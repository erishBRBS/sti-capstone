document.addEventListener('DOMContentLoaded', () => {
  setCurrentDate();
  setupMenuToggle();
  setupClickOutsideSidebar();
  setupThemeToggle();
  setupNotificationSystem();
  loadNotifications();
  renderWeeklySchedule();
  renderListView();
  setupViewSwitching();
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
    { id: 1, type: 'schedule', message: 'Class schedule updated for next week', time: '3 hours ago', unread: true },
    { id: 2, type: 'announcement', message: 'Room change for Web Systems class', time: '1 day ago', unread: true },
    { id: 3, type: 'system', message: 'System maintenance scheduled for tonight', time: '2 days ago', unread: false }
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
    schedule: 'fas fa-calendar-alt',
    announcement: 'fas fa-bullhorn',
    system: 'fas fa-cog',
    message: 'fas fa-envelope'
  };
  return icons[type] || 'fas fa-bell';
}

function getNotificationColor(type) {
  const colors = {
    schedule: '#ff9800',
    announcement: '#2196f3',
    system: '#9c27b0',
    message: '#4caf50'
  };
  return colors[type] || '#757575';
}

/* ---------- Schedule Data ---------- */
const scheduleData = {
  Monday: [
    { subject: "Mobile System and Technologies", day: "Monday", time: "7:00AM - 9:00AM", room: "LIB2", professor: "JUNKATE LINDON BERNABE" },
    { subject: "Web Systems & Technologies", day: "Monday", time: "10:00AM - 1:00PM", room: "L3", professor: "ENRICO ENERLAN" },
    { subject: "Information Assurance & Security (Cybersecurity Fundamentals)", day: "Monday", time: "2:00PM - 5:00PM", room: "212", professor: "JOSHUA GUEVARRA" }
  ],
  Tuesday: [
    { subject: "Great Books", day: "Tuesday-Thursday", time: "7:00AM - 8:30AM", room: "218-A", professor: "LUZVIE MAE MANALAYSAY" },
    { subject: "Management Information Systems", day: "Tuesday-Thursday", time: "8:30AM - 10:00AM", room: "218-A", professor: "ENRICO ENERLAN" }
  ],
  Wednesday: [
    { subject: "YOUR SCHEDULE IS FREE TODAY", day: "Wednesday", time: "All Day", room: "None", professor: "None" }
  ],
  Thursday: [
    { subject: "Great Books", day: "Tuesday-Thursday", time: "7:00AM - 8:30AM", room: "218-A", professor: "LUZVIE MAE MANALAYSAY" },
    { subject: "Management Information Systems", day: "Tuesday-Thursday", time: "8:30AM - 10:00AM", room: "218-A", professor: "ENRICO ENERLAN" }
  ],
  Friday: [
    { subject: "Mobile Systems and Technologies", day: "Friday", time: "10:00AM - 1:00PM", room: "L1", professor: "JUNKATE LINDON BERNABE" },
    { subject: "IT Capstone Project 1", day: "Friday", time: "3:00PM - 5:00PM", room: "212", professor: "ROCELLE CAMPOSAGRADO" }
  ],
  Saturday: [
    { subject: "Programming Languages", day: "Saturday", time: "10:00AM - 1:00PM", room: "206", professor: "JUNKATE LINDON BERNABE" },
    { subject: "Web Systems and Technologies", day: "Saturday", time: "1:00PM - 3:00PM", room: "206", professor: "ENRICO ENERLAN" }
  ]
};

// Time slots for the weekly view
const timeSlots = [
  "7:00 - 9:00 AM",
  "9:00 - 10:00 AM",
  "10:00 AM - 1:00 PM",
  "1:00 - 2:00 PM",
  "2:00 - 3:00 PM",
  "3:00 - 5:00 PM"
];

