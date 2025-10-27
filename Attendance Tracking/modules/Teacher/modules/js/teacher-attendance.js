class TeacherAttendance {
    constructor() {
        this.selectedDate = new Date();
        this.students = [];
        this.selectedStudents = new Set();
        this.init();
    }

    init() {
        this.loadSampleData();
        this.bindEvents();
        this.generateCalendar();
        console.log('Teacher Attendance initialized!');
    }

    loadSampleData() {
        // Sample student data
        this.students = [
            { id: '2025-001', name: 'Juan Dela Cruz', year: '1st', section: 'A' },
            { id: '2025-002', name: 'Maria Santos', year: '1st', section: 'A' },
            { id: '2025-003', name: 'Pedro Gomez', year: '1st', section: 'B' },
            { id: '2025-004', name: 'Ana Cruz', year: '2nd', section: 'B' },
            { id: '2025-005', name: 'John Smith', year: '2nd', section: 'A' },
            { id: '2025-006', name: 'Sarah Johnson', year: '1st', section: 'C' }
        ];
    }

    bindEvents() {
        // Load students button
        document.getElementById('loadStudents').addEventListener('click', () => {
            this.loadStudents();
        });

        // Save attendance button
        document.getElementById('saveAttendance').addEventListener('click', () => {
            this.saveAttendance();
        });

        // Export buttons
        document.getElementById('exportCSV').addEventListener('click', () => {
            this.exportCSV();
        });

        document.getElementById('exportExcel').addEventListener('click', () => {
            this.exportExcel();
        });

        // Quick action buttons
        document.getElementById('markAllPresent').addEventListener('click', () => {
            this.markAllStudents('Present');
        });

        document.getElementById('markAllLate').addEventListener('click', () => {
            this.markAllStudents('Late');
        });

        document.getElementById('markAllAbsent').addEventListener('click', () => {
            this.markAllStudents('Absent');
        });

        document.getElementById('setCurrentTime').addEventListener('click', () => {
            this.setCurrentTimeForAll();
        });

        // Select all functionality
        document.getElementById('selectAllHeader').addEventListener('change', (e) => {
            this.toggleSelectAll(e.target.checked);
        });

        document.getElementById('selectAllStudents').addEventListener('change', (e) => {
            this.toggleSelectAll(e.target.checked);
        });

        // Filter inputs
        document.getElementById('filterName').addEventListener('input', () => {
            this.filterStudents();
        });

        document.getElementById('filterStatus').addEventListener('change', () => {
            this.filterStudents();
        });

        // Notification button
        document.querySelector('.notification-btn').addEventListener('click', () => {
            this.showNotifications();
        });
    }

    generateCalendar() {
        const calendarEl = document.getElementById('calendar');
        calendarEl.innerHTML = '';
        
        const today = new Date();
        const currentDate = today.getDate();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // Get first day of month
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        
        // Get last day of month
        const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            calendarEl.innerHTML += '<div class="calendar-day"></div>';
        }
        
        // Add cells for each day of the month
        for (let i = 1; i <= lastDay; i++) {
            const isToday = i === currentDate;
            calendarEl.innerHTML += `
                <div class="calendar-day ${isToday ? 'today' : ''}" onclick="teacherAttendance.selectDate(${i})">
                    ${i}
                </div>
            `;
        }
    }

    selectDate(day) {
        const calendarDays = document.querySelectorAll('.calendar-day');
        calendarDays.forEach(dayEl => dayEl.classList.remove('selected'));
        
        event.target.classList.add('selected');
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        this.selectedDate = new Date(currentYear, currentMonth, day);
        
        this.showAlert(`Selected date: ${this.selectedDate.toDateString()}`, 'info');
    }

    loadStudents() {
        const course = document.getElementById('course').value;
        const subject = document.getElementById('subject').value;
        const section = document.getElementById('section').value;
        
        if (!course || !subject || !section) {
            this.showAlert('Please select course, subject, and section', 'warning');
            return;
        }
        
        this.selectedStudents.clear();
        this.updateSelectedCount();
        
        const tableBody = document.getElementById('studentTableBody');
        tableBody.innerHTML = '';
        
        this.students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <input type="checkbox" class="student-checkbox" data-student-id="${student.id}">
                </td>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.year}</td>
                <td>${student.section}</td>
                <td><input type="time" class="form-control time-in" style="padding: 6px;"></td>
                <td><input type="time" class="form-control time-out" style="padding: 6px;"></td>
                <td>
                    <select class="form-control status-select" style="padding: 6px;">
                        <option value="Present">Present</option>
                        <option value="Late">Late</option>
                        <option value="Absent">Absent</option>
                    </select>
                </td>
                <td>
                    <button class="quick-action-btn quick-present" onclick="teacherAttendance.quickMarkPresent(${index})">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="quick-action-btn quick-late" onclick="teacherAttendance.quickMarkLate(${index})">
                        <i class="fas fa-clock"></i>
                    </button>
                    <button class="quick-action-btn quick-absent" onclick="teacherAttendance.quickMarkAbsent(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Add event listeners for checkboxes
        document.querySelectorAll('.student-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const studentId = e.target.dataset.studentId;
                if (e.target.checked) {
                    this.selectedStudents.add(studentId);
                } else {
                    this.selectedStudents.delete(studentId);
                }
                this.updateSelectedCount();
                this.updateSelectAllHeader();
            });
        });
        
        // Show the attendance section, filters, and quick actions
        document.getElementById('attendanceSection').style.display = 'block';
        document.getElementById('filterSection').style.display = 'grid';
        document.getElementById('quickActions').style.display = 'block';
        
        this.showAlert(`Loaded ${this.students.length} students for ${course} - ${subject} - Section ${section}`, 'success');
    }

    toggleSelectAll(checked) {
        const checkboxes = document.querySelectorAll('.student-checkbox');
        this.selectedStudents.clear();
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
            if (checked) {
                this.selectedStudents.add(checkbox.dataset.studentId);
            }
        });
        
        document.getElementById('selectAllHeader').checked = checked;
        document.getElementById('selectAllStudents').checked = checked;
        
        this.updateSelectedCount();
    }

    updateSelectAllHeader() {
        const checkboxes = document.querySelectorAll('.student-checkbox');
        const allChecked = checkboxes.length > 0 && Array.from(checkboxes).every(cb => cb.checked);
        const someChecked = Array.from(checkboxes).some(cb => cb.checked);
        
        document.getElementById('selectAllHeader').checked = allChecked;
        document.getElementById('selectAllHeader').indeterminate = someChecked && !allChecked;
        document.getElementById('selectAllStudents').checked = allChecked;
    }

    updateSelectedCount() {
        const count = this.selectedStudents.size;
        document.getElementById('selectedCount').textContent = `${count} student${count !== 1 ? 's' : ''} selected`;
    }

    filterStudents() {
        const nameFilter = document.getElementById('filterName').value.toLowerCase();
        const statusFilter = document.getElementById('filterStatus').value;
        
        const rows = document.querySelectorAll('#studentTable tbody tr');
        
        rows.forEach(row => {
            const name = row.cells[2].textContent.toLowerCase();
            const status = row.cells[7].querySelector('select').value;
            
            const nameMatch = name.includes(nameFilter);
            const statusMatch = !statusFilter || status === statusFilter;
            
            row.style.display = (nameMatch && statusMatch) ? '' : 'none';
        });
    }

    // Quick action methods for individual students
    quickMarkPresent(index) {
        const rows = document.querySelectorAll('#studentTable tbody tr');
        const row = rows[index];
        row.cells[7].querySelector('select').value = 'Present';
        
        // Set current time
        const now = new Date();
        const timeString = now.toTimeString().substring(0, 5);
        row.cells[5].querySelector('.time-in').value = timeString;
        
        this.showAlert(`Marked ${row.cells[2].textContent} as Present`, 'success');
    }

    quickMarkLate(index) {
        const rows = document.querySelectorAll('#studentTable tbody tr');
        const row = rows[index];
        row.cells[7].querySelector('select').value = 'Late';
        
        // Set current time
        const now = new Date();
        const timeString = now.toTimeString().substring(0, 5);
        row.cells[5].querySelector('.time-in').value = timeString;
        
        this.showAlert(`Marked ${row.cells[2].textContent} as Late`, 'warning');
    }

    quickMarkAbsent(index) {
        const rows = document.querySelectorAll('#studentTable tbody tr');
        const row = rows[index];
        row.cells[7].querySelector('select').value = 'Absent';
        
        // Clear time fields for absent students
        row.cells[5].querySelector('.time-in').value = '';
        row.cells[6].querySelector('.time-out').value = '';
        
        this.showAlert(`Marked ${row.cells[2].textContent} as Absent`, 'info');
    }

    // Bulk action methods
    markAllStudents(status) {
        const rows = document.querySelectorAll('#studentTable tbody tr');
        const now = new Date();
        const timeString = now.toTimeString().substring(0, 5);
        
        rows.forEach(row => {
            if (row.style.display !== 'none') {
                const select = row.cells[7].querySelector('select');
                select.value = status;
                
                if (status === 'Absent') {
                    row.cells[5].querySelector('.time-in').value = '';
                    row.cells[6].querySelector('.time-out').value = '';
                } else {
                    row.cells[5].querySelector('.time-in').value = timeString;
                }
            }
        });
        
        this.showAlert(`Marked all visible students as ${status}`, 'success');
    }

    setCurrentTimeForAll() {
        const rows = document.querySelectorAll('#studentTable tbody tr');
        const now = new Date();
        const timeString = now.toTimeString().substring(0, 5);
        
        rows.forEach(row => {
            if (row.style.display !== 'none') {
                const status = row.cells[7].querySelector('select').value;
                if (status !== 'Absent') {
                    row.cells[5].querySelector('.time-in').value = timeString;
                }
            }
        });
        
        this.showAlert('Set current time for all present/late students', 'info');
    }

    saveAttendance() {
        // In a real application, this would save to a database
        const presentCount = document.querySelectorAll('.status-select[value="Present"]').length;
        const lateCount = document.querySelectorAll('.status-select[value="Late"]').length;
        const absentCount = document.querySelectorAll('.status-select[value="Absent"]').length;
        
        this.showAlert(`Attendance saved! Present: ${presentCount}, Late: ${lateCount}, Absent: ${absentCount}`, 'success');
    }

    exportCSV() {
        let csv = [];
        
        // Add headers
        const headers = ['Student ID', 'Name', 'Year', 'Section', 'Time In', 'Time Out', 'Status'];
        csv.push(headers.join(","));
        
        // Add data rows
        const rows = document.querySelectorAll('#studentTable tbody tr');
        rows.forEach(row => {
            if (row.style.display !== 'none') {
                const rowData = [
                    row.cells[1].textContent,
                    row.cells[2].textContent,
                    row.cells[3].textContent,
                    row.cells[4].textContent,
                    row.cells[5].querySelector('input').value,
                    row.cells[6].querySelector('input').value,
                    row.cells[7].querySelector('select').value
                ];
                csv.push(rowData.join(","));
            }
        });
        
        this.downloadCSV(csv.join("\n"), "student_attendance.csv");
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
        const headers = ['Student ID', 'Name', 'Year', 'Section', 'Time In', 'Time Out', 'Status'];
        headers.forEach(header => {
            excelContent += `<th>${header}</th>`;
        });
        excelContent += "</tr>";
        
        // Add data rows
        const rows = document.querySelectorAll('#studentTable tbody tr');
        rows.forEach(row => {
            if (row.style.display !== 'none') {
                excelContent += "<tr>";
                const rowData = [
                    row.cells[1].textContent,
                    row.cells[2].textContent,
                    row.cells[3].textContent,
                    row.cells[4].textContent,
                    row.cells[5].querySelector('input').value,
                    row.cells[6].querySelector('input').value,
                    row.cells[7].querySelector('select').value
                ];
                rowData.forEach(cell => {
                    excelContent += `<td>${cell}</td>`;
                });
                excelContent += "</tr>";
            }
        });
        
        excelContent += "</table>";
        
        const uri = 'data:application/vnd.ms-excel;base64,';
        const base64 = s => window.btoa(unescape(encodeURIComponent(s)));
        const link = document.createElement("a");
        link.href = uri + base64(excelContent);
        link.download = "student_attendance.xls";
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

// Global instance for calendar click events
let teacherAttendance;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    teacherAttendance = new TeacherAttendance();
});