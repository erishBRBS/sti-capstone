// student-records.js
// Student records management functionality

let studentsData = [];
let currentPage = 1;
let rowsPerPage = 5;
let filteredStudents = [];
let sortColumn = '';
let sortDirection = 'asc';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    setupEventListeners();
    renderStudentTable();
    updatePagination();
});

// Initialize sample data
function initializeData() {
    studentsData = [
        {
            id: 'STI-2024-0001',
            firstName: 'Juan',
            lastName: 'Cruz',
            middleName: 'Santos',
            email: 'juan.cruz@sti.edu',
            phone: '+63 912 345 6789',
            course: 'Computer Science',
            yearLevel: '3rd Year',
            status: 'Active',
            balance: 15000,
            enrollmentDate: '2022-08-15',
            avatar: 'https://ui-avatars.com/api/?name=Juan+Cruz&background=1a4b8c&color=fff'
        },
        {
            id: 'STI-2024-0002',
            firstName: 'Maria',
            lastName: 'Gonzales',
            middleName: 'Reyes',
            email: 'maria.gonzales@sti.edu',
            phone: '+63 915 678 9012',
            course: 'Information Technology',
            yearLevel: '2nd Year',
            status: 'Active',
            balance: 0,
            enrollmentDate: '2023-08-20',
            avatar: 'https://ui-avatars.com/api/?name=Maria+Gonzales&background=2d68b8&color=fff'
        },
        {
            id: 'STI-2024-0003',
            firstName: 'Carlos',
            lastName: 'Rivera',
            middleName: 'Martinez',
            email: 'carlos.rivera@sti.edu',
            phone: '+63 918 901 2345',
            course: 'Business Administration',
            yearLevel: '4th Year',
            status: 'Active',
            balance: 8500,
            enrollmentDate: '2021-08-10',
            avatar: 'https://ui-avatars.com/api/?name=Carlos+Rivera&background=43a047&color=fff'
        },
        {
            id: 'STI-2024-0004',
            firstName: 'Ana',
            lastName: 'Torres',
            middleName: 'Lopez',
            email: 'ana.torres@sti.edu',
            phone: '+63 913 456 7890',
            course: 'Engineering',
            yearLevel: '1st Year',
            status: 'Active',
            balance: 25000,
            enrollmentDate: '2024-08-05',
            avatar: 'https://ui-avatars.com/api/?name=Ana+Torres&background=e6b400&color=fff'
        },
        {
            id: 'STI-2024-0005',
            firstName: 'Miguel',
            lastName: 'Santos',
            middleName: 'Cruz',
            email: 'miguel.santos@sti.edu',
            phone: '+63 916 567 8901',
            course: 'Computer Science',
            yearLevel: '2nd Year',
            status: 'Inactive',
            balance: 45000,
            enrollmentDate: '2023-08-18',
            avatar: 'https://ui-avatars.com/api/?name=Miguel+Santos&background=e53935&color=fff'
        }
    ];
    
    filteredStudents = [...studentsData];
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu functionality
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.querySelector(".sidebar");
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
    }
    
    // Dark mode toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    if (themeToggle && themeIcon) {
        // Check for saved theme preference or respect OS preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Set initial theme
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
        
        // Toggle theme
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

    // Search functionality
    const studentSearch = document.getElementById('studentSearch');
    if (studentSearch) {
        studentSearch.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filteredStudents = studentsData.filter(student => 
                student.firstName.toLowerCase().includes(searchTerm) ||
                student.lastName.toLowerCase().includes(searchTerm) ||
                student.id.toLowerCase().includes(searchTerm) ||
                student.email.toLowerCase().includes(searchTerm) ||
                student.course.toLowerCase().includes(searchTerm)
            );
            currentPage = 1;
            renderStudentTable();
            updatePagination();
        });
    }

    // Quick search functionality
    const quickSearch = document.getElementById('quickSearch');
    if (quickSearch) {
        quickSearch.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filteredStudents = studentsData.filter(student => 
                student.firstName.toLowerCase().includes(searchTerm) ||
                student.lastName.toLowerCase().includes(searchTerm) ||
                student.id.toLowerCase().includes(searchTerm) ||
                student.email.toLowerCase().includes(searchTerm)
            );
            currentPage = 1;
            renderStudentTable();
            updatePagination();
        });
    }

    // Select all checkbox
    const selectAll = document.getElementById('selectAll');
    const selectAllHeader = document.getElementById('selectAllHeader');
    
    if (selectAll) {
        selectAll.addEventListener('change', function(e) {
            const checkboxes = document.querySelectorAll('#studentTableBody input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = e.target.checked);
            if (selectAllHeader) selectAllHeader.checked = e.target.checked;
        });
    }

    if (selectAllHeader) {
        selectAllHeader.addEventListener('change', function(e) {
            const checkboxes = document.querySelectorAll('#studentTableBody input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = e.target.checked);
            if (selectAll) selectAll.checked = e.target.checked;
        });
    }

    // Add student form submission
    const addStudentForm = document.getElementById('addStudentForm');
    if (addStudentForm) {
        addStudentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processAddStudent();
        });
    }

    // Bulk action type change
    const bulkActionType = document.getElementById('bulkActionType');
    if (bulkActionType) {
        bulkActionType.addEventListener('change', function(e) {
            showBulkActionDetails(e.target.value);
        });
    }

    // Modal buttons
    document.getElementById('addStudentBtn')?.addEventListener('click', showAddStudentModal);
    document.getElementById('bulkActionsBtn')?.addEventListener('click', showBulkActionsModal);
    document.getElementById('toggleFiltersBtn')?.addEventListener('click', toggleFiltersPanel);
    document.getElementById('closeAddStudentModal')?.addEventListener('click', closeAddStudentModal);
    document.getElementById('cancelAddStudent')?.addEventListener('click', closeAddStudentModal);
    document.getElementById('closeBulkActionsModal')?.addEventListener('click', closeBulkActionsModal);
    document.getElementById('cancelBulkAction')?.addEventListener('click', closeBulkActionsModal);
    document.getElementById('applyFiltersBtn')?.addEventListener('click', applyFilters);
    document.getElementById('clearFiltersBtn')?.addEventListener('click', clearFilters);
    document.getElementById('processBulkAction')?.addEventListener('click', processBulkAction);
    document.getElementById('prevBtn')?.addEventListener('click', previousPage);
    document.getElementById('nextBtn')?.addEventListener('click', nextPage);

    // Close modals when clicking outside
    document.addEventListener('click', function(event) {
        const modals = ['addStudentModal', 'bulkActionsModal'];
        
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (event.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Escape to close modals
        if (event.key === 'Escape') {
            closeAddStudentModal();
            closeBulkActionsModal();
            closeStudentDetailsModal();
        }
        
        // Ctrl/Cmd + N for new student
        if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
            event.preventDefault();
            showAddStudentModal();
        }
        
        // Ctrl/Cmd + F for search
        if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
            event.preventDefault();
            document.getElementById('studentSearch')?.focus();
        }
    });
}

