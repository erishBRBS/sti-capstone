/* viewgrades.js
   Grade viewing and management functionality
*/

// Sample grade data
const gradeData = [
  {
    id: '2024-001234',
    name: 'Maria Santos',
    course: 'WEB101',
    section: 'A',
    year: '2023-2024',
    grades: {
      prelim: 85,
      midterm: 88,
      prefinal: 90,
      final: 92
    },
    status: 'passed'
  },
  {
    id: '2024-001235',
    name: 'Juan Dela Cruz',
    course: 'WEB101',
    section: 'A',
    year: '2023-2024',
    grades: {
      prelim: 78,
      midterm: 82,
      prefinal: 85,
      final: 87
    },
    status: 'passed'
  },
  {
    id: '2024-001236',
    name: 'Anna Reyes',
    course: 'DB201',
    section: 'B',
    year: '2023-2024',
    grades: {
      prelim: 92,
      midterm: 90,
      prefinal: 94,
      final: 91
    },
    status: 'passed'
  },
  {
    id: '2024-001237',
    name: 'Pedro Garcia',
    course: 'DB201',
    section: 'B',
    year: '2023-2024',
    grades: {
      prelim: 65,
      midterm: 68,
      prefinal: 72,
      final: 70
    },
    status: 'conditional'
  },
  {
    id: '2024-001238',
    name: 'Sofia Martinez',
    course: 'PROG101',
    section: 'C',
    year: '2023-2024',
    grades: {
      prelim: 88,
      midterm: 85,
      prefinal: 90,
      final: 89
    },
    status: 'passed'
  },
  {
    id: '2024-001239',
    name: 'Miguel Torres',
    course: 'PROG101',
    section: 'C',
    year: '2023-2024',
    grades: {
      prelim: 55,
      midterm: 58,
      prefinal: 62,
      final: 60
    },
    status: 'failed'
  },
  {
    id: '2024-001240',
    name: 'Isabella Cruz',
    course: 'NET301',
    section: 'D',
    year: '2023-2024',
    grades: {
      prelim: 90,
      midterm: 92,
      prefinal: 88,
      final: 91
    },
    status: 'passed'
  },
  {
    id: '2024-001241',
    name: 'Carlos Lopez',
    course: 'NET301',
    section: 'D',
    year: '2023-2024',
    grades: {
      prelim: 72,
      midterm: 75,
      prefinal: 78,
      final: 76
    },
    status: 'passed'
  }
];

let filteredData = [...gradeData];
let currentPage = 1;
const itemsPerPage = 5;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Set up event listeners
  setupEventListeners();
  
  // Initialize data
  updateSummary();
  renderGradesTable();
});

function setupEventListeners() {
  // Filter buttons
  document.getElementById('applyFiltersBtn').addEventListener('click', applyFilters);
  document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);
  
  // Export buttons
  document.getElementById('exportPdfBtn').addEventListener('click', () => exportGrades('pdf'));
  document.getElementById('exportExcelBtn').addEventListener('click', () => exportGrades('excel'));
  document.getElementById('printGradesBtn').addEventListener('click', printGrades);
  
  // Pagination buttons
  document.getElementById('prevPageBtn').addEventListener('click', () => changePage('prev'));
  document.getElementById('nextPageBtn').addEventListener('click', () => changePage('next'));
  
  // Modal close button
  document.getElementById('modalCloseBtn').addEventListener('click', closeStudentModal);
  
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
}

function updateSummary() {
  const total = filteredData.length;
  const passed = filteredData.filter(student => student.status === 'passed').length;
  const conditional = filteredData.filter(student => student.status === 'conditional').length;
  const failed = filteredData.filter(student => student.status === 'failed').length;
  
  document.getElementById('totalStudents').textContent = total;
  document.getElementById('passedStudents').textContent = passed;
  document.getElementById('conditionalStudents').textContent = conditional;
  document.getElementById('failedStudents').textContent = failed;
}

