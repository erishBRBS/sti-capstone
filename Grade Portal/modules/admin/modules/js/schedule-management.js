// schedule-management.js
// Schedule management functionality

let currentWeekOffset = 0;
let scheduleData = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    setupEventListeners();
    updateWeekDisplay();
    loadCalendar();
    loadScheduleList();
});

// Initialize sample data
function initializeData() {
    scheduleData = [
        {
            id: 'cs101-a',
            course: 'CS101 - Programming',
            section: 'A',
            teacher: 'Prof. Rodriguez',
            schedule: 'Mon/Wed 8:00-10:00 AM',
            room: 'Room 301',
            status: 'Active',
            day: 'Monday',
            startTime: '8:00 AM',
            endTime: '10:00 AM',
            duration: 2,
            color: 'schedule-cs'
        },
        {
            id: 'it101-b',
            course: 'IT101 - Systems',
            section: 'B',
            teacher: 'Prof. Santos',
            schedule: 'Wed/Fri 9:00-11:00 AM',
            room: 'Room 205',
            status: 'Active',
            day: 'Wednesday',
            startTime: '9:00 AM',
            endTime: '11:00 AM',
            duration: 2,
            color: 'schedule-it'
        },
        {
            id: 'cs201-a',
            course: 'CS201 - Data Structures',
            section: 'A',
            teacher: 'Prof. Garcia',
            schedule: 'Tue/Thu 10:00-12:00 PM',
            room: 'Room 302',
            status: 'Conflict',
            day: 'Tuesday',
            startTime: '10:00 AM',
            endTime: '12:00 PM',
            duration: 2,
            color: 'schedule-orange'
        },
        {
            id: 'ba101-c',
            course: 'BA101 - Business Ethics',
            section: 'C',
            teacher: 'Prof. Johnson',
            schedule: 'Mon/Fri 1:00-3:00 PM',
            room: 'Room 401',
            status: 'Active',
            day: 'Monday',
            startTime: '1:00 PM',
            endTime: '3:00 PM',
            duration: 2,
            color: 'schedule-ba'
        },
        {
            id: 'ma101-d',
            course: 'MA101 - Calculus',
            section: 'D',
            teacher: 'Prof. Lee',
            schedule: 'Tue/Thu 3:00-5:00 PM',
            room: 'Room 402',
            status: 'Active',
            day: 'Tuesday',
            startTime: '3:00 PM',
            endTime: '5:00 PM',
            duration: 2,
            color: 'schedule-purple'
        },
        {
            id: 'en101-e',
            course: 'EN101 - English',
            section: 'E',
            teacher: 'Prof. Martinez',
            schedule: 'Wed/Sat 4:00-6:00 PM',
            room: 'Room 501',
            status: 'Active',
            day: 'Saturday',
            startTime: '4:00 PM',
            endTime: '6:00 PM',
            duration: 2,
            color: 'schedule-brown'
        },
        {
            id: 'phy101-f',
            course: 'PHY101 - Physics',
            section: 'F',
            teacher: 'Prof. Wilson',
            schedule: 'Mon/Wed 7:00-9:00 AM',
            room: 'Room 301',
            status: 'Active',
            day: 'Monday',
            startTime: '7:00 AM',
            endTime: '9:00 AM',
            duration: 2,
            color: 'schedule-cs'
        },
        {
            id: 'chem101-g',
            course: 'CHEM101 - Chemistry',
            section: 'G',
            teacher: 'Prof. Brown',
            schedule: 'Thu/Sat 6:00-8:00 PM',
            room: 'Room 205',
            status: 'Active',
            day: 'Thursday',
            startTime: '6:00 PM',
            endTime: '8:00 PM',
            duration: 2,
            color: 'schedule-it'
        }
    ];
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu functionality
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.querySelector(".sidebar");
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (event) => {
            if (window.innerWidth < 992 && sidebar.classList.contains('open')) {
                if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });
    }
    
    // Dark mode toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    if (themeToggle && themeIcon) {
        // Check for saved theme preference or respect OS preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Set initial theme
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
        
        // Toggle theme
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            
            if (currentTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                themeIcon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeIcon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
    
    // Tab functionality
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Week navigation
    document.getElementById('prevWeekBtn').addEventListener('click', () => changeWeek(-1));
    document.getElementById('nextWeekBtn').addEventListener('click', () => changeWeek(1));

    // Modal buttons
    document.getElementById('addScheduleBtn').addEventListener('click', showAddModal);
    document.getElementById('closeAddModal').addEventListener('click', closeAddModal);
    document.getElementById('cancelAddBtn').addEventListener('click', closeAddModal);
    document.getElementById('saveScheduleBtn').addEventListener('click', saveSchedule);

    // Time calculation for modal
    document.getElementById('startTime').addEventListener('change', updateEndTime);
    document.getElementById('durationSelect').addEventListener('change', updateEndTime);

    // Export button
    document.getElementById('exportSchedulesBtn').addEventListener('click', exportSchedules);
    
    // Search functionality
    document.getElementById('scheduleSearch').addEventListener('input', function() {
        filterSchedules(this.value);
    });

    // Close modal when clicking outside
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('addModal');
        if (modal && event.target === modal) {
            closeAddModal();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Escape to close modals
        if (event.key === 'Escape') {
            closeAddModal();
        }
        
        // Ctrl/Cmd + N for new schedule
        if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
            event.preventDefault();
            showAddModal();
        }
    });
}

