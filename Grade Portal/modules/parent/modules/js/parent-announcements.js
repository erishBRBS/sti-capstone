// Announcements Page JavaScript

// Announcements data
const announcementsData = [
  {
    id: 1,
    title: "Graduation Ceremony Schedule and Office Hours Adjustment",
    category: "important",
    priority: "high",
    date: "2025-06-20",
    excerpt: "In celebration of our Senior High School and Tertiary students' graduation, all office transactions will be suspended tomorrow, July 3, 2025.",
    content: `
      <p>In celebration of our Senior High School and Tertiary students' graduation, all office transactions will be suspended tomorrow, July 3, 2025.</p>
      <p><strong>Office Transactions will resume on Friday, July 4, 2025:</strong></p>
      <ul>
        <li>ADMISSIONS OFFICE - 8AM-5PM</li>
        <li>OTHER OFFICE TRANSACTIONS - 1PM - 5PM</li>
      </ul>
      <p>Thank you for your kind understanding and support as we honor this milestone with our graduates!</p>
      <p><strong>Happy Graduation!</strong></p>
    `,
    image: "",
    attachments: [
      { name: "Graduation Ceremony Program.pdf", type: "pdf" },
      { name: "Venue Map.jpg", type: "image" }
    ],
    read: false
  },
  {
    id: 2,
    title: "Midterm Examination Schedule - 2nd Term 2024-2025",
    category: "academic",
    priority: "high",
    date: "2025-06-18",
    excerpt: "Please be informed that the Midterm Examinations for the 2nd Term of School Year 2024-2025 will be held from October 15-19, 2025.",
    content: `
      <p>Please be informed that the Midterm Examinations for the 2nd Term of School Year 2024-2025 will be held from <strong>October 15-19, 2025</strong>.</p>
      <p><strong>Important Reminders:</strong></p>
      <ul>
        <li>Examinations will follow the regular class schedule</li>
        <li>Students must bring their school ID and examination permit</li>
        <li>Strict compliance with examination rules and regulations</li>
        <li>No special examinations will be given except for valid reasons</li>
      </ul>
      <p>Please ensure that your child is well-prepared for the examinations. For any concerns, please contact the Academic Office.</p>
    `,
    image: "",
    attachments: [
      { name: "Exam Schedule.pdf", type: "pdf" },
      { name: "Exam Guidelines.docx", type: "document" }
    ],
    read: true
  },
  {
    id: 3,
    title: "Parent-Teacher Conference Schedule",
    category: "academic",
    priority: "medium",
    date: "2025-06-15",
    excerpt: "We would like to invite all parents to the Parent-Teacher Conference scheduled on November 10-11, 2025.",
    content: `
      <p>We would like to invite all parents to the Parent-Teacher Conference scheduled on <strong>November 10-11, 2025</strong>.</p>
      <p><strong>Schedule:</strong></p>
      <ul>
        <li><strong>November 10, 2025</strong> - 8:00 AM to 5:00 PM</li>
        <li><strong>November 11, 2025</strong> - 8:00 AM to 12:00 NN</li>
      </ul>
      <p><strong>Venue:</strong> STI Bacoor Campus, 2nd Floor Conference Rooms</p>
      <p>This is a great opportunity to discuss your child's academic progress, concerns, and ways we can work together for their success.</p>
      <p>Please confirm your attendance by replying to this announcement or contacting the Registrar's Office.</p>
    `,
    image: "",
    attachments: [
      { name: "Conference Schedule.pdf", type: "pdf" }
    ],
    read: false
  },
  {
    id: 4,
    title: "STI Foundation Week Celebration",
    category: "event",
    priority: "medium",
    date: "2025-06-10",
    excerpt: "Join us in celebrating STI Foundation Week from August 12-16, 2025 with various activities and competitions.",
    content: `
      <p>Join us in celebrating <strong>STI Foundation Week from August 12-16, 2025</strong> with various activities and competitions.</p>
      <p><strong>Schedule of Activities:</strong></p>
      <ul>
        <li><strong>August 12</strong> - Opening Ceremony and Parade of Colors</li>
        <li><strong>August 13</strong> - Academic Competitions</li>
        <li><strong>August 14</strong> - Sports Fest</li>
        <li><strong>August 15</strong> - Talent Show and Cultural Night</li>
        <li><strong>August 16</strong> - Awarding Ceremony and Closing</li>
      </ul>
      <p>All students are encouraged to participate. Class suspensions will be observed during the celebration.</p>
      <p>For more information, please contact the Student Affairs Office.</p>
    `,
    image: "",
    attachments: [],
    read: true
  },
  {
    id: 5,
    title: "Library Hours Extension During Examination Week",
    category: "academic",
    priority: "medium",
    date: "2025-06-05",
    excerpt: "The library will extend its operating hours during the examination week to accommodate students' study needs.",
    content: `
      <p>The library will extend its operating hours during the examination week to accommodate students' study needs.</p>
      <p><strong>Extended Library Hours:</strong></p>
      <ul>
        <li><strong>Regular Days:</strong> 7:00 AM - 7:00 PM</li>
        <li><strong>Examination Week (October 15-19):</strong> 6:00 AM - 9:00 PM</li>
      </ul>
      <p><strong>Additional Services:</strong></p>
      <ul>
        <li>Quiet study areas</li>
        <li>Group discussion rooms (reservation required)</li>
        <li>Extended computer lab access</li>
        <li>Free printing of review materials (limited pages)</li>
      </ul>
      <p>We encourage students to take advantage of these extended hours for their examination preparations.</p>
    `,
    image: "",
    attachments: [
      { name: "Library Schedule.pdf", type: "pdf" }
    ],
    read: false
  }
];

