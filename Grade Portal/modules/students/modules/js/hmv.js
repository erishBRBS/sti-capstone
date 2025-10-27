document.addEventListener('DOMContentLoaded', () => {
  setCurrentDate();
  setupMenuToggle();
  setupClickOutsideSidebar();
  setupThemeToggle();
  setupNotificationSystem();
  loadNotifications();
  setupHymnAudio();
  setupPrintFunctionality();
  setupShareFunctionality();
  addInteractiveEffects();
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
    { id: 1, type: 'info', message: 'Learn about STI\'s Mission and Vision', time: '1 day ago', unread: true },
    { id: 2, type: 'academic', message: 'New HMV content available', time: '2 days ago', unread: true },
    { id: 3, type: 'events', message: 'STI Foundation Day celebration', time: '1 week ago', unread: false }
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
    academic: 'fas fa-graduation-cap',
    events: 'fas fa-calendar-alt',
    important: 'fas fa-exclamation-circle'
  };
  return icons[type] || 'fas fa-bell';
}

function getNotificationColor(type) {
  const colors = {
    info: '#2196f3',
    academic: '#4caf50',
    events: '#ff9800',
    important: '#f44336'
  };
  return colors[type] || '#757575';
}

/* ---------- Hymn Audio Functionality ---------- */
function setupHymnAudio() {
  const playBtn = document.getElementById('playHymnBtn');
  let isPlaying = false;

  playBtn.addEventListener('click', function() {
    if (!isPlaying) {
      // Start playing
      playBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Hymn';
      playBtn.classList.add('playing');
      isPlaying = true;
      showAudioMessage('STI Hymn is now playing...');
      
      // Simulate audio playback (in real app, this would be actual audio)
      simulateAudioPlayback();
    } else {
      // Pause playing
      playBtn.innerHTML = '<i class="fas fa-play"></i> Play Hymn';
      playBtn.classList.remove('playing');
      isPlaying = false;
      showAudioMessage('STI Hymn paused');
    }
  });
}

function simulateAudioPlayback() {
  // In a real application, this would control actual audio playback
  console.log('Audio playback simulation started');
}

function showAudioMessage(message) {
  // Create or update notification message
  let notification = document.querySelector('.audio-notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'audio-notification';
    document.body.appendChild(notification);
  }
  
  notification.textContent = message;
  notification.style.opacity = '1';
  
  // Hide after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
  }, 3000);
}

/* ---------- Print Functionality ---------- */
function setupPrintFunctionality() {
  const printBtn = document.getElementById('printHymnBtn');
  
  printBtn.addEventListener('click', function() {
    window.print();
  });
}

/* ---------- Share Functionality ---------- */
function setupShareFunctionality() {
  const shareBtn = document.getElementById('shareHymnBtn');
  
  shareBtn.addEventListener('click', function() {
    if (navigator.share) {
      navigator.share({
        title: 'STI Mission, Vision & Hymn',
        text: 'Learn about STI\'s Mission, Vision and listen to the STI Hymn',
        url: window.location.href
      })
      .catch(error => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      alert('Share this page with others to spread awareness about STI\'s Mission and Vision!');
    }
  });
}

/* ---------- Interactive Effects ---------- */
function addInteractiveEffects() {
  // Add hover effects to content cards
  const contentCards = document.querySelectorAll('.content-card, .mission-card, .vision-card');
  contentCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
}

/* ---------- Add Print Styles ---------- */
const printStyles = `
@media print {
  .sidebar, .header-actions, .menu-toggle, .hymn-actions, .audio-notification {
    display: none !important;
  }
  
  .main-content {
    margin: 0 !important;
    width: 100% !important;
  }
  
  .content-card, .mission-card, .vision-card {
    box-shadow: none !important;
    border: 1px solid #ccc !important;
    page-break-inside: avoid;
  }
  
  body {
    background: white !important;
    color: black !important;
  }
}
`;

// Add print styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = printStyles;
document.head.appendChild(styleSheet);