class TeacherDashboard {
    constructor() {
        this.currentClasses = [];
        this.announcements = [];
        this.init();
    }

    init() {
        this.loadTeacherData();
        this.bindEvents();
        this.setupRealTimeUpdates();
        console.log('Teacher Dashboard initialized!');
    }

    loadTeacherData() {
        // Simulate API calls to load teacher data
        setTimeout(() => {
            this.loadTodaysClasses();
            this.loadAnnouncements();
            this.updateStats();
        }, 1000);
    }

    loadTodaysClasses() {
        this.currentClasses = [
            {
                subject: 'Mathematics',
                section: 'BSIT 2A',
                room: 'Room 204',
                time: '8:00 AM - 9:30 AM',
                status: 'completed',
                attendanceTaken: true
            },
            {
                subject: 'Science',
                section: 'BSIT 3B',
                room: 'Room 305',
                time: '10:00 AM - 11:30 AM',
                status: 'in-progress',
                attendanceTaken: false
            },
            {
                subject: 'Programming',
                section: 'BSCS 1C',
                room: 'Lab 102',
                time: '1:00 PM - 2:30 PM',
                status: 'upcoming',
                attendanceTaken: false
            }
        ];

        this.renderTodaysClasses();
    }

    renderTodaysClasses() {
        const container = document.getElementById('todaysClasses');
        if (!container) return;

        container.innerHTML = this.currentClasses.map(cls => `
            <tr>
                <td>${cls.subject}</td>
                <td>${cls.section}</td>
                <td>${cls.room}</td>
                <td>${cls.time}</td>
                <td>${this.getStatusBadge(cls.status)}</td>
                <td>${this.getActionButton(cls)}</td>
            </tr>
        `).join('');
    }

    getStatusBadge(status) {
        const badges = {
            'completed': 'badge-success',
            'in-progress': 'badge-warning',
            'upcoming': 'badge-info'
        };
        const texts = {
            'completed': 'Completed',
            'in-progress': 'In Progress',
            'upcoming': 'Upcoming'
        };
        return `<span class="badge ${badges[status]}">${texts[status]}</span>`;
    }

    getActionButton(cls) {
        if (cls.status === 'completed' && cls.attendanceTaken) {
            return '<button class="btn btn-primary view-attendance">View Attendance</button>';
        } else if (cls.status === 'in-progress' && !cls.attendanceTaken) {
            return '<button class="btn btn-primary take-attendance">Take Attendance</button>';
        } else if (cls.status === 'upcoming') {
            return '<button class="btn btn-outline" disabled>Starts Soon</button>';
        }
        return '<button class="btn btn-outline" disabled>Completed</button>';
    }

    loadAnnouncements() {
        this.announcements = [
            {
                title: 'General Assembly - September 15',
                meta: 'Posted by Administration • September 10, 2023',
                content: 'All faculty members are required to attend the general assembly on September 15 at the main auditorium. Please arrive 15 minutes early for registration.'
            },
            {
                title: 'Class Suspension - September 18 (Typhoon)',
                meta: 'Posted by Administration • September 9, 2023',
                content: 'Due to the approaching typhoon, all classes on September 18 are suspended. Please check your email for updates regarding make-up classes.'
            },
            {
                title: 'New Curriculum Guidelines',
                meta: 'Posted by Academic Department • September 5, 2023',
                content: 'Updated curriculum guidelines have been released. Please review the changes in the faculty portal and submit feedback by September 20.'
            }
        ];

        this.renderAnnouncements();
    }

    renderAnnouncements() {
        const container = document.getElementById('announcementsList');
        if (!container) return;

        container.innerHTML = this.announcements.map(announcement => `
            <div class="announcement-item">
                <div class="announcement-title">${announcement.title}</div>
                <div class="announcement-meta">${announcement.meta}</div>
                <p>${announcement.content}</p>
            </div>
        `).join('');
    }

