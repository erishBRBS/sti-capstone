document.addEventListener('DOMContentLoaded', () => {
  setCurrentDate();
  setupMenuToggle();
  setupClickOutsideSidebar();
  setupThemeToggle();
  setupNotificationSystem();
  loadNotifications();
  setupFeedbackForm();
  setupCharacterCounter();
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
    { id: 1, type: 'feedback', message: 'Thank you for your recent feedback submission', time: '2 days ago', unread: true },
    { id: 2, type: 'system', message: 'Feedback system maintenance completed', time: '1 week ago', unread: true },
    { id: 3, type: 'info', message: 'New feedback categories added', time: '2 weeks ago', unread: false }
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
    feedback: 'fas fa-comment',
    system: 'fas fa-cog',
    info: 'fas fa-info-circle',
    important: 'fas fa-exclamation-circle'
  };
  return icons[type] || 'fas fa-bell';
}

function getNotificationColor(type) {
  const colors = {
    feedback: '#2196f3',
    system: '#9c27b0',
    info: '#4caf50',
    important: '#f44336'
  };
  return colors[type] || '#757575';
}

/* ---------- Feedback Form Functionality ---------- */
function setupFeedbackForm() {
  const feedbackForm = document.getElementById('feedbackForm');
  
  feedbackForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const feedbackType = document.getElementById('feedbackType').value;
    const feedbackMessage = document.getElementById('feedbackMessage').value;
    
    // Validate form
    if (!feedbackType) {
      showAlert('Please select a feedback type', 'error');
      return;
    }
    
    if (!feedbackMessage.trim()) {
      showAlert('Please enter your feedback message', 'error');
      return;
    }
    
    // Submit feedback
    submitFeedback(feedbackType, feedbackMessage);
  });
}

function submitFeedback(type, message) {
  const submitBtn = document.querySelector('.submit-btn');
  
  // Show loading state
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
  submitBtn.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    // Reset button state
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Feedback';
    submitBtn.disabled = false;
    
    // Show success message
    showAlert('Thank you for your feedback! We appreciate your input.', 'success');
    
    // Reset form
    document.getElementById('feedbackForm').reset();
    updateCharacterCounter(0);
    
    // Show confirmation message
    showConfirmationMessage(type);
    
    // Log for demo purposes
    console.log('Feedback submitted:', {
      type: type,
      message: message,
      timestamp: new Date().toISOString()
    });
  }, 1500);
}

function setupCharacterCounter() {
  const textarea = document.getElementById('feedbackMessage');
  const charCounter = document.querySelector('.char-counter');
  
  textarea.addEventListener('input', function() {
    const length = this.value.length;
    updateCharacterCounter(length);
  });
}

function updateCharacterCounter(length) {
  const charCounter = document.querySelector('.char-counter');
  charCounter.textContent = `${length}/1000 characters`;
  
  // Update color based on length
  charCounter.classList.remove('warning', 'error');
  
  if (length > 1000) {
    charCounter.classList.add('error');
  } else if (length > 800) {
    charCounter.classList.add('warning');
  }
}

function showAlert(message, type) {
  // Remove existing alerts
  const existingAlert = document.querySelector('.feedback-alert');
  if (existingAlert) {
    existingAlert.remove();
  }
  
  // Create alert element
  const alert = document.createElement('div');
  alert.className = `feedback-alert feedback-alert-${type}`;
  alert.textContent = message;
  
  document.body.appendChild(alert);
  
  // Remove alert after 5 seconds
  setTimeout(() => {
    if (alert.parentNode) {
      alert.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        if (alert.parentNode) {
          alert.parentNode.removeChild(alert);
        }
      }, 300);
    }
  }, 5000);
}

function showConfirmationMessage(feedbackType) {
  const confirmation = document.createElement('div');
  confirmation.className = 'confirmation-message';
  
  const typeLabels = {
    'look': 'Appearance Feedback',
    'speed': 'Performance Feedback',
    'usability': 'Usability Feedback',
    'error': 'Error Report',
    'info': 'Information Feedback',
    'features': 'Feature Request',
    'others': 'General Feedback'
  };
  
  confirmation.innerHTML = `
    <i class="fas fa-check-circle" style="font-size: 48px; color: var(--primary-blue); margin-bottom: 15px;"></i>
    <h3 style="color: var(--primary-blue); margin-bottom: 10px;">Feedback Submitted Successfully!</h3>
    <p>Your ${typeLabels[feedbackType]} has been received. We'll review it and get back to you if needed.</p>
  `;
  
  // Add to form
  const form = document.getElementById('feedbackForm');
  form.appendChild(confirmation);
  
  // Show with animation
  setTimeout(() => {
    confirmation.classList.add('show');
  }, 100);
  
  // Hide after 8 seconds
  setTimeout(() => {
    confirmation.classList.remove('show');
    setTimeout(() => {
      if (confirmation.parentNode) {
        confirmation.parentNode.removeChild(confirmation);
      }
    }, 500);
  }, 8000);
}