/* ---------- Schedule Rendering ---------- */
function renderWeeklySchedule() {
  const scheduleBody = document.getElementById('scheduleBody');
  scheduleBody.innerHTML = '';
  
  timeSlots.forEach(timeSlot => {
    const row = document.createElement('tr');
    
    // Time column
    const timeCell = document.createElement('td');
    timeCell.className = 'time-slot';
    timeCell.textContent = timeSlot;
    row.appendChild(timeCell);
    
    // Day columns
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    days.forEach(day => {
      const dayCell = document.createElement('td');
      
      // Find classes for this day and time slot
      const classes = scheduleData[day] || [];
      const matchingClasses = classes.filter(cls => {
        if (cls.time === "All Day") return false;
        
        // Simple time matching
        const classTime = cls.time.toLowerCase();
        const slotTime = timeSlot.toLowerCase();
        
        // Check if the class time overlaps with the time slot
        if (classTime.includes("7:00am") && slotTime.includes("7:00")) return true;
        if (classTime.includes("8:30am") && slotTime.includes("9:00")) return true;
        if (classTime.includes("10:00am") && slotTime.includes("10:00")) return true;
        if (classTime.includes("1:00pm") && slotTime.includes("1:00")) return true;
        if (classTime.includes("2:00pm") && slotTime.includes("2:00")) return true;
        if (classTime.includes("3:00pm") && slotTime.includes("3:00")) return true;
        
        return false;
      });
      
      if (matchingClasses.length > 0) {
        matchingClasses.forEach(cls => {
          const classBlock = document.createElement('div');
          classBlock.className = 'class-block';
          classBlock.onclick = () => viewClassDetails(cls.subject);
          
          classBlock.innerHTML = `
            <div class="class-code">${cls.subject.split(' ')[0]}</div>
            <div class="class-name">${cls.subject}</div>
            <div class="class-details">
              <span><i class="fas fa-door-open"></i> ${cls.room}</span>
              <span><i class="fas fa-user-tie"></i> ${cls.professor.split(' ')[0]}</span>
            </div>
          `;
          
          dayCell.appendChild(classBlock);
        });
      }
      
      row.appendChild(dayCell);
    });
    
    scheduleBody.appendChild(row);
  });
}

function renderListView() {
  const listView = document.getElementById('listView');
  listView.innerHTML = '';
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  days.forEach(day => {
    const daySection = document.createElement('div');
    daySection.className = 'day-section';
    
    const dayHeader = document.createElement('div');
    dayHeader.className = 'day-header';
    dayHeader.innerHTML = `<i class="fas fa-calendar-day"></i> ${day}`;
    daySection.appendChild(dayHeader);
    
    const classes = scheduleData[day] || [];
    
    if (classes.length === 0) {
      const scheduleItem = document.createElement('div');
      scheduleItem.className = 'schedule-item';
      scheduleItem.innerHTML = `
        <div class="schedule-time">All Day</div>
        <div class="schedule-content">
          <div class="schedule-course">YOUR SCHEDULE IS FREE TODAY</div>
        </div>
      `;
      daySection.appendChild(scheduleItem);
    } else {
      classes.forEach(cls => {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';
        scheduleItem.onclick = () => viewClassDetails(cls.subject);
        
        scheduleItem.innerHTML = `
          <div class="schedule-time">${cls.time}</div>
          <div class="schedule-content">
            <div class="schedule-course">${cls.subject}</div>
            <div class="schedule-meta">
              <span><i class="fas fa-door-open"></i> ${cls.room}</span>
              <span><i class="fas fa-user-tie"></i> ${cls.professor}</span>
            </div>
          </div>
        `;
        
        daySection.appendChild(scheduleItem);
      });
    }
    
    listView.appendChild(daySection);
  });
}

/* ---------- View Switching ---------- */
function setupViewSwitching() {
  const tableViewBtn = document.getElementById('tableViewBtn');
  const listViewBtn = document.getElementById('listViewBtn');
  const viewTypeSelect = document.getElementById('viewType');
  
  tableViewBtn.addEventListener('click', () => switchView('table'));
  listViewBtn.addEventListener('click', () => switchView('list'));
  
  viewTypeSelect.addEventListener('change', function() {
    if (this.value === 'Weekly View') {
      switchView('table');
    } else {
      switchView('list');
    }
  });
}

function switchView(view) {
  const tableView = document.getElementById('tableView');
  const listView = document.getElementById('listView');
  const tableViewBtn = document.getElementById('tableViewBtn');
  const listViewBtn = document.getElementById('listViewBtn');
  
  if (view === 'table') {
    tableView.style.display = 'block';
    listView.classList.remove('active');
    tableViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
  } else {
    tableView.style.display = 'none';
    listView.classList.add('active');
    tableViewBtn.classList.remove('active');
    listViewBtn.classList.add('active');
  }
}

/* ---------- Class Details ---------- */
function viewClassDetails(subject) {
  alert(`Details for: ${subject}\n\nThis would show more detailed information about the class in a real application.`);
}