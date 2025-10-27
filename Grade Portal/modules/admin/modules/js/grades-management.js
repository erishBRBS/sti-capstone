// grades-management.js
// Focused on Grade Approval functionality

let gradesData = {};
let currentClassKey = '';
let pendingApprovals = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    setupEventListeners();
    loadApprovalQueue();
    loadClassGrades();
});

// Initialize sample data
function initializeData() {
    gradesData = {
        'CS101-A': [
            {
                studentId: 'STI-2024-0001',
                studentName: 'Juan Cruz',
                prelim: 85,
                midterm: 88,
                final: 90,
                quizzes: [78, 82, 85, 90],
                projects: [85, 92],
                finalGrade: 87.5,
                letterGrade: 'B+',
                gpa: 3.3,
                status: 'Passed'
            },
            {
                studentId: 'STI-2024-0002',
                studentName: 'Maria Gonzales',
                prelim: 92,
                midterm: 90,
                final: 95,
                quizzes: [88, 90, 92, 95],
                projects: [90, 95],
                finalGrade: 92.1,
                letterGrade: 'A-',
                gpa: 3.7,
                status: 'Passed'
            },
            {
                studentId: 'STI-2024-0003',
                studentName: 'Carlos Rivera',
                prelim: 75,
                midterm: 72,
                final: 78,
                quizzes: [70, 75, 73, 80],
                projects: [72, 78],
                finalGrade: 75.2,
                letterGrade: 'C',
                gpa: 2.0,
                status: 'Passed'
            }
        ]
    };

    // Sample pending approvals data
    pendingApprovals = [
        {
            id: 'sub001',
            course: 'CS101 - Programming Fundamentals',
            section: 'Section A',
            teacher: 'Prof. Rodriguez',
            gradeType: 'Midterm Grades',
            studentCount: 45,
            submitted: '2 hours ago',
            status: 'pending',
            gradeRange: '45-98',
            average: 82.3,
            passRate: 93,
            failing: 3,
            needsReview: false
        },
        {
            id: 'sub002',
            course: 'IT101 - Computer Systems',
            section: 'Section B',
            teacher: 'Prof. Martinez',
            gradeType: 'Final Grades',
            studentCount: 38,
            submitted: '5 hours ago',
            status: 'flagged',
            gradeRange: '38-96',
            average: 79.1,
            passRate: 87,
            failing: 5,
            needsReview: true
        },
        {
            id: 'sub003',
            course: 'BA101 - Business Ethics',
            section: 'Section A',
            teacher: 'Prof. Johnson',
            gradeType: 'Prelim Grades',
            studentCount: 42,
            submitted: '1 day ago',
            status: 'pending',
            gradeRange: '65-98',
            average: 85.2,
            passRate: 95,
            failing: 2,
            needsReview: false
        },
        {
            id: 'sub004',
            course: 'CS201 - Data Structures',
            section: 'Section C',
            teacher: 'Prof. Lee',
            gradeType: 'Quiz 1 Scores',
            studentCount: 52,
            submitted: '3 days ago',
            status: 'pending',
            gradeRange: '50-100',
            average: 78.5,
            passRate: 88,
            failing: 6,
            needsReview: false
        }
    ];
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
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (event) => {
            if (window.innerWidth < 992 && sidebar.classList.contains('open')) {
                if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });
    }
    
    // Dark mode toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    if (themeToggle && themeIcon) {
        // Check for saved theme preference or respect OS preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Set initial theme
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
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
    
    // Tab functionality
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Course and section selection
    document.getElementById('courseSelect').addEventListener('change', loadClassGrades);
    document.getElementById('sectionSelect').addEventListener('change', loadClassGrades);
    document.getElementById('gradeComponentSelect').addEventListener('change', loadClassGrades);

    // Grade approval functionality
    document.getElementById('bulkApproveBtn').addEventListener('click', bulkApproveGrades);
    document.getElementById('approvalFilter').addEventListener('change', filterApprovals);

    // Button event listeners
    document.getElementById('exportGradesBtn').addEventListener('click', exportClassGrades);
    document.getElementById('printGradesBtn').addEventListener('click', printGrades);
    document.getElementById('processBulkGradesBtn').addEventListener('click', processBulkGrades);
    document.getElementById('downloadTemplateBtn').addEventListener('click', downloadTemplate);
    
    // Modal close buttons
    document.getElementById('closeGradeReviewModal').addEventListener('click', closeGradeReviewModal);

    // File upload
    document.getElementById('bulkUploadArea').addEventListener('click', function() {
        document.getElementById('bulkGradeFile').click();
    });

    // Quick search
    document.getElementById('quickSearch').addEventListener('input', function() {
        performQuickSearch(this.value);
    });

    // Student search
    document.getElementById('studentSearchGrades').addEventListener('input', function() {
        searchStudentGrades(this.value);
    });

    // Close modals when clicking outside
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('gradeReviewModal');
        if (modal && event.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Escape to close modals
        if (event.key === 'Escape') {
            closeGradeReviewModal();
        }
    });
}

