class StudentSubjectAttendance {
    constructor() {
        this.currentPage = 1;
        this.recordsPerPage = 10;
        this.filteredData = [];
        this.allData = [];
        this.init();
    }

    init() {
        this.loadSampleData();
        this.bindEvents();
        this.updateSummaryCards();
        this.renderTable();
        console.log('Student Subject Attendance initialized!');
    }

    loadSampleData() {
        // Sample subject attendance data with RFID logs only
        this.allData = [
            { date: "2025-09-11", day: "Thursday", subject: "Mathematics", timeIn: "08:00 AM", timeOut: "09:00 AM", method: "RFID", status: "present" },
            { date: "2025-09-11", day: "Thursday", subject: "Science", timeIn: "09:15 AM", timeOut: "10:15 AM", method: "RFID", status: "present" },
            { date: "2025-09-10", day: "Wednesday", subject: "English", timeIn: "08:00 AM", timeOut: "09:00 AM", method: "RFID", status: "present" },
            { date: "2025-09-10", day: "Wednesday", subject: "Physical Education", timeIn: "09:15 AM", timeOut: "10:15 AM", method: "RFID", status: "present" },
            { date: "2025-09-09", day: "Tuesday", subject: "Mathematics", timeIn: "08:00 AM", timeOut: "09:00 AM", method: "RFID", status: "present" },
            { date: "2025-09-09", day: "Tuesday", subject: "Science", timeIn: "09:15 AM", timeOut: "10:15 AM", method: "RFID", status: "present" },
            { date: "2025-09-08", day: "Monday", subject: "English", timeIn: "08:00 AM", timeOut: "09:00 AM", method: "RFID", status: "present" },
            { date: "2025-09-08", day: "Monday", subject: "Physical Education", timeIn: "09:15 AM", timeOut: "10:15 AM", method: "RFID", status: "present" },
            { date: "2025-09-05", day: "Friday", subject: "Mathematics", timeIn: "08:00 AM", timeOut: "09:00 AM", method: "RFID", status: "present" },
            { date: "2025-09-05", day: "Friday", subject: "Science", timeIn: "09:15 AM", timeOut: "10:15 AM", method: "RFID", status: "present" },
            { date: "2025-09-04", day: "Thursday", subject: "English", timeIn: "08:00 AM", timeOut: "09:00 AM", method: "RFID", status: "present" },
            { date: "2025-09-04", day: "Thursday", subject: "Physical Education", timeIn: "09:15 AM", timeOut: "10:15 AM", method: "RFID", status: "present" },
            { date: "2025-09-03", day: "Wednesday", subject: "Mathematics", timeIn: "-", timeOut: "-", method: "-", status: "absent" },
            { date: "2025-09-03", day: "Wednesday", subject: "Science", timeIn: "09:15 AM", timeOut: "10:15 AM", method: "RFID", status: "present" },
            { date: "2025-09-02", day: "Tuesday", subject: "English", timeIn: "08:00 AM", timeOut: "09:00 AM", method: "RFID", status: "present" },
            { date: "2025-09-02", day: "Tuesday", subject: "Physical Education", timeIn: "-", timeOut: "-", method: "-", status: "absent" },
            { date: "2025-09-01", day: "Monday", subject: "Mathematics", timeIn: "08:00 AM", timeOut: "09:00 AM", method: "RFID", status: "present" },
            { date: "2025-09-01", day: "Monday", subject: "Science", timeIn: "09:15 AM", timeOut: "10:15 AM", method: "RFID", status: "present" }
        ];
        this.filteredData = [...this.allData];
    }

