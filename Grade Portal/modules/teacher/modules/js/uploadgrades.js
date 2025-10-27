/* uploadgrades.js
   Enhanced grade management functionality
*/

// Student data
const studentsData = {
  'WEB101-A': [
    { id: '2024-001234', name: 'Maria Santos', year: '2023-2024', course: 'WEB101', section: 'A' },
    { id: '2024-001235', name: 'Juan Dela Cruz', year: '2023-2024', course: 'WEB101', section: 'A' }
  ],
  'DB201-B': [
    { id: '2024-001236', name: 'Anna Reyes', year: '2023-2024', course: 'DB201', section: 'B' },
    { id: '2024-001237', name: 'Pedro Garcia', year: '2023-2024', course: 'DB201', section: 'B' }
  ],
  'PROG101-C': [
    { id: '2024-001238', name: 'Sofia Martinez', year: '2023-2024', course: 'PROG101', section: 'C' },
    { id: '2024-001239', name: 'Miguel Torres', year: '2023-2024', course: 'PROG101', section: 'C' }
  ],
  'NET301-D': [
    { id: '2024-001240', name: 'Isabella Cruz', year: '2023-2024', course: 'NET301', section: 'D' },
    { id: '2024-001241', name: 'Carlos Lopez', year: '2023-2024', course: 'NET301', section: 'D' }
  ]
};

let selectedFile = null;
let selectedAdvancedFile = null;
let filteredStudents = [];

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
  
  // Initialize with manual entry selected
  selectMethod('manual');
});

function setupEventListeners() {
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

  // Method selection
  document.querySelectorAll('[data-action="selectMethod"]').forEach(card => {
    card.addEventListener('click', (e) => {
      const method = e.currentTarget.getAttribute('data-method');
      selectMethod(method);
    });
  });

  // File upload handling
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });
  
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  });

  dropZone.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFile(file);
    }
  });

  // Advanced file upload handling
  const advancedDropZone = document.getElementById('advancedDropZone');
  const advancedFileInput = document.getElementById('advancedFileInput');
  
  advancedDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    advancedDropZone.classList.add('dragover');
  });
  
  advancedDropZone.addEventListener('dragleave', () => {
    advancedDropZone.classList.remove('dragover');
  });
  
  advancedDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    advancedDropZone.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleAdvancedFile(files[0]);
    }
  });

  advancedDropZone.addEventListener('click', () => {
    advancedFileInput.click();
  });

  advancedFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      handleAdvancedFile(file);
    }
  });

  // Manual form event listeners
  document.getElementById('manualCourse').addEventListener('change', loadStudentsForManual);
  document.getElementById('manualPeriod').addEventListener('change', loadStudentsForManual);
  document.getElementById('searchStudent').addEventListener('keyup', searchStudents);

  // Action buttons
  document.querySelectorAll('[data-action="applyToAll"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const value = e.currentTarget.getAttribute('data-value');
      applyToAll('grade', value);
    });
  });

  document.querySelectorAll('[data-action="submitManualGrades"]').forEach(btn => {
    btn.addEventListener('click', submitManualGrades);
  });

  document.querySelectorAll('[data-action="resetManualForm"]').forEach(btn => {
    btn.addEventListener('click', resetManualForm);
  });

  document.querySelectorAll('[data-action="downloadTemplate"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const format = e.currentTarget.getAttribute('data-format');
      downloadTemplate(format);
    });
  });

  document.querySelectorAll('[data-action="removeFile"]').forEach(btn => {
    btn.addEventListener('click', removeFile);
  });

  document.querySelectorAll('[data-action="uploadFile"]').forEach(btn => {
    btn.addEventListener('click', uploadFile);
  });

  document.querySelectorAll('[data-action="resetImportForm"]').forEach(btn => {
    btn.addEventListener('click', resetImportForm);
  });

  document.querySelectorAll('[data-action="loadFilteredStudents"]').forEach(btn => {
    btn.addEventListener('click', loadFilteredStudents);
  });

  document.querySelectorAll('[data-action="downloadFilteredTemplate"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const format = e.currentTarget.getAttribute('data-format');
      downloadFilteredTemplate(format);
    });
  });

  document.querySelectorAll('[data-action="removeAdvancedFile"]').forEach(btn => {
    btn.addEventListener('click', removeAdvancedFile);
  });

  document.querySelectorAll('[data-action="uploadAdvancedFile"]').forEach(btn => {
    btn.addEventListener('click', uploadAdvancedFile);
  });

  document.querySelectorAll('[data-action="resetAdvancedForm"]').forEach(btn => {
    btn.addEventListener('click', resetAdvancedForm);
  });
}

