// settings.js
// Admin Settings functionality

document.addEventListener('DOMContentLoaded', () => {
  initializeSettings();
});

/* ---------- App initialization ---------- */
function initializeSettings() {
  setCurrentDate();
  setupEventListeners();
  setupThemeToggle();
  setupMobileMenu();
  loadNotifications();
}

/* ---------- Date and time ---------- */
function setCurrentDate() {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateElement = document.getElementById('todayDate');
  if (dateElement) {
    dateElement.textContent = today.toLocaleDateString('en-US', options);
  }
}

/* ---------- Event listeners ---------- */
function setupEventListeners() {
  // Notification dropdown
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationDropdown = document.getElementById('notificationDropdown');
  
  if (notificationBtn && notificationDropdown) {
    notificationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationDropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      notificationDropdown.classList.remove('active');
    });
  }
  
  // Mark all as read button
  const markAllAsReadBtn = document.getElementById('markAllAsReadBtn');
  if (markAllAsReadBtn) {
    markAllAsReadBtn.addEventListener('click', markAllAsRead);
  }
  
  // Save buttons
  const saveAccountBtn = document.getElementById('saveAccountSettings');
  const saveSchoolBtn = document.getElementById('saveSchoolInfo');
  const saveSystemBtn = document.getElementById('saveSystemSettings');
  
  if (saveAccountBtn) saveAccountBtn.addEventListener('click', saveAccountSettings);
  if (saveSchoolBtn) saveSchoolBtn.addEventListener('click', saveSchoolInformation);
  if (saveSystemBtn) saveSystemBtn.addEventListener('click', saveSystemSettings);
  
  // Admin management
  const addAdminBtn = document.getElementById('addAdminBtn');
  const closeAdminModal = document.getElementById('closeAdminModal');
  const cancelAdminBtn = document.getElementById('cancelAdminBtn');
  const adminForm = document.getElementById('adminForm');
  
  if (addAdminBtn) addAdminBtn.addEventListener('click', openAddAdminModal);
  if (closeAdminModal) closeAdminModal.addEventListener('click', closeAdminModalFunc);
  if (cancelAdminBtn) cancelAdminBtn.addEventListener('click', closeAdminModalFunc);
  if (adminForm) adminForm.addEventListener('submit', addNewAdmin);
  
  // Edit and remove admin buttons
  document.addEventListener('click', (e) => {
    if (e.target.closest('.edit-admin')) {
      editAdmin(e.target.closest('tr'));
    }
    
    if (e.target.closest('.remove-admin')) {
      removeAdmin(e.target.closest('tr'));
    }
  });
  
  // Backup and export buttons
  const downloadBackupBtn = document.getElementById('downloadBackupBtn');
  const restoreDataBtn = document.getElementById('restoreDataBtn');
  const systemLogsBtn = document.getElementById('systemLogsBtn');
  
  if (downloadBackupBtn) downloadBackupBtn.addEventListener('click', downloadBackup);
  if (restoreDataBtn) restoreDataBtn.addEventListener('click', restoreData);
  if (systemLogsBtn) systemLogsBtn.addEventListener('click', viewSystemLogs);
  
  // Close modals on outside click
  document.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
  
  // Close modals with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAdminModalFunc();
    }
  });
}

/* ---------- Theme toggle ---------- */
function setupThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  
  if (themeToggle && themeIcon) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
    
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      
      if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
      }
    });
  }
}

/* ---------- Mobile menu ---------- */
function setupMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.querySelector('.sidebar');
  
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
    
    document.addEventListener('click', (event) => {
      if (window.innerWidth < 992 && 
          !sidebar.contains(event.target) && 
          !menuToggle.contains(event.target) &&
          sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }
    });
  }
}

/* ---------- Notifications ---------- */
function loadNotifications() {
  const notifications = [
    {
      id: 1,
      title: 'System Backup Completed',
      message: 'Weekly system backup was completed successfully.',
      time: '2 hours ago',
      unread: true,
      type: 'success'
    },
    {
      id: 2,
      title: 'New User Registration',
      message: 'A new admin user has been registered in the system.',
      time: '5 hours ago',
      unread: true,
      type: 'info'
    },
    {
      id: 3,
      title: 'Security Alert',
      message: 'Multiple failed login attempts detected from unknown IP.',
      time: '1 day ago',
      unread: false,
      type: 'warning'
    },
    {
      id: 4,
      title: 'System Update Available',
      message: 'A new version of the admin portal is available.',
      time: '2 days ago',
      unread: false,
      type: 'info'
    }
  ];
  
  const notificationList = document.getElementById('notificationList');
  if (!notificationList) return;
  
  notificationList.innerHTML = notifications.map(notification => `
    <div class="notification-item ${notification.unread ? 'unread' : ''}" data-id="${notification.id}">
      <div style="font-weight: 600; margin-bottom: 4px;">${notification.title}</div>
      <div style="font-size: 14px; color: var(--medium-gray); margin-bottom: 4px;">${notification.message}</div>
      <div style="font-size: 12px; color: var(--medium-gray);">${notification.time}</div>
    </div>
  `).join('');
  
  // Update badge count
  const unreadCount = notifications.filter(n => n.unread).length;
  const badge = document.querySelector('.notification-badge');
  if (badge) {
    badge.textContent = unreadCount;
    if (unreadCount === 0) {
      badge.style.display = 'none';
    }
  }
}

