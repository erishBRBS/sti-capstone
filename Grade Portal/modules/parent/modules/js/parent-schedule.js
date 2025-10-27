// Schedule Page JavaScript

// Schedule data
const scheduleData = {
  Monday: [
    { subject: "Mobile System and Technologies", day: "Monday", time: "7:00AM - 9:00AM", room: "LIB2", professor: "JUNKATE LINDON BERNABE", units: "3", grade: "85.00" },
    { subject: "Web Systems & Technologies", day: "Monday", time: "10:00AM - 1:00PM", room: "L3", professor: "ENRICO ENERLAN", units: "3", grade: "85.50" },
    { subject: "Information Assurance & Security (Cybersecurity Fundamentals)", day: "Monday", time: "2:00PM - 5:00PM", room: "212", professor: "JOSHUA GUEVARRA", units: "3", grade: "80.00" }
  ],
  Tuesday: [
    { subject: "Great Books", day: "Tuesday-Thursday", time: "7:00AM - 8:30AM", room: "218-A", professor: "LUZVIE MAE MANALAYSAY", units: "3", grade: "89.00" },
    { subject: "Management Information Systems", day: "Tuesday-Thursday", time: "8:30AM - 10:00AM", room: "218-A", professor: "ENRICO ENERLAN", units: "3", grade: "87.50" }
  ],
  Wednesday: [
    { subject: "YOUR SCHEDULE IS FREE TODAY", day: "Wednesday", time: "All Day", room: "None", professor: "None", units: "0", grade: "" }
  ],
  Thursday: [
    { subject: "Great Books", day: "Tuesday-Thursday", time: "7:00AM - 8:30AM", room: "218-A", professor: "LUZVIE MAE MANALAYSAY", units: "3", grade: "89.00" },
    { subject: "Management Information Systems", day: "Tuesday-Thursday", time: "8:30AM - 10:00AM", room: "218-A", professor: "ENRICO ENERLAN", units: "3", grade: "87.50" }
  ],
  Friday: [
    { subject: "Mobile Systems and Technologies", day: "Friday", time: "10:00AM - 1:00PM", room: "L1", professor: "JUNKATE LINDON BERNABE", units: "3", grade: "85.00" },
    { subject: "IT Capstone Project 1", day: "Friday", time: "3:00PM - 5:00PM", room: "212", professor: "ROCELLE CAMPOSAGRADO", units: "3", grade: "" }
  ],
  Saturday: [
    { subject: "Programming Languages", day: "Saturday", time: "10:00AM - 1:00PM", room: "206", professor: "JUNKATE LINDON BERNABE", units: "3", grade: "" },
    { subject: "Web Systems and Technologies", day: "Saturday", time: "1:00PM - 3:00PM", room: "206", professor: "ENRICO ENERLAN", units: "3", grade: "85.50" }
  ]
};

// Function to render today's classes
function renderTodaysClasses() {
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = scheduleData[dayName] || [];
  const container = document.getElementById('todayClasses');
  container.innerHTML = '';
  
  if (todayClasses.length === 0 || (todayClasses.length === 1 && todayClasses[0].subject === "YOUR SCHEDULE IS FREE TODAY")) {
    container.innerHTML = `
      <div class="today-class-item">
        <div class="today-class-time">All Day</div>
        <div class="today-class-details">
          <div class="today-class-name">No classes scheduled for today</div>
          <div class="today-class-meta">Your child has a free day</div>
        </div>
      </div>
    `;
  } else {
    todayClasses.forEach(cls => {
      if (cls.subject !== "YOUR SCHEDULE IS FREE TODAY") {
        const classItem = document.createElement('div');
        classItem.className = 'today-class-item';
        classItem.onclick = () => viewClassDetails(cls.subject);
        
        classItem.innerHTML = `
          <div class="today-class-time">${cls.time}</div>
          <div class="today-class-details">
            <div class="today-class-name">${cls.subject}</div>
            <div class="today-class-meta">
              <span><i class="fas fa-door-open"></i> ${cls.room}</span>
              <span><i class="fas fa-user-tie"></i> ${cls.professor}</span>
            </div>
          </div>
        `;
        
        container.appendChild(classItem);
      }
    });
  }
}