    updateStats() {
        const stats = {
            weeklyClasses: this.currentClasses.length * 5, // 5 days a week
            totalStudents: 85,
            todayClasses: this.currentClasses.length,
            newAnnouncements: this.announcements.length
        };

        document.getElementById('weeklyClasses').textContent = stats.weeklyClasses;
        document.getElementById('totalStudents').textContent = stats.totalStudents;
        document.getElementById('todayClasses').textContent = stats.todayClasses;
        document.getElementById('newAnnouncements').textContent = stats.newAnnouncements;
    }

    bindEvents() {
        // Class attendance buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('take-attendance')) {
                const row = e.target.closest('tr');
                const subject = row.cells[0].textContent;
                const section = row.cells[1].textContent;
                this.takeAttendance(subject, section);
            }

            if (e.target.classList.contains('view-attendance')) {
                const row = e.target.closest('tr');
                const subject = row.cells[0].textContent;
                const section = row.cells[1].textContent;
                this.viewAttendance(subject, section);
            }
        });

        // Quick actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.getAttribute('data-action');
                this.handleQuickAction(action);
            });
        });

        // Notifications
        const notificationBtn = document.querySelector('.notification-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                this.showNotifications();
            });
        }
    }

    takeAttendance(subject, section) {
        this.showAlert(`Taking attendance for ${subject} - ${section}`, 'info');
        
        // Simulate attendance process
        setTimeout(() => {
            // Update class status
            const classIndex = this.currentClasses.findIndex(cls => 
                cls.subject === subject && cls.section === section
            );
            
            if (classIndex !== -1) {
                this.currentClasses[classIndex].attendanceTaken = true;
                this.renderTodaysClasses();
                this.showAlert(`Attendance recorded for ${subject}`, 'success');
            }
        }, 2000);
    }

    viewAttendance(subject, section) {
        this.showAlert(`Viewing attendance for ${subject} - ${section}`, 'info');
    }

    handleQuickAction(action) {
        const actions = {
            attendance: () => this.showAlert('Opening Attendance Management...', 'info'),
            students: () => this.showAlert('Opening Student Management...', 'info'),
            schedule: () => this.showAlert('Opening Schedule Management...', 'info'),
            announcements: () => this.showAlert('Opening Announcements...', 'info')
        };

        if (actions[action]) {
            actions[action]();
        }
    }

    showNotifications() {
        const notifications = [
            'New faculty meeting scheduled for Friday',
            'Student submitted assignment late',
            'System update completed successfully'
        ];

        this.showAlert(notifications[0], 'info');
        
        // Update notification badge
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            const currentCount = parseInt(badge.textContent);
            if (currentCount > 0) {
                badge.textContent = currentCount - 1;
            }
        }
    }

    setupRealTimeUpdates() {
        // Simulate real-time updates for class status
        setInterval(() => {
            this.updateClassStatuses();
        }, 60000); // Update every minute
    }

    updateClassStatuses() {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        this.currentClasses.forEach(cls => {
            const [startTime, endTime] = cls.time.split(' - ');
            const startMinutes = this.timeToMinutes(startTime);
            const endMinutes = this.timeToMinutes(endTime);

            if (currentTime >= startMinutes && currentTime <= endMinutes) {
                cls.status = 'in-progress';
            } else if (currentTime > endMinutes) {
                cls.status = 'completed';
            } else {
                cls.status = 'upcoming';
            }
        });

        this.renderTodaysClasses();
    }

    timeToMinutes(timeStr) {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        
        return hours * 60 + minutes;
    }

    // Modern Alert System - Same as admin dashboard
    showAlert(message, type = 'info', duration = 5000) {
        const alertContainer = document.getElementById('alertContainer');
        if (!alertContainer) {
            console.error('Alert container not found');
            return null;
        }

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

// Make it available globally
if (typeof window !== 'undefined') {
    window.TeacherDashboard = TeacherDashboard;
}