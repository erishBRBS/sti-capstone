class TeacherStudents {
    constructor() {
        this.currentPage = 1;
        this.studentsPerPage = 10;
        this.filteredStudents = [];
        this.allStudents = [];
        this.init();
    }

    init() {
        this.loadSampleData();
        this.bindEvents();
        this.renderTable();
        console.log('Teacher Students initialized!');
    }

    loadSampleData() {
        // Sample student data
        this.allStudents = [
            { id: '2025-001', name: 'Juan Dela Cruz', year: '1st Year', section: 'BSIT 2A', subject: 'Mathematics', status: 'Present' },
            { id: '2025-002', name: 'Maria Santos', year: '1st Year', section: 'BSIT 2A', subject: 'Mathematics', status: 'Late' },
            { id: '2025-003', name: 'Pedro Gomez', year: '1st Year', section: 'BSIT 3B', subject: 'Science', status: 'Absent' },
            { id: '2025-004', name: 'Ana Cruz', year: '1st Year', section: 'BSIT 3B', subject: 'Science', status: 'Present' },
            { id: '2025-005', name: 'Luis Reyes', year: '2nd Year', section: 'BSCS 1C', subject: 'Programming', status: 'Present' },
            { id: '2025-006', name: 'Sofia Martinez', year: '2nd Year', section: 'BSCS 1C', subject: 'Programming', status: 'Late' },
            { id: '2025-007', name: 'Miguel Torres', year: '1st Year', section: 'BSIT 2A', subject: 'Mathematics', status: 'Present' },
            { id: '2025-008', name: 'Elena Rodriguez', year: '2nd Year', section: 'BSCS 1C', subject: 'Programming', status: 'Absent' },
            { id: '2025-009', name: 'Carlos Lim', year: '1st Year', section: 'BSIT 2A', subject: 'Mathematics', status: 'Present' },
            { id: '2025-010', name: 'Isabella Garcia', year: '2nd Year', section: 'BSCS 1C', subject: 'Programming', status: 'Late' },
            { id: '2025-011', name: 'Fernando Lopez', year: '1st Year', section: 'BSIT 3B', subject: 'Science', status: 'Present' },
            { id: '2025-012', name: 'Gabriela Reyes', year: '2nd Year', section: 'BSCS 1C', subject: 'Programming', status: 'Absent' }
        ];
        this.filteredStudents = [...this.allStudents];
    }

    bindEvents() {
        // Export buttons
        document.getElementById('exportCSV').addEventListener('click', () => {
            this.exportTableToCSV();
        });

        document.getElementById('exportExcel').addEventListener('click', () => {
            this.exportTableToExcel();
        });

        // Filter form submission
        document.getElementById('applyFilters').addEventListener('click', (e) => {
            e.preventDefault();
            this.applyFilters();
        });

        // Clear filters
        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearFilters();
        });

        // Filter inputs (real-time filtering)
        document.getElementById('filterName').addEventListener('input', () => {
            this.applyFilters();
        });

        document.getElementById('filterYear').addEventListener('input', () => {
            this.applyFilters();
        });

        document.getElementById('filterSection').addEventListener('input', () => {
            this.applyFilters();
        });

        document.getElementById('filterSubject').addEventListener('input', () => {
            this.applyFilters();
        });

        document.getElementById('filterStatus').addEventListener('change', () => {
            this.applyFilters();
        });

        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => {
            this.previousPage();
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            this.nextPage();
        });

        // Notification button
        document.querySelector('.notification-btn').addEventListener('click', () => {
            this.showNotifications();
        });
    }

    applyFilters() {
        const nameFilter = document.getElementById('filterName').value.toLowerCase();
        const yearFilter = document.getElementById('filterYear').value.toLowerCase();
        const sectionFilter = document.getElementById('filterSection').value.toLowerCase();
        const subjectFilter = document.getElementById('filterSubject').value.toLowerCase();
        const statusFilter = document.getElementById('filterStatus').value;
        
        this.filteredStudents = this.allStudents.filter(student => {
            const nameMatch = student.name.toLowerCase().includes(nameFilter);
            const yearMatch = student.year.toLowerCase().includes(yearFilter);
            const sectionMatch = student.section.toLowerCase().includes(sectionFilter);
            const subjectMatch = student.subject.toLowerCase().includes(subjectFilter);
            const statusMatch = !statusFilter || student.status === statusFilter;
            
            return nameMatch && yearMatch && sectionMatch && subjectMatch && statusMatch;
        });
        
        this.currentPage = 1;
        this.renderTable();
        this.showAlert('Filters applied successfully!', 'success');
    }

    clearFilters() {
        document.getElementById('filterName').value = '';
        document.getElementById('filterYear').value = '';
        document.getElementById('filterSection').value = '';
        document.getElementById('filterSubject').value = '';
        document.getElementById('filterStatus').value = '';
        
        this.filteredStudents = [...this.allStudents];
        this.currentPage = 1;
        this.renderTable();
        this.showAlert('Filters cleared!', 'info');
    }

    renderTable() {
        const tableBody = document.getElementById('studentTableBody');
        const startIndex = (this.currentPage - 1) * this.studentsPerPage;
        const endIndex = startIndex + this.studentsPerPage;
        const pageData = this.filteredStudents.slice(startIndex, endIndex);

        tableBody.innerHTML = '';

        pageData.forEach(student => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.year}</td>
                <td>${student.section}</td>
                <td>${student.subject}</td>
                <td>
                    <select class="form-control status-select" data-student-id="${student.id}" onchange="teacherStudents.updateStatus('${student.id}', this.value)">
                        <option value="Present" ${student.status === 'Present' ? 'selected' : ''}>Present</option>
                        <option value="Late" ${student.status === 'Late' ? 'selected' : ''}>Late</option>
                        <option value="Absent" ${student.status === 'Absent' ? 'selected' : ''}>Absent</option>
                    </select>
                </td>
            `;
            
            tableBody.appendChild(row);
        });

        this.updatePaginationInfo();
    }

    updatePaginationInfo() {
        const totalRecords = this.filteredStudents.length;
        const totalPages = Math.ceil(totalRecords / this.studentsPerPage);
        
        document.getElementById('showingCount').textContent = Math.min(this.studentsPerPage, totalRecords - (this.currentPage - 1) * this.studentsPerPage);
        document.getElementById('totalCount').textContent = totalRecords;
        document.getElementById('currentPage').textContent = this.currentPage;
        document.getElementById('totalPages').textContent = totalPages;

        // Enable/disable pagination buttons
        document.getElementById('prevPage').disabled = this.currentPage === 1;
        document.getElementById('nextPage').disabled = this.currentPage === totalPages || totalPages === 0;
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderTable();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredStudents.length / this.studentsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderTable();
        }
    }

    updateStatus(studentId, status) {
        const student = this.allStudents.find(s => s.id === studentId);
        if (student) {
            student.status = status;
            // In a real application, you would send this update to the server
            this.showAlert(`Updated ${student.name}'s status to ${status}`, 'success');
            console.log(`Updated ${student.name} status to ${status}`);
        }
    }

    exportTableToCSV() {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Student ID,Name,Year,Section,Subject,Status\n";
        
        this.filteredStudents.forEach(student => {
            csvContent += `${student.id},${student.name},${student.year},${student.section},${student.subject},${student.status}\n`;
        });
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "students.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showAlert('CSV exported successfully!', 'success');
    }

    exportTableToExcel() {
        // Create table HTML for Excel
        let tableHTML = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="UTF-8">
                <style>
                    table { border-collapse: collapse; width: 100%; }
                    th { background-color: #1a4b8c; color: white; font-weight: bold; padding: 8px; border: 1px solid #ddd; }
                    td { padding: 8px; border: 1px solid #ddd; }
                </style>
            </head>
            <body>
                <table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Year</th>
                            <th>Section</th>
                            <th>Subject</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // Add data rows
        this.filteredStudents.forEach(student => {
            tableHTML += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.year}</td>
                    <td>${student.section}</td>
                    <td>${student.subject}</td>
                    <td>${student.status}</td>
                </tr>
            `;
        });
        
        tableHTML += `
                    </tbody>
                </table>
            </body>
            </html>
        `;
        
        // Create and trigger download
        const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel' });
        const link = document.createElement('a');
        link.download = 'students.xls';
        link.href = window.URL.createObjectURL(blob);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showAlert('Excel exported successfully!', 'success');
    }

    showNotifications() {
        this.showAlert('You have 3 new notifications', 'info');
    }

    // Modern Alert System
    showAlert(message, type = 'info', duration = 5000) {
        const alertContainer = document.getElementById('alertContainer');
        const alertId = 'alert-' + Date.now();
        
        // Alert type configurations
        const alertConfig = {
            success: {
                icon: 'fas fa-check-circle',
                title: 'Success',
                class: 'alert-success'
            },
            info: {
                icon: 'fas fa-info-circle',
                title: 'Information',
                class: 'alert-info'
            },
            warning: {
                icon: 'fas fa-exclamation-triangle',
                title: 'Warning',
                class: 'alert-warning'
            },
            error: {
                icon: 'fas fa-times-circle',
                title: 'Error',
                class: 'alert-error'
            }
        };
        
        const config = alertConfig[type] || alertConfig.info;
        
        const alertElement = document.createElement('div');
        alertElement.className = `alert ${config.class}`;
        alertElement.id = alertId;
        alertElement.innerHTML = `
            <div class="alert-icon">
                <i class="${config.icon}"></i>
            </div>
            <div class="alert-content">
                <div class="alert-title">${config.title}</div>
                <div class="alert-message">${message}</div>
            </div>
            <button class="alert-close" onclick="this.closest('.alert').remove()">
                <i class="fas fa-times"></i>
            </button>
            <div class="alert-progress"></div>
        `;
        
        alertContainer.appendChild(alertElement);
        
        // Animate in
        setTimeout(() => {
            alertElement.classList.add('show');
        }, 10);
        
        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.removeAlert(alertId);
            }, duration);
        }
        
        return alertId;
    }
    
    removeAlert(alertId) {
        const alertElement = document.getElementById(alertId);
        if (alertElement) {
            alertElement.classList.remove('show');
            alertElement.classList.add('hide');
            
            setTimeout(() => {
                if (alertElement.parentNode) {
                    alertElement.parentNode.removeChild(alertElement);
                }
            }, 400);
        }
    }
}