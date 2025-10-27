// Grades Page JavaScript

// Grade data
const gradesData = {
  current: [
    {
      subject: "Information Assurance & Security",
      professor: "Joshua Guevarra",
      prelim: "82.00",
      midterm: "78.50",
      finals: "80.00",
      finalGrade: "80.00",
      status: "In Progress",
      schedule: "Monday 2:00PM - 5:00PM",
      room: "212",
      units: "3",
      breakdown: [
        { component: "Quizzes", percentage: "20%", score: "85%" },
        { component: "Projects", percentage: "30%", score: "78%" },
        { component: "Exams", percentage: "40%", score: "82%" },
        { component: "Participation", percentage: "10%", score: "75%" }
      ]
    },
    {
      subject: "Web Systems & Technologies",
      professor: "Enrico Enerlan",
      prelim: "88.00",
      midterm: "85.50",
      finals: "",
      finalGrade: "85.50",
      status: "In Progress",
      schedule: "Monday 10:00AM - 1:00PM, Saturday 1:00PM - 3:00PM",
      room: "L3, 206",
      units: "3",
      breakdown: [
        { component: "Quizzes", percentage: "15%", score: "90%" },
        { component: "Projects", percentage: "35%", score: "82%" },
        { component: "Exams", percentage: "40%", score: "85%" },
        { component: "Laboratory", percentage: "10%", score: "88%" }
      ]
    },
    {
      subject: "Mobile Systems and Technologies",
      professor: "Junkate Lindon Bernabe",
      prelim: "85.00",
      midterm: "",
      finals: "",
      finalGrade: "85.00",
      status: "In Progress",
      schedule: "Monday 7:00AM - 9:00AM, Friday 10:00AM - 1:00PM",
      room: "LIB2, L1",
      units: "3",
      breakdown: [
        { component: "Quizzes", percentage: "20%", score: "88%" },
        { component: "Projects", percentage: "30%", score: "80%" },
        { component: "Exams", percentage: "40%", score: "85%" },
        { component: "Lab Exercises", percentage: "10%", score: "87%" }
      ]
    },
    {
      subject: "Management Information Systems",
      professor: "Enrico Enerlan",
      prelim: "90.00",
      midterm: "87.50",
      finals: "",
      finalGrade: "87.50",
      status: "In Progress",
      schedule: "Tuesday-Thursday 8:30AM - 10:00AM",
      room: "218-A",
      units: "3",
      breakdown: [
        { component: "Quizzes", percentage: "15%", score: "92%" },
        { component: "Case Studies", percentage: "25%", score: "85%" },
        { component: "Exams", percentage: "50%", score: "87%" },
        { component: "Class Participation", percentage: "10%", score: "90%" }
      ]
    },
    {
      subject: "Great Books",
      professor: "Luzvie Mae Manalaysay",
      prelim: "92.00",
      midterm: "89.00",
      finals: "",
      finalGrade: "89.00",
      status: "In Progress",
      schedule: "Tuesday-Thursday 7:00AM - 8:30AM",
      room: "218-A",
      units: "3",
      breakdown: [
        { component: "Reading Responses", percentage: "30%", score: "95%" },
        { component: "Essays", percentage: "40%", score: "85%" },
        { component: "Exams", percentage: "20%", score: "89%" },
        { component: "Class Participation", percentage: "10%", score: "92%" }
      ]
    },
    {
      subject: "IT Capstone Project 1",
      professor: "Rocelle Camposagrado",
      prelim: "",
      midterm: "",
      finals: "",
      finalGrade: "",
      status: "In Progress",
      schedule: "Friday 3:00PM - 5:00PM",
      room: "212",
      units: "3",
      breakdown: [
        { component: "Proposal", percentage: "20%", score: "" },
        { component: "Progress Report", percentage: "30%", score: "" },
        { component: "Final Paper", percentage: "40%", score: "" },
        { component: "Presentation", percentage: "10%", score: "" }
      ]
    }
  ],
  previous: [
    {
      subject: "Programming Fundamentals",
      professor: "Maria Santos",
      prelim: "85.00",
      midterm: "82.50",
      finals: "84.00",
      finalGrade: "84.00",
      status: "Passed",
      schedule: "MWF 1:00PM - 2:30PM",
      room: "402",
      units: "3",
      breakdown: [
        { component: "Quizzes", percentage: "20%", score: "88%" },
        { component: "Projects", percentage: "30%", score: "80%" },
        { component: "Exams", percentage: "40%", score: "84%" },
        { component: "Lab Exercises", percentage: "10%", score: "85%" }
      ]
    },
    {
      subject: "Database Management",
      professor: "Carlos Reyes",
      prelim: "88.00",
      midterm: "85.00",
      finals: "87.50",
      finalGrade: "87.50",
      status: "Passed",
      schedule: "MTH 10:00AM - 11:30AM",
      room: "205",
      units: "3",
      breakdown: [
        { component: "Quizzes", percentage: "15%", score: "90%" },
        { component: "Projects", percentage: "35%", score: "85%" },
        { component: "Exams", percentage: "40%", score: "87%" },
        { component: "Lab Exercises", percentage: "10%", score: "88%" }
      ]
    }
  ]
};

