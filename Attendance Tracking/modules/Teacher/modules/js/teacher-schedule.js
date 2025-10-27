class TeacherSchedule {
    constructor() {
        this.currentClass = null;
        this.students = [];
        this.classes = [];
        this.init();
    }

    init() {
        this.loadSampleData();
        this.bindEvents();
        this.renderWeeklySchedule();
        console.log('Teacher Schedule initialized!');
    }

    loadSampleData() {
        // Sample class schedule data
        this.classes = [
            {
                id: 0,
                day: "Monday",
                time: "08:00 - 10:00",
                subject: "Mathematics",
                year: "1st Year",
                section: "BSIT 2A",
                room: "Room 204"
            },
            {
                id: 1,
                day: "Tuesday",
                time: "10:00 - 12:00",
                subject: "Science",
                year: "1st Year",
                section: "BSIT 3B",
                room: "Room 305"
            },
            {
                id: 2,
                day: "Wednesday",
                time: "01:00 - 03:00",
                subject: "Programming",
                year: "2nd Year",
                section: "BSCS 1C",
                room: "Lab 102"
            },
            {
                id: 3,
                day: "Thursday",
                time: "09:00 - 11:00",
                subject: "English",
                year: "1st Year",
                section: "BSED 2B",
                room: "Room 201"
            },
            {
                id: 4,
                day: "Friday",
                time: "02:00 - 04:00",
                subject: "History",
                year: "3rd Year",
                section: "BSBA 3A",
                room: "Room 401"
            }
        ];

        // Sample student data
        this.students = [
            { id: '2025-001', name: 'Juan Dela Cruz', year: '1st Year', section: 'BSIT 2A', subject: 'Mathematics' },
            { id: '2025-002', name: 'Maria Santos', year: '1st Year', section: 'BSIT 2A', subject: 'Mathematics' },
            { id: '2025-003', name: 'Pedro Gomez', year: '1st Year', section: 'BSIT 3B', subject: 'Science' },
            { id: '2025-004', name: 'Ana Cruz', year: '1st Year', section: 'BSIT 3B', subject: 'Science' },
            { id: '2025-005', name: 'Luis Reyes', year: '2nd Year', section: 'BSCS 1C', subject: 'Programming' },
            { id: '2025-006', name: 'Sofia Martinez', year: '2nd Year', section: 'BSCS 1C', subject: 'Programming' },
            { id: '2025-007', name: 'Miguel Torres', year: '1st Year', section: 'BSED 2B', subject: 'English' },
            { id: '2025-008', name: 'Elena Rodriguez', year: '3rd Year', section: 'BSBA 3A', subject: 'History' },
            { id: '2025-009', name: 'Carlos Lim', year: '1st Year', section: 'BSIT 2A', subject: 'Mathematics' },
            { id: '2025-010', name: 'Isabel Garcia', year: '1st Year', section: 'BSIT 3B', subject: 'Science' },
            { id: '2025-011', name: 'Roberto Tan', year: '2nd Year', section: 'BSCS 1C', subject: 'Programming' },
            { id: '2025-012', name: 'Andrea Ong', year: '1st Year', section: 'BSED 2B', subject: 'English' },
            { id: '2025-013', name: 'Daniel Sy', year: '3rd Year', section: 'BSBA 3A', subject: 'History' }
        ];
    }

    bindEvents() {
        // Export buttons
        document.getElementById('exportCSV').addEventListener('click', () => {
            this.exportCSV();
        });

        document.getElementById('exportExcel').addEventListener('click', () => {
            this.exportExcel();
        });

        // Save attendance button
        document.getElementById('saveAttendance').addEventListener('click', () => {
            this.saveAttendance();
        });

        // Filter event listeners
        document.getElementById('filterName').addEventListener('input', () => {
            this.filterStudents();
        });

        document.getElementById('filterYear').addEventListener('input', () => {
            this.filterStudents();
        });

        document.getElementById('filterSectionInput').addEventListener('input', () => {
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

    renderWeeklySchedule() {
        const weeklyScheduleBody = document.getElementById('weeklyScheduleBody');
        weeklyScheduleBody.innerHTML = '';

        this.classes.forEach(classItem => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${classItem.day}</td>
                <td>${classItem.time}</td>
                <td>${classItem.subject}</td>
                <td>${classItem.year}</td>
                <td>${classItem.section}</td>
                <td>${classItem.room}</td>
                <td>
                    <button class="btn btn-primary view-attendance-btn" data-id="${classItem.id}">
                        View Attendance
                    </button>
                </td>
            `;
            weeklyScheduleBody.appendChild(row);
        });

        // Add event listeners to view attendance buttons
        document.querySelectorAll('.view-attendance-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const classId = parseInt(e.target.dataset.id);
                this.viewAttendance(classId);
            });
        });
    }

    viewAttendance(classId) {
        const classItem = this.classes.find(c => c.id === classId);
        if (!classItem) return;

        this.currentClass = classItem;
        
        // Show the filter and attendance sections
        const filterSection = document.getElementById('filterSection');
        const attendanceSection = document.getElementById('attendanceSection');
        
        filterSection.style.display = 'block';
        attendanceSection.style.display = 'block';
        
        // Scroll to the attendance section
        attendanceSection.scrollIntoView({ behavior: 'smooth' });
        
        // Filter students based on the class
        const classStudents = this.filterStudentsByClass(classItem.section);
        
        // Render the student table
        this.renderStudentTable(classStudents);
        
        this.showAlert(`Viewing attendance for ${classItem.subject} - ${classItem.section}`, 'info');
    }

    filterStudentsByClass(section) {
        return this.students.filter(student => student.section === section);
    }

    renderStudentTable(students) {
        const studentTableBody = document.getElementById('studentTableBody');
        studentTableBody.innerHTML = '';

        if (students.length === 0) {
            studentTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="no-data">
                        <i class="fas fa-inbox"></i>
                        <div>No students found for this class</div>
                    </td>
                </tr>
            `;
            return;
        }

        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.year}</td>
                <td>${student.section}</td>
                <td>${student.subject}</td>
                <td>
                    <select class="form-control status-select">
                        <option value="Present">Present</option>
                        <option value="Late">Late</option>
                        <option value="Absent">Absent</option>
                    </select>
                </td>
            `;
            studentTableBody.appendChild(row);
        });
    }

    filterStudents() {
        const nameFilter = document.getElementById('filterName').value.toLowerCase();
        const yearFilter = document.getElementById('filterYear').value.toLowerCase();
        const sectionFilter = document.getElementById('filterSectionInput').value.toLowerCase();
        const statusFilter = document.getElementById('filterStatus').value;
        
        const rows = document.querySelectorAll('#studentTableBody tr');
        let visibleCount = 0;
        
        rows.forEach(row => {
            if (row.classList.contains('no-data')) {
                row.style.display = 'none';
                return;
            }

            const name = row.cells[1].textContent.toLowerCase();
            const year = row.cells[2].textContent.toLowerCase();
            const section = row.cells[3].textContent.toLowerCase();
            const status = row.cells[5].querySelector('.status-select').value;
            
            const nameMatch = name.includes(nameFilter);
            const yearMatch = year.includes(yearFilter);
            const sectionMatch = section.includes(sectionFilter);
            const statusMatch = !statusFilter || status === statusFilter;
            
            const shouldShow = nameMatch && yearMatch && sectionMatch && statusMatch;
            row.style.display = shouldShow ? '' : 'none';
            
            if (shouldShow) visibleCount++;
        });

        // Show no data message if no rows are visible
        if (visibleCount === 0 && rows.length > 0) {
            const noDataRow = document.createElement('tr');
            noDataRow.innerHTML = `
                <td colspan="6" class="no-data">
                    <i class="fas fa-search"></i>
                    <div>No students match your filters</div>
                </td>
            `;
            document.getElementById('studentTableBody').appendChild(noDataRow);
        }
    }

    saveAttendance() {
        if (!this.currentClass) {
            this.showAlert('Please select a class first!', 'error');
            return;
        }

        const rows = document.querySelectorAll('#studentTableBody tr');
        const attendanceData = [];
        
        rows.forEach(row => {
            if (row.style.display !== 'none' && !row.classList.contains('no-data')) {
                const id = row.cells[0].textContent;
                const name = row.cells[1].textContent;
                const status = row.cells[5].querySelector('.status-select').value;
                
                attendanceData.push({
                    id: id,
                    name: name,
                    status: status,
                    class: this.currentClass.subject,
                    section: this.currentClass.section,
                    date: new Date().toISOString().split('T')[0]
                });
            }
        });
        
        console.log('Saving attendance data:', attendanceData);
        this.showAlert(`Attendance data saved successfully for ${attendanceData.length} students in ${this.currentClass.subject}!`, 'success');
    }

    exportCSV() {
        if (!this.currentClass) {
            this.showAlert('Please select a class first!', 'error');
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Student ID,Name,Year,Section,Subject,Status\n";
        
        const rows = document.querySelectorAll('#studentTableBody tr');
        let exportedCount = 0;
        
        rows.forEach(row => {
            if (row.style.display !== 'none' && !row.classList.contains('no-data')) {
                const id = row.cells[0].textContent;
                const name = row.cells[1].textContent;
                const year = row.cells[2].textContent;
                const section = row.cells[3].textContent;
                const subject = row.cells[4].textContent;
                const status = row.cells[5].querySelector('.status-select').value;
                
                csvContent += `"${id}","${name}","${year}","${section}","${subject}","${status}"\n`;
                exportedCount++;
            }
        });
        
        if (exportedCount > 0) {
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `attendance_${this.currentClass.section}_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.showAlert(`CSV exported successfully for ${exportedCount} students!`, 'success');
        } else {
            this.showAlert('No data to export!', 'warning');
        }
    }

    exportExcel() {
        if (!this.currentClass) {
            this.showAlert('Please select a class first!', 'error');
            return;
        }

        // For a real implementation, you might want to use a library like SheetJS
        let excelContent = "<table>";
        
        // Add headers
        excelContent += "<tr>";
        const headers = ['Student ID', 'Name', 'Year', 'Section', 'Subject', 'Status'];
        headers.forEach(header => {
            excelContent += `<th>${header}</th>`;
        });
        excelContent += "</tr>";
        
        // Add data rows
        const rows = document.querySelectorAll('#studentTableBody tr');
        let exportedCount = 0;
        
        rows.forEach(row => {
            if (row.style.display !== 'none' && !row.classList.contains('no-data')) {
                excelContent += "<tr>";
                const cells = row.querySelectorAll('td');
                cells.forEach((cell, index) => {
                    if (index < 5) {
                        excelContent += `<td>${cell.textContent}</td>`;
                    } else if (index === 5) {
                        const status = cell.querySelector('.status-select').value;
                        excelContent += `<td>${status}</td>`;
                    }
                });
                excelContent += "</tr>";
                exportedCount++;
            }
        });
        
        excelContent += "</table>";
        
        if (exportedCount > 0) {
            const uri = 'data:application/vnd.ms-excel;base64,';
            const base64 = s => window.btoa(unescape(encodeURIComponent(s)));
            const link = document.createElement("a");
            link.href = uri + base64(excelContent);
            link.download = `attendance_${this.currentClass.section}_${new Date().toISOString().split('T')[0]}.xls`;
            link.click();
            this.showAlert(`Excel exported successfully for ${exportedCount} students!`, 'success');
        } else {
            this.showAlert('No data to export!', 'warning');
        }
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