function renderGradesTable() {
  const tableBody = document.getElementById('gradesTableBody');
  tableBody.innerHTML = '';
  
  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = filteredData.slice(startIndex, endIndex);
  
  if (pageData.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="11" style="text-align: center; padding: 20px;">
          No students found matching the selected filters.
        </td>
      </tr>
    `;
    return;
  }
  
  pageData.forEach(student => {
    const average = calculateAverage(student.grades);
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.course}</td>
      <td>${student.section}</td>
      <td class="grade-cell ${getGradeClass(student.grades.prelim)}">${student.grades.prelim}</td>
      <td class="grade-cell ${getGradeClass(student.grades.midterm)}">${student.grades.midterm}</td>
      <td class="grade-cell ${getGradeClass(student.grades.prefinal)}">${student.grades.prefinal}</td>
      <td class="grade-cell ${getGradeClass(student.grades.final)}">${student.grades.final}</td>
      <td class="grade-cell ${getGradeClass(average)}">${average.toFixed(2)}</td>
      <td>
        <span class="status-badge ${student.status}">
          ${getStatusText(student.status)}
        </span>
      </td>
      <td>
        <div class="student-actions">
          <button class="action-btn view" data-student-id="${student.id}">
            <i class="fas fa-eye"></i> View
          </button>
          <button class="action-btn edit" data-student-id="${student.id}">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="action-btn print" data-student-id="${student.id}">
            <i class="fas fa-print"></i> Print
          </button>
        </div>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
  
  // Add event listeners to action buttons
  document.querySelectorAll('.action-btn.view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const studentId = e.currentTarget.getAttribute('data-student-id');
      viewStudentDetails(studentId);
    });
  });
  
  document.querySelectorAll('.action-btn.edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const studentId = e.currentTarget.getAttribute('data-student-id');
      editStudentGrade(studentId);
    });
  });
  
  document.querySelectorAll('.action-btn.print').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const studentId = e.currentTarget.getAttribute('data-student-id');
      printStudentReport(studentId);
    });
  });
  
  updatePagination();
}

function calculateAverage(grades) {
  const values = Object.values(grades);
  return values.reduce((sum, grade) => sum + grade, 0) / values.length;
}

function getGradeClass(grade) {
  if (grade >= 90) return 'grade-excellent';
  if (grade >= 80) return 'grade-good';
  if (grade >= 75) return 'grade-average';
  return 'grade-poor';
}

function getStatusText(status) {
  switch(status) {
    case 'passed': return 'Passed';
    case 'failed': return 'Failed';
    case 'conditional': return 'Conditional';
    default: return 'Unknown';
  }
}

function updatePagination() {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginationContainer = document.getElementById('paginationContainer');
  
  // Clear existing pagination buttons (except prev/next)
  const prevBtn = paginationContainer.querySelector('#prevPageBtn');
  const nextBtn = paginationContainer.querySelector('#nextPageBtn');
  paginationContainer.innerHTML = '';
  paginationContainer.appendChild(prevBtn);
  
  // Add page number buttons
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
    btn.textContent = i;
    btn.addEventListener('click', () => {
      currentPage = i;
      renderGradesTable();
    });
    paginationContainer.appendChild(btn);
  }
  
  paginationContainer.appendChild(nextBtn);
}

function changePage(direction) {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  if (direction === 'prev' && currentPage > 1) {
    currentPage--;
  } else if (direction === 'next' && currentPage < totalPages) {
    currentPage++;
  }
  
  renderGradesTable();
}

function applyFilters() {
  const year = document.getElementById('academicYear').value;
  const course = document.getElementById('courseFilter').value;
  const section = document.getElementById('sectionFilter').value;
  const period = document.getElementById('periodFilter').value;
  const status = document.getElementById('statusFilter').value;
  const search = document.getElementById('studentSearch').value.toLowerCase();
  
  filteredData = gradeData.filter(student => {
    // Filter by year
    if (year && student.year !== year) return false;
    
    // Filter by course
    if (course && student.course !== course) return false;
    
    // Filter by section
    if (section && student.section !== section) return false;
    
    // Filter by status
    if (status && student.status !== status) return false;
    
    // Filter by search term
    if (search && 
        !student.name.toLowerCase().includes(search) && 
        !student.id.toLowerCase().includes(search)) {
      return false;
    }
    
    return true;
  });
  
  currentPage = 1;
  updateSummary();
  renderGradesTable();
}

function resetFilters() {
  document.getElementById('academicYear').value = '';
  document.getElementById('courseFilter').value = '';
  document.getElementById('sectionFilter').value = '';
  document.getElementById('periodFilter').value = '';
  document.getElementById('statusFilter').value = '';
  document.getElementById('studentSearch').value = '';
  
  filteredData = [...gradeData];
  currentPage = 1;
  updateSummary();
  renderGradesTable();
}

function viewStudentDetails(studentId) {
  const student = gradeData.find(s => s.id === studentId);
  if (!student) return;
  
  const modalBody = document.getElementById('studentModalBody');
  const average = calculateAverage(student.grades);
  
  modalBody.innerHTML = `
    <div class="student-info">
      <div class="info-item">
        <div class="info-label">Student ID</div>
        <div>${student.id}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Student Name</div>
        <div>${student.name}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Course</div>
        <div>${student.course}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Section</div>
        <div>${student.section}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Academic Year</div>
        <div>${student.year}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Overall Average</div>
        <div><strong>${average.toFixed(2)}</strong></div>
      </div>
      <div class="info-item">
        <div class="info-label">Status</div>
        <div><span class="status-badge ${student.status}">${getStatusText(student.status)}</span></div>
      </div>
    </div>
    
    <div class="grade-history">
      <h3>Grade History</h3>
      <table class="grade-history-table">
        <thead>
          <tr>
            <th>Grading Period</th>
            <th>Grade</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Prelims</td>
            <td class="${getGradeClass(student.grades.prelim)}">${student.grades.prelim}</td>
            <td>${getGradeRemarks(student.grades.prelim)}</td>
          </tr>
          <tr>
            <td>Midterms</td>
            <td class="${getGradeClass(student.grades.midterm)}">${student.grades.midterm}</td>
            <td>${getGradeRemarks(student.grades.midterm)}</td>
          </tr>
          <tr>
            <td>Pre-Finals</td>
            <td class="${getGradeClass(student.grades.prefinal)}">${student.grades.prefinal}</td>
            <td>${getGradeRemarks(student.grades.prefinal)}</td>
          </tr>
          <tr>
            <td>Finals</td>
            <td class="${getGradeClass(student.grades.final)}">${student.grades.final}</td>
            <td>${getGradeRemarks(student.grades.final)}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="btn-group" style="margin-top: 20px;">
      <button class="btn btn-primary" onclick="printStudentReport('${student.id}')">
        <i class="fas fa-print"></i> Print Report
      </button>
      <button class="btn btn-secondary" onclick="closeStudentModal()">
        <i class="fas fa-times"></i> Close
      </button>
    </div>
  `;
  
  document.getElementById('studentModal').classList.add('active');
}

function getGradeRemarks(grade) {
  if (grade >= 90) return 'Excellent';
  if (grade >= 80) return 'Very Good';
  if (grade >= 75) return 'Satisfactory';
  return 'Needs Improvement';
}

function closeStudentModal() {
  document.getElementById('studentModal').classList.remove('active');
}

function editStudentGrade(studentId) {
  alert(`Edit grade functionality for student ${studentId} would open here.`);
  // In a real application, this would open a form to edit the student's grades
}

function printStudentReport(studentId) {
  alert(`Printing report for student ${studentId}`);
  // In a real application, this would generate a printable report
}

function exportGrades(format) {
  alert(`Exporting grades as ${format.toUpperCase()}`);
  // In a real application, this would generate and download the file
}

function printGrades() {
  alert('Printing grade report');
  // In a real application, this would open the print dialog
}