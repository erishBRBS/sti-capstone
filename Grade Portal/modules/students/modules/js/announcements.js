document.addEventListener('DOMContentLoaded', () => {
  setCurrentDate();
  setupMenuToggle();
  setupClickOutsideSidebar();
  setupThemeToggle();
  setupNotificationSystem();
  loadNotifications();
  generateAnnouncements();
  setupFiltering();
  setupActionButtons();
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
    { id: 1, type: 'announcement', message: 'New announcement: Graduation Ceremony Schedule', time: '2 hours ago', unread: true },
    { id: 2, type: 'academic', message: 'Midterm examination schedule has been updated', time: '1 day ago', unread: true },
    { id: 3, type: 'events', message: 'IT Week 2025 registration is now open', time: '3 days ago', unread: false }
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
    announcement: 'fas fa-bullhorn',
    academic: 'fas fa-graduation-cap',
    events: 'fas fa-calendar-alt',
    important: 'fas fa-exclamation-circle'
  };
  return icons[type] || 'fas fa-bell';
}

function getNotificationColor(type) {
  const colors = {
    announcement: '#2196f3',
    academic: '#4caf50',
    events: '#ff9800',
    important: '#f44336'
  };
  return colors[type] || '#757575';
}

/* ---------- Announcements Data ---------- */
const announcementsData = [
  {
    id: 1,
    title: "Graduation Ceremony Schedule",
    date: "July 1, 2025",
    category: "important",
    content: `
      <p>In celebration of our Senior High School and Tertiary students' graduation, all office transactions will be suspended tomorrow, July 3, 2025.</p>
      <p>Office Transactions will resume on Friday, July 4, 2025:</p>
      <ul>
        <li>ADMISSIONS OFFICE - 8AM-5PM</li>
        <li>OTHER OFFICE TRANSACTIONS - 1PM - 5PM</li>
      </ul>
      <p>Thank you for your kind understanding and support as we honor this milestone with our graduates!</p>
    `,
    hasImage: true,
    author: "Admin Office"
  },
  {
    id: 2,
    title: "Midterm Examination Schedule",
    date: "June 25, 2025",
    category: "academic",
    content: `
      <p>Midterm examinations for the second semester will be held from July 15-19, 2025. Please check the detailed schedule below:</p>
      <p><strong>July 15 (Monday):</strong> Programming Languages, Web Systems & Technologies</p>
      <p><strong>July 16 (Tuesday):</strong> Information Assurance & Security, Database Management</p>
      <p><strong>July 17 (Wednesday):</strong> Software Engineering, IT Elective 2</p>
      <p><strong>July 18-19:</strong> Make-up examinations (by appointment only)</p>
      <p>All exams will be conducted in your regular classrooms. Please bring your student ID and necessary materials.</p>
    `,
    hasImage: false,
    author: "Academic Department"
  },
  {
    id: 3,
    title: "IT Week 2025 Celebration",
    date: "June 20, 2025",
    category: "events",
    content: `
      <p>Join us for the annual IT Week celebration from July 8-12, 2025! This year's theme is "Innovation Through Technology: Shaping the Future".</p>
      <p>Activities include:</p>
      <ul>
        <li>July 8: Opening Ceremony & Tech Expo</li>
        <li>July 9: Coding Competition</li>
        <li>July 10: Tech Talk Series with Industry Professionals</li>
        <li>July 11: Hackathon</li>
        <li>July 12: Awarding Ceremony & Closing Program</li>
      </ul>
      <p>Registration for competitions is now open at the Student Affairs Office. Limited slots available!</p>
    `,
    hasImage: true,
    author: "IT Department"
  },
  {
    id: 4,
    title: "Library Extended Hours",
    date: "June 18, 2025",
    category: "academic",
    content: `
      <p>To better serve students during the examination period, the library will extend its operating hours starting July 1, 2025.</p>
      <p><strong>New Library Hours (July 1-31):</strong></p>
      <ul>
        <li>Monday to Friday: 7:00 AM - 9:00 PM</li>
        <li>Saturday: 8:00 AM - 6:00 PM</li>
        <li>Sunday: 9:00 AM - 5:00 PM</li>
      </ul>
      <p>Please note that group study rooms will be available on a first-come, first-served basis. Silent study areas will be strictly enforced during examination weeks.</p>
    `,
    hasImage: false,
    author: "Library Services"
  }
];

/* ---------- Announcements Generation ---------- */
function generateAnnouncements() {
  const announcementsList = document.getElementById('announcementsList');
  announcementsList.innerHTML = '';
  
  announcementsData.forEach(announcement => {
    const announcementCard = document.createElement('div');
    announcementCard.className = 'announcement-card';
    announcementCard.setAttribute('data-category', announcement.category);
    
    announcementCard.innerHTML = `
      <div class="announcement-header">
        <div>
          <div class="announcement-title">${announcement.title}</div>
          <div class="announcement-date">Posted on: ${announcement.date}</div>
        </div>
        <div class="announcement-badge badge-${announcement.category}">
          ${announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
        </div>
      </div>
      <div class="announcement-content">
        ${announcement.content}
      </div>
      ${announcement.hasImage ? `
        <div class="announcement-image">
          <i class="fas fa-image"></i>
        </div>
      ` : ''}
      <div class="announcement-actions">
        <div class="announcement-author">Posted by: ${announcement.author}</div>
        <div class="announcement-buttons">
          <button class="action-btn" data-action="save">
            <i class="far fa-bookmark"></i> Save
          </button>
          <button class="action-btn" data-action="share">
            <i class="fas fa-share"></i> Share
          </button>
        </div>
      </div>
    `;
    
    announcementsList.appendChild(announcementCard);
  });
}

/* ---------- Filtering ---------- */
function setupFiltering() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter announcements
      const filter = button.getAttribute('data-filter');
      filterAnnouncements(filter);
    });
  });
}

function filterAnnouncements(filter) {
  const announcements = document.querySelectorAll('.announcement-card');
  
  announcements.forEach(announcement => {
    const category = announcement.getAttribute('data-category');
    
    if (filter === 'all' || filter === category) {
      announcement.style.display = 'block';
    } else {
      announcement.style.display = 'none';
    }
  });
}

/* ---------- Action Buttons ---------- */
function setupActionButtons() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.action-btn')) {
      const button = e.target.closest('.action-btn');
      const action = button.getAttribute('data-action');
      
      if (action === 'save') {
        handleSaveAction(button);
      } else if (action === 'share') {
        handleShareAction(button);
      }
    }
  });
}

function handleSaveAction(button) {
  const icon = button.querySelector('i');
  
  if (icon.classList.contains('far')) {
    // Save announcement
    icon.classList.replace('far', 'fas');
    button.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
    button.style.color = 'var(--primary-blue)';
  } else {
    // Unsave announcement
    icon.classList.replace('fas', 'far');
    button.innerHTML = '<i class="far fa-bookmark"></i> Save';
    button.style.color = '';
  }
}

function handleShareAction(button) {
  alert('Share functionality would open here. In a real application, this would open a share dialog.');
}

/* ---------- Announcement Interactions ---------- */
document.addEventListener('click', (e) => {
  if (e.target.closest('.announcement-card') && !e.target.closest('.action-btn')) {
    const card = e.target.closest('.announcement-card');
    
    // Mark as read (visual feedback)
    card.style.opacity = '0.8';
    setTimeout(() => {
      card.style.opacity = '1';
    }, 300);
    
    // In a real app, you might track read status
    console.log('Announcement viewed:', card.querySelector('.announcement-title').textContent);
  }
});