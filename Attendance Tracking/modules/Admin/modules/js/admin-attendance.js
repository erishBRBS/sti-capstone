class AdminAttendance {
    constructor() {
        this.currentPage = 1;
        this.recordsPerPage = 10;
        this.filteredRecords = [];
        this.allRecords = [];
        this.init();
    }

    init() {
        this.loadSampleData();
        this.bindEvents();
        this.renderTable();
        this.updateSummary();
        console.log('Admin Attendance initialized!');
        
        // Set default date range (last 7 days)
        this.setDefaultDateRange();
        
        // Show welcome alert
        AlertManager.info('Attendance module loaded successfully!');
    }

    setDefaultDateRange() {
        const today = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        
        // Format dates as YYYY-MM-DD
        const formatDate = (date) => date.toISOString().split('T')[0];
        
        document.getElementById('fromDate').value = formatDate(oneWeekAgo);
        document.getElementById('toDate').value = formatDate(today);
    }

    loadSampleData() {
        // Sample attendance data with multiple dates
        this.allRecords = [
            {
                id: "ATT001",
                studentId: "2025-001",
                name: "John Michael Doe",
                course: "BSIT",
                section: "A",
                subject: "Mathematics",
                date: "2023-09-11",
                timeIn: "08:00",
                timeOut: "17:00",
                status: "Present",
                method: "RFID"
            },
            {
                id: "ATT002",
                studentId: "2025-002",
                name: "Jane Marie Smith",
                course: "BSED",
                section: "B",
                subject: "Science",
                date: "2023-09-11",
                timeIn: "08:15",
                timeOut: "17:00",
                status: "Late",
                method: "Face Recognition"
            },
            {
                id: "ATT003",
                studentId: "2025-003",
                name: "Robert James Johnson",
                course: "BSCS",
                section: "C",
                subject: "Programming",
                date: "2023-09-11",
                timeIn: "",
                timeOut: "",
                status: "Absent",
                method: "Manual"
            },
            {
                id: "ATT004",
                studentId: "2025-004",
                name: "Maria Santos Garcia",
                course: "BSBA",
                section: "A",
                subject: "English",
                date: "2023-09-10",
                timeIn: "08:05",
                timeOut: "17:00",
                status: "Present",
                method: "RFID"
            },
            {
                id: "ATT005",
                studentId: "2025-005",
                name: "Carlos David Reyes",
                course: "BSIT",
                section: "B",
                subject: "Mathematics",
                date: "2023-09-10",
                timeIn: "08:20",
                timeOut: "17:00",
                status: "Late",
                method: "Face Recognition"
            },
            {
                id: "ATT006",
                studentId: "2025-006",
                name: "Sarah Lynn Tan",
                course: "BSED",
                section: "C",
                subject: "Science",
                date: "2023-09-09",
                timeIn: "08:00",
                timeOut: "17:00",
                status: "Present",
                method: "RFID"
            },
            {
                id: "ATT007",
                studentId: "2025-007",
                name: "Michael Anthony Cruz",
                course: "BSCS",
                section: "A",
                subject: "Programming",
                date: "2023-09-09",
                timeIn: "08:00",
                timeOut: "17:00",
                status: "Present",
                method: "RFID"
            },
            {
                id: "ATT008",
                studentId: "2025-008",
                name: "Andrea Nicole Lim",
                course: "BSBA",
                section: "B",
                subject: "English",
                date: "2023-09-08",
                timeIn: "",
                timeOut: "",
                status: "Absent",
                method: "Manual"
            },
            {
                id: "ATT009",
                studentId: "2025-009",
                name: "Daniel Patrick Ong",
                course: "BSIT",
                section: "C",
                subject: "Mathematics",
                date: "2023-09-08",
                timeIn: "08:10",
                timeOut: "17:00",
                status: "Present",
                method: "Face Recognition"
            },
            {
                id: "ATT010",
                studentId: "2025-010",
                name: "Christine Ann Torres",
                course: "BSED",
                section: "A",
                subject: "Science",
                date: "2023-09-07",
                timeIn: "08:25",
                timeOut: "17:00",
                status: "Late",
                method: "RFID"
            }
        ];
        this.filteredRecords = [...this.allRecords];
    }

    bindEvents() {
        // Filter buttons
        document.getElementById('applyAttendanceFilters').addEventListener('click', (e) => {
            e.preventDefault();
            this.applyFilters();
        });

        document.getElementById('resetAttendanceFilters').addEventListener('click', (e) => {
            e.preventDefault();
            this.resetFilters();
        });

        // Export buttons
        document.getElementById('exportAttendanceCSV').addEventListener('click', () => {
            this.exportTableToCSV();
        });

        document.getElementById('exportAttendanceExcel').addEventListener('click', () => {
            this.exportTableToExcel();
        });

        document.getElementById('generateAttendanceReport').addEventListener('click', () => {
            this.generateReport();
        });

        // Pagination
        document.getElementById('attendancePrevPage').addEventListener('click', () => {
            this.previousPage();
        });

        document.getElementById('attendanceNextPage').addEventListener('click', () => {
            this.nextPage();
        });

        // Form submissions
        document.getElementById('editAttendanceForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateAttendance();
        });

        // Notification button
        document.querySelector('.notification-btn').addEventListener('click', () => {
            this.showNotifications();
        });

        // Add event listeners for validation
        this.setupFilterValidation();
    }

    setupFilterValidation() {
        const filterFields = [
            'fromDate',
            'toDate',
            'attendanceCourse', 
            'attendanceSection',
            'attendanceSubject'
        ];

        filterFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            
            // Add event listener to clear validation when user starts typing
            field.addEventListener('input', () => {
                this.clearFieldValidation(field);
            });
        });

        // Add date range validation
        document.getElementById('toDate').addEventListener('change', () => {
            this.validateDateRange();
        });
    }

    validateDateRange() {
        const fromDate = document.getElementById('fromDate').value;
        const toDate = document.getElementById('toDate').value;

        if (fromDate && toDate && fromDate > toDate) {
            this.showFieldError('toDate', 'To date cannot be before from date');
            return false;
        } else {
            this.clearFieldValidation(document.getElementById('toDate'));
            return true;
        }
    }

    clearFieldValidation(field) {
        field.style.borderColor = '';
        field.style.boxShadow = '';
        
        // Remove error message
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    applyFilters() {
        const fromDate = document.getElementById('fromDate').value;
        const toDate = document.getElementById('toDate').value;
        const course = document.getElementById('attendanceCourse').value;
        const section = document.getElementById('attendanceSection').value;
        const subject = document.getElementById('attendanceSubject').value;

        // Validate date range first
        if (!this.validateDateRange()) {
            AlertManager.error('Please correct the date range.');
            return;
        }

        // Check if all required fields are filled
        let isValid = true;
        let firstInvalidField = null;

        if (!fromDate) {
            this.showFieldError('fromDate', 'Please select from date');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = document.getElementById('fromDate');
        }

        if (!toDate) {
            this.showFieldError('toDate', 'Please select to date');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = document.getElementById('toDate');
        }

        if (!course) {
            this.showFieldError('attendanceCourse', 'Please select a course');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = document.getElementById('attendanceCourse');
        }

        if (!section) {
            this.showFieldError('attendanceSection', 'Please select a section');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = document.getElementById('attendanceSection');
        }

        if (!subject) {
            this.showFieldError('attendanceSubject', 'Please select a subject');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = document.getElementById('attendanceSubject');
        }

        if (!isValid) {
            // Focus on the first invalid field
            if (firstInvalidField) {
                firstInvalidField.focus();
            }
            AlertManager.error('Please fill out all required filter fields.');
            return;
        }

        // Clear any previous validation errors
        this.clearAllValidation();

        this.filteredRecords = this.allRecords.filter(record => {
            // Filter by date range
            const recordDate = new Date(record.date);
            const from = new Date(fromDate);
            const to = new Date(toDate);
            
            const matchesDateRange = recordDate >= from && recordDate <= to;
            
            // Filter by course
            const matchesCourse = !course || record.course === course;
            
            // Filter by section
            const matchesSection = !section || record.section === section;
            
            // Filter by subject
            const matchesSubject = !subject || record.subject === subject;
            
            return matchesDateRange && matchesCourse && matchesSection && matchesSubject;
        });
        
        this.currentPage = 1;
        this.renderTable();
        this.updateSummary();
        AlertManager.success('Filters applied successfully!');
    }

    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        field.style.borderColor = '#dc3545';
        field.style.boxShadow = '0 0 0 2px rgba(220, 53, 69, 0.2)';
        
        // Remove any existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = '12px';
        errorElement.style.marginTop = '4px';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }

    clearAllValidation() {
        const filterFields = [
            'fromDate',
            'toDate',
            'attendanceCourse', 
            'attendanceSection',
            'attendanceSubject'
        ];

        filterFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            this.clearFieldValidation(field);
        });
    }

    resetFilters() {
        document.getElementById('fromDate').value = '';
        document.getElementById('toDate').value = '';
        document.getElementById('attendanceCourse').value = '';
        document.getElementById('attendanceSection').value = '';
        document.getElementById('attendanceSubject').value = '';

        this.clearAllValidation();
        
        // Reset to default date range
        this.setDefaultDateRange();
        
        this.filteredRecords = [...this.allRecords];
        this.currentPage = 1;
        this.renderTable();
        this.updateSummary();
        AlertManager.info('Filters reset successfully!');
    }

    renderTable() {
        const tableBody = document.getElementById('attendanceTableBody');
        const startIndex = (this.currentPage - 1) * this.recordsPerPage;
        const endIndex = startIndex + this.recordsPerPage;
        const pageData = this.filteredRecords.slice(startIndex, endIndex);

        tableBody.innerHTML = '';

        pageData.forEach(record => {
            const row = document.createElement('tr');
            
            // Determine status badge class
            let statusClass = '';
            switch(record.status) {
                case 'Present':
                    statusClass = 'status-present';
                    break;
                case 'Late':
                    statusClass = 'status-late';
                    break;
                case 'Absent':
                    statusClass = 'status-absent';
                    break;
                case 'Excused':
                    statusClass = 'status-excused';
                    break;
            }

            // Determine method badge class
            let methodClass = '';
            switch(record.method) {
                case 'RFID':
                    methodClass = 'method-rfid';
                    break;
                case 'Face Recognition':
                    methodClass = 'method-face';
                    break;
                case 'Manual':
                    methodClass = 'method-manual';
                    break;
            }
            
            row.innerHTML = `
                <td>${record.studentId}</td>
                <td>${record.name}</td>
                <td>${record.course}</td>
                <td>${record.section}</td>
                <td>${record.subject}</td>
                <td>${this.formatDate(record.date)}</td>
                <td>${record.timeIn || '-'}</td>
                <td>${record.timeOut || '-'}</td>
                <td><span class="status-badge ${statusClass}">${record.status}</span></td>
                <td><span class="method-badge ${methodClass}">${record.method}</span></td>
                <td class="action-cell">
                    <button class="action-btn view-btn" onclick="adminAttendance.viewRecord('${record.id}')"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit-btn" onclick="adminAttendance.openModal('editAttendance')"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" onclick="adminAttendance.confirmDelete('${record.id}')"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });

        this.updatePaginationInfo();
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    updatePaginationInfo() {
        const totalRecords = this.filteredRecords.length;
        const totalPages = Math.ceil(totalRecords / this.recordsPerPage);
        
        document.getElementById('attendanceShowingCount').textContent = Math.min(this.recordsPerPage, totalRecords - (this.currentPage - 1) * this.recordsPerPage);
        document.getElementById('attendanceTotalCount').textContent = totalRecords;
        document.getElementById('attendanceCurrentPage').textContent = this.currentPage;
        document.getElementById('attendanceTotalPages').textContent = totalPages;

        // Enable/disable pagination buttons
        document.getElementById('attendancePrevPage').disabled = this.currentPage === 1;
        document.getElementById('attendanceNextPage').disabled = this.currentPage === totalPages || totalPages === 0;
    }

    updateSummary() {
        const present = this.filteredRecords.filter(record => record.status === 'Present').length;
        const late = this.filteredRecords.filter(record => record.status === 'Late').length;
        const absent = this.filteredRecords.filter(record => record.status === 'Absent').length;
        const total = this.filteredRecords.length;
        const attendanceRate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

        document.getElementById('presentCount').textContent = present;
        document.getElementById('lateCount').textContent = late;
        document.getElementById('absentCount').textContent = absent;
        document.getElementById('attendanceRate').textContent = `${attendanceRate}%`;
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderTable();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredRecords.length / this.recordsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderTable();
        }
    }

    viewRecord(recordId) {
        const record = this.filteredRecords.find(r => r.id === recordId);
        if (record) {
            AlertManager.info(`Viewing attendance record for ${record.name}`);
        }
    }

    updateAttendance() {
        // In a real app, this would update the attendance record in the database
        AlertManager.success('Attendance record updated successfully!');
        this.closeModal('editAttendance');
    }

    confirmDelete(recordId) {
        if (confirm('Are you sure you want to delete this attendance record? This action cannot be undone.')) {
            AlertManager.success('Attendance record deleted successfully.');
        }
    }

    openModal(type) {
        document.getElementById(`${type}Modal`).classList.add('active');
    }

    closeModal(type) {
        document.getElementById(`${type}Modal`).classList.remove('active');
    }

    exportTableToCSV() {
        if (this.filteredRecords.length === 0) {
            AlertManager.warning('No records to export. Please apply filters first.');
            return;
        }

        let csv = [];
        
        // Add headers
        const headers = ['Student ID', 'Name', 'Course', 'Section', 'Subject', 'Date', 'Time In', 'Time Out', 'Status', 'Method'];
        csv.push(headers.join(','));
        
        // Add data rows
        this.filteredRecords.forEach(record => {
            const row = [
                record.studentId,
                `"${record.name}"`,
                record.course,
                record.section,
                `"${record.subject}"`,
                record.date,
                record.timeIn || '-',
                record.timeOut || '-',
                record.status,
                record.method
            ];
            csv.push(row.join(','));
        });
        
        this.downloadCSV(csv.join('\n'), 'attendance_records.csv');
        AlertManager.success('CSV exported successfully!');
    }

    downloadCSV(csv, filename) {
        const csvFile = new Blob([csv], { type: 'text/csv' });
        const downloadLink = document.createElement('a');
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    exportTableToExcel() {
        if (this.filteredRecords.length === 0) {
            AlertManager.warning('No records to export. Please apply filters first.');
            return;
        }

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
                            <th>Course</th>
                            <th>Section</th>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Time In</th>
                            <th>Time Out</th>
                            <th>Status</th>
                            <th>Method</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // Add data rows
        this.filteredRecords.forEach(record => {
            tableHTML += `
                <tr>
                    <td>${record.studentId}</td>
                    <td>${record.name}</td>
                    <td>${record.course}</td>
                    <td>${record.section}</td>
                    <td>${record.subject}</td>
                    <td>${record.date}</td>
                    <td>${record.timeIn || '-'}</td>
                    <td>${record.timeOut || '-'}</td>
                    <td>${record.status}</td>
                    <td>${record.method}</td>
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
        link.download = 'attendance_records.xls';
        link.href = window.URL.createObjectURL(blob);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        AlertManager.success('Excel exported successfully!');
    }

    generateReport() {
        if (this.filteredRecords.length === 0) {
            AlertManager.warning('No records to generate report. Please apply filters first.');
            return;
        }

        AlertManager.info('Generating attendance report... This may take a few moments.');
        
        // Simulate report generation
        setTimeout(() => {
            AlertManager.success('Attendance report generated successfully!');
        }, 2000);
    }

    showNotifications() {
        AlertManager.info('You have 3 new notifications');
    }
}