// Function to render the weekly schedule table
function renderWeeklySchedule() {
  const scheduleBody = document.getElementById('scheduleBody');
  scheduleBody.innerHTML = '';
  
  // Time slots for the weekly view
  const timeSlots = [
    "7:00 - 9:00 AM",
    "9:00 - 10:00 AM",
    "10:00 AM - 1:00 PM",
    "1:00 - 2:00 PM",
    "2:00 - 3:00 PM",
    "3:00 - 5:00 PM"
  ];
  
  timeSlots.forEach(timeSlot => {
    const row = document.createElement('tr');
    
    // Time column
    const timeCell = document.createElement('td');
    timeCell.className = 'time-slot';
    timeCell.textContent = timeSlot;
    row.appendChild(timeCell);
    
    // Day columns
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    days.forEach(day => {
      const dayCell = document.createElement('td');
      
      // Find classes for this day and time slot
      const classes = scheduleData[day] || [];
      const matchingClasses = classes.filter(cls => {
        if (cls.subject === "YOUR SCHEDULE IS FREE TODAY") return false;
        
        // Simple time matching - in a real app you'd parse times properly
        const classTime = cls.time.toLowerCase();
        const slotTime = timeSlot.toLowerCase();
        
        // Check if the class time overlaps with the time slot
        if (classTime.includes("7:00am") && slotTime.includes("7:00")) return true;
        if (classTime.includes("8:30am") && slotTime.includes("9:00")) return true;
        if (classTime.includes("10:00am") && slotTime.includes("10:00")) return true;
        if (classTime.includes("1:00pm") && slotTime.includes("1:00")) return true;
        if (classTime.includes("2:00pm") && slotTime.includes("2:00")) return true;
        if (classTime.includes("3:00pm") && slotTime.includes("3:00")) return true;
        
        return false;
      });
      
      if (matchingClasses.length > 0) {
        matchingClasses.forEach(cls => {
          const classBlock = document.createElement('div');
          classBlock.className = 'class-block';
          classBlock.onclick = () => viewClassDetails(cls.subject);
          
          classBlock.innerHTML = `
            <div class="class-code">${cls.subject.split(' ')[0]}</div>
            <div class="class-name">${cls.subject}</div>
            <div class="class-details">
              <span><i class="fas fa-door-open"></i> ${cls.room}</span>
              <span><i class="fas fa-user-tie"></i> ${cls.professor.split(' ')[0]}</span>
            </div>
          `;
          
          dayCell.appendChild(classBlock);
        });
      }
      
      row.appendChild(dayCell);
    });
    
    scheduleBody.appendChild(row);
  });
}

// Function to render list view
function renderListView() {
  const listView = document.getElementById('listView');
  listView.innerHTML = '';
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  days.forEach(day => {
    const daySection = document.createElement('div');
    daySection.className = 'day-section';
    
    const dayHeader = document.createElement('div');
    dayHeader.className = 'day-header';
    dayHeader.innerHTML = `<i class="fas fa-calendar-day"></i> ${day}`;
    
    daySection.appendChild(dayHeader);
    
    const classes = scheduleData[day] || [];
    
    if (classes.length === 0 || (classes.length === 1 && classes[0].subject === "YOUR SCHEDULE IS FREE TODAY")) {
      const scheduleItem = document.createElement('div');
      scheduleItem.className = 'schedule-item';
      scheduleItem.innerHTML = `
        <div class="schedule-time">All Day</div>
        <div class="schedule-content">
          <div class="schedule-course">YOUR SCHEDULE IS FREE TODAY</div>
        </div>
      `;
      daySection.appendChild(scheduleItem);
    } else {
      classes.forEach(cls => {
        if (cls.subject !== "YOUR SCHEDULE IS FREE TODAY") {
          const scheduleItem = document.createElement('div');
          scheduleItem.className = 'schedule-item';
          scheduleItem.onclick = () => viewClassDetails(cls.subject);
          
          scheduleItem.innerHTML = `
            <div class="schedule-time">${cls.time}</div>
            <div class="schedule-content">
              <div class="schedule-course">${cls.subject}</div>
              <div class="schedule-meta">
                <span><i class="fas fa-door-open"></i> ${cls.room}</span>
                <span><i class="fas fa-user-tie"></i> ${cls.professor}</span>
              </div>
            </div>
          `;
          
          daySection.appendChild(scheduleItem);
        }
      });
    }
    
    listView.appendChild(daySection);
  });
}

