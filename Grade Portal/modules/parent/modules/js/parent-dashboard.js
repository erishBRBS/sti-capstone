// Parent Portal Specific JavaScript

document.addEventListener('DOMContentLoaded', () => {
  setupNotificationSystem();
  setupQuickActions();
  setupStudentSelector();
  loadNotifications();
});

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
    { 
      id: 1, 
      type: 'grade', 
      message: 'Your child\'s grade for Information Assurance has been updated', 
      time: '2 hours ago', 
      unread: true 
    },
    { 
      id: 2, 
      type: 'announcement', 
      message: 'New announcement: Graduation Day Information', 
      time: '5 hours ago', 
      unread: true 
    },
    { 
      id: 3, 
      type: 'system', 
      message: 'Parent-teacher meeting scheduled for next week', 
      time: '2 days ago', 
      unread: false 
    }
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
    system: 'fas fa-cog'
  };
  return icons[type] || 'fas fa-bell';
}

function getNotificationColor(type) {
  const colors = {
    grade: '#ff9800',
    announcement: '#2196f3',
    system: '#9c27b0'
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
    viewGrades: () => window.location.href = 'ParentGrades.html',
    viewSchedule: () => window.location.href = 'ParentSchedule.html',
    viewAnnouncements: () => window.location.href = 'ParentAnnouncements.html'
  };
  
  if (actions[action]) {
    actions[action]();
  }
}

/* ---------- Student Selector ---------- */
function setupStudentSelector() {
  const studentSelect = document.getElementById('studentSelect');
  if (studentSelect) {
    studentSelect.addEventListener('change', function() {
      const selectedStudent = this.options[this.selectedIndex].text;
      updateStudentInfo(selectedStudent);
    });
  }
}

function updateStudentInfo(studentName) {
  // In a real application, this would fetch data from the server
  // For now, we'll just update the displayed student info
  const studentInfo = document.querySelector('.student-info');
  if (studentInfo) {
    const nameElement = studentInfo.querySelector('h3');
    const avatarElement = studentInfo.querySelector('.student-avatar');
    
    if (nameElement && avatarElement) {
      const initials = studentName.split(' ').map(n => n[0]).join('').substring(0, 2);
      nameElement.textContent = studentName.split(' - ')[0];
      avatarElement.textContent = initials;
      
      // Show loading state
      const originalContent = studentInfo.innerHTML;
      studentInfo.innerHTML = '<div class="loading">Loading student data...</div>';
      
      // Simulate API call delay
      setTimeout(() => {
        studentInfo.innerHTML = originalContent;
        // Update the name and avatar with new initials
        studentInfo.querySelector('h3').textContent = studentName.split(' - ')[0];
        studentInfo.querySelector('.student-avatar').textContent = initials;
      }, 1000);
    }
  }
}