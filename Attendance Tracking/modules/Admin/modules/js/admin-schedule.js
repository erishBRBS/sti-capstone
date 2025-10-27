class AdminSchedule {
    constructor() {
        this.events = [];
        this.init();
    }

    init() {
        this.loadSampleData();
        this.bindEvents();
        this.generateCalendar();
        this.renderWeeklySchedule();
        this.renderScheduleTable();
        console.log('Admin Schedule initialized!');
    }

    loadSampleData() {
        // Sample schedule data - same as your original code
        this.events = [
            {
                id: 0,
                academicYear: "2025-2026",
                type: "Regular Class",
                title: "First Semester Classes Begin",
                startDate: "2025-09-01",
                endDate: "2025-12-15",
                description: "Start of academic year 2025-2026",
                day: "Monday",
                time: "08:00 - 10:00"
            },
            {
                id: 1,
                academicYear: "2025-2026",
                type: "Examination",
                title: "Midterm Examinations",
                startDate: "2025-10-15",
                endDate: "2025-10-20",
                description: "Midterm exams for all courses",
                day: "Tuesday",
                time: "10:00 - 12:00"
            },
            {
                id: 2,
                academicYear: "2025-2026",
                type: "University Event",
                title: "University Foundation Day",
                startDate: "2025-11-20",
                endDate: "2025-11-20",
                description: "Annual celebration of university founding",
                day: "Wednesday",
                time: "01:00 - 03:00"
            },
            {
                id: 3,
                academicYear: "2025-2026",
                type: "Holiday",
                title: "National Heroes Day",
                startDate: "2025-08-26",
                endDate: "2025-08-26",
                description: "National holiday - no classes",
                day: "Thursday",
                time: "09:00 - 11:00"
            },
            {
                id: 4,
                academicYear: "2025-2026",
                type: "Class Suspension",
                title: "Faculty Development Day",
                startDate: "2025-07-15",
                endDate: "2025-07-15",
                description: "Classes suspended for faculty training",
                day: "Friday",
                time: "02:00 - 04:00"
            },
            {
                id: 5,
                academicYear: "2025-2026",
                type: "Regular Class",
                title: "Second Semester Classes Begin",
                startDate: "2026-01-06",
                endDate: "2026-04-15",
                description: "Start of second semester",
                day: "Monday",
                time: "08:00 - 10:00"
            },
            {
                id: 6,
                academicYear: "2025-2026",
                type: "Examination",
                title: "Final Examinations",
                startDate: "2026-04-20",
                endDate: "2026-04-25",
                description: "Final exams for all courses",
                day: "Tuesday",
                time: "10:00 - 12:00"
            },
            {
                id: 7,
                academicYear: "2025-2026",
                type: "Holiday",
                title: "Semester Break",
                startDate: "2025-12-16",
                endDate: "2026-01-05",
                description: "Semester break for students and faculty",
                day: "Various",
                time: "All Day"
            }
        ];
    }

    bindEvents() {
        // Form submission
        document.getElementById('scheduleForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewEvent();
        });

        document.getElementById('editForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateEvent();
        });

        // Modal controls
        document.getElementById('modalClose').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.closeModal();
        });

        // Event delegation for action buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-btn')) {
                const button = e.target.closest('.edit-btn');
                const eventId = parseInt(button.dataset.id);
                this.editEvent(eventId);
            }

            if (e.target.closest('.delete-btn')) {
                const button = e.target.closest('.delete-btn');
                const eventId = parseInt(button.dataset.id);
                this.deleteEvent(eventId);
            }
        });

        // Filter functionality
        document.getElementById('filterType').addEventListener('change', () => {
            this.filterSchedule();
        });

        document.getElementById('filterYear').addEventListener('input', () => {
            this.filterSchedule();
        });

        document.getElementById('filterTitle').addEventListener('input', () => {
            this.filterSchedule();
        });

        document.getElementById('filterDate').addEventListener('change', () => {
            this.filterSchedule();
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
            const hasEvent = this.hasEventOnDate(i, currentMonth, currentYear);
            const eventType = this.getEventTypeForDate(i, currentMonth, currentYear);
            
            calendarEl.innerHTML += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}" onclick="window.adminSchedule.selectDate(${i})">
                    ${i}
                    ${hasEvent ? `<div class="event-indicator ${eventType}-indicator"></div>` : ''}
                </div>
            `;
        }
    }

    renderWeeklySchedule() {
        const weeklyScheduleBody = document.getElementById('weeklyScheduleBody');
        weeklyScheduleBody.innerHTML = '';

        // Get events for the current week (first 5 for demonstration)
        const weeklyEvents = this.events.slice(0, 5);

        weeklyEvents.forEach(event => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${event.day}</td>
                <td>${event.time}</td>
                <td><span class="event-badge event-${this.getEventTypeClass(event.type)}">${event.type}</span></td>
                <td>${event.title}</td>
                <td>${event.academicYear}</td>
                <td>${event.description}</td>
                <td class="action-cell">
                    <button class="action-btn edit-btn" data-id="${event.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${event.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            weeklyScheduleBody.appendChild(row);
        });
    }

    renderScheduleTable() {
        const scheduleTableBody = document.getElementById('scheduleTableBody');
        scheduleTableBody.innerHTML = '';

        this.events.forEach(event => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${event.academicYear}</td>
                <td><span class="event-badge event-${this.getEventTypeClass(event.type)}">${event.type}</span></td>
                <td>${event.title}</td>
                <td>${this.formatDateDisplay(event.startDate)}</td>
                <td>${this.formatDateDisplay(event.endDate)}</td>
                <td>${event.description}</td>
                <td class="action-cell">
                    <button class="action-btn edit-btn" data-id="${event.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${event.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            scheduleTableBody.appendChild(row);
        });
    }

    formatDateDisplay(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    hasEventOnDate(day, month, year) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return this.events.some(event => {
            const eventStart = new Date(event.startDate);
            const eventEnd = new Date(event.endDate);
            const checkDate = new Date(dateStr);
            
            return checkDate >= eventStart && checkDate <= eventEnd;
        });
    }

    getEventTypeForDate(day, month, year) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const event = this.events.find(event => {
            const eventStart = new Date(event.startDate);
            const eventEnd = new Date(event.endDate);
            const checkDate = new Date(dateStr);
            
            return checkDate >= eventStart && checkDate <= eventEnd;
        });
        
        if (event) {
            return this.getEventTypeClass(event.type);
        }
        return '';
    }

    getEventTypeClass(type) {
        const typeMap = {
            'Regular Class': 'regular',
            'Examination': 'exam',
            'University Event': 'event',
            'Holiday': 'holiday',
            'Class Suspension': 'suspension'
        };
        return typeMap[type] || 'regular';
    }

    selectDate(day) {
        const calendarDays = document.querySelectorAll('.calendar-day');
        calendarDays.forEach(dayEl => dayEl.classList.remove('selected'));
        
        event.target.classList.add('selected');
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const selectedDate = new Date(currentYear, currentMonth, day);
        
        this.showAlert(`Selected date: ${selectedDate.toDateString()}`, 'info');
        
        // Filter schedule table to show events for this date
        document.getElementById('filterDate').value = selectedDate.toISOString().split('T')[0];
        this.filterSchedule();
    }

    addNewEvent() {
        const formData = {
            academicYear: document.getElementById('academicYear').value,
            type: document.getElementById('eventType').value,
            title: document.getElementById('eventTitle').value,
            startDate: document.getElementById('dateStart').value,
            endDate: document.getElementById('dateEnd').value || document.getElementById('dateStart').value,
            description: document.getElementById('description').value
        };

        // Basic validation
        if (!formData.academicYear || !formData.type || !formData.title || !formData.startDate) {
            this.showAlert('Please fill in all required fields!', 'error');
            return;
        }

        const newEvent = {
            id: this.events.length,
            ...formData,
            day: this.getDayOfWeek(formData.startDate),
            time: '08:00 - 17:00' // Default time
        };

        this.events.push(newEvent);
        this.showAlert('Schedule added successfully!', 'success');
        document.getElementById('scheduleForm').reset();
        this.generateCalendar();
        this.renderWeeklySchedule();
        this.renderScheduleTable();
    }

    getDayOfWeek(dateString) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const date = new Date(dateString);
        return days[date.getDay()];
    }

    editEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        document.getElementById('editIndex').value = event.id;
        document.getElementById('editYear').value = event.academicYear;
        document.getElementById('editType').value = event.type;
        document.getElementById('editTitle').value = event.title;
        document.getElementById('editStart').value = event.startDate;
        document.getElementById('editEnd').value = event.endDate;
        document.getElementById('editDesc').value = event.description;

        this.openModal();
    }

    updateEvent() {
        const eventId = parseInt(document.getElementById('editIndex').value);
        const eventIndex = this.events.findIndex(e => e.id === eventId);
        
        if (eventIndex === -1) return;

        this.events[eventIndex] = {
            ...this.events[eventIndex],
            academicYear: document.getElementById('editYear').value,
            type: document.getElementById('editType').value,
            title: document.getElementById('editTitle').value,
            startDate: document.getElementById('editStart').value,
            endDate: document.getElementById('editEnd').value || document.getElementById('editStart').value,
            description: document.getElementById('editDesc').value,
            day: this.getDayOfWeek(document.getElementById('editStart').value)
        };

        this.showAlert('Schedule updated successfully!', 'success');
        this.closeModal();
        this.generateCalendar();
        this.renderWeeklySchedule();
        this.renderScheduleTable();
    }

    deleteEvent(eventId) {
        if (confirm('Are you sure you want to delete this event?')) {
            this.events = this.events.filter(e => e.id !== eventId);
            this.showAlert('Event deleted successfully!', 'success');
            this.generateCalendar();
            this.renderWeeklySchedule();
            this.renderScheduleTable();
        }
    }

    openModal() {
        document.getElementById('editModal').classList.add('active');
    }

    closeModal() {
        document.getElementById('editModal').classList.remove('active');
    }

    filterSchedule() {
        const typeFilter = document.getElementById('filterType').value;
        const yearFilter = document.getElementById('filterYear').value.toLowerCase();
        const titleFilter = document.getElementById('filterTitle').value.toLowerCase();
        const dateFilter = document.getElementById('filterDate').value;
        
        const weeklyRows = document.querySelectorAll('#weeklySchedule tbody tr');
        const tableRows = document.querySelectorAll('#scheduleTable tbody tr');
        
        // Filter weekly schedule
        weeklyRows.forEach(row => {
            const eventId = parseInt(row.querySelector('.edit-btn').dataset.id);
            const event = this.events.find(e => e.id === eventId);
            
            if (!event) {
                row.style.display = 'none';
                return;
            }
            
            const typeMatch = !typeFilter || event.type === typeFilter;
            const yearMatch = !yearFilter || event.academicYear.toLowerCase().includes(yearFilter);
            const titleMatch = !titleFilter || event.title.toLowerCase().includes(titleFilter);
            const dateMatch = !dateFilter || event.startDate === dateFilter;
            
            row.style.display = (typeMatch && yearMatch && titleMatch && dateMatch) ? '' : 'none';
        });
        
        // Filter schedule table
        tableRows.forEach(row => {
            const eventId = parseInt(row.querySelector('.edit-btn').dataset.id);
            const event = this.events.find(e => e.id === eventId);
            
            if (!event) {
                row.style.display = 'none';
                return;
            }
            
            const typeMatch = !typeFilter || event.type === typeFilter;
            const yearMatch = !yearFilter || event.academicYear.toLowerCase().includes(yearFilter);
            const titleMatch = !titleFilter || event.title.toLowerCase().includes(titleFilter);
            const dateMatch = !dateFilter || event.startDate === dateFilter;
            
            row.style.display = (typeMatch && yearMatch && titleMatch && dateMatch) ? '' : 'none';
        });
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

// Make it globally accessible
window.adminSchedule = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    window.adminSchedule = new AdminSchedule();
});