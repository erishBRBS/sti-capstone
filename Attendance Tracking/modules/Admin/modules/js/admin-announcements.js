class AdminAnnouncements {
    constructor() {
        this.announcements = [];
        this.init();
    }

    init() {
        this.loadSampleData();
        this.bindEvents();
        this.renderAnnouncements();
        console.log('Admin Announcements initialized!');
    }

    loadSampleData() {
        // Sample announcements data
        this.announcements = [
            {
                id: 0,
                audience: 'General',
                course: '',
                subject: 'System Maintenance',
                message: 'System maintenance scheduled for September 15 from 10 PM to 2 AM.',
                imageName: '',
                date: 'Sept 7, 2025'
            },
            {
                id: 1,
                audience: 'Students',
                course: 'BSIT',
                subject: 'Midterm Examinations',
                message: 'Midterm examinations will begin on October 15. Please check your schedule.',
                imageName: '',
                date: 'Sept 5, 2025'
            },
            {
                id: 2,
                audience: 'Teachers',
                course: '',
                subject: 'Faculty Meeting',
                message: 'There will be a faculty meeting this Friday at 3 PM in the conference room.',
                imageName: '',
                date: 'Sept 3, 2025'
            },
            {
                id: 3,
                audience: 'Parents',
                course: '',
                subject: 'Parent-Teacher Conference',
                message: 'The parent-teacher conference is scheduled for September 20. Please confirm your attendance.',
                imageName: '',
                date: 'Sept 1, 2025'
            }
        ];
    }

    bindEvents() {
        // Form submission
        document.getElementById('announcementForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createAnnouncement();
        });

        document.getElementById('editForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateAnnouncement();
        });

        // Filter inputs
        const filterInputs = document.querySelectorAll('#filterAudience, #filterCourse, #filterSubject, #filterDate');
        filterInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.filterAnnouncements();
            });
        });

        // Apply filter button
        document.getElementById('applyFilterBtn').addEventListener('click', () => {
            this.filterAnnouncements();
        });

        // Clear filter button
        document.getElementById('clearFilterBtn').addEventListener('click', () => {
            this.clearFilters();
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

        // Image preview for create form
        document.getElementById('image').addEventListener('change', (e) => {
            this.previewImage(e.target, 'imagePreview', 'previewImage');
        });

        // Image preview for edit form
        document.getElementById('editImage').addEventListener('change', (e) => {
            this.previewImage(e.target, 'editImagePreview', 'editPreviewImage');
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
        const course = document.getElementById('course').value || '';
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        const imageFile = document.getElementById('image').files[0];
        const imageName = imageFile ? imageFile.name : '';

        if (!audience || !message) {
            this.showAlert('Please fill in all required fields', 'error');
            return;
        }

        const newAnnouncement = {
            id: this.announcements.length,
            audience,
            course,
            subject,
            message,
            imageName,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        this.announcements.unshift(newAnnouncement);
        this.renderAnnouncements();
        document.getElementById('announcementForm').reset();
        document.getElementById('imagePreview').style.display = 'none';
        this.showAlert('Announcement posted successfully!', 'success');
    }

    editAnnouncement(id) {
        const announcement = this.announcements.find(a => a.id === id);
        if (!announcement) return;

        document.getElementById('editIndex').value = id;
        document.getElementById('editAudience').value = announcement.audience;
        document.getElementById('editCourse').value = announcement.course || '';
        document.getElementById('editSubject').value = announcement.subject;
        document.getElementById('editMessage').value = announcement.message;

        // Show current image if exists
        const currentImageDiv = document.getElementById('currentImage');
        if (announcement.imageName) {
            currentImageDiv.innerHTML = `
                <p style="margin: 10px 0; font-size: 14px;"><strong>Current Image:</strong> ${announcement.imageName}</p>
                <button type="button" class="btn btn-danger btn-sm" onclick="adminAnnouncements.removeImage(${id})">
                    <i class="fas fa-trash"></i> Remove Image
                </button>
            `;
        } else {
            currentImageDiv.innerHTML = '<p style="margin: 10px 0; font-size: 14px; color: var(--medium-gray);"><em>No image attached</em></p>';
        }

        document.getElementById('editModal').classList.add('active');
    }

    removeImage(id) {
        const announcementIndex = this.announcements.findIndex(a => a.id === id);
        if (announcementIndex !== -1) {
            this.announcements[announcementIndex].imageName = '';
            this.renderAnnouncements();
            document.getElementById('currentImage').innerHTML = '<p style="margin: 10px 0; font-size: 14px; color: var(--medium-gray);"><em>No image attached</em></p>';
            this.showAlert('Image removed successfully!', 'success');
        }
    }

    updateAnnouncement() {
        const id = parseInt(document.getElementById('editIndex').value);
        const audience = document.getElementById('editAudience').value;
        const course = document.getElementById('editCourse').value || '';
        const subject = document.getElementById('editSubject').value;
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

        this.renderAnnouncements();
        this.closeModal();
        this.showAlert('Announcement updated successfully!', 'success');
    }

    deleteAnnouncement(id) {
        if (!confirm('Are you sure you want to delete this announcement?')) {
            return;
        }

        this.announcements = this.announcements.filter(a => a.id !== id);
        this.renderAnnouncements();
        this.showAlert('Announcement deleted successfully!', 'success');
    }

    renderAnnouncements() {
        const tableBody = document.querySelector('#announcementTable tbody');
        tableBody.innerHTML = '';

        this.announcements.forEach(announcement => {
            const row = document.createElement('tr');
            
            const imageCell = announcement.imageName 
                ? `<span class="image-attached"><i class="fas fa-image"></i> ${announcement.imageName}</span>`
                : '<span class="image-indicator">No Image</span>';
            
            const courseCell = announcement.course || '-';
            
            row.innerHTML = `
                <td><span class="audience-badge audience-${announcement.audience.toLowerCase()}">${announcement.audience}</span></td>
                <td>${courseCell}</td>
                <td>${announcement.subject}</td>
                <td>${announcement.message}</td>
                <td>${imageCell}</td>
                <td>${announcement.date}</td>
                <td class="action-cell">
                    <button class="action-btn edit-btn" data-id="${announcement.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${announcement.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        this.updateAnnouncementCount();
    }

    filterAnnouncements() {
        const audienceFilter = document.getElementById('filterAudience').value.toLowerCase();
        const courseFilter = document.getElementById('filterCourse').value.toLowerCase();
        const subjectFilter = document.getElementById('filterSubject').value.toLowerCase();
        const dateFilter = document.getElementById('filterDate').value;
        
        const rows = document.querySelectorAll('#announcementTable tbody tr');
        let visibleCount = 0;
        
        rows.forEach(row => {
            const audience = row.cells[0].textContent.toLowerCase();
            const course = row.cells[1].textContent.toLowerCase();
            const subject = row.cells[2].textContent.toLowerCase();
            const date = row.cells[5].textContent;
            
            const audienceMatch = !audienceFilter || audience.includes(audienceFilter);
            const courseMatch = !courseFilter || course.includes(courseFilter);
            const subjectMatch = !subjectFilter || subject.includes(subjectFilter);
            const dateMatch = !dateFilter || date.includes(dateFilter);
            
            if (audienceMatch && courseMatch && subjectMatch && dateMatch) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });
        
        this.updateAnnouncementCount(visibleCount);
    }

    clearFilters() {
        document.getElementById('filterAudience').value = '';
        document.getElementById('filterCourse').value = '';
        document.getElementById('filterSubject').value = '';
        document.getElementById('filterDate').value = '';
        this.filterAnnouncements();
    }

    updateAnnouncementCount(count = null) {
        const totalCount = count !== null ? count : this.announcements.length;
        document.querySelector('.announcement-count').textContent = `Total: ${totalCount} announcements`;
    }

    previewImage(input, previewId, imageId) {
        const preview = document.getElementById(previewId);
        const image = document.getElementById(imageId);
        
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                image.src = e.target.result;
                preview.style.display = 'block';
            }
            
            reader.readAsDataURL(input.files[0]);
        } else {
            preview.style.display = 'none';
        }
    }

    closeModal() {
        document.getElementById('editModal').classList.remove('active');
        document.getElementById('editForm').reset();
        document.getElementById('editImagePreview').style.display = 'none';
        document.getElementById('currentImage').innerHTML = '';
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

// Global reference for removeImage function
const adminAnnouncements = new AdminAnnouncements();