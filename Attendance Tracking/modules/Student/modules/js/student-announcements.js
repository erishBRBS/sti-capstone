class StudentAnnouncements {
    constructor() {
        this.announcements = [];
        this.filteredAnnouncements = [];
        this.init();
    }

    init() {
        this.loadSampleData();
        this.bindEvents();
        this.displayAnnouncements(this.announcements);
        console.log('Student Announcements initialized!');
    }

    loadSampleData() {
        // Sample announcements data
        this.announcements = [
            {
                title: "Campus Cleaning Drive",
                type: "General",
                subject: "",
                content: "Join us for the campus clean-up on Sept 25. All students are required to participate in this community service activity.",
                image: "https://via.placeholder.com/600x200/1a4b8c/ffffff?text=Campus+Cleaning",
                date: "2025-09-20",
                priority: "high"
            },
            {
                title: "Math Quiz Reminder",
                type: "Subject",
                subject: "Math",
                content: "Quiz #2 will be on Sept 22. Please review chapters 3 and 4. The quiz will cover algebraic expressions and basic equations.",
                image: "https://via.placeholder.com/600x200/2d68b8/ffffff?text=Math+Quiz",
                date: "2025-09-19",
                priority: "high"
            },
            {
                title: "Science Lab Session",
                type: "Subject",
                subject: "Science",
                content: "Bring your lab coat for tomorrow's experiment on chemical reactions. Safety goggles will be provided.",
                image: "https://via.placeholder.com/600x200/28a745/ffffff?text=Science+Lab",
                date: "2025-09-18",
                priority: "medium"
            },
            {
                title: "Library Hours Extended",
                type: "General",
                subject: "",
                content: "The library will now be open until 8 PM on weekdays to accommodate students who need extra study time.",
                image: "https://via.placeholder.com/600x200/6f42c1/ffffff?text=Library+Hours",
                date: "2025-09-17",
                priority: "low"
            },
            {
                title: "Essay Submission",
                type: "Subject",
                subject: "English",
                content: "Remember to submit your essays on modern literature by Friday. Late submissions will be penalized.",
                image: "https://via.placeholder.com/600x200/fd7e14/ffffff?text=Essay+Submission",
                date: "2025-09-16",
                priority: "high"
            },
            {
                title: "Sports Day Announcement",
                type: "Event",
                subject: "",
                content: "Annual sports day will be held on October 5. Sign up at the PE department if you're interested in participating.",
                image: "https://via.placeholder.com/600x200/e74c3c/ffffff?text=Sports+Day",
                date: "2025-09-15",
                priority: "medium"
            },
            {
                title: "Web Development Project Deadline",
                type: "Subject",
                subject: "Web Development",
                content: "Final project submissions for Web Development are due next Monday. Make sure to test all functionality before submitting.",
                image: "https://via.placeholder.com/600x200/17a2b8/ffffff?text=Web+Project",
                date: "2025-09-14",
                priority: "high"
            },
            {
                title: "Independence Day Holiday",
                type: "Holiday",
                subject: "",
                content: "Classes will be suspended on June 12 in observance of Independence Day. Regular classes will resume the following day.",
                image: "https://via.placeholder.com/600x200/dc3545/ffffff?text=No+Classes",
                date: "2025-09-13",
                priority: "medium"
            }
        ];
    }

    bindEvents() {
        // Filter button
        document.getElementById('applyFilterBtn').addEventListener('click', () => {
            this.applyFilters();
        });

        // Filter inputs (apply on change)
        document.getElementById('filterType').addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('filterSubject').addEventListener('change', () => {
            this.applyFilters();
        });

        // Search input with debounce
        let searchTimeout;
        document.getElementById('searchBox').addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.applyFilters();
            }, 300);
        });

        // Notification button
        document.querySelector('.notification-btn').addEventListener('click', () => {
            this.showNotifications();
        });
    }

    displayAnnouncements(list) {
        const container = document.getElementById("announcementList");
        container.innerHTML = "";

        if (list.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>No announcements found</h3>
                    <p>Try adjusting your filters or search terms</p>
                </div>
            `;
            return;
        }

        // Sort by date (newest first) and priority
        const sorted = [...list].sort((a, b) => {
            // First sort by priority (high > medium > low)
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
            
            if (priorityDiff !== 0) return priorityDiff;
            
            // Then sort by date (newest first)
            return new Date(b.date) - new Date(a.date);
        });

        sorted.forEach(announcement => {
            const announcementElement = this.createAnnouncementElement(announcement);
            container.appendChild(announcementElement);
        });
    }

    createAnnouncementElement(announcement) {
        const div = document.createElement('div');
        div.className = `announcement-card ${announcement.type.toLowerCase()}`;
        
        const image = announcement.image ? 
            `<img src="${announcement.image}" alt="Announcement Image" class="announcement-image">` : "";
        
        const icon = this.getTypeIcon(announcement.type);
        const priorityIcon = this.getPriorityIcon(announcement.priority);
        const priorityClass = `priority-${announcement.priority}`;
        
        div.innerHTML = `
            ${image}
            <h4>${announcement.title}</h4>
            <div class="announcement-meta">
                <span>
                    <i class="fas ${icon}"></i> 
                    <span class="announcement-tag ${announcement.type.toLowerCase()}">
                        ${announcement.type}
                    </span>
                </span>
                <span><i class="fas fa-calendar"></i> ${this.formatDate(announcement.date)}</span>
                <span>
                    <i class="fas ${priorityIcon}"></i> 
                    <span class="${priorityClass}">
                        ${announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                    </span>
                </span>
                ${announcement.subject ? `
                    <span><i class="fas fa-book"></i> ${announcement.subject}</span>
                ` : ""}
            </div>
            <p class="announcement-content">${announcement.content}</p>
        `;
        
        return div;
    }

    applyFilters() {
        const typeFilter = document.getElementById("filterType").value;
        const subjectFilter = document.getElementById("filterSubject").value;
        const keyword = document.getElementById("searchBox").value.toLowerCase();

        const filtered = this.announcements.filter(announcement =>
            (!typeFilter || announcement.type === typeFilter) &&
            (!subjectFilter || announcement.subject === subjectFilter) &&
            (!keyword || 
                announcement.title.toLowerCase().includes(keyword) || 
                announcement.content.toLowerCase().includes(keyword) ||
                announcement.subject.toLowerCase().includes(keyword))
        );
        
        this.displayAnnouncements(filtered);
        
        // Show feedback if no results
        if (filtered.length === 0 && (typeFilter || subjectFilter || keyword)) {
            this.showAlert('No announcements match your filters', 'info', 3000);
        }
    }

    getTypeIcon(type) {
        switch (type) {
            case 'General': return 'fa-bullhorn';
            case 'Subject': return 'fa-book';
            case 'Event': return 'fa-calendar-alt';
            case 'Holiday': return 'fa-umbrella-beach';
            default: return 'fa-bullhorn';
        }
    }

    getPriorityIcon(priority) {
        switch (priority) {
            case 'high': return 'fa-exclamation-circle';
            case 'medium': return 'fa-info-circle';
            case 'low': return 'fa-check-circle';
            default: return 'fa-info-circle';
        }
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
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