    bindEvents() {
        // Filter buttons
        document.getElementById('applyFilters').addEventListener('click', () => {
            this.applyFilters();
        });

        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearFilters();
        });

        // Export buttons
        document.getElementById('exportCSV').addEventListener('click', () => {
            this.exportCSV();
        });

        document.getElementById('exportExcel').addEventListener('click', () => {
            this.exportExcel();
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

        // Set default date range (last 7 days)
        this.setDefaultDateRange();
    }

    setDefaultDateRange() {
        const today = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        
        document.getElementById('dateFrom').value = this.formatDateForInput(oneWeekAgo);
        document.getElementById('dateTo').value = this.formatDateForInput(today);
        
        // Apply filters with default range
        this.applyFilters();
    }

    formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    applyFilters() {
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;
        const subjectFilter = document.getElementById('subjectFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;

        // Validate date range
        if (dateFrom && dateTo && dateFrom > dateTo) {
            this.showAlert('Date From cannot be after Date To!', 'error');
            return;
        }

        this.filteredData = this.allData.filter(record => {
            const dateMatch = (!dateFrom || record.date >= dateFrom) && 
                             (!dateTo || record.date <= dateTo);
            const subjectMatch = !subjectFilter || record.subject.toLowerCase().includes(subjectFilter.toLowerCase());
            const statusMatch = !statusFilter || record.status === statusFilter;

            return dateMatch && subjectMatch && statusMatch;
        });

        this.currentPage = 1;
        this.updateSummaryCards();
        this.renderTable();
        this.showAlert('Filters applied successfully!', 'success');
    }

    clearFilters() {
        document.getElementById('dateFrom').value = '';
        document.getElementById('dateTo').value = '';
        document.getElementById('subjectFilter').value = '';
        document.getElementById('statusFilter').value = '';
        
        this.filteredData = [...this.allData];
        this.currentPage = 1;
        this.updateSummaryCards();
        this.renderTable();
        this.showAlert('Filters cleared!', 'info');
    }

    updateSummaryCards() {
        const totalClasses = this.filteredData.length;
        const presentCount = this.filteredData.filter(r => r.status === 'present').length;
        const absentCount = this.filteredData.filter(r => r.status === 'absent').length;
        const attendanceRate = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

        document.getElementById('totalClasses').textContent = totalClasses;
        document.getElementById('presentCount').textContent = presentCount;
        document.getElementById('absentCount').textContent = absentCount;
        document.getElementById('attendanceRate').textContent = `${attendanceRate}%`;
    }

    renderTable() {
        const tableBody = document.getElementById('subjectLogsTableBody');
        const startIndex = (this.currentPage - 1) * this.recordsPerPage;
        const endIndex = startIndex + this.recordsPerPage;
        const pageData = this.filteredData.slice(startIndex, endIndex);

        tableBody.innerHTML = '';

        if (pageData.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="7" class="no-data">
                    <i class="fas fa-inbox"></i>
                    <div>No attendance records found</div>
                    <small>Try adjusting your filters</small>
                </td>
            `;
            tableBody.appendChild(row);
        } else {
            pageData.forEach(record => {
                const row = document.createElement('tr');
                
                // Get method icon and class
                const methodIcon = record.method === 'RFID' ? 'fas fa-id-card' : 'fas fa-user-edit';
                const methodClass = record.method === 'RFID' ? 'method-rfid' : 'method-manual';

                row.innerHTML = `
                    <td>${this.formatDate(record.date)}</td>
                    <td>${record.day}</td>
                    <td>${record.subject}</td>
                    <td>
                        ${record.timeIn !== '-' ? `
                        <span class="time-entry">
                            <i class="fas fa-sign-in-alt"></i>
                            ${record.timeIn}
                        </span>
                        ` : '-'}
                    </td>
                    <td>
                        ${record.timeOut !== '-' ? `
                        <span class="time-entry">
                            <i class="fas fa-sign-out-alt"></i>
                            ${record.timeOut}
                        </span>
                        ` : '-'}
                    </td>
                    <td>
                        <span class="method-icon ${methodClass}">
                            <i class="${methodIcon}"></i>
                            ${record.method}
                        </span>
                    </td>
                    <td>
                        <span class="status-badge status-${record.status}">
                            ${this.getStatusText(record.status)}
                        </span>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }

        this.updatePaginationInfo();
    }

    getStatusText(status) {
        const statusMap = {
            'present': 'Present',
            'absent': 'Absent',
            'late': 'Late'
        };
        return statusMap[status] || status;
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    updatePaginationInfo() {
        const totalRecords = this.filteredData.length;
        const totalPages = Math.ceil(totalRecords / this.recordsPerPage);
        
        document.getElementById('showingCount').textContent = Math.min(this.recordsPerPage, totalRecords - (this.currentPage - 1) * this.recordsPerPage);
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
        const totalPages = Math.ceil(this.filteredData.length / this.recordsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderTable();
        }
    }

    exportCSV() {
        if (this.filteredData.length === 0) {
            this.showAlert('No data to export!', 'warning');
            return;
        }

        let csv = [];
        
        // Add headers
        const headers = ['Date', 'Day', 'Subject', 'Time In', 'Time Out', 'Method', 'Status'];
        csv.push(headers.join(","));
        
        // Add data rows
        this.filteredData.forEach(record => {
            const row = [
                record.date,
                record.day,
                record.subject,
                record.timeIn,
                record.timeOut,
                record.method,
                this.getStatusText(record.status)
            ];
            csv.push(row.join(","));
        });
        
        this.downloadCSV(csv.join("\n"), "subject_attendance.csv");
        this.showAlert('CSV exported successfully!', 'success');
    }

    downloadCSV(csv, filename) {
        let csvFile = new Blob([csv], { type: "text/csv" });
        let downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.click();
    }

    exportExcel() {
        if (this.filteredData.length === 0) {
            this.showAlert('No data to export!', 'warning');
            return;
        }

        // For a real implementation, you might want to use a library like SheetJS
        let excelContent = "<table>";
        
        // Add headers
        excelContent += "<tr>";
        const headers = ['Date', 'Day', 'Subject', 'Time In', 'Time Out', 'Method', 'Status'];
        headers.forEach(header => {
            excelContent += `<th>${header}</th>`;
        });
        excelContent += "</tr>";
        
        // Add data rows
        this.filteredData.forEach(record => {
            excelContent += "<tr>";
            const row = [
                record.date,
                record.day,
                record.subject,
                record.timeIn,
                record.timeOut,
                record.method,
                this.getStatusText(record.status)
            ];
            row.forEach(cell => {
                excelContent += `<td>${cell}</td>`;
            });
            excelContent += "</tr>";
        });
        
        excelContent += "</table>";
        
        const uri = 'data:application/vnd.ms-excel;base64,';
        const base64 = s => window.btoa(unescape(encodeURIComponent(s)));
        const link = document.createElement("a");
        link.href = uri + base64(excelContent);
        link.download = "subject_attendance.xls";
        link.click();
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