// Update end time based on start time and duration
function updateEndTime() {
    const startTime = document.getElementById('startTime').value;
    const duration = parseFloat(document.getElementById('durationSelect').value);
    
    if (!startTime) return;
    
    // Calculate end time
    const [hours, minutes] = startTime.split(':').map(Number);
    let endHours = hours + Math.floor(duration);
    let endMinutes = minutes + ((duration % 1) * 60);
    
    // Handle minute overflow
    if (endMinutes >= 60) {
        endHours += 1;
        endMinutes -= 60;
    }
    
    // Format end time
    const formattedEndTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    document.getElementById('endTime').value = formattedEndTime;
}

// Tab switching
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeTabBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTabBtn) {
        activeTabBtn.classList.add('active');
    }

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const activeTabContent = document.getElementById(tabName);
    if (activeTabContent) {
        activeTabContent.classList.add('active');
    }
}

// Week navigation
function changeWeek(offset) {
    currentWeekOffset += offset;
    updateWeekDisplay();
    loadCalendar();
}

function updateWeekDisplay() {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() + (currentWeekOffset * 7)));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const options = { month: 'short', day: 'numeric' };
    const startStr = weekStart.toLocaleDateString('en-US', options);
    const endStr = weekEnd.toLocaleDateString('en-US', options);
    
    document.getElementById('weekDisplay').textContent = `Week of ${startStr} - ${endStr}, ${weekEnd.getFullYear()}`;
}

