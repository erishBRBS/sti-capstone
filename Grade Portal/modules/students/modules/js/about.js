document.addEventListener('DOMContentLoaded', () => {
  setCurrentDate();
  setupMenuToggle();
  setupClickOutsideSidebar();
  setupThemeToggle();
  setupNotificationSystem();
  loadNotifications();
  setupInteractiveElements();
  setupContactCopy();
});

/* ---------- Utilities ---------- */
function setCurrentDate() {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('todayDate').textContent = today.toLocaleDateString('en-US', options);
}

/* ---------- Menu & sidebar ---------- */
function setupMenuToggle() {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.querySelector('.sidebar');
  if (!menuToggle || !sidebar) return;
  
  menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
}

function setupClickOutsideSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const menuToggle = document.getElementById('menuToggle');
  
  document.addEventListener('click', (event) => {
    if (window.innerWidth < 992 && 
        !sidebar.contains(event.target) && 
        !menuToggle.contains(event.target) &&
        sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
    }
  });
}

/* ---------- Theme toggle ---------- */
function setupThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Set initial theme
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (icon) icon.classList.replace('fa-moon', 'fa-sun');
  }

  // Toggle theme
  if (toggle) {
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      
      if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        icon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        icon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
      }
    });
  }
}

/* ---------- Notification system ---------- */
function setupNotificationSystem() {
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationDropdown = document.getElementById('notificationDropdown');

  if (notificationBtn && notificationDropdown) {
    notificationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationDropdown.classList.toggle('active');
    });

    // Close notification dropdown when clicking outside
    document.addEventListener('click', () => {
      notificationDropdown.classList.remove('active');
    });
  }
}

function loadNotifications() {
  const notifications = [
    { id: 1, type: 'info', message: 'About page has been updated with new features', time: '2 days ago', unread: true },
    { id: 2, type: 'system', message: 'Portal maintenance completed successfully', time: '1 week ago', unread: true },
    { id: 3, type: 'update', message: 'New version 1.2.7 released', time: '2 weeks ago', unread: false }
  ];

  const notificationList = document.getElementById('notificationList');
  if (!notificationList) return;
  
  notificationList.innerHTML = notifications.map(notification => `
    <div class="notification-item ${notification.unread ? 'unread' : ''}">
      <div class="notification-content">
        <div class="notification-icon" style="background-color: ${getNotificationColor(notification.type)}">
          <i class="${getNotificationIcon(notification.type)}"></i>
        </div>
        <div>
          <p class="notification-message">${notification.message}</p>
          <p class="notification-time">${notification.time}</p>
        </div>
      </div>
    </div>
  `).join('');
}

function getNotificationIcon(type) {
  const icons = {
    info: 'fas fa-info-circle',
    system: 'fas fa-cog',
    update: 'fas fa-sync-alt',
    important: 'fas fa-exclamation-circle'
  };
  return icons[type] || 'fas fa-bell';
}

function getNotificationColor(type) {
  const colors = {
    info: '#2196f3',
    system: '#9c27b0',
    update: '#4caf50',
    important: '#f44336'
  };
  return colors[type] || '#757575';
}

/* ---------- Interactive Elements ---------- */
function setupInteractiveElements() {
  // Add click animations to feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('click', function() {
      this.style.transform = 'scale(0.98)';
      this.style.transition = 'transform 0.2s';
      
      setTimeout(() => {
        this.style.transform = '';
      }, 200);
    });
  });
  
  // Add hover effects to version cards
  const versionCards = document.querySelectorAll('.version-card');
  versionCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
}

/* ---------- Contact Copy Functionality ---------- */
function setupContactCopy() {
  const contactItems = document.querySelectorAll('.contact-info li');
  
  contactItems.forEach(item => {
    // Make contact items clickable
    item.style.cursor = 'pointer';
    item.title = 'Click to copy contact information';
    
    item.addEventListener('click', function() {
      const text = this.textContent.replace(/\s+/g, ' ').trim();
      copyToClipboard(text);
      showCopyNotification('Contact information copied to clipboard!');
    });
  });
}

function copyToClipboard(text) {
  // Create a temporary textarea element
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  
  // Select and copy the text
  textarea.select();
  textarea.setSelectionRange(0, 99999); // For mobile devices
  
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
  
  // Remove the temporary element
  document.body.removeChild(textarea);
}

function showCopyNotification(message) {
  // Remove existing notification
  const existingNotification = document.querySelector('.copy-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'copy-notification';
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideDown 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }, 3000);
}

/* ---------- Version Check ---------- */
function checkForUpdates() {
  // In a real application, this would check for updates from an API
  const currentVersion = '1.2.7';
  const latestVersion = '1.2.7'; // This would come from an API
  
  if (currentVersion !== latestVersion) {
    showUpdateNotification();
  }
}

function showUpdateNotification() {
  const updateNotification = document.createElement('div');
  updateNotification.className = 'update-notification';
  updateNotification.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span>New version available! Update to v1.3.0</span>
      <button onclick="this.parentNode.parentNode.remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 16px;">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  updateNotification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: var(--accent-yellow);
    color: var(--dark-gray);
    padding: 12px 16px;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    z-index: 1000;
    font-weight: 600;
  `;
  
  document.body.appendChild(updateNotification);
  
  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (updateNotification.parentNode) {
      updateNotification.remove();
    }
  }, 10000);
}

// Check for updates on page load
checkForUpdates();