// Function to determine grade class for styling
function getGradeClass(grade) {
  if (!grade || grade === "") return "";
  
  const numGrade = parseFloat(grade);
  if (numGrade >= 90) return "grade-excellent";
  if (numGrade >= 80) return "grade-good";
  if (numGrade >= 75) return "grade-average";
  return "grade-poor";
}

// Function to determine status class for styling
function getStatusClass(status) {
  if (status === "Passed") return "status-passed";
  if (status === "Failed") return "status-failed";
  return "status-inprogress";
}

// Function to render grades table
function renderGradesTable(containerId, data) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  data.forEach((grade, index) => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>
        <div class="subject-name">${grade.subject}</div>
      </td>
      <td>
        <div class="professor-name">${grade.professor}</div>
      </td>
      <td>
        <div class="grade-value ${getGradeClass(grade.prelim)}">${grade.prelim || '-'}</div>
      </td>
      <td>
        <div class="grade-value ${getGradeClass(grade.midterm)}">${grade.midterm || '-'}</div>
      </td>
      <td>
        <div class="grade-value ${getGradeClass(grade.finals)}">${grade.finals || '-'}</div>
      </td>
      <td>
        <div class="grade-value ${getGradeClass(grade.finalGrade)}">${grade.finalGrade || '-'}</div>
      </td>
      <td>
        <span class="grade-status ${getStatusClass(grade.status)}">${grade.status}</span>
      </td>
      <td>
        <button class="view-details-btn" onclick="viewGradeDetails(${index}, '${containerId}')">
          <i class="fas fa-eye"></i> Details
        </button>
      </td>
    `;
    
    container.appendChild(row);
  });
}

// Function to load grades data
function loadGradesData(studentId) {
  // In a real application, this would fetch data based on the selected student
  // For now, we'll just use the sample data
  renderGradesTable('gradesBody', gradesData.current);
  renderGradesTable('previousGradesBody', gradesData.previous);
}

// Function to view grade details
function viewGradeDetails(index, containerId) {
  const data = containerId === 'gradesBody' ? gradesData.current : gradesData.previous;
  const grade = data[index];
  
  document.getElementById('subjectName').textContent = grade.subject;
  document.getElementById('professorName').textContent = grade.professor;
  document.getElementById('subjectSchedule').textContent = grade.schedule;
  document.getElementById('subjectRoom').textContent = grade.room;
  document.getElementById('subjectUnits').textContent = grade.units;
  document.getElementById('finalGrade').textContent = grade.finalGrade || 'Not yet available';
  document.getElementById('gradeStatus').innerHTML = `<span class="grade-status ${getStatusClass(grade.status)}">${grade.status}</span>`;
  
  // Render grade breakdown
  const breakdownBody = document.getElementById('breakdownBody');
  breakdownBody.innerHTML = '';
  
  grade.breakdown.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.component}</td>
      <td>${item.percentage}</td>
      <td>${item.score || 'Not yet available'}</td>
    `;
    breakdownBody.appendChild(row);
  });
  
  // Prevent body scrolling when modal is open
  document.body.style.overflow = 'hidden';
  document.getElementById('gradeModal').classList.add('active');
}

// Function to close modal
function closeModal() {
  document.getElementById('gradeModal').classList.remove('active');
  // Restore body scrolling
  document.body.style.overflow = '';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Student selector functionality
  const studentSelect = document.getElementById('studentSelect');
  studentSelect.addEventListener('change', function() {
    loadGradesData(this.value);
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
  const modal = document.getElementById('gradeModal');
  modal.addEventListener('click', function(event) {
    if (event.target === this) {
      closeModal();
    }
  });

  // Initialize the page with grades data
  loadGradesData('hadassa');
});