// Render student table
function renderStudentTable() {
    const tbody = document.getElementById('studentTableBody');
    if (!tbody) return;
    
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const studentsToShow = filteredStudents.slice(start, end);

    tbody.innerHTML = studentsToShow.map(student => `
        <tr>
            <td>
                <input type="checkbox" class="student-checkbox" data-student-id="${student.id}">
            </td>
            <td>
                <div class="student-info-cell">
                    <div class="student-avatar">
                        <img src="${student.avatar}" alt="${student.firstName}" onerror="this.src='https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName}&background=1a4b8c&color=fff'">
                    </div>
                    <div class="student-details">
                        <div class="student-name">${student.firstName} ${student.lastName}</div>
                        <div class="student-id">${student.id}</div>
                        <div class="student-email">${student.email}</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="course-info">
                    <div class="course-name">${student.course}</div>
                    <div class="year-level">${student.yearLevel}</div>
                </div>
            </td>
            <td>
                <span class="status-badge ${getStatusClass(student.status)}">${student.status}</span>
            </td>
            <td>
                <div class="balance-amount ${student.balance > 0 ? 'has-balance' : 'paid'}">
                    ${student.balance > 0 ? `₱${student.balance.toLocaleString()}` : 'Paid'}
                </div>
            </td>
            <td>
                <div class="enrollment-date">
                    ${new Date(student.enrollmentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-btn" onclick="viewStudent('${student.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="editStudent('${student.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteStudent('${student.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    // Update counts
    const showingCount = document.getElementById('showingCount');
    const totalCount = document.getElementById('totalCount');
    if (showingCount) showingCount.textContent = `${start + 1}-${Math.min(end, filteredStudents.length)}`;
    if (totalCount) totalCount.textContent = filteredStudents.length;
}

// Get status class
function getStatusClass(status) {
    const classes = {
        'Active': 'status-active',
        'Inactive': 'status-inactive',
        'Graduated': 'status-graduated',
        'Dropped': 'status-inactive'
    };
    return classes[status] || 'status-inactive';
}

// Pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
    const paginationContainer = document.getElementById('paginationNumbers');
    
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = '';
    
    // Previous button state
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
    
    // Page numbers
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.onclick = () => goToPage(i);
        paginationContainer.appendChild(pageBtn);
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderStudentTable();
        updatePagination();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderStudentTable();
        updatePagination();
    }
}

function goToPage(page) {
    currentPage = page;
    renderStudentTable();
    updatePagination();
}

// Filter functions
function toggleFiltersPanel() {
    const panel = document.getElementById('filtersPanel');
    if (panel) panel.classList.toggle('active');
}

function applyFilters() {
    const courseFilter = document.getElementById('filterCourse').value;
    const yearFilter = document.getElementById('filterYear').value;
    const statusFilter = document.getElementById('filterStatus').value;
    
    filteredStudents = studentsData.filter(student => {
        const courseMatch = courseFilter === 'All Courses' || student.course === courseFilter;
        const yearMatch = yearFilter === 'All Years' || student.yearLevel === yearFilter;
        const statusMatch = statusFilter === 'All Status' || student.status === statusFilter;
        
        return courseMatch && yearMatch && statusMatch;
    });
    
    currentPage = 1;
    renderStudentTable();
    updatePagination();
    
    showAlert('Filters applied successfully', 'success');
    const panel = document.getElementById('filtersPanel');
    if (panel) panel.classList.remove('active');
}

function clearFilters() {
    // Reset all filter dropdowns to default
    const filterSelects = document.querySelectorAll('#filtersPanel select');
    filterSelects.forEach(select => select.selectedIndex = 0);
    
    // Reset filtered data
    filteredStudents = [...studentsData];
    currentPage = 1;
    renderStudentTable();
    updatePagination();
    
    showAlert('Filters cleared', 'info');
    const panel = document.getElementById('filtersPanel');
    if (panel) panel.classList.remove('active');
}

// Student actions
function viewStudent(studentId) {
    const student = studentsData.find(s => s.id === studentId);
    if (student) {
        showAlert(`Viewing details for: ${student.firstName} ${student.lastName} (${student.id})`, 'info');
        
        // Create and show a view modal with student details
        showStudentDetailsModal(student);
    }
}

function editStudent(studentId) {
    const student = studentsData.find(s => s.id === studentId);
    if (student) {
        showAlert(`Editing student: ${student.firstName} ${student.lastName}`, 'info');
        
        // In a real application, this would open an edit form
        // For now, we'll simulate an edit by toggling their status
        student.status = student.status === 'Active' ? 'Inactive' : 'Active';
        renderStudentTable();
        showAlert(`Updated ${student.firstName}'s status to: ${student.status}`, 'success');
    }
}

