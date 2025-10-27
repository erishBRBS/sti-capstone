document.addEventListener('DOMContentLoaded', () => {
  setCurrentDate();
  setupMenuToggle();
  setupClickOutsideSidebar();
  setupThemeToggle();
  setupNotificationSystem();
  setupQuickActions();
  loadNotifications();
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
    { id: 1, type: 'grade', message: 'Your grade for Information Assurance has been updated', time: '2 hours ago', unread: true },
    { id: 2, type: 'announcement', message: 'New announcement: Graduation Day Information', time: '5 hours ago', unread: true },
    { id: 3, type: 'system', message: 'System maintenance scheduled for tonight', time: '1 day ago', unread: false }
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
    grade: 'fas fa-file-alt',
    announcement: 'fas fa-bullhorn',
    system: 'fas fa-cog',
    message: 'fas fa-envelope'
  };
  return icons[type] || 'fas fa-bell';
}

function getNotificationColor(type) {
  const colors = {
    grade: '#ff9800',
    announcement: '#2196f3',
    system: '#9c27b0',
    message: '#4caf50'
  };
  return colors[type] || '#757575';
}

/* ---------- Quick Actions ---------- */
function setupQuickActions() {
  const actionButtons = document.querySelectorAll('.action-btn');
  
  actionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const action = this.getAttribute('data-action');
      if (action) {
        handleQuickAction(action);
      }
    });
  });
}

function handleQuickAction(action) {
  const actions = {
    viewGrades: () => window.location.href = 'Grades.html',
    viewSchedule: () => window.location.href = 'ClassSchedule.html',
    viewAnnouncements: () => window.location.href = 'Announcements.html'
  };
  
  if (actions[action]) {
    actions[action]();
  }
}