// Tab switching
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeTabBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTabBtn) {
        activeTabBtn.classList.add('active');
    }

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const activeTabContent = document.getElementById(tabName);
    if (activeTabContent) {
        activeTabContent.classList.add('active');
    }
}

// Load approval queue
function loadApprovalQueue() {
    const container = document.getElementById('approvalQueue');
    
    if (pendingApprovals.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <p>No pending grade approvals</p>
                <p style="font-size: 14px; margin-top: 8px;">All teacher submissions have been reviewed</p>
            </div>
        `;
        return;
    }

    container.innerHTML = pendingApprovals.map(approval => `
        <div class="approval-item ${approval.needsReview ? 'needs-review' : ''}">
            <div class="approval-item-header">
                <input type="checkbox" class="approval-checkbox" value="${approval.id}">
                <div class="approval-content">
                    <h4 class="approval-title">${approval.course} (${approval.section})</h4>
                    <p class="approval-meta">Submitted by ${approval.teacher} • ${approval.gradeType} • ${approval.studentCount} students</p>
                    <p class="approval-time">Submitted ${approval.submitted}</p>
                </div>
                <div class="approval-actions">
                    <span class="status-badge ${getApprovalStatusClass(approval.status)}">
                        ${getApprovalStatusText(approval.status)}
                    </span>
                    <button class="btn btn-primary" onclick="reviewSubmission('${approval.id}')">Review</button>
                </div>
            </div>
            <div class="approval-stats-grid">
                <div class="stat-item">
                    <span class="stat-label-small">Grade Range:</span>
                    <span class="stat-value-small">${approval.gradeRange}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label-small">Average:</span>
                    <span class="stat-value-small">${approval.average}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label-small">Pass Rate:</span>
                    <span class="stat-value-small" style="color: ${approval.passRate >= 90 ? '#43a047' : approval.passRate >= 80 ? '#e6b400' : '#e53935'};">${approval.passRate}%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label-small">Failing:</span>
                    <span class="stat-value-small" style="color: ${approval.failing > 0 ? '#e53935' : '#43a047'};">${approval.failing} students</span>
                </div>
            </div>
            ${approval.needsReview ? `
                <div class="alert alert-error" style="margin-top: 12px;">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>High failure rate detected - Review recommended</span>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Get approval status class
function getApprovalStatusClass(status) {
    const classes = {
        'pending': 'status-pending',
        'flagged': 'status-flagged',
        'approved': 'status-approved'
    };
    return classes[status] || 'status-pending';
}

// Get approval status text
function getApprovalStatusText(status) {
    const texts = {
        'pending': 'Pending Review',
        'flagged': 'Needs Review',
        'approved': 'Approved'
    };
    return texts[status] || 'Pending Review';
}

// Review submission
function reviewSubmission(submissionId) {
    const submission = pendingApprovals.find(s => s.id === submissionId);
    if (!submission) return;

    const modal = document.getElementById('gradeReviewModal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = `
        <div class="review-header">
            <h4>${submission.course} - ${submission.gradeType}</h4>
            <p>Submitted by ${submission.teacher} • ${submission.studentCount} students</p>
        </div>
        
        <div class="review-stats">
            <div class="stat-card">
                <div class="stat-value">${submission.average}</div>
                <div class="stat-label">Average Grade</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${submission.passRate}%</div>
                <div class="stat-label">Pass Rate</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${submission.failing}</div>
                <div class="stat-label">Failing Students</div>
            </div>
        </div>

        <div class="grade-distribution-preview">
            <h4>Grade Distribution</h4>
            <div class="distribution-chart">
                <div class="distribution-bar" style="height: 60%; background-color: #43a047;" title="A: 25%"></div>
                <div class="distribution-bar" style="height: 80%; background-color: #2196f3;" title="B: 35%"></div>
                <div class="distribution-bar" style="height: 50%; background-color: #ffc107;" title="C: 28%"></div>
                <div class="distribution-bar" style="height: 20%; background-color: #ff9800;" title="D: 8%"></div>
                <div class="distribution-bar" style="height: 10%; background-color: #f44336;" title="F: 4%"></div>
            </div>
        </div>

        <div class="review-actions">
            <button class="btn btn-success" onclick="approveSubmission('${submissionId}')">
                <i class="fas fa-check"></i> Approve Grades
            </button>
            <button class="btn btn-danger" onclick="rejectSubmission('${submissionId}')">
                <i class="fas fa-times"></i> Request Revision
            </button>
            <button class="btn btn-secondary" onclick="closeGradeReviewModal()">
                <i class="fas fa-times"></i> Cancel
            </button>
        </div>
    `;

    modal.classList.add('active');
}

// Approve submission
function approveSubmission(submissionId) {
    const submissionIndex = pendingApprovals.findIndex(s => s.id === submissionId);
    if (submissionIndex === -1) return;

    const submission = pendingApprovals[submissionIndex];
    
    // Remove from pending approvals
    pendingApprovals.splice(submissionIndex, 1);
    
    showAlert(`Grades for ${submission.course} approved successfully!`, 'success');
    closeGradeReviewModal();
    loadApprovalQueue();
    
    // Update tab badge
    updateApprovalBadge();
}

// Reject submission
function rejectSubmission(submissionId) {
    const submission = pendingApprovals.find(s => s.id === submissionId);
    if (!submission) return;

    const reason = prompt('Please provide a reason for requesting revision:');
    if (reason) {
        showAlert(`Revision requested for ${submission.course}. Reason: ${reason}`, 'warning');
        closeGradeReviewModal();
        
        // In a real application, you would send this back to the teacher
        console.log(`Revision requested for ${submissionId}: ${reason}`);
    }
}

// Bulk approve grades
function bulkApproveGrades() {
    const selectedCheckboxes = document.querySelectorAll('.approval-checkbox:checked');
    if (selectedCheckboxes.length === 0) {
        showAlert('Please select submissions to approve', 'warning');
        return;
    }

    const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.value);
    
    // Remove selected submissions from pending approvals
    pendingApprovals = pendingApprovals.filter(approval => !selectedIds.includes(approval.id));
    
    showAlert(`${selectedIds.length} grade submissions approved successfully!`, 'success');
    loadApprovalQueue();
    
    // Update tab badge
    updateApprovalBadge();
}

// Update approval badge count
function updateApprovalBadge() {
    const badge = document.querySelector('.tab-btn[data-tab="grade-approval"] .tab-badge');
    if (badge) {
        badge.textContent = pendingApprovals.length;
        if (pendingApprovals.length === 0) {
            badge.style.display = 'none';
        }
    }
}

// Filter approvals
function filterApprovals() {
    const filter = document.getElementById('approvalFilter').value;
    // In a real application, this would filter the approvals based on the selected criteria
    showAlert(`Filtering approvals by: ${filter}`, 'info');
}

// Close grade review modal
function closeGradeReviewModal() {
    document.getElementById('gradeReviewModal').classList.remove('active');
}

// Load class grades
function loadClassGrades() {
    const course = document.getElementById('courseSelect').value;
    const section = document.getElementById('sectionSelect').value;
    const container = document.getElementById('classGradesContainer');

    if (!course || !section) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <p>Select a course and section to view grades</p>
            </div>
        `;
        return;
    }

    const classKey = `${course}-${section}`;
    currentClassKey = classKey;
    const grades = gradesData[classKey] || [];

    if (grades.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-list"></i>
                <p>No grades found for this class</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Prelim</th>
                        <th>Midterm</th>
                        <th>Final</th>
                        <th>Final Grade</th>
                        <th>Letter Grade</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${grades.map(student => `
                        <tr>
                            <td>
                                <div class="student-info">
                                    <div class="student-avatar">
                                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(student.studentName)}&background=1a4b8c&color=fff" alt="${student.studentName}">
                                    </div>
                                    <div class="student-details">
                                        <p class="student-name">${student.studentName}</p>
                                        <p class="student-id">${student.studentId}</p>
                                    </div>
                                </div>
                            </td>
                            <td>${student.prelim || '-'}</td>
                            <td>${student.midterm || '-'}</td>
                            <td>${student.final || '-'}</td>
                            <td class="final-grade">${student.finalGrade || '-'}</td>
                            <td>
                                <span class="status-badge ${getGradeColor(student.letterGrade)}">
                                    ${student.letterGrade || 'INC'}
                                </span>
                            </td>
                            <td>
                                <span class="status-badge ${getStatusColor(student.status)}">
                                    ${student.status || 'Incomplete'}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Search functions
function performQuickSearch(query) {
    if (query.length < 2) return;
    showAlert(`Searching for: ${query}`, 'info');
}

function searchStudentGrades(query) {
    if (query.length < 2) {
        document.getElementById('studentGradesContainer').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-search"></i>
                <p>Search for a student to view their grades</p>
            </div>
        `;
        return;
    }
    
    // Simulate search results
    document.getElementById('studentGradesContainer').innerHTML = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Prelim</th>
                        <th>Midterm</th>
                        <th>Final</th>
                        <th>Final Grade</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>CS101 - Programming Fundamentals</td>
                        <td>85</td>
                        <td>88</td>
                        <td>90</td>
                        <td>87.5</td>
                        <td><span class="status-badge status-approved">Passed</span></td>
                    </tr>
                    <tr>
                        <td>CS201 - Data Structures</td>
                        <td>78</td>
                        <td>82</td>
                        <td>85</td>
                        <td>82.3</td>
                        <td><span class="status-badge status-approved">Passed</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

// Utility functions
function getGradeColor(letterGrade) {
    const colors = {
        'A': 'status-approved',
        'A-': 'status-approved',
        'B+': 'status-active',
        'B': 'status-active',
        'B-': 'status-active',
        'C+': 'status-pending',
        'C': 'status-pending',
        'C-': 'status-pending',
        'D': 'status-pending',
        'F': 'status-flagged',
        'INC': 'status-pending'
    };
    return colors[letterGrade] || 'status-pending';
}

function getStatusColor(status) {
    const colors = {
        'Passed': 'status-approved',
        'Failed': 'status-flagged',
        'Incomplete': 'status-pending',
        'Dropped': 'status-pending'
    };
    return colors[status] || 'status-pending';
}

// Action functions
function exportClassGrades() {
    if (!currentClassKey) {
        showAlert('Please select a course and section first', 'warning');
        return;
    }
    showAlert('Exporting class grades...', 'info');
    setTimeout(() => {
        showAlert('Class grades exported successfully!', 'success');
    }, 2000);
}

function printGrades() {
    showAlert('Printing grade report...', 'info');
    setTimeout(() => {
        showAlert('Grade report sent to printer!', 'success');
    }, 1000);
}

function processBulkGrades() {
    const fileInput = document.getElementById('bulkGradeFile');
    if (!fileInput.files[0]) {
        showAlert('Please select a file to upload', 'warning');
        return;
    }
    
    showAlert('Processing bulk grade upload...', 'info');
    setTimeout(() => {
        showAlert('Bulk grades uploaded successfully! 45 records processed.', 'success');
    }, 3000);
}

function downloadTemplate() {
    showAlert('Downloading grade template...', 'info');
    setTimeout(() => {
        showAlert('Template downloaded successfully!', 'success');
    }, 1000);
}

// Alert system
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
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
            <span>${message}</span>
            <button onclick="document.getElementById('${alertId}').remove()" style="margin-left: auto; background: none; border: none; cursor: pointer; color: inherit;">✕</button>
        </div>
    `;
    
    alertContainer.insertAdjacentHTML('beforeend', alertHtml);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        const alert = document.getElementById(alertId);
        if (alert) alert.remove();
    }, 5000);
}