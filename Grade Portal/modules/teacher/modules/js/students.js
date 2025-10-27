/* students.js
   Clean UI behaviors for students page
*/

// Student data
const students = [
  { id: '2024-001234', name: 'Maria Santos', course: 'WEB101', section: 'A', email: 'maria.santos@sti.edu', year: '2nd Year', program: 'BSIT', status: 'active', prelim: 88, midterm: 90, prefinal: 87, final: 89 },
  { id: '2024-001235', name: 'Juan Dela Cruz', course: 'WEB101', section: 'A', email: 'juan.delacruz@sti.edu', year: '2nd Year', program: 'BSIT', status: 'active', prelim: 85, midterm: 83, prefinal: 86, final: 88 },
  { id: '2024-001236', name: 'Anna Reyes', course: 'DB201', section: 'B', email: 'anna.reyes@sti.edu', year: '3rd Year', program: 'BSCS', status: 'active', prelim: 92, midterm: 94, prefinal: 93, final: 95 },
  { id: '2024-001237', name: 'Pedro Garcia', course: 'DB201', section: 'B', email: 'pedro.garcia@sti.edu', year: '3rd Year', program: 'BSCS', status: 'active', prelim: 78, midterm: 80, prefinal: 82, final: 84 },
  { id: '2024-001238', name: 'Sofia Martinez', course: 'PROG101', section: 'C', email: 'sofia.martinez@sti.edu', year: '1st Year', program: 'BSIT', status: 'active', prelim: 90, midterm: 88, prefinal: 91, final: 92 },
  { id: '2024-001239', name: 'Miguel Torres', course: 'PROG101', section: 'C', email: 'miguel.torres@sti.edu', year: '1st Year', program: 'BSIT', status: 'active', prelim: 76, midterm: 78, prefinal: 80, final: 82 },
  { id: '2024-001240', name: 'Isabella Cruz', course: 'NET301', section: 'D', email: 'isabella.cruz@sti.edu', year: '4th Year', program: 'BSCS', status: 'active', prelim: 95, midterm: 96, prefinal: 94, final: 97 },
  { id: '2024-001241', name: 'Carlos Lopez', course: 'NET301', section: 'D', email: 'carlos.lopez@sti.edu', year: '4th Year', program: 'BSCS', status: 'active', prelim: 82, midterm: 85, prefinal: 84, final: 86 },
];

let filteredStudents = [...students];

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
  renderStudentGrid();
  renderStudentTable();
});

function setupEventListeners() {
  // View switching
  document.querySelectorAll('[data-action="switchView"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const view = e.currentTarget.getAttribute('data-view');
      switchView(view);
    });
  });
  
  // Filter events
  document.getElementById('courseFilter').addEventListener('change', filterStudents);
  document.getElementById('sectionFilter').addEventListener('change', filterStudents);
  document.getElementById('searchInput').addEventListener('input', filterStudents);
  
  // Modal close button
  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
  
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
  document.getElementById('studentModal').addEventListener('click', function(event) {
    if (event.target === this) {
      closeModal();
    }
  });
}

function renderStudentGrid() {
  const grid = document.getElementById('studentGrid');
  grid.innerHTML = filteredStudents.map(student => `
    <div class="student-card" data-action="viewStudentProfile" data-student-id="${student.id}">
      <div class="student-header">
        <div class="student-avatar">${student.name.split(' ').map(n => n[0]).join('')}</div>
        <div class="student-info">
          <div class="student-name">${student.name}</div>
          <div class="student-id">${student.id}</div>
        </div>
      </div>
      <div class="student-details">
        <div class="detail-item">
          <i class="fas fa-book"></i>
          <span>${student.course} - Section ${student.section}</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-graduation-cap"></i>
          <span>${student.year} - ${student.program}</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-envelope"></i>
          <span>${student.email}</span>
        </div>
      </div>
      <div class="student-actions">
        <button class="action-icon-btn" data-action="viewGrades" data-student-id="${student.id}">
          <i class="fas fa-chart-bar"></i> View Grades
        </button>
      </div>
    </div>
  `).join('');

  // Add event listeners to dynamically created elements
  document.querySelectorAll('[data-action="viewStudentProfile"]').forEach(el => {
    el.addEventListener('click', (e) => {
      const studentId = e.currentTarget.getAttribute('data-student-id');
      viewStudentProfile(studentId);
    });
  });

  document.querySelectorAll('[data-action="viewGrades"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const studentId = e.currentTarget.getAttribute('data-student-id');
      viewGrades(studentId);
    });
  });
}