// Function to format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Function to get category class
function getCategoryClass(category) {
  switch(category) {
    case 'important': return 'category-important';
    case 'academic': return 'category-academic';
    case 'event': return 'category-event';
    default: return 'category-general';
  }
}

// Function to get category label
function getCategoryLabel(category) {
  switch(category) {
    case 'important': return 'Important';
    case 'academic': return 'Academic';
    case 'event': return 'Event';
    default: return 'General';
  }
}

// Function to get priority class
function getPriorityClass(priority) {
  switch(priority) {
    case 'high': return 'priority-high';
    case 'medium': return 'priority-medium';
    case 'low': return 'priority-low';
    default: return 'priority-low';
  }
}

// Function to get priority icon
function getPriorityIcon(priority) {
  switch(priority) {
    case 'high': return 'fas fa-exclamation-circle';
    case 'medium': return 'fas fa-exclamation-triangle';
    case 'low': return 'fas fa-info-circle';
    default: return 'fas fa-info-circle';
  }
}

// Function to render announcements
function renderAnnouncements() {
  const container = document.getElementById('announcementsContainer');
  container.innerHTML = '';

  if (announcementsData.length === 0) {
    container.innerHTML = `
      <div class="no-announcements">
        <div class="no-announcements-icon">
          <i class="fas fa-bullhorn"></i>
        </div>
        <div class="no-announcements-title">No Announcements</div>
        <div class="no-announcements-text">There are no announcements at this time. Please check back later.</div>
      </div>
    `;
    return;
  }

  announcementsData.forEach(announcement => {
    const announcementElement = document.createElement('div');
    announcementElement.className = 'announcement-card';
    announcementElement.onclick = () => viewAnnouncement(announcement.id);

    announcementElement.innerHTML = `
      <div class="announcement-header">
        <div style="flex: 1;">
          <div class="announcement-title">${announcement.title}</div>
          <div class="announcement-meta">
            <span class="announcement-date">
              <i class="far fa-calendar"></i> ${formatDate(announcement.date)}
            </span>
            <span class="announcement-category ${getCategoryClass(announcement.category)}">
              ${getCategoryLabel(announcement.category)}
            </span>
            ${announcement.read ? '' : '<span style="color: #e74c3c; font-weight: 600;">NEW</span>'}
          </div>
        </div>
        <div class="announcement-priority ${getPriorityClass(announcement.priority)}">
          <i class="${getPriorityIcon(announcement.priority)}"></i>
          ${announcement.priority.toUpperCase()}
        </div>
      </div>
      <div class="announcement-content">
        <div class="announcement-excerpt">${announcement.excerpt}</div>
      </div>
      <div class="announcement-footer">
        <div class="announcement-actions">
          <button class="action-btn" onclick="event.stopPropagation(); markAsRead(${announcement.id})">
            <i class="far fa-check-circle"></i> Mark as Read
          </button>
          <button class="action-btn" onclick="event.stopPropagation(); shareAnnouncement(${announcement.id})">
            <i class="fas fa-share"></i> Share
          </button>
        </div>
        <a href="#" class="read-more" onclick="event.stopPropagation(); viewAnnouncement(${announcement.id})">
          Read More <i class="fas fa-chevron-right"></i>
        </a>
      </div>
    `;

    container.appendChild(announcementElement);
  });
}