function selectMethod(method) {
  document.querySelectorAll('.method-card').forEach(card => {
    card.classList.remove('active');
  });
  
  document.querySelectorAll('.upload-section').forEach(section => {
    section.classList.remove('active');
  });
  
  if (method === 'manual') {
    document.querySelector('[data-action="selectMethod"][data-method="manual"]').classList.add('active');
    document.getElementById('manualSection').classList.add('active');
  } else if (method === 'import') {
    document.querySelector('[data-action="selectMethod"][data-method="import"]').classList.add('active');
    document.getElementById('importSection').classList.add('active');
  } else {
    document.querySelector('[data-action="selectMethod"][data-method="advanced"]').classList.add('active');
    document.getElementById('advancedSection').classList.add('active');
  }
}

function loadStudentsForManual() {
  const course = document.getElementById('manualCourse').value;
  const period = document.getElementById('manualPeriod').value;
  const tableContainer = document.getElementById('manualGradesTable');
  
  if (!course || !period) {
    tableContainer.innerHTML = '';
    return;
  }
  
  const students = studentsData[course] || [];
  
  const table = `
    <table class="grades-table">
      <thead>
        <tr>
          <th style="width: 120px;">Student ID</th>
          <th>Student Name</th>
          <th style="width: 150px;">Grade <span class="required">*</span></th>
          <th style="width: 250px;">Remarks (Optional)</th>
          <th style="width: 150px;">Actions</th>
        </tr>
      </thead>
      <tbody>
        ${students.map(student => `
          <tr class="student-row" data-id="${student.id}">
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>
              <input type="number" min="0" max="100" step="0.01" 
                     class="grade-input" data-student="${student.id}" 
                     placeholder="0.00">
            </td>
            <td>
              <input type="text" class="form-control remarks-input" 
                     style="width: 100%;" placeholder="Optional remarks">
            </td>
            <td>
              <div class="grade-actions">
                <button class="btn btn-secondary" data-action="setGrade" data-student="${student.id}" data-grade="85">
                  <i class="fas fa-bolt"></i> 85
                </button>
                <button class="btn btn-secondary" data-action="setGrade" data-student="${student.id}" data-grade="90">
                  <i class="fas fa-bolt"></i> 90
                </button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  tableContainer.innerHTML = table;

  // Add event listeners to dynamically created grade action buttons
  document.querySelectorAll('[data-action="setGrade"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const studentId = e.currentTarget.getAttribute('data-student');
      const grade = e.currentTarget.getAttribute('data-grade');
      setGrade(studentId, grade);
    });
  });
}

function setGrade(studentId, grade) {
  const input = document.querySelector(`.grade-input[data-student="${studentId}"]`);
  if (input) {
    input.value = grade;
  }
}

function applyToAll(field, value) {
  if (field === 'grade') {
    document.querySelectorAll('.grade-input').forEach(input => {
      input.value = value;
    });
  }
}