function renderStudentTable() {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = filteredStudents.map(student => `
    <tr data-action="viewStudentProfile" data-student-id="${student.id}">
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.course}</td>
      <td>Section ${student.section}</td>
      <td>${student.email}</td>
      <td><span class="status-badge status-${student.status}">${student.status.toUpperCase()}</span></td>
      <td>
        <button class="action-icon-btn" data-action="viewGrades" data-student-id="${student.id}" style="display: inline-flex; width: auto;">
          <i class="fas fa-chart-bar"></i> Grades
        </button>
      </td>
    </tr>
  `).join('');

  // Add event listeners to dynamically created elements
  document.querySelectorAll('[data-action="viewStudentProfile"]').forEach(el => {
    el.addEventListener('click', (e) => {
      const studentId = e.currentTarget.getAttribute('data-student-id');
      viewStudentProfile(studentId);
    });
  });

  document.querySelectorAll('[data-action="viewGrades"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const studentId = e.currentTarget.getAttribute('data-student-id');
      viewGrades(studentId);
    });
  });
}

function filterStudents() {
  const courseFilter = document.getElementById('courseFilter').value;
  const sectionFilter = document.getElementById('sectionFilter').value;
  const searchInput = document.getElementById('searchInput').value.toLowerCase();

  filteredStudents = students.filter(student => {
    const matchesCourse = courseFilter === 'all' || student.course === courseFilter;
    const matchesSection = sectionFilter === 'all' || student.section === sectionFilter;
    const matchesSearch = student.name.toLowerCase().includes(searchInput) || 
                        student.id.toLowerCase().includes(searchInput);
    
    return matchesCourse && matchesSection && matchesSearch;
  });

  renderStudentGrid();
  renderStudentTable();
}

function switchView(view) {
  const gridView = document.getElementById('studentGrid');
  const tableView = document.getElementById('tableView');
  const buttons = document.querySelectorAll('.toggle-btn');

  buttons.forEach(btn => btn.classList.remove('active'));

  if (view === 'grid') {
    gridView.classList.remove('hidden');
    tableView.classList.remove('active');
    buttons[0].classList.add('active');
  } else {
    gridView.classList.add('hidden');
    tableView.classList.add('active');
    buttons[1].classList.add('active');
  }
}

function viewStudentProfile(studentId) {
  const student = students.find(s => s.id === studentId);
  if (!student) return;

  const modalBody = document.getElementById('modalBody');
  const avgGrade = ((student.prelim + student.midterm + student.prefinal + student.final) / 4).toFixed(2);

  modalBody.innerHTML = `
    <div class="student-profile-header">
      <div class="profile-avatar">${student.name.split(' ').map(n => n[0]).join('')}</div>
      <div class="profile-name">${student.name}</div>
      <div class="profile-id">${student.id}</div>
    </div>

    <div class="info-section">
      <div class="section-title">
        <i class="fas fa-user"></i> Personal Information
      </div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Email</div>
          <div class="info-value">${student.email}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Status</div>
          <div class="info-value"><span class="status-badge status-${student.status}">${student.status.toUpperCase()}</span></div>
        </div>
      </div>
    </div>

    <div class="info-section">
      <div class="section-title">
        <i class="fas fa-graduation-cap"></i> Academic Information
      </div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Program</div>
          <div class="info-value">${student.program}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Year Level</div>
          <div class="info-value">${student.year}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Course</div>
          <div class="info-value">${student.course}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Section</div>
          <div class="info-value">Section ${student.section}</div>
        </div>
      </div>
    </div>

    <div class="info-section">
      <div class="section-title">
        <i class="fas fa-chart-line"></i> Grade Summary
      </div>
      <table class="grades-table">
        <thead>
          <tr>
            <th>Prelim</th>
            <th>Midterm</th>
            <th>Pre-Finals</th>
            <th>Finals</th>
            <th>Average</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="grade-value">${student.prelim}</span></td>
            <td><span class="grade-value">${student.midterm}</span></td>
            <td><span class="grade-value">${student.prefinal}</span></td>
            <td><span class="grade-value">${student.final}</span></td>
            <td><span class="grade-value" style="color: #43a047;">${avgGrade}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  document.getElementById('studentModal').classList.add('active');
}

function closeModal() {
  document.getElementById('studentModal').classList.remove('active');
}

function viewGrades(studentId) {
  viewStudentProfile(studentId);
}