// Function to view announcement details
function viewAnnouncement(id) {
  const announcement = announcementsData.find(a => a.id === id);
  if (!announcement) return;

  // Mark as read
  announcement.read = true;

  // Update modal content
  document.getElementById('modalTitle').textContent = announcement.title;
  
  // Set meta information
  document.getElementById('modalMeta').innerHTML = `
    <span><i class="far fa-calendar"></i> ${formatDate(announcement.date)}</span>
    <span class="announcement-category ${getCategoryClass(announcement.category)}">
      ${getCategoryLabel(announcement.category)}
    </span>
    <span class="announcement-priority ${getPriorityClass(announcement.priority)}">
      <i class="${getPriorityIcon(announcement.priority)}"></i>
      ${announcement.priority.toUpperCase()} PRIORITY
    </span>
  `;

  // Set content
  document.getElementById('modalContent').innerHTML = announcement.content;

  // Handle image
  const modalImage = document.getElementById('modalImage');
  if (announcement.image) {
    modalImage.src = announcement.image;
    modalImage.style.display = 'block';
  } else {
    modalImage.style.display = 'none';
  }

  // Handle attachments
  const attachmentsContainer = document.getElementById('modalAttachments');
  const attachmentList = document.getElementById('attachmentList');
  
  if (announcement.attachments && announcement.attachments.length > 0) {
    attachmentList.innerHTML = '';
    announcement.attachments.forEach(attachment => {
      const attachmentItem = document.createElement('a');
      attachmentItem.className = 'attachment-item';
      attachmentItem.href = '#';
      attachmentItem.innerHTML = `
        <i class="fas fa-file-${attachment.type} attachment-icon"></i>
        <span>${attachment.name}</span>
      `;
      attachmentList.appendChild(attachmentItem);
    });
    attachmentsContainer.style.display = 'block';
  } else {
    attachmentsContainer.style.display = 'none';
  }

  // Prevent body scrolling when modal is open
  document.body.style.overflow = 'hidden';
  document.getElementById('announcementModal').classList.add('active');
  
  // Re-render announcements to update read status
  renderAnnouncements();
}

// Function to close modal
function closeModal() {
  document.getElementById('announcementModal').classList.remove('active');
  // Restore body scrolling
  document.body.style.overflow = '';
}

// Function to mark announcement as read
function markAsRead(id) {
  const announcement = announcementsData.find(a => a.id === id);
  if (announcement) {
    announcement.read = true;
    renderAnnouncements();
  }
}

// Function to share announcement
function shareAnnouncement(id) {
  const announcement = announcementsData.find(a => a.id === id);
  if (announcement) {
    // In a real application, this would use the Web Share API or copy to clipboard
    alert(`Sharing: ${announcement.title}\n\nThis would open sharing options in a real application.`);
  }
}

// Function to load announcements
function loadAnnouncements(studentId) {
  // In a real application, this would fetch data based on the selected student
  renderAnnouncements();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Student selector functionality
  const studentSelect = document.getElementById('studentSelect');
  studentSelect.addEventListener('change', function() {
    loadAnnouncements(this.value);
  });

  // Modal functionality
  const modalClose = document.getElementById('modalClose');
  modalClose.addEventListener('click', closeModal);

  // Close modal with Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  });

  // Close modal when clicking outside
  const modal = document.getElementById('announcementModal');
  modal.addEventListener('click', function(event) {
    if (event.target === this) {
      closeModal();
    }
  });

  // Filter functionality
  const categoryFilter = document.getElementById('category');
  const priorityFilter = document.getElementById('priority');
  const dateRangeFilter = document.getElementById('dateRange');

  categoryFilter.addEventListener('change', function() {
    // In a real application, this would filter announcements
    console.log('Filtering by category:', this.value);
  });

  priorityFilter.addEventListener('change', function() {
    // In a real application, this would filter announcements
    console.log('Filtering by priority:', this.value);
  });

  dateRangeFilter.addEventListener('change', function() {
    // In a real application, this would filter announcements
    console.log('Filtering by date range:', this.value);
  });

  // Initialize the page with announcements data
  loadAnnouncements('hadassa');
});