function searchStudents() {
  const searchTerm = document.getElementById('searchStudent').value.toLowerCase();
  const rows = document.querySelectorAll('.student-row');
  
  rows.forEach(row => {
    const studentName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
    const studentId = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
    
    if (studentName.includes(searchTerm) || studentId.includes(searchTerm)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

function submitManualGrades() {
  const course = document.getElementById('manualCourse').value;
  const period = document.getElementById('manualPeriod').value;
  
  if (!course || !period) {
    alert('Please select both course and grading period');
    return;
  }
  
  const gradeInputs = document.querySelectorAll('.grade-input');
  const grades = [];
  let hasEmpty = false;
  
  gradeInputs.forEach(input => {
    const value = input.value.trim();
    if (!value) {
      hasEmpty = true;
    } else {
      grades.push({
        studentId: input.dataset.student,
        grade: parseFloat(value)
      });
    }
  });
  
  if (hasEmpty) {
    if (!confirm('Some grades are empty. Do you want to continue?')) {
      return;
    }
  }
  
  // Simulate submission
  alert(`Successfully submitted ${grades.length} grades for ${period.toUpperCase()} period!`);
  resetManualForm();
}

function resetManualForm() {
  document.getElementById('manualCourse').value = '';
  document.getElementById('manualPeriod').value = '';
  document.getElementById('manualGradesTable').innerHTML = '';
  document.getElementById('searchStudent').value = '';
}

function handleFile(file) {
  // Validate file type
  const validTypes = ['.csv', '.xls', '.xlsx'];
  const fileExt = '.' + file.name.split('.').pop().toLowerCase();
  
  if (!validTypes.includes(fileExt)) {
    alert('Invalid file type. Please upload CSV or Excel file.');
    return;
  }
  
  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size exceeds 5MB limit.');
    return;
  }
  
  selectedFile = file;
  
  // Display file info
  document.getElementById('fileName').textContent = file.name;
  document.getElementById('fileSize').textContent = formatFileSize(file.size);
  document.getElementById('fileInfo').classList.add('active');
  
  // Show preview
  showImportPreview(file);
}

function showImportPreview(file) {
  const previewContainer = document.getElementById('importPreview');
  
  // Simulate file parsing and preview
  const previewHTML = `
    <div class="import-preview">
      <h4>File Preview</h4>
      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Grade</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr class="valid-row">
            <td>2024-001234</td>
            <td>Maria Santos</td>
            <td>85</td>
            <td><i class="fas fa-check-circle" style="color: var(--success);"></i> Valid</td>
          </tr>
          <tr class="valid-row">
            <td>2024-001235</td>
            <td>Juan Dela Cruz</td>
            <td>90</td>
            <td><i class="fas fa-check-circle" style="color: var(--success);"></i> Valid</td>
          </tr>
          <tr class="invalid-row">
            <td>2024-001236</td>
            <td>Anna Reyes</td>
            <td>105</td>
            <td><i class="fas fa-exclamation-triangle" style="color: var(--warning);"></i> Grade out of range</td>
          </tr>
        </tbody>
      </table>
      
      <div class="import-summary">
        <h4>Import Summary</h4>
        <ul>
          <li><i class="fas fa-check-circle" style="color: var(--success);"></i> 2 records are valid and ready for import</li>
          <li><i class="fas fa-exclamation-triangle" style="color: var(--warning);"></i> 1 record has issues that need attention</li>
          <li><i class="fas fa-info-circle" style="color: var(--primary-blue);"></i> Total records: 3</li>
        </ul>
      </div>
    </div>
  `;
  
  previewContainer.innerHTML = previewHTML;
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function removeFile() {
  selectedFile = null;
  document.getElementById('fileInput').value = '';
  document.getElementById('fileInfo').classList.remove('active');
  document.getElementById('importPreview').innerHTML = '';
}

function uploadFile() {
  const course = document.getElementById('importCourse').value;
  const period = document.getElementById('importPeriod').value;
  
  if (!course || !period) {
    alert('Please select both course and grading period');
    return;
  }
  
  if (!selectedFile) {
    alert('Please select a file to upload');
    return;
  }
  
  // Simulate file upload and processing
  const uploadProgress = document.createElement('div');
  uploadProgress.className = 'alert alert-info';
  uploadProgress.innerHTML = `
    <i class="fas fa-spinner fa-spin" style="font-size: 20px;"></i>
    <div>
      <strong>Processing file...</strong><br>
      <small>Please wait while we validate and import your data.</small>
    </div>
  `;
  
  document.querySelector('.dashboard').insertBefore(uploadProgress, document.querySelector('.dashboard').firstChild);
  
  setTimeout(() => {
    uploadProgress.remove();
    
    const successAlert = document.createElement('div');
    successAlert.className = 'alert alert-success';
    successAlert.innerHTML = `
      <i class="fas fa-check-circle" style="font-size: 20px;"></i>
      <div>
        <strong>Upload Successful!</strong><br>
        <small>Grades have been imported and saved successfully.</small>
      </div>
    `;
    
    document.querySelector('.dashboard').insertBefore(successAlert, document.querySelector('.dashboard').firstChild);
    
    setTimeout(() => successAlert.remove(), 5000);
    
    resetImportForm();
  }, 2000);
}

function resetImportForm() {
  document.getElementById('importCourse').value = '';
  document.getElementById('importPeriod').value = '';
  removeFile();
}

// Advanced Import Functions
function loadFilteredStudents() {
  const year = document.getElementById('academicYear').value;
  const course = document.getElementById('advancedCourse').value;
  const section = document.getElementById('section').value;
  
  if (!year || !course || !section) {
    alert('Please select academic year, course, and section');
    return;
  }
  
  // Filter students based on criteria
  filteredStudents = [];
  for (const key in studentsData) {
    studentsData[key].forEach(student => {
      if (student.year === year && student.course === course && student.section === section) {
        filteredStudents.push(student);
      }
    });
  }
  
  if (filteredStudents.length === 0) {
    alert('No students found for the selected criteria');
  } else {
    alert(`Found ${filteredStudents.length} students for ${course} - Section ${section} (${year})`);
  }
}

function downloadFilteredTemplate(format) {
  if (filteredStudents.length === 0) {
    alert('Please load students first by selecting academic year, course, and section');
    return;
  }
  
  const templateData = [
    ['Student ID', 'Student Name', 'Grade', 'Remarks']
  ];
  
  // Add filtered students to template
  filteredStudents.forEach(student => {
    templateData.push([student.id, student.name, '', '']);
  });
  
  if (format === 'csv') {
    // Create CSV content
    const csvContent = templateData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grades_${document.getElementById('advancedCourse').value}_${document.getElementById('section').value}_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  } else {
    // For Excel, we'll just download CSV and user can open in Excel
    const csvContent = templateData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grades_${document.getElementById('advancedCourse').value}_${document.getElementById('section').value}_template.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
  alert('Template downloaded successfully!');
}

function handleAdvancedFile(file) {
  // Validate file type
  const validTypes = ['.csv', '.xls', '.xlsx'];
  const fileExt = '.' + file.name.split('.').pop().toLowerCase();
  
  if (!validTypes.includes(fileExt)) {
    alert('Invalid file type. Please upload CSV or Excel file.');
    return;
  }
  
  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size exceeds 5MB limit.');
    return;
  }
  
  selectedAdvancedFile = file;
  
  // Display file info
  document.getElementById('advancedFileName').textContent = file.name;
  document.getElementById('advancedFileSize').textContent = formatFileSize(file.size);
  document.getElementById('advancedFileInfo').classList.add('active');
  
  // Show preview
  showAdvancedImportPreview(file);
}

function showAdvancedImportPreview(file) {
  const previewContainer = document.getElementById('advancedImportPreview');
  
  // Simulate file parsing and preview
  const previewHTML = `
    <div class="import-preview">
      <h4>Advanced Import Preview</h4>
      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Grade</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${filteredStudents.map(student => `
            <tr class="valid-row">
              <td>${student.id}</td>
              <td>${student.name}</td>
              <td>${Math.floor(Math.random() * 30) + 70}</td>
              <td><i class="fas fa-check-circle" style="color: var(--success);"></i> Valid</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="import-summary">
        <h4>Import Summary</h4>
        <ul>
          <li><i class="fas fa-check-circle" style="color: var(--success);"></i> ${filteredStudents.length} records are valid and ready for import</li>
          <li><i class="fas fa-info-circle" style="color: var(--primary-blue);"></i> Course: ${document.getElementById('advancedCourse').value}</li>
          <li><i class="fas fa-info-circle" style="color: var(--primary-blue);"></i> Section: ${document.getElementById('section').value}</li>
          <li><i class="fas fa-info-circle" style="color: var(--primary-blue);"></i> Academic Year: ${document.getElementById('academicYear').value}</li>
        </ul>
      </div>
    </div>
  `;
  
  previewContainer.innerHTML = previewHTML;
}

function removeAdvancedFile() {
  selectedAdvancedFile = null;
  document.getElementById('advancedFileInput').value = '';
  document.getElementById('advancedFileInfo').classList.remove('active');
  document.getElementById('advancedImportPreview').innerHTML = '';
}

function uploadAdvancedFile() {
  const period = document.getElementById('advancedPeriod').value;
  
  if (!period) {
    alert('Please select grading period');
    return;
  }
  
  if (!selectedAdvancedFile) {
    alert('Please select a file to upload');
    return;
  }
  
  if (filteredStudents.length === 0) {
    alert('Please load students first by selecting academic year, course, and section');
    return;
  }
  
  // Simulate file upload and processing
  const uploadProgress = document.createElement('div');
  uploadProgress.className = 'alert alert-info';
  uploadProgress.innerHTML = `
    <i class="fas fa-spinner fa-spin" style="font-size: 20px;"></i>
    <div>
      <strong>Processing advanced import...</strong><br>
      <small>Please wait while we validate and import your data.</small>
    </div>
  `;
  
  document.querySelector('.dashboard').insertBefore(uploadProgress, document.querySelector('.dashboard').firstChild);
  
  setTimeout(() => {
    uploadProgress.remove();
    
    const successAlert = document.createElement('div');
    successAlert.className = 'alert alert-success';
    successAlert.innerHTML = `
      <i class="fas fa-check-circle" style="font-size: 20px;"></i>
      <div>
        <strong>Advanced Import Successful!</strong><br>
        <small>${filteredStudents.length} grades have been imported for ${document.getElementById('advancedCourse').value} - Section ${document.getElementById('section').value} (${document.getElementById('academicYear').value}).</small>
      </div>
    `;
    
    document.querySelector('.dashboard').insertBefore(successAlert, document.querySelector('.dashboard').firstChild);
    
    setTimeout(() => successAlert.remove(), 5000);
    
    resetAdvancedForm();
  }, 2000);
}

function resetAdvancedForm() {
  document.getElementById('academicYear').value = '';
  document.getElementById('advancedCourse').value = '';
  document.getElementById('section').value = '';
  document.getElementById('advancedPeriod').value = '';
  removeAdvancedFile();
  filteredStudents = [];
}

function downloadTemplate(format) {
  const templateData = [
    ['Student ID', 'Student Name', 'Grade', 'Remarks'],
    ['2024-001234', 'Maria Santos', '85', 'Good performance'],
    ['2024-001235', 'Juan Dela Cruz', '90', 'Excellent work'],
    ['2024-001236', 'Anna Reyes', '88', '']
  ];
  
  if (format === 'csv') {
    // Create CSV content
    const csvContent = templateData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grades_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  } else {
    // For Excel, we'll just download CSV and user can open in Excel
    const csvContent = templateData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grades_template.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
  alert('Template downloaded successfully!');
}