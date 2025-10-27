class StudentGateAttendance {
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
        this.updateTodayActivity();
        this.renderTable();
        console.log('Student Gate Attendance initialized!');
    }

    loadSampleData() {
        // Sample gate entry/exit data
        this.allData = [
            { date: "2025-09-11", day: "Thursday", timeIn: "07:45 AM", timeInMethod: "Face Recognition", timeOut: "03:30 PM", timeOutMethod: "Face Recognition", status: "complete" },
            { date: "2025-09-10", day: "Wednesday", timeIn: "07:50 AM", timeInMethod: "Face Recognition", timeOut: "03:35 PM", timeOutMethod: "RFID", status: "complete" },
            { date: "2025-09-09", day: "Tuesday", timeIn: "08:05 AM", timeInMethod: "RFID", timeOut: "03:20 PM", timeOutMethod: "Face Recognition", status: "complete" },
            { date: "2025-09-08", day: "Monday", timeIn: "07:55 AM", timeInMethod: "Face Recognition", timeOut: "03:40 PM", timeOutMethod: "Face Recognition", status: "complete" },
            { date: "2025-09-07", day: "Sunday", timeIn: "-", timeInMethod: "-", timeOut: "-", timeOutMethod: "-", status: "no-entry" },
            { date: "2025-09-06", day: "Saturday", timeIn: "08:10 AM", timeInMethod: "Face Recognition", timeOut: "-", timeOutMethod: "-", status: "in-only" },
            { date: "2025-09-05", day: "Friday", timeIn: "07:40 AM", timeInMethod: "RFID", timeOut: "03:45 PM", timeOutMethod: "RFID", status: "complete" },
            { date: "2025-09-04", day: "Thursday", timeIn: "07:48 AM", timeInMethod: "Face Recognition", timeOut: "03:32 PM", timeOutMethod: "Face Recognition", status: "complete" },
            { date: "2025-09-03", day: "Wednesday", timeIn: "08:15 AM", timeInMethod: "Face Recognition", timeOut: "-", timeOutMethod: "-", status: "in-only" },
            { date: "2025-09-02", day: "Tuesday", timeIn: "-", timeInMethod: "-", timeOut: "-", timeOutMethod: "-", status: "no-entry" },
            { date: "2025-09-01", day: "Monday", timeIn: "07:52 AM", timeInMethod: "Face Recognition", timeOut: "03:38 PM", timeOutMethod: "Face Recognition", status: "complete" }
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
    }

    applyFilters() {
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;
        const methodFilter = document.getElementById('methodFilter').value;
        const entryType = document.getElementById('entryType').value;

        this.filteredData = this.allData.filter(record => {
            const dateMatch = (!dateFrom || record.date >= dateFrom) && 
                             (!dateTo || record.date <= dateTo);
            const methodMatch = !methodFilter || 
                               record.timeInMethod === methodFilter || 
                               record.timeOutMethod === methodFilter;
            const entryTypeMatch = !entryType || record.status === entryType;

            return dateMatch && methodMatch && entryTypeMatch;
        });

        this.currentPage = 1;
        this.updateSummaryCards();
        this.renderTable();
        this.showAlert('Filters applied successfully!', 'success');
    }

    clearFilters() {
        document.getElementById('dateFrom').value = '';
        document.getElementById('dateTo').value = '';
        document.getElementById('methodFilter').value = '';
        document.getElementById('entryType').value = '';
        
        this.filteredData = [...this.allData];
        this.currentPage = 1;
        this.updateSummaryCards();
        this.renderTable();
        this.showAlert('Filters cleared!', 'info');
    }

    updateSummaryCards() {
        const totalEntries = this.filteredData.length;
        const completeEntries = this.filteredData.filter(r => r.status === 'complete').length;
        const missingOut = this.filteredData.filter(r => r.status === 'in-only').length;
        const noEntries = this.filteredData.filter(r => r.status === 'no-entry').length;

        document.getElementById('totalEntries').textContent = totalEntries;
        document.getElementById('completeEntries').textContent = completeEntries;
        document.getElementById('missingOut').textContent = missingOut;
        document.getElementById('noEntries').textContent = noEntries;
    }

    updateTodayActivity() {
        const today = new Date().toISOString().split('T')[0];
        const todayRecord = this.allData.find(record => record.date === today);
        
        if (todayRecord && todayRecord.timeIn !== '-') {
            document.getElementById('todayTimeIn').textContent = todayRecord.timeIn;
            document.getElementById('todayTimeOut').textContent = todayRecord.timeOut !== '-' ? todayRecord.timeOut : 'Not yet recorded';
        } else {
            document.getElementById('todayTimeIn').textContent = 'No entry today';
            document.getElementById('todayTimeOut').textContent = '-';
        }
    }

    renderTable() {
        const tableBody = document.getElementById('gateLogsTableBody');
        const startIndex = (this.currentPage - 1) * this.recordsPerPage;
        const endIndex = startIndex + this.recordsPerPage;
        const pageData = this.filteredData.slice(startIndex, endIndex);

        tableBody.innerHTML = '';

        pageData.forEach(record => {
            const row = document.createElement('tr');
            
            // Get method icons
            const timeInIcon = record.timeInMethod === 'RFID' ? 'fas fa-id-card' : 'fas fa-user-circle';
            const timeInClass = record.timeInMethod === 'RFID' ? 'method-rfid' : 'method-face';
            
            const timeOutIcon = record.timeOutMethod === 'RFID' ? 'fas fa-id-card' : 'fas fa-user-circle';
            const timeOutClass = record.timeOutMethod === 'RFID' ? 'method-rfid' : 'method-face';

            row.innerHTML = `
                <td>${this.formatDate(record.date)}</td>
                <td>${record.day}</td>
                <td>
                    ${record.timeIn !== '-' ? `
                    <span class="method-icon ${timeInClass}">
                        <i class="${timeInIcon}"></i>
                        ${record.timeIn}
                    </span>
                    ` : '-'}
                </td>
                <td>${record.timeInMethod}</td>
                <td>
                    ${record.timeOut !== '-' ? `
                    <span class="method-icon ${timeOutClass}">
                        <i class="${timeOutIcon}"></i>
                        ${record.timeOut}
                    </span>
                    ` : '-'}
                </td>
                <td>${record.timeOutMethod}</td>
                <td>
                    <span class="status-badge status-${record.status}">
                        ${this.getStatusText(record.status)}
                    </span>
                </td>
            `;
            tableBody.appendChild(row);
        });

        this.updatePaginationInfo();
    }

    getStatusText(status) {
        const statusMap = {
            'complete': 'Complete',
            'in-only': 'Time In Only',
            'no-entry': 'No Entry'
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
        let csv = [];
        
        // Add headers
        const headers = ['Date', 'Day', 'Time In', 'Time In Method', 'Time Out', 'Time Out Method', 'Status'];
        csv.push(headers.join(","));
        
        // Add data rows
        this.filteredData.forEach(record => {
            const row = [
                record.date,
                record.day,
                record.timeIn,
                record.timeInMethod,
                record.timeOut,
                record.timeOutMethod,
                this.getStatusText(record.status)
            ];
            csv.push(row.join(","));
        });
        
        this.downloadCSV(csv.join("\n"), "gate_logs.csv");
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
        // For a real implementation, you might want to use a library like SheetJS
        let excelContent = "<table>";
        
        // Add headers
        excelContent += "<tr>";
        const headers = ['Date', 'Day', 'Time In', 'Time In Method', 'Time Out', 'Time Out Method', 'Status'];
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
                record.timeIn,
                record.timeInMethod,
                record.timeOut,
                record.timeOutMethod,
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
        link.download = "gate_logs.xls";
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

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    new StudentGateAttendance();
});