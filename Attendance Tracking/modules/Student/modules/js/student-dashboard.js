class StudentDashboard {
    constructor() {
        this.studentData = {
            name: 'Hadassa Yap',
            studentId: 'STI2024001',
            program: 'BS Information Technology',
            year: '2024'
        };
        this.attendanceData = {};
        this.schedule = [];
        this.announcements = [];
        this.init();
    }

    init() {
        this.loadStudentData();
        this.bindEvents();
        this.setupRealTimeUpdates();
        console.log('Student Dashboard initialized!');
    }

    loadStudentData() {
        // Simulate API calls to load student data
        setTimeout(() => {
            this.loadAttendanceData();
            this.loadSchedule();
            this.loadAnnouncements();
            this.updateStats();
        }, 1000);
    }

    loadAttendanceData() {
        this.attendanceData = {
            totalClasses: 8,
            attendanceStatus: 'Present',
            overallAttendance: 92,
            presentDays: 45,
            absentDays: 3,
            lateDays: 2
        };
    }

    loadSchedule() {
        this.schedule = [
            {
                subject: 'Mathematics',
                room: 'Room 204',
                professor: 'Prof. Santos',
                time: '8:00 AM - 9:30 AM',
                status: 'present'
            },
            {
                subject: 'Science',
                room: 'Room 305',
                professor: 'Dr. Rodriguez',
                time: '10:00 AM - 11:30 AM',
                status: 'present'
            },
            {
                subject: 'Programming',
                room: 'Lab 102',
                professor: 'Prof. Lee',
                time: '1:00 PM - 2:30 PM',
                status: 'upcoming'
            }
        ];

        this.renderSchedule();
    }

    renderSchedule() {
        const container = document.getElementById('todaysSchedule');
        if (!container) return;

        container.innerHTML = this.schedule.map(item => `
            <tr>
                <td>${item.subject}</td>
                <td>${item.room}</td>
                <td>${item.professor}</td>
                <td>${item.time}</td>
                <td>${this.getStatusBadge(item.status)}</td>
            </tr>
        `).join('');
    }

    getStatusBadge(status) {
        const badges = {
            'present': 'badge-success',
            'absent': 'badge-danger',
            'late': 'badge-warning',
            'upcoming': 'badge-info'
        };
        const texts = {
            'present': 'Present',
            'absent': 'Absent',
            'late': 'Late',
            'upcoming': 'Upcoming'
        };
        return `<span class="badge ${badges[status]}">${texts[status]}</span>`;
    }

    loadAnnouncements() {
        this.announcements = [
            {
                title: 'Math Quiz Next Week',
                meta: 'Posted by Prof. Santos • 2 hours ago',
                content: 'There will be a quiz on Calculus next Monday. Please review chapters 3-5. Bring your scientific calculators.'
            },
            {
                title: 'Library Hours Extended',
                meta: 'Posted by Administration • 1 day ago',
                content: 'Library hours have been extended until 9 PM during finals week. Group study rooms are available for reservation.'
            },
            {
                title: 'Student Council Elections',
                meta: 'Posted by Student Affairs • 2 days ago',
                content: 'Student council elections will be held next Friday in the main auditorium. Cast your vote from 8 AM to 5 PM.'
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
        document.getElementById('totalClasses').textContent = this.attendanceData.totalClasses;
        document.getElementById('attendanceStatus').textContent = this.attendanceData.attendanceStatus;
        document.getElementById('overallAttendance').textContent = this.attendanceData.overallAttendance + '%';
        document.getElementById('newAnnouncements').textContent = this.announcements.length;
    }

    bindEvents() {
        // Quick action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.getAttribute('data-action');
                this.handleQuickAction(action);
            });
        });

        // Notification button
        const notificationBtn = document.querySelector('.notification-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                this.showNotifications();
            });
        }
    }

    handleQuickAction(action) {
        const actions = {
            'gate-attendance': () => this.recordGateAttendance(),
            'subject-attendance': () => this.showAlert('Opening Subject Attendance...', 'info'),
            'schedule': () => this.showAlert('Opening Schedule...', 'info'),
            'announcements': () => this.showAlert('Opening Announcements...', 'info')
        };

        if (actions[action]) {
            actions[action]();
        }
    }

    recordGateAttendance() {
        this.showAlert('Recording gate attendance...', 'info');
        
        // Simulate API call
        setTimeout(() => {
            this.attendanceData.attendanceStatus = 'Present';
            document.getElementById('attendanceStatus').textContent = 'Present';
            this.showAlert('Gate attendance recorded successfully!', 'success');
        }, 1500);
    }

    showNotifications() {
        const notifications = [
            'Your attendance has been recorded for Mathematics',
            'New grade posted for Science assignment',
            'Reminder: Programming class at 1:00 PM'
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
        // Simulate real-time updates
        setInterval(() => {
            this.updateScheduleStatus();
        }, 60000); // Update every minute
    }

    updateScheduleStatus() {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        this.schedule.forEach(item => {
            const [startTime, endTime] = item.time.split(' - ');
            const startMinutes = this.timeToMinutes(startTime);
            const endMinutes = this.timeToMinutes(endTime);

            if (currentTime >= startMinutes && currentTime <= endMinutes) {
                item.status = 'present';
            } else if (currentTime > endMinutes && item.status === 'upcoming') {
                item.status = 'present';
            }
        });

        this.renderSchedule();
    }

    timeToMinutes(timeStr) {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        
        return hours * 60 + minutes;
    }

    // Modern Alert System - Same as admin and teacher dashboards
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
    window.StudentDashboard = StudentDashboard;
}