function markAllAsRead(e) {
  e.preventDefault();
  
  const notificationItems = document.querySelectorAll('.notification-item');
  notificationItems.forEach(item => {
    item.classList.remove('unread');
  });
  
  const badge = document.querySelector('.notification-badge');
  if (badge) {
    badge.textContent = '0';
    badge.style.display = 'none';
  }
  
  showAlert('All notifications marked as read', 'success');
}

/* ---------- Settings saving ---------- */
function saveAccountSettings() {
  // Simulate saving account settings
  showAlert('Account settings saved successfully', 'success');
}

function saveSchoolInformation() {
  // Simulate saving school information
  showAlert('School information updated successfully', 'success');
}

function saveSystemSettings() {
  // Simulate saving system settings
  showAlert('System settings saved successfully', 'success');
}

/* ---------- Admin management ---------- */
function openAddAdminModal() {
  const modal = document.getElementById('addAdminModal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeAdminModalFunc() {
  const modal = document.getElementById('addAdminModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function addNewAdmin(e) {
  e.preventDefault();
  
  const name = document.getElementById('adminName').value;
  const email = document.getElementById('adminEmail').value;
  const role = document.getElementById('adminRole').value;
  
  if (!name || !email || !role) {
    showAlert('Please fill in all required fields', 'error');
    return;
  }
  
  // Add to table
  const tableBody = document.querySelector('#adminTable tbody');
  if (tableBody) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${name}</td>
      <td>${role.charAt(0).toUpperCase() + role.slice(1)}</td>
      <td>${email}</td>
      <td>
        <button class="btn btn-secondary btn-sm edit-admin">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn-danger btn-sm remove-admin">
          <i class="fas fa-trash"></i> Remove
        </button>
      </td>
    `;
    tableBody.appendChild(newRow);
  }
  
  // Close modal and reset form
  closeAdminModalFunc();
  document.getElementById('adminForm').reset();
  
  showAlert(`Admin ${name} added successfully`, 'success');
}

function editAdmin(row) {
  const cells = row.cells;
  const name = cells[0].textContent;
  const role = cells[1].textContent;
  const email = cells[2].textContent;
  
  // In a real application, you would populate a form with this data
  showAlert(`Editing admin: ${name}`, 'info');
}

function removeAdmin(row) {
  const name = row.cells[0].textContent;
  
  if (confirm(`Are you sure you want to remove ${name} as an admin?`)) {
    row.remove();
    showAlert(`Admin ${name} removed successfully`, 'success');
  }
}

/* ---------- Backup and export ---------- */
function downloadBackup() {
  // Simulate backup download
  showAlert('System backup download started', 'info');
  
  // Simulate download process
  setTimeout(() => {
    showAlert('Backup downloaded successfully', 'success');
  }, 2000);
}

function restoreData() {
  // Simulate data restoration
  if (confirm('Are you sure you want to restore data from backup? This will overwrite current data.')) {
    showAlert('Data restoration in progress...', 'info');
    
    setTimeout(() => {
      showAlert('Data restored successfully from backup', 'success');
    }, 3000);
  }
}

function viewSystemLogs() {
  // Simulate viewing system logs
  showAlert('Opening system logs...', 'info');
}

/* ---------- Alert system ---------- */
function showAlert(message, type = 'info') {
  const alertContainer = document.getElementById('alertContainer');
  const alertId = 'alert-' + Date.now();
  
  const alertHtml = `
    <div class="alert alert-${type}" id="${alertId}">
      <i class="fas ${getAlertIcon(type)}"></i>
      <div>${message}</div>
      <button class="close-btn" onclick="document.getElementById('${alertId}').remove()">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  alertContainer.insertAdjacentHTML('beforeend', alertHtml);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    const alertElement = document.getElementById(alertId);
    if (alertElement) {
      alertElement.remove();
    }
  }, 5000);
}

function getAlertIcon(type) {
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };
  return icons[type] || 'fa-info-circle';
}