// View switching
function switchView(view) {
  const tableView = document.getElementById('tableView');
  const listView = document.getElementById('listView');
  const tableViewBtn = document.getElementById('tableViewBtn');
  const listViewBtn = document.getElementById('listViewBtn');
  
  tableViewBtn.classList.remove('active');
  listViewBtn.classList.remove('active');
  
  if (view === 'table') {
    tableView.style.display = 'block';
    listView.classList.remove('active');
    tableViewBtn.classList.add('active');
  } else {
    tableView.style.display = 'none';
    listView.classList.add('active');
    listViewBtn.classList.add('active');
  }
}

// Function to load schedule data
function loadScheduleData(studentId) {
  // In a real application, this would fetch data based on the selected student
  // For now, we'll just use the sample data
  renderTodaysClasses();
  renderWeeklySchedule();
  renderListView();
}

// Function to view class details
function viewClassDetails(subject) {
  // Find the class in the schedule data
  let classDetails = null;
  for (const day in scheduleData) {
    const found = scheduleData[day].find(cls => cls.subject === subject);
    if (found) {
      classDetails = found;
      break;
    }
  }
  
  if (classDetails) {
    document.getElementById('subjectName').textContent = classDetails.subject;
    document.getElementById('professorName').textContent = classDetails.professor;
    document.getElementById('classSchedule').textContent = `${classDetails.day} ${classDetails.time}`;
    document.getElementById('classRoom').textContent = classDetails.room;
    document.getElementById('classUnits').textContent = classDetails.units;
    document.getElementById('classGrade').textContent = classDetails.grade || "Not yet available";
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
    document.getElementById('classModal').classList.add('active');
  }
}

// Function to close modal
function closeModal() {
  document.getElementById('classModal').classList.remove('active');
  // Restore body scrolling
  document.body.style.overflow = '';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Set current date
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('todayDate').textContent = today.toLocaleDateString('en-US', options);

  // Student selector functionality
  const studentSelect = document.getElementById('studentSelect');
  studentSelect.addEventListener('change', function() {
    loadScheduleData(this.value);
  });

  // Modal close functionality
  const modalClose = document.getElementById('modalClose');
  modalClose.addEventListener('click', closeModal);

  // Close modal with Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  });

  // Close modal when clicking outside
  const modal = document.getElementById('classModal');
  modal.addEventListener('click', function(event) {
    if (event.target === this) {
      closeModal();
    }
  });

  // View buttons functionality
  const tableViewBtn = document.getElementById('tableViewBtn');
  const listViewBtn = document.getElementById('listViewBtn');
  
  tableViewBtn.addEventListener('click', () => switchView('table'));
  listViewBtn.addEventListener('click', () => switchView('list'));

  // Handle view type change
  document.getElementById('viewType').addEventListener('change', function() {
    if (this.value === 'Weekly View') {
      switchView('table');
    } else {
      switchView('list');
    }
  });

  // Initialize the page with schedule data
  loadScheduleData('hadassa');
});