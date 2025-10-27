// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        console.log('Admin Dashboard initialized!');
        
        // Show welcome alert
        AlertManager.info('Welcome to Admin Dashboard! System is running smoothly.');
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
        document.querySelector('.notification-btn').addEventListener('click', () => {
            this.showNotifications();
        });

        // Stats cards click events
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('click', () => {
                this.handleStatCardClick(card);
            });
        });
    }

    handleQuickAction(action) {
        const actions = {
            attendance: () => {
                AlertManager.info('Opening Attendance Management...');
                // Simulate navigation delay
                setTimeout(() => {
                    window.location.href = 'admin-attendance.html';
                }, 1000);
            },
            students: () => {
                AlertManager.info('Opening Student Management...');
                setTimeout(() => {
                    window.location.href = 'admin-manage-students.html';
                }, 1000);
            },
            schedule: () => {
                AlertManager.warning('Schedule module is under maintenance');
            },
            announcements: () => {
                AlertManager.info('Opening Announcements Management...');
                setTimeout(() => {
                    window.location.href = 'admin-announcements.html';
                }, 1000);
            }
        };

        if (actions[action]) {
            actions[action]();
        } else {
            AlertManager.error('Action not available');
        }
    }

    handleStatCardClick(card) {
        const statLabel = card.querySelector('.stat-label').textContent;
        const statValue = card.querySelector('.stat-value').textContent;
        
        AlertManager.info(`Viewing details for: ${statLabel} (${statValue})`);
    }

    showNotifications() {
        AlertManager.info('You have 3 new notifications', 'info', 3000);
        
        // Simulate marking notifications as read
        setTimeout(() => {
            const badge = document.querySelector('.notification-badge');
            if (badge) {
                badge.style.display = 'none';
            }
        }, 2000);
    }

    // Method to simulate system alerts
    simulateSystemAlerts() {
        // Simulate various system alerts
        setTimeout(() => {
            AlertManager.warning('System maintenance scheduled for tonight at 11 PM');
        }, 5000);
        
        setTimeout(() => {
            AlertManager.success('Daily backup completed successfully');
        }, 10000);
    }
}

// Make it available globally
if (typeof window !== 'undefined') {
    window.AdminDashboard = AdminDashboard;
}