function deleteStudent(studentId) {
    const student = studentsData.find(s => s.id === studentId);
    if (student) {
        if (confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}? This action cannot be undone.`)) {
            studentsData = studentsData.filter(s => s.id !== studentId);
            filteredStudents = filteredStudents.filter(s => s.id !== studentId);
            renderStudentTable();
            updatePagination();
            showAlert(`Student ${student.firstName} ${student.lastName} deleted successfully`, 'success');
        }
    }
}

// Show student details in a modal
function showStudentDetailsModal(student) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal active" id="studentDetailsModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Student Details</h3>
                    <button class="modal-close" onclick="closeStudentDetailsModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="student-detail-header">
                        <div class="detail-avatar">
                            <img src="${student.avatar}" alt="${student.firstName}" onerror="this.src='https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName}&background=1a4b8c&color=fff'">
                        </div>
                        <div class="detail-name">
                            <h2>${student.firstName} ${student.lastName}</h2>
                            <p>${student.id} • ${student.course} • ${student.yearLevel}</p>
                            <span class="status-badge ${getStatusClass(student.status)}">${student.status}</span>
                        </div>
                    </div>
                    
                    <div class="detail-sections">
                        <div class="detail-section">
                            <h4>Personal Information</h4>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <label>Full Name</label>
                                    <span>${student.firstName} ${student.middleName} ${student.lastName}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Email</label>
                                    <span>${student.email}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Phone</label>
                                    <span>${student.phone}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4>Academic Information</h4>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <label>Course</label>
                                    <span>${student.course}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Year Level</label>
                                    <span>${student.yearLevel}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Enrollment Date</label>
                                    <span>${new Date(student.enrollmentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Balance</label>
                                    <span class="${student.balance > 0 ? 'has-balance' : 'paid'}">
                                        ${student.balance > 0 ? `₱${student.balance.toLocaleString()}` : 'Paid in Full'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeStudentDetailsModal()">Close</button>
                    <button class="btn btn-primary" onclick="editStudent('${student.id}'); closeStudentDetailsModal();">Edit Student</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeStudentDetailsModal() {
    const modal = document.getElementById('studentDetailsModal');
    if (modal) {
        modal.remove();
    }
}

// Modal functions
function showAddStudentModal() {
    document.getElementById('addStudentModal').classList.add('active');
}

function closeAddStudentModal() {
    document.getElementById('addStudentModal').classList.remove('active');
    document.getElementById('addStudentForm').reset();
}

function showBulkActionsModal() {
    const selectedStudents = getSelectedStudents();
    if (selectedStudents.length === 0) {
        showAlert('Please select at least one student', 'warning');
        return;
    }
    document.getElementById('bulkActionsModal').classList.add('active');
}

function closeBulkActionsModal() {
    document.getElementById('bulkActionsModal').classList.remove('active');
    document.getElementById('bulkActionType').selectedIndex = 0;
    document.getElementById('bulkActionDetails').classList.add('hidden');
}

// Bulk actions
function getSelectedStudents() {
    const checkboxes = document.querySelectorAll('#studentTableBody input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.dataset.studentId);
}

function showBulkActionDetails(actionType) {
    const detailsDiv = document.getElementById('bulkActionDetails');
    if (!detailsDiv) return;
    
    if (!actionType) {
        detailsDiv.classList.add('hidden');
        return;
    }

    let content = '';
    
    switch(actionType) {
        case 'status':
            content = `
                <div class="form-group">
                    <label class="form-label">New Status</label>
                    <select id="newStatus" class="form-control">
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Graduated</option>
                        <option>Dropped</option>
                    </select>
                </div>
            `;
            break;
        case 'course':
            content = `
                <div class="form-group">
                    <label class="form-label">Transfer to Course</label>
                    <select id="newCourse" class="form-control">
                        <option>Computer Science</option>
                        <option>Information Technology</option>
                        <option>Business Administration</option>
                        <option>Engineering</option>
                    </select>
                </div>
            `;
            break;
        case 'year':
            content = `
                <div class="form-group">
                    <label class="form-label">Update Year Level</label>
                    <select id="newYear" class="form-control">
                        <option>1st Year</option>
                        <option>2nd Year</option>
                        <option>3rd Year</option>
                        <option>4th Year</option>
                    </select>
                </div>
            `;
            break;
        case 'export':
            content = `
                <div class="form-group">
                    <label class="form-label">Export Format</label>
                    <select id="exportFormat" class="form-control">
                        <option value="csv">CSV</option>
                        <option value="excel">Excel</option>
                        <option value="pdf">PDF</option>
                    </select>
                </div>
            `;
            break;
        case 'delete':
            content = `
                <div class="alert alert-error">
                    <i class="fas fa-exclamation-circle"></i>
                    <div>
                        <h4>Warning</h4>
                        <p>This action will permanently delete the selected students and cannot be undone.</p>
                    </div>
                </div>
            `;
            break;
    }

    detailsDiv.innerHTML = content;
    detailsDiv.classList.remove('hidden');
}

function processBulkAction() {
    const actionType = document.getElementById('bulkActionType').value;
    const selectedStudents = getSelectedStudents();
    
    if (!actionType || selectedStudents.length === 0) {
        showAlert('Please select an action and students', 'warning');
        return;
    }

    // Process the bulk action
    switch(actionType) {
        case 'status':
            const newStatus = document.getElementById('newStatus').value;
            selectedStudents.forEach(studentId => {
                const student = studentsData.find(s => s.id === studentId);
                if (student) student.status = newStatus;
            });
            renderStudentTable();
            showAlert(`Status updated to "${newStatus}" for ${selectedStudents.length} students`, 'success');
            break;
        case 'course':
            const newCourse = document.getElementById('newCourse').value;
            selectedStudents.forEach(studentId => {
                const student = studentsData.find(s => s.id === studentId);
                if (student) student.course = newCourse;
            });
            renderStudentTable();
            showAlert(`${selectedStudents.length} students transferred to ${newCourse}`, 'success');
            break;
        case 'year':
            const newYear = document.getElementById('newYear').value;
            selectedStudents.forEach(studentId => {
                const student = studentsData.find(s => s.id === studentId);
                if (student) student.yearLevel = newYear;
            });
            renderStudentTable();
            showAlert(`Year level updated to ${newYear} for ${selectedStudents.length} students`, 'success');
            break;
        case 'export':
            const format = document.getElementById('exportFormat').value;
            showAlert(`Exporting ${selectedStudents.length} student records as ${format.toUpperCase()}...`, 'info');
            setTimeout(() => {
                showAlert('Export completed! Download will start automatically.', 'success');
            }, 2000);
            break;
        case 'delete':
            if (confirm(`Are you sure you want to delete ${selectedStudents.length} students? This action cannot be undone.`)) {
                // Remove selected students from data
                studentsData = studentsData.filter(student => !selectedStudents.includes(student.id));
                filteredStudents = filteredStudents.filter(student => !selectedStudents.includes(student.id));
                renderStudentTable();
                updatePagination();
                showAlert(`${selectedStudents.length} students deleted successfully`, 'success');
            }
            break;
    }

    closeBulkActionsModal();
    // Clear all selections
    const selectAll = document.getElementById('selectAll');
    if (selectAll) selectAll.checked = false;
    const selectAllHeader = document.getElementById('selectAllHeader');
    if (selectAllHeader) selectAllHeader.checked = false;
    const checkboxes = document.querySelectorAll('#studentTableBody input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);
}

// Add new student
function processAddStudent() {
    const form = document.getElementById('addStudentForm');
    if (!form) return;
    
    // Generate student ID if not provided
    let studentId = document.getElementById('studentId').value;
    if (!studentId.trim()) {
        studentId = 'STI-2024-' + String(studentsData.length + 1).padStart(4, '0');
    }

    // Create new student object
    const newStudent = {
        id: studentId,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        middleName: document.getElementById('middleName').value || '',
        dateOfBirth: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        civilStatus: document.getElementById('civilStatus').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        course: document.getElementById('course').value,
        yearLevel: document.getElementById('yearLevel').value,
        enrollmentDate: document.getElementById('enrollmentDate').value,
        status: 'Active',
        balance: 0,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            document.getElementById('firstName').value + '+' + document.getElementById('lastName').value
        )}&background=1a4b8c&color=fff`
    };

    // Map course and year level values
    const courseMap = {
        'cs': 'Computer Science',
        'it': 'Information Technology',
        'ba': 'Business Administration',
        'eng': 'Engineering'
    };
    
    const yearMap = {
        '1': '1st Year',
        '2': '2nd Year',
        '3': '3rd Year',
        '4': '4th Year'
    };

    newStudent.course = courseMap[newStudent.course] || newStudent.course;
    newStudent.yearLevel = yearMap[newStudent.yearLevel] || newStudent.yearLevel;

    // Add to data arrays
    studentsData.unshift(newStudent);
    filteredStudents = [...studentsData];
    
    // Refresh table
    currentPage = 1;
    renderStudentTable();
    updatePagination();
    
    // Close modal and show success message
    closeAddStudentModal();
    showAlert(`Student ${newStudent.firstName} ${newStudent.lastName} added successfully!`, 'success');
}

// Alert system
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    const alertClass = {
        success: 'alert-success',
        error: 'alert-error',
        warning: 'alert-warning',
        info: 'alert-info'
    }[type];
    
    const alertId = `alert-${Date.now()}`;
    const alertHtml = `
        <div class="alert ${alertClass}" id="${alertId}">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            <div class="alert-content">
                <span>${message}</span>
                <button onclick="document.getElementById('${alertId}').remove()" class="alert-close">✕</button>
            </div>
        </div>
    `;
    
    alertContainer.insertAdjacentHTML('beforeend', alertHtml);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        const alert = document.getElementById(alertId);
        if (alert) alert.remove();
    }, 5000);
}