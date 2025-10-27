class StudentSchedule {
    constructor() {
        this.classData = {};
        this.init();
    }

    init() {
        this.loadSampleData();
        this.bindEvents();
        this.renderScheduleTable();
        this.renderScheduleList();
        console.log('Student Schedule initialized!');
    }

    loadSampleData() {
        // Class data
        this.classData = {
            'WEB101-A': {
                code: 'WEB101',
                name: 'Web Development',
                professor: 'Prof. Santos',
                schedule: 'MWF 8:00 - 9:30 AM',
                room: 'Room 301',
                section: 'Section A',
                units: 3
            },
            'DB201-B': {
                code: 'DB201',
                name: 'Database Management',
                professor: 'Prof. Reyes',
                schedule: 'MTH 10:00 - 11:30 AM',
                room: 'Room 205',
                section: 'Section B',
                units: 3
            },
            'PROG101-C': {
                code: 'PROG101',
                name: 'Programming Fundamentals',
                professor: 'Prof. Cruz',
                schedule: 'MWF 1:00 - 2:30 PM',
                room: 'Room 402',
                section: 'Section C',
                units: 3
            },
            'NET301-D': {
                code: 'NET301',
                name: 'Network Administration',
                professor: 'Prof. Lim',
                schedule: 'TTH 3:00 - 4:30 PM',
                room: 'Lab 102',
                section: 'Section D',
                units: 3
            }
        };

        // Schedule data for table view
        this.scheduleData = [
            {
                time: '8:00 - 9:30 AM',
                monday: { course: 'WEB101', section: 'A' },
                tuesday: null,
                wednesday: { course: 'WEB101', section: 'A' },
                thursday: null,
                friday: { course: 'WEB101', section: 'A' }
            },
            {
                time: '10:00 - 11:30 AM',
                monday: { course: 'DB201', section: 'B' },
                tuesday: { course: 'DB201', section: 'B' },
                wednesday: null,
                thursday: { course: 'DB201', section: 'B' },
                friday: null
            },
            {
                time: '1:00 - 2:30 PM',
                monday: { course: 'PROG101', section: 'C' },
                tuesday: null,
                wednesday: { course: 'PROG101', section: 'C' },
                thursday: null,
                friday: { course: 'PROG101', section: 'C' }
            },
            {
                time: '3:00 - 4:30 PM',
                monday: null,
                tuesday: { course: 'NET301', section: 'D' },
                wednesday: null,
                thursday: { course: 'NET301', section: 'D' },
                friday: null
            }
        ];

        // Schedule data for list view
        this.listScheduleData = [
            {
                day: 'Monday',
                classes: [
                    { time: '8:00 - 9:30 AM', course: 'WEB101', section: 'A' },
                    { time: '10:00 - 11:30 AM', course: 'DB201', section: 'B' },
                    { time: '1:00 - 2:30 PM', course: 'PROG101', section: 'C' }
                ]
            },
            {
                day: 'Tuesday',
                classes: [
                    { time: '10:00 - 11:30 AM', course: 'DB201', section: 'B' },
                    { time: '3:00 - 4:30 PM', course: 'NET301', section: 'D' }
                ]
            },
            {
                day: 'Wednesday',
                classes: [
                    { time: '8:00 - 9:30 AM', course: 'WEB101', section: 'A' },
                    { time: '1:00 - 2:30 PM', course: 'PROG101', section: 'C' }
                ]
            },
            {
                day: 'Thursday',
                classes: [
                    { time: '10:00 - 11:30 AM', course: 'DB201', section: 'B' },
                    { time: '3:00 - 4:30 PM', course: 'NET301', section: 'D' }
                ]
            },
            {
                day: 'Friday',
                classes: [
                    { time: '8:00 - 9:30 AM', course: 'WEB101', section: 'A' },
                    { time: '1:00 - 2:30 PM', course: 'PROG101', section: 'C' }
                ]
            }
        ];
    }

    bindEvents() {
        // View switching
        document.getElementById('tableViewBtn').addEventListener('click', () => {
            this.switchView('table');
        });

        document.getElementById('listViewBtn').addEventListener('click', () => {
            this.switchView('list');
        });

        // Modal close button
        document.getElementById('modalCloseBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // View subject button
        document.getElementById('viewSubjectBtn').addEventListener('click', () => {
            this.viewSubjectDetails();
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeModal();
            }
        });

        // Close modal when clicking outside
        document.getElementById('classModal').addEventListener('click', (event) => {
            if (event.target === event.currentTarget) {
                this.closeModal();
            }
        });

        // Notification button
        document.querySelector('.notification-btn').addEventListener('click', () => {
            this.showNotifications();
        });
    }

    renderScheduleTable() {
        const scheduleTableBody = document.getElementById('scheduleTableBody');
        scheduleTableBody.innerHTML = '';

        this.scheduleData.forEach(timeSlot => {
            const row = document.createElement('tr');
            
            // Time slot
            const timeCell = document.createElement('td');
            timeCell.className = 'time-slot';
            timeCell.textContent = timeSlot.time;
            row.appendChild(timeCell);

            // Days
            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
            days.forEach(day => {
                const dayCell = document.createElement('td');
                
                if (timeSlot[day]) {
                    const classData = this.classData[`${timeSlot[day].course}-${timeSlot[day].section}`];
                    if (classData) {
                        const classBlock = document.createElement('div');
                        classBlock.className = 'class-block';
                        classBlock.setAttribute('data-course', timeSlot[day].course);
                        classBlock.setAttribute('data-section', timeSlot[day].section);
                        
                        classBlock.innerHTML = `
                            <div class="class-code">${classData.code}</div>
                            <div class="class-name">${classData.name}</div>
                            <div class="class-details">
                                <span><i class="fas fa-user-tie"></i> ${classData.professor}</span>
                                <span><i class="fas fa-door-open"></i> ${classData.room}</span>
                            </div>
                        `;
                        
                        classBlock.addEventListener('click', () => {
                            this.viewClassDetails(timeSlot[day].course, timeSlot[day].section);
                        });
                        
                        dayCell.appendChild(classBlock);
                    }
                }
                
                row.appendChild(dayCell);
            });

            scheduleTableBody.appendChild(row);
        });
    }

    renderScheduleList() {
        const listView = document.getElementById('listView');
        listView.innerHTML = '';

        this.listScheduleData.forEach(dayData => {
            const daySection = document.createElement('div');
            daySection.className = 'day-section';
            
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.innerHTML = `<i class="fas fa-calendar-day"></i> ${dayData.day}`;
            daySection.appendChild(dayHeader);

            dayData.classes.forEach(classItem => {
                const classData = this.classData[`${classItem.course}-${classItem.section}`];
                if (classData) {
                    const scheduleItem = document.createElement('div');
                    scheduleItem.className = 'schedule-item';
                    scheduleItem.setAttribute('data-course', classItem.course);
                    scheduleItem.setAttribute('data-section', classItem.section);
                    
                    scheduleItem.innerHTML = `
                        <div class="schedule-time">${classItem.time}</div>
                        <div class="schedule-content">
                            <div class="schedule-course">${classData.code} - ${classData.name}</div>
                            <div class="schedule-meta">
                                <span><i class="fas fa-user-tie"></i> ${classData.professor}</span>
                                <span><i class="fas fa-door-open"></i> ${classData.room}</span>
                                <span><i class="fas fa-users"></i> ${classData.section}</span>
                            </div>
                        </div>
                    `;
                    
                    scheduleItem.addEventListener('click', () => {
                        this.viewClassDetails(classItem.course, classItem.section);
                    });
                    
                    daySection.appendChild(scheduleItem);
                }
            });

            listView.appendChild(daySection);
        });
    }

    switchView(view) {
        const tableView = document.getElementById('tableView');
        const listView = document.getElementById('listView');
        const tableViewBtn = document.getElementById('tableViewBtn');
        const listViewBtn = document.getElementById('listViewBtn');
        
        tableViewBtn.classList.remove('active');
        listViewBtn.classList.remove('active');
        
        if (view === 'table') {
            tableView.style.display = 'block';
            listView.style.display = 'none';
            tableViewBtn.classList.add('active');
        } else {
            tableView.style.display = 'none';
            listView.style.display = 'block';
            listViewBtn.classList.add('active');
        }
    }

    viewClassDetails(courseCode, section) {
        const key = `${courseCode}-${section}`;
        const data = this.classData[key];
        
        if (data) {
            document.getElementById('subjectCode').textContent = data.code;
            document.getElementById('subjectName').textContent = data.name;
            document.getElementById('professor').textContent = data.professor;
            document.getElementById('schedule').textContent = data.schedule;
            document.getElementById('room').textContent = data.room;
            document.getElementById('section').textContent = data.section;
            document.getElementById('units').textContent = data.units + ' Units';
            
            document.getElementById('classModal').classList.add('active');
        }
    }

    closeModal() {
        document.getElementById('classModal').classList.remove('active');
    }

    viewSubjectDetails() {
        const subjectCode = document.getElementById('subjectCode').textContent;
        this.closeModal();
        this.showAlert(`Redirecting to ${subjectCode} subject details page...`, 'info');
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