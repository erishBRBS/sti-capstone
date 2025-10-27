class TeacherAnnouncements {
    constructor() {
        this.announcements = [];
        this.init();
    }

    init() {
        this.loadSampleData();
        this.bindEvents();
        this.renderAnnouncements(this.announcements);
        console.log('Teacher Announcements initialized!');
    }

    loadSampleData() {
        // Sample announcements data
        this.announcements = [
            { 
                id: 1,
                audience: 'Students', 
                course: 'Mathematics 101', 
                subject: 'Midterm Exam', 
                message: 'The midterm exam will be held next week. Please prepare chapters 1-5.', 
                imageName: 'exam_schedule.pdf', 
                date: '2023-09-15' 
            },
            { 
                id: 2,
                audience: 'Teachers', 
                course: 'N/A', 
                subject: 'Faculty Meeting', 
                message: 'There will be a faculty meeting this Friday at 3 PM in the conference room.', 
                imageName: '', 
                date: '2023-09-12' 
            },
            { 
                id: 3,
                audience: 'All', 
                course: 'N/A', 
                subject: 'Holiday Notice', 
                message: 'The university will be closed on September 20 for a national holiday.', 
                imageName: 'holiday_notice.jpg', 
                date: '2023-09-08' 
            }
        ];
    }

    bindEvents() {
        // Form submission
        document.getElementById('announcementForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createAnnouncement();
        });

        // Edit form submission
        document.getElementById('editForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateAnnouncement();
        });

        // Filter button
        document.getElementById('applyFilterBtn').addEventListener('click', () => {
            this.applyFilters();
        });

        // Export buttons
        document.getElementById('exportCSVBtn').addEventListener('click', () => {
            this.exportTableToCSV();
        });

        document.getElementById('exportExcelBtn').addEventListener('click', () => {
            this.exportTableToExcel();
        });

        // Modal buttons
        document.getElementById('modalCloseBtn').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelEditBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Edit and delete buttons (using event delegation)
        document.getElementById('announcementTable').addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;

            const id = target.getAttribute('data-id');
            if (!id) return;

            if (target.classList.contains('edit-btn')) {
                this.editAnnouncement(parseInt(id));
            } else if (target.classList.contains('delete-btn')) {
                this.deleteAnnouncement(parseInt(id));
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Close modal when clicking outside
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal();
            }
        });

        // Notification button
        document.querySelector('.notification-btn').addEventListener('click', () => {
            this.showNotifications();
        });
    }

    createAnnouncement() {
        const audience = document.getElementById('audience').value;
        const course = document.getElementById('course').value || 'N/A';
        const subject = document.getElementById('subject').value || 'N/A';
        const message = document.getElementById('message').value;
        const imageFile = document.getElementById('image').files[0];
        const imageName = imageFile ? imageFile.name : '';
        const date = new Date().toISOString().split('T')[0];

        if (!audience || !message) {
            this.showAlert('Please fill in all required fields', 'error');
            return;
        }

        const newAnnouncement = {
            id: this.announcements.length > 0 ? Math.max(...this.announcements.map(a => a.id)) + 1 : 1,
            audience,
            course,
            subject,
            message,
            imageName,
            date
        };

        this.announcements.unshift(newAnnouncement);
        this.renderAnnouncements(this.announcements);
        document.getElementById('announcementForm').reset();
        this.showAlert('Announcement posted successfully!', 'success');
    }

    renderAnnouncements(data) {
        const tableBody = document.querySelector('#announcementTable tbody');
        tableBody.innerHTML = '';
        
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No announcements found</td></tr>';
            return;
        }
        
        data.forEach(announcement => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${announcement.audience}</td>
                <td>${announcement.course}</td>
                <td>${announcement.subject}</td>
                <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${announcement.message}">${announcement.message}</td>
                <td>${announcement.imageName || 'N/A'}</td>
                <td>${announcement.date}</td>
                <td class="action-cell">
                    <button class="action-btn edit-btn" data-id="${announcement.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${announcement.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        this.updateAnnouncementCount(data.length);
    }

    editAnnouncement(id) {
        const announcement = this.announcements.find(a => a.id === id);
        if (announcement) {
            document.getElementById('editIndex').value = id;
            document.getElementById('editAudience').value = announcement.audience;
            document.getElementById('editCourse').value = announcement.course !== 'N/A' ? announcement.course : '';
            document.getElementById('editSubject').value = announcement.subject !== 'N/A' ? announcement.subject : '';
            document.getElementById('editMessage').value = announcement.message;

            document.getElementById('editModal').classList.add('active');
        }
    }

    updateAnnouncement() {
        const id = parseInt(document.getElementById('editIndex').value);
        const audience = document.getElementById('editAudience').value;
        const course = document.getElementById('editCourse').value || 'N/A';
        const subject = document.getElementById('editSubject').value || 'N/A';
        const message = document.getElementById('editMessage').value;
        const imageFile = document.getElementById('editImage').files[0];
        const imageName = imageFile ? imageFile.name : '';

        const announcementIndex = this.announcements.findIndex(a => a.id === id);
        if (announcementIndex === -1) return;

        this.announcements[announcementIndex] = {
            ...this.announcements[announcementIndex],
            audience,
            course,
            subject,
            message,
            imageName: imageName || this.announcements[announcementIndex].imageName
        };

        this.renderAnnouncements(this.announcements);
        this.closeModal();
        this.showAlert('Announcement updated successfully!', 'success');
    }

    deleteAnnouncement(id) {
        if (!confirm('Are you sure you want to delete this announcement?')) {
            return;
        }

        this.announcements = this.announcements.filter(a => a.id !== id);
        this.renderAnnouncements(this.announcements);
        this.showAlert('Announcement deleted successfully!', 'success');
    }

    closeModal() {
        document.getElementById('editModal').classList.remove('active');
        document.getElementById('editForm').reset();
    }

    applyFilters() {
        const audienceFilter = document.getElementById('filterAudience').value;
        const courseFilter = document.getElementById('filterCourse').value.toLowerCase();
        const subjectFilter = document.getElementById('filterSubject').value.toLowerCase();
        const dateFilter = document.getElementById('filterDate').value;
        
        const filteredAnnouncements = this.announcements.filter(announcement => {
            const audienceMatch = !audienceFilter || announcement.audience === audienceFilter;
            const courseMatch = !courseFilter || announcement.course.toLowerCase().includes(courseFilter);
            const subjectMatch = !subjectFilter || announcement.subject.toLowerCase().includes(subjectFilter);
            const dateMatch = !dateFilter || announcement.date === dateFilter;
            
            return audienceMatch && courseMatch && subjectMatch && dateMatch;
        });
        
        this.renderAnnouncements(filteredAnnouncements);
    }

    updateAnnouncementCount(count = null) {
        const totalCount = count !== null ? count : this.announcements.length;
        document.querySelector('.announcement-count').textContent = `Total: ${totalCount} announcements`;
    }

    exportTableToCSV() {
        let csv = [];
        const rows = document.querySelectorAll("#announcementTable tr");
        
        for (let row of rows) {
            let cols = row.querySelectorAll("td, th");
            let rowData = [];
            
            for (let col of cols) {
                // Skip action column
                if (!col.classList.contains('action-cell')) {
                    rowData.push(`"${col.innerText.replace(/"/g, '""')}"`);
                }
            }
            
            csv.push(rowData.join(","));
        }
        
        this.downloadCSV(csv.join("\n"), "announcements.csv");
        this.showAlert('CSV exported successfully!', 'success');
    }

    downloadCSV(csv, filename) {
        let csvFile = new Blob([csv], { type: "text/csv" });
        let downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    exportTableToExcel() {
        const table = document.getElementById("announcementTable");
        const html = table.outerHTML;
        const url = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(html);
        const link = document.createElement("a");
        link.download = "announcements.xls";
        link.href = url;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.showAlert('Excel file exported successfully!', 'success');
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