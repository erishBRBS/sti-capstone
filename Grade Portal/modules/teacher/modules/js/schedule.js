/* schedule.js
   Clean UI behaviors for schedule page
*/

// Class data
const classData = {
  'WEB101-A': {
    code: 'WEB101',
    name: 'Web Development',
    section: 'Section A',
    schedule: 'MWF 8:00 - 9:30 AM',
    room: 'Room 301',
    students: 32,
    units: 3
  },
  'DB201-B': {
    code: 'DB201',
    name: 'Database Management',
    section: 'Section B',
    schedule: 'MTH 10:00 - 11:30 AM',
    room: 'Room 205',
    students: 28,
    units: 3
  },
  'PROG101-C': {
    code: 'PROG101',
    name: 'Programming Fundamentals',
    section: 'Section C',
    schedule: 'MWF 1:00 - 2:30 PM',
    room: 'Room 402',
    students: 30,
    units: 3
  },
  'NET301-D': {
    code: 'NET301',
    name: 'Network Administration',
    section: 'Section D',
    schedule: 'TTH 3:00 - 4:30 PM',
    room: 'Lab 102',
    students: 25,
    units: 3
  }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
});

function setupEventListeners() {
  // View switching
  document.getElementById('tableViewBtn').addEventListener('click', () => switchView('table'));
  document.getElementById('listViewBtn').addEventListener('click', () => switchView('list'));
  
  // Class block click events
  document.querySelectorAll('.class-block').forEach(block => {
    block.addEventListener('click', (e) => {
      const course = e.currentTarget.getAttribute('data-course');
      const section = e.currentTarget.getAttribute('data-section');
      viewClassDetails(course, section);
    });
  });
  
  // Schedule item click events
  document.querySelectorAll('.schedule-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const course = e.currentTarget.getAttribute('data-course');
      const section = e.currentTarget.getAttribute('data-section');
      viewClassDetails(course, section);
    });
  });
  
  // Modal close button
  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
  
  // View student list button
  document.getElementById('viewStudentListBtn').addEventListener('click', viewStudentList);
  
  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.querySelector('.sidebar');
  
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

  // Dark mode toggle
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
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

  // Close modal with Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  });

  // Close modal when clicking outside
  document.getElementById('classModal').addEventListener('click', function(event) {
    if (event.target === this) {
      closeModal();
    }
  });
}

// View switching
function switchView(view) {
  const tableView = document.getElementById('tableView');
  const listView = document.getElementById('listView');
  const buttons = document.querySelectorAll('.view-btn');
  
  buttons.forEach(btn => btn.classList.remove('active'));
  
  if (view === 'table') {
    tableView.style.display = 'block';
    listView.classList.remove('active');
    document.getElementById('tableViewBtn').classList.add('active');
  } else {
    tableView.style.display = 'none';
    listView.classList.add('active');
    document.getElementById('listViewBtn').classList.add('active');
  }
}

// View class details
function viewClassDetails(courseCode, section) {
  const key = `${courseCode}-${section}`;
  const data = classData[key];
  
  if (data) {
    document.getElementById('courseCode').textContent = data.code;
    document.getElementById('courseName').textContent = data.name;
    document.getElementById('section').textContent = data.section;
    document.getElementById('schedule').textContent = data.schedule;
    document.getElementById('room').textContent = data.room;
    document.getElementById('students').textContent = data.students + ' Students';
    document.getElementById('units').textContent = data.units + ' Units';
    
    document.getElementById('classModal').classList.add('active');
  }
}

// Close modal
function closeModal() {
  document.getElementById('classModal').classList.remove('active');
}

// View student list
function viewStudentList() {
  closeModal();
  alert('Redirecting to student list page...');
}