document.addEventListener('DOMContentLoaded', () => {
  setCurrentDate();
  setupMenuToggle();
  setupClickOutsideSidebar();
  setupThemeToggle();
  setupNotificationSystem();
  loadNotifications();
  generateGradeCards();
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

/* ---------- Grade Cards Generation ---------- */
function generateGradeCards() {
  // Subjects data
  const subjects = [
    { title: "Great Books", prof: "LUZVIE MAE MANALAYSAY", date: "17 JUN, 2025", grades: ["82.00", "82.67", "90.67", "89.33"], final: "2.00" },
    { title: "Information Assurance & Security", prof: "JOSHUA GUEVARRA", date: "16 JUN, 2025", grades: ["89.00", "66.15", "87.20", "80.00"], final: "2.50" },
    { title: "IT Capstone Project 1", prof: "ROCELLE CAMPOSAGRADO", date: "16 JUN, 2025", grades: ["", "", "", "87.20"], final: "2.00" },
    { title: "Management Information Systems", prof: "ENRICO ENERLAN", date: "16 JUN, 2025", grades: ["85.33", "78.67", "72.00", "82.00"], final: "2.50" },
    { title: "Mobile Systems & Technologies", prof: "JUNKATE LINDON BERNABE", date: "16 JUN, 2025", grades: ["86.00", "69.33", "88.67", "85.33"], final: "2.25" },
    { title: "Programming Languages", prof: "JUNKATE LINDON BERNABE", date: "16 JUN, 2025", grades: ["75.33", "72.67", "79.33", "74.67"], final: "2.75" },
    { title: "Web Systems and Technologies", prof: "ENRICO ENERLAN", date: "16 JUN, 2025", grades: ["72.67", "77.42", "86.00", "91.33"], final: "2.25" }
  ];

  const gradesContainer = document.getElementById('gradesContainer');

  subjects.forEach(subject => {
    const card = document.createElement('div');
    card.className = 'content-card';
    
    card.innerHTML = `
      <div class="grade-subject">${subject.title}</div>
      <div class="grade-details">${subject.prof} • ${subject.date}</div>
      
      <div class="grade-periods">
        <div>Prelim</div>
        <div>Midterm</div>
        <div>Pre-Finals</div>
        <div>Finals</div>
      </div>
      
      <div class="grade-values">
        ${subject.grades.map(grade => `<div>${grade || '-'}</div>`).join('')}
      </div>
      
      <div class="final-grade">
        <button class="final-grade-btn">Final Grade</button>
        <div class="final-grade-value">${subject.final}</div>
      </div>
    `;
    
    gradesContainer.appendChild(card);
  });
}