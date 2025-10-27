// Dashboard specific functionality
class Dashboard {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadDashboardData();
        console.log('Dashboard initialized!');
        
        // Show welcome notification
        setTimeout(() => {
            if (window.commonUtils) {
                window.commonUtils.showNotification('Welcome to Admin Dashboard! System is running smoothly.', 'success');
            }
        }, 1000);
    }

    bindEvents() {
        // Notification button click
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                this.handleNotificationClick();
            });
        }

        // Stats cards click events
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('click', () => {
                this.handleStatCardClick(card);
            });
        });

        // Announcement card clicks
        document.querySelectorAll('.announcement-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('a')) {
                    this.handleAnnouncementClick(card);
                }
            });
        });
    }

    handleNotificationClick() {
        if (window.commonUtils) {
            window.commonUtils.showNotification('You have 3 new notifications', 'info', 3000);
            
            // Simulate marking notifications as read
            setTimeout(() => {
                const badge = document.querySelector('.notification-badge');
                if (badge) {
                    badge.style.display = 'none';
                }
            }, 2000);
        }
    }

    handleStatCardClick(card) {
        const statLabel = card.querySelector('.stat-label').textContent;
        const statValue = card.querySelector('.stat-value').textContent;
        
        if (window.commonUtils) {
            window.commonUtils.showNotification(`Viewing details for: ${statLabel} (${statValue})`, 'info');
        }
    }

    handleAnnouncementClick(card) {
        const title = card.querySelector('.announcement-title').textContent;
        if (window.commonUtils) {
            window.commonUtils.showNotification(`Opening announcement: ${title}`, 'info');
        }
    }

    loadDashboardData() {
        // Simulate loading data
        setTimeout(() => {
            this.animateStats();
        }, 500);
    }

    animateStats() {
        // Animate stat numbers
        const statValues = document.querySelectorAll('.stat-value');
        statValues.forEach(stat => {
            const finalValue = stat.textContent;
            if (!isNaN(finalValue.replace(',', ''))) {
                this.animateValue(stat, 0, parseInt(finalValue.replace(',', '')), 1000);
            }
        });
    }

    animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Simulate real-time updates
    simulateRealTimeUpdates() {
        setInterval(() => {
            // Randomly update activity feed
            this.addRandomActivity();
        }, 30000); // Every 30 seconds
    }

    addRandomActivity() {
        const activities = [
            'New student application submitted',
            'Payment processed successfully',
            'Grade submission completed',
            'System backup completed',
            'New teacher account created'
        ];
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        const activityTime = 'Just now';
        
        const activitiesContainer = document.querySelector('.recent-activities');
        if (activitiesContainer) {
            const newActivity = document.createElement('div');
            newActivity.className = 'activity-item';
            newActivity.innerHTML = `
                <div class="activity-icon">
                    <i class="fas fa-bell"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-time">${activityTime}</div>
                    <div class="activity-text">${randomActivity}</div>
                </div>
            `;
            
            activitiesContainer.insertBefore(newActivity, activitiesContainer.firstChild);
            
            // Limit to 6 activities
            if (activitiesContainer.children.length > 6) {
                activitiesContainer.removeChild(activitiesContainer.lastChild);
            }
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
    
    // Start real-time updates after a delay
    setTimeout(() => {
        window.dashboard.simulateRealTimeUpdates();
    }, 5000);
});