// Load calendar data
function loadCalendar() {
    const calendarBody = document.getElementById('calendarBody');
    
    // Create time slots from 7AM to 7PM
    const timeSlots = [];
    for (let hour = 7; hour <= 19; hour++) {
        const timeString = `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
        timeSlots.push({
            time: `${hour}:00`,
            display: timeString
        });
    }

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    calendarBody.innerHTML = timeSlots.map(timeSlot => `
        <tr>
            <td style="color: var(--medium-gray); font-size: 12px;">${timeSlot.display}</td>
            ${days.map(day => {
                const scheduleItem = getScheduleForDayAndTime(day, timeSlot.time);
                return scheduleItem ? `
                    <td>
                        <div class="schedule-item ${scheduleItem.color}" onclick="viewDetails('${scheduleItem.id}')">
                            <div class="time-range">${scheduleItem.startTime} - ${scheduleItem.endTime}</div>
                            <div class="course-info">${scheduleItem.course.split(' - ')[0]}-${scheduleItem.section}</div>
                            <div class="room-info">${scheduleItem.room}</div>
                        </div>
                    </td>
                ` : '<td></td>';
            }).join('')}
        </tr>
    `).join('');
}

function getScheduleForDayAndTime(day, time) {
    // Find schedule items that match the day and start time
    return scheduleData.find(schedule => 
        schedule.day === day && schedule.startTime === formatTimeForCalendar(time)
    );
}

function formatTimeForCalendar(timeString) {
    // Convert 24h time to 12h format for comparison
    const [hours] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${ampm}`;
}

// Load schedule list
function loadScheduleList() {
    const scheduleListBody = document.getElementById('scheduleListBody');
    
    scheduleListBody.innerHTML = scheduleData.map(schedule => `
        <tr ${schedule.status === 'Conflict' ? 'style="background-color: #ffebee;"' : ''}>
            <td style="color: var(--dark-gray);">${schedule.course}</td>
            <td style="color: var(--dark-gray);">${schedule.section}</td>
            <td style="color: var(--dark-gray);">${schedule.teacher}</td>
            <td style="color: var(--dark-gray);">${schedule.schedule}</td>
            <td style="color: var(--dark-gray);">${schedule.room}</td>
            <td>
                <span class="status-badge ${schedule.status === 'Active' ? 'status-active' : 'status-conflict'}">
                    ${schedule.status}
                </span>
            </td>
            <td>
                <button class="action-btn" onclick="editSchedule('${schedule.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                ${schedule.status === 'Conflict' ? `
                    <button class="action-btn" onclick="resolveConflict('${schedule.id}')">
                        <i class="fas fa-exclamation-triangle"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

// Filter schedules
function filterSchedules(query) {
    const filteredSchedules = scheduleData.filter(schedule => 
        schedule.course.toLowerCase().includes(query.toLowerCase()) ||
        schedule.section.toLowerCase().includes(query.toLowerCase()) ||
        schedule.teacher.toLowerCase().includes(query.toLowerCase()) ||
        schedule.room.toLowerCase().includes(query.toLowerCase())
    );
    
    const scheduleListBody = document.getElementById('scheduleListBody');
    
    scheduleListBody.innerHTML = filteredSchedules.map(schedule => `
        <tr ${schedule.status === 'Conflict' ? 'style="background-color: #ffebee;"' : ''}>
            <td style="color: var(--dark-gray);">${schedule.course}</td>
            <td style="color: var(--dark-gray);">${schedule.section}</td>
            <td style="color: var(--dark-gray);">${schedule.teacher}</td>
            <td style="color: var(--dark-gray);">${schedule.schedule}</td>
            <td style="color: var(--dark-gray);">${schedule.room}</td>
            <td>
                <span class="status-badge ${schedule.status === 'Active' ? 'status-active' : 'status-conflict'}">
                    ${schedule.status}
                </span>
            </td>
            <td>
                <button class="action-btn" onclick="editSchedule('${schedule.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                ${schedule.status === 'Conflict' ? `
                    <button class="action-btn" onclick="resolveConflict('${schedule.id}')">
                        <i class="fas fa-exclamation-triangle"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

// Modal functions
function showAddModal() {
    document.getElementById('addModal').classList.add('active');
    updateEndTime(); // Initialize end time
}

function closeAddModal() {
    document.getElementById('addModal').classList.remove('active');
    document.getElementById('addScheduleForm').reset();
}

function saveSchedule() {
    const courseCode = document.getElementById('courseCode').value;
    const section = document.getElementById('section').value;
    const teacher = document.getElementById('teacherSelect').value;
    const day = document.getElementById('daySelect').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const duration = parseFloat(document.getElementById('durationSelect').value);
    const room = document.getElementById('roomSelect').value;

    if (!courseCode || !section || !teacher || !day || !startTime || !room) {
        showAlert('Please fill in all fields', 'warning');
        return;
    }

    // Create new schedule object
    const newSchedule = {
        id: `${courseCode.toLowerCase()}-${section.toLowerCase()}-${Date.now()}`,
        course: `${courseCode} - ${getCourseName(courseCode)}`,
        section: section,
        teacher: teacher,
        schedule: `${day} ${formatTime(startTime)}-${formatTime(endTime)}`,
        room: room,
        status: 'Active',
        day: day,
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
        duration: duration,
        color: getCourseColor(courseCode)
    };

    // Add to schedule data
    scheduleData.push(newSchedule);

    // Refresh displays
    loadCalendar();
    loadScheduleList();

    showAlert('Schedule added successfully!', 'success');
    closeAddModal();
}

function getCourseName(code) {
    const courseNames = {
        'CS101': 'Programming',
        'IT101': 'Systems',
        'BA101': 'Business Ethics',
        'CS201': 'Data Structures',
        'MA101': 'Calculus',
        'EN101': 'English',
        'PHY101': 'Physics',
        'CHEM101': 'Chemistry'
    };
    return courseNames[code] || 'Course';
}

function getCourseColor(code) {
    const colors = {
        'CS101': 'schedule-cs',
        'IT101': 'schedule-it',
        'BA101': 'schedule-ba',
        'CS201': 'schedule-orange',
        'MA101': 'schedule-purple',
        'EN101': 'schedule-brown',
        'PHY101': 'schedule-cs',
        'CHEM101': 'schedule-it'
    };
    return colors[code] || 'schedule-cs';
}

function formatTime(timeString) {
    // Convert 24h time to 12h format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Export functionality
function exportSchedules() {
    showAlert('Exporting schedule data...', 'info');
    setTimeout(() => {
        showAlert('Schedule data exported successfully!', 'success');
    }, 2000);
}

// Action functions
function viewDetails(id) {
    const schedule = scheduleData.find(s => s.id === id);
    if (schedule) {
        showAlert(`Viewing details for ${schedule.course}-${schedule.section} (${schedule.startTime} - ${schedule.endTime})`, 'info');
    }
}

function editSchedule(id) {
    const schedule = scheduleData.find(s => s.id === id);
    if (schedule) {
        showAlert(`Editing schedule for ${schedule.course}-${schedule.section}`, 'info');
        // In a real app, you would populate the modal with existing data
        showAddModal();
    }
}

function resolveConflict(id) {
    showAlert(`Resolving conflict ${id}`, 'info');
    // In a real app, you would implement conflict resolution logic
}

// Alert system
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    const alertClass = {
        success: 'alert-success',
        error: 'alert-error',
        warning: 'alert-warning',
        info: 'alert-info'
    }[type];
    
    const alertId = `alert-${Date.now()}`;
    const alertHtml = `
        <div class="alert ${alertClass}" id="${alertId}">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button onclick="document.getElementById('${alertId}').remove()" style="margin-left: auto; background: none; border: none; cursor: pointer; color: inherit;">✕</button>
        </div>
    `;
    
    alertContainer.insertAdjacentHTML('beforeend', alertHtml);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        const alert = document.getElementById(alertId);
        if (alert) alert.remove();
    }, 5000);
}