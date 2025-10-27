document.addEventListener('DOMContentLoaded', () => {
  setCurrentDate();
  setupMenuToggle();
  setupClickOutsideSidebar();
  setupThemeToggle();
  setupNotificationSystem();
  loadNotifications();
  initializeFAQs();
  setupSearch();
  setupCategories();
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
    { id: 1, type: 'info', message: 'FAQ page has been updated with new questions', time: '2 days ago', unread: true },
    { id: 2, type: 'system', message: 'New login procedure implemented', time: '1 week ago', unread: true },
    { id: 3, type: 'update', message: 'Check the FAQ for common grade-related questions', time: '2 weeks ago', unread: false }
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

/* ---------- FAQ Data ---------- */
const faqData = [
  {
    id: 1,
    question: "How to log-in",
    answer: "Sign-in using your STI Microsoft Office 365 account. If you don't know your account yet, get your credentials from the School Laboratory Facilitator or refer to your Registration and Assessment Form to get your official school email address. You may locate it at the lower-left corner of the form.",
    category: "login",
    helpful: 0
  },
  {
    id: 2,
    question: "My email account is not working",
    answer: "You might be using the old email address format (sti.ph). Please update it using the new format (sti.edu.ph). When a message appears that your email account needs to link up with your record, talk to your School Registrar and request for a record update.",
    category: "login",
    helpful: 0
  },
  {
    id: 3,
    question: "My default password is not working",
    answer: "Verify the password from your School Laboratory Facilitator. You may also request for a new one by approaching the School Laboratory Facilitator then ask for a password reset.",
    category: "login",
    helpful: 0
  },
  {
    id: 4,
    question: "Grades",
    answer: "All the grades indicated in your Grades section are encoded only by the corresponding teacher or instructor of every subject. For grade-related concerns, you may discuss it with your teacher.",
    category: "grades",
    helpful: 0
  },
  {
    id: 5,
    question: "Class Schedule",
    answer: "Missing time, room, number, or questionable subject periods? Confirm your class schedules through the Registrar's Office.",
    category: "schedule",
    helpful: 0
  },
  {
    id: 6,
    question: "The portal is not loading properly",
    answer: "Try clearing your browser cache and cookies, or try using a different browser. If the problem persists, contact IT Support at itsupport@stibacoor.edu.ph.",
    category: "technical",
    helpful: 0
  },
  {
    id: 7,
    question: "I can't see my recent grades",
    answer: "Grades are updated by instructors periodically. If you believe grades should be available but aren't showing, please contact your instructor directly.",
    category: "grades",
    helpful: 0
  }
];

/* ---------- FAQ Functionality ---------- */
function initializeFAQs() {
  const faqContainer = document.getElementById('faqContainer');
  renderFAQs(faqData, faqContainer);
}

function renderFAQs(faqs, container) {
  container.innerHTML = '';
  
  if (faqs.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <h3>No questions found</h3>
        <p>Try adjusting your search or filter criteria</p>
      </div>
    `;
    return;
  }
  
  faqs.forEach(faq => {
    const faqItem = document.createElement('div');
    faqItem.className = 'faq-item';
    faqItem.setAttribute('data-category', faq.category);
    
    faqItem.innerHTML = `
      <div class="faq-question">
        <i class="fas fa-question-circle"></i>
        <span>${faq.question}</span>
      </div>
      <div class="faq-answer">
        <p>${faq.answer}</p>
        <div class="faq-helpful">
          <span>Was this helpful?</span>
          <button class="helpful-btn" data-faq-id="${faq.id}">
            <i class="fas fa-thumbs-up"></i> Yes (${faq.helpful})
          </button>
        </div>
      </div>
    `;
    
    container.appendChild(faqItem);
  });
  
  // Add click event to FAQ questions
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const isActive = answer.classList.contains('active');
      
      // Close all other answers
      document.querySelectorAll('.faq-answer').forEach(ans => {
        ans.classList.remove('active');
      });
      document.querySelectorAll('.faq-question').forEach(q => {
        q.classList.remove('active');
      });
      
      // Toggle current answer
      if (!isActive) {
        answer.classList.add('active');
        this.classList.add('active');
      }
    });
  });
  
  // Add helpful button events
  const helpfulButtons = document.querySelectorAll('.helpful-btn');
  helpfulButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      const faqId = parseInt(this.getAttribute('data-faq-id'));
      markAsHelpful(faqId, this);
    });
  });
}

function markAsHelpful(faqId, button) {
  const faq = faqData.find(item => item.id === faqId);
  if (faq) {
    faq.helpful++;
    button.innerHTML = `<i class="fas fa-thumbs-up"></i> Yes (${faq.helpful})`;
    button.classList.add('active');
    
    // Show thank you message
    showHelpfulNotification();
  }
}

function showHelpfulNotification() {
  const notification = document.createElement('div');
  notification.className = 'helpful-notification';
  notification.textContent = 'Thank you for your feedback!';
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--primary-blue);
    color: white;
    padding: 12px 20px;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    z-index: 1000;
    font-weight: 600;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

/* ---------- Search Functionality ---------- */
function setupSearch() {
  const searchInput = document.getElementById('faqSearch');
  
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim();
    filterFAQs(searchTerm);
  });
}

function filterFAQs(searchTerm) {
  let filteredFAQs = faqData;
  
  // Apply category filter first
  const activeCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
  if (activeCategory !== 'all') {
    filteredFAQs = filteredFAQs.filter(faq => faq.category === activeCategory);
  }
  
  // Apply search filter
  if (searchTerm) {
    filteredFAQs = filteredFAQs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm) || 
      faq.answer.toLowerCase().includes(searchTerm)
    );
  }
  
  renderFAQs(filteredFAQs, document.getElementById('faqContainer'));
}

/* ---------- Category Filtering ---------- */
function setupCategories() {
  const categoryButtons = document.querySelectorAll('.category-btn');
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active button
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Apply filter
      const searchTerm = document.getElementById('faqSearch').value.toLowerCase().trim();
      filterFAQs(searchTerm);
    });
  });
}