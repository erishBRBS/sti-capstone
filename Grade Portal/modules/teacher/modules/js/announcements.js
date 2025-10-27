// Sample announcement data
let announcements = [
  {
    id: 1,
    title: "Midterm Examination Schedule",
    content: "The midterm examinations will be held from October 15 to October 19. Please check the examination schedule posted on the bulletin board. All students are required to bring their school ID and examination permit.",
    course: "WEB101",
    priority: "high",
    author: "John Doe",
    date: "2023-10-05T14:30:00",
    status: "active",
    pinned: true,
    attachments: [
      { name: "exam_schedule.pdf", size: "2.1 MB" }
    ],
    views: 142
  },
  {
    id: 2,
    title: "Project Submission Deadline Extended",
    content: "Due to multiple requests, the deadline for the final project submission has been extended to November 10. Please ensure your projects are properly documented and tested before submission.",
    course: "DB201",
    priority: "medium",
    author: "John Doe",
    date: "2023-10-03T09:15:00",
    status: "active",
    pinned: false,
    attachments: [],
    views: 89
  },
  {
    id: 3,
    title: "Laboratory Session Cancelled",
    content: "The laboratory session scheduled for tomorrow (October 6) has been cancelled due to maintenance work in the computer lab. We will reschedule the session next week.",
    course: "PROG101",
    priority: "medium",
    author: "John Doe",
    date: "2023-10-04T16:45:00",
    status: "active",
    pinned: false,
    attachments: [],
    views: 67
  },
  {
    id: 4,
    title: "Guest Lecture on Web Security",
    content: "We are pleased to announce a guest lecture on 'Modern Web Security Practices' by industry expert Ms. Sarah Johnson. The lecture will be held on October 12 at 2:00 PM in Room 301. Attendance is mandatory for all WEB101 students.",
    course: "WEB101",
    priority: "high",
    author: "John Doe",
    date: "2023-09-28T11:20:00",
    status: "active",
    pinned: true,
    attachments: [
      { name: "guest_lecture_details.pdf", size: "1.5 MB" }
    ],
    views: 123
  },
  {
    id: 5,
    title: "Database Design Competition",
    content: "The annual database design competition is now open for registration. Form teams of 2-3 students and submit your project proposals by October 20. Prizes include certificates and gift vouchers.",
    course: "DB201",
    priority: "low",
    author: "John Doe",
    date: "2023-09-25T13:10:00",
    status: "active",
    pinned: false,
    attachments: [
      { name: "competition_guidelines.pdf", size: "3.2 MB" },
      { name: "registration_form.docx", size: "0.5 MB" }
    ],
    views: 95
  },
  {
    id: 6,
    title: "Draft: New Course Materials",
    content: "New course materials for the advanced programming module will be available next week. These materials cover object-oriented programming concepts and design patterns.",
    course: "PROG101",
    priority: "medium",
    author: "John Doe",
    date: "2023-10-02T10:05:00",
    status: "draft",
    pinned: false,
    attachments: [],
    views: 0
  }
];

let filteredAnnouncements = [...announcements];
let currentPage = 1;
const itemsPerPage = 5;
let attachments = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  renderAnnouncements();
  setupEventListeners();
});

function setupEventListeners() {
  // Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      this.classList.add('active');
      document.getElementById(this.dataset.tab + 'Tab').classList.add('active');
    });
  });

  // Schedule announcement toggle
  document.getElementById('scheduleAnnouncement').addEventListener('change', function() {
    document.getElementById('scheduleFields').style.display = this.checked ? 'block' : 'none';
  });

  // File upload drag and drop
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  
  dropZone.addEventListener('click', () => {
    fileInput.click();
  });
  
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });
  
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  });

  // File input change
  fileInput.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  });

  // Form submission
  document.getElementById('announcementForm').addEventListener('submit', function(e) {
    e.preventDefault();
    createAnnouncement('active');
  });

  // Button event listeners
  document.getElementById('applyFiltersBtn').addEventListener('click', applyFilters);
  document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);
  document.getElementById('saveDraftBtn').addEventListener('click', saveAsDraft);
  document.getElementById('resetFormBtn').addEventListener('click', resetForm);
  document.getElementById('prevPageBtn').addEventListener('click', () => changePage('prev'));
  document.getElementById('nextPageBtn').addEventListener('click', () => changePage('next'));
  document.getElementById('closeAnnouncementModalBtn').addEventListener('click', closeAnnouncementModal);

  // Mobile menu
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.querySelector('.sidebar');
  
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
    
    document.addEventListener('click', (event) => {
      if (window.innerWidth < 992 && 
          !sidebar.contains(event.target) && 
          !menuToggle.contains(event.target) &&
          sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }
    });
  }

  // Dark mode toggle
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');

  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  }

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

function renderAnnouncements() {
  const container = document.getElementById('announcementsList');
  container.innerHTML = '';
  
  // Sort announcements: pinned first, then by date (newest first)
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date) - new Date(a.date);
  });
  
  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = sortedAnnouncements.slice(startIndex, endIndex);
  
  if (pageData.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-bullhorn"></i>
        <h3>No Announcements Found</h3>
        <p>No announcements match your current filters.</p>
        <button class="btn btn-primary" onclick="switchToCreateTab()">
          <i class="fas fa-plus"></i> Create Your First Announcement
        </button>
      </div>
    `;
    return;
  }
  
  pageData.forEach(announcement => {
    const announcementDate = new Date(announcement.date);
    const formattedDate = announcementDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const priorityClass = `priority-${announcement.priority}`;
    const priorityText = announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1);
    
    const card = document.createElement('div');
    card.className = `announcement-card ${announcement.pinned ? 'pinned-announcement' : ''}`;
    
    card.innerHTML = `
      <div class="announcement-header">
        <h3 class="announcement-title">
          ${announcement.title}
          ${announcement.priority !== 'medium' ? `<span class="priority-badge ${priorityClass}">${priorityText}</span>` : ''}
          ${announcement.pinned ? '<i class="fas fa-thumbtack" style="color: var(--accent-yellow); margin-left: 8px;"></i>' : ''}
          ${announcement.status === 'draft' ? '<span class="priority-badge priority-medium">Draft</span>' : ''}
        </h3>
        <div class="announcement-meta">
          <span><i class="fas fa-user"></i> ${announcement.author}</span>
          <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
          <span><i class="fas fa-eye"></i> ${announcement.views} views</span>
        </div>
      </div>
      <div class="announcement-body">
        <div class="announcement-content">
          ${announcement.content.length > 200 ? 
            announcement.content.substring(0, 200) + '...' : 
            announcement.content}
        </div>
        ${announcement.attachments.length > 0 ? `
          <div>
            <strong>Attachments:</strong>
            ${announcement.attachments.map(att => 
              `<div class="attachment-item">
                <div class="attachment-info">
                  <i class="fas fa-paperclip attachment-icon"></i>
                  <span>${att.name}</span>
                  <span style="font-size: 12px; color: var(--medium-gray);">(${att.size})</span>
                </div>
                <button class="action-btn" onclick="downloadAttachment(${announcement.id}, '${att.name}')">
                  <i class="fas fa-download"></i> Download
                </button>
              </div>`
            ).join('')}
          </div>
        ` : ''}
      </div>
      <div class="announcement-footer">
        <div>
          <span><i class="fas fa-book"></i> ${announcement.course}</span>
        </div>
        <div class="announcement-actions">
          <button class="action-btn" onclick="viewAnnouncement(${announcement.id})">
            <i class="fas fa-eye"></i> View
          </button>
          <button class="action-btn edit" onclick="editAnnouncement(${announcement.id})">
            <i class="fas fa-edit"></i> Edit
          </button>
          ${announcement.pinned ? 
            `<button class="action-btn" onclick="togglePinAnnouncement(${announcement.id})">
              <i class="fas fa-thumbtack"></i> Unpin
            </button>` :
            `<button class="action-btn pin" onclick="togglePinAnnouncement(${announcement.id})">
              <i class="fas fa-thumbtack"></i> Pin
            </button>`
          }
          <button class="action-btn delete" onclick="deleteAnnouncement(${announcement.id})">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    `;
    
    container.appendChild(card);
  });
  
  updatePagination();
}

function updatePagination() {
  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  const paginationContainer = document.getElementById('paginationNumbers');
  
  paginationContainer.innerHTML = '';
  
  // Add page number buttons
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
    btn.textContent = i;
    btn.onclick = () => {
      currentPage = i;
      renderAnnouncements();
    };
    paginationContainer.appendChild(btn);
  }
}

function changePage(direction) {
  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  
  if (direction === 'prev' && currentPage > 1) {
    currentPage--;
  } else if (direction === 'next' && currentPage < totalPages) {
    currentPage++;
  }
  
  renderAnnouncements();
}

function applyFilters() {
  const course = document.getElementById('courseFilter').value;
  const status = document.getElementById('statusFilter').value;
  const search = document.getElementById('searchAnnouncements').value.toLowerCase();
  
  filteredAnnouncements = announcements.filter(announcement => {
    // Filter by course
    if (course && announcement.course !== course) return false;
    
    // Filter by status
    if (status && announcement.status !== status) return false;
    
    // Filter by search term
    if (search && 
        !announcement.title.toLowerCase().includes(search) && 
        !announcement.content.toLowerCase().includes(search)) {
      return false;
    }
    
    return true;
  });
  
  currentPage = 1;
  renderAnnouncements();
}

function resetFilters() {
  document.getElementById('courseFilter').value = '';
  document.getElementById('statusFilter').value = '';
  document.getElementById('searchAnnouncements').value = '';
  
  filteredAnnouncements = [...announcements];
  currentPage = 1;
  renderAnnouncements();
}

function switchToCreateTab() {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  
  document.querySelector('.tab[data-tab="create"]').classList.add('active');
  document.getElementById('createTab').classList.add('active');
}

function handleFiles(files) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // Validate file type
    const validTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(fileExt)) {
      alert(`Invalid file type: ${file.name}. Please upload PDF, DOC, DOCX, JPG, or PNG files.`);
      continue;
    }
    
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert(`File size exceeds 10MB limit: ${file.name}`);
      continue;
    }
    
    attachments.push({
      name: file.name,
      size: formatFileSize(file.size),
      file: file
    });
  }
  
  renderAttachments();
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function renderAttachments() {
  const container = document.getElementById('attachmentList');
  container.innerHTML = '';
  
  if (attachments.length === 0) {
    container.innerHTML = '<p style="color: var(--medium-gray); font-size: 14px;">No attachments added</p>';
    return;
  }
  
  attachments.forEach((attachment, index) => {
    const item = document.createElement('div');
    item.className = 'attachment-item';
    item.innerHTML = `
      <div class="attachment-info">
        <i class="fas fa-paperclip attachment-icon"></i>
        <span>${attachment.name}</span>
        <span style="font-size: 12px; color: var(--medium-gray);">(${attachment.size})</span>
      </div>
      <button class="attachment-remove" onclick="removeAttachment(${index})">
        <i class="fas fa-times"></i>
      </button>
    `;
    container.appendChild(item);
  });
}

function removeAttachment(index) {
  attachments.splice(index, 1);
  renderAttachments();
}

function createAnnouncement(status) {
  const title = document.getElementById('announcementTitle').value;
  const course = document.getElementById('announcementCourse').value;
  const priority = document.getElementById('announcementPriority').value;
  const content = document.getElementById('announcementContent').value;
  const pinned = document.getElementById('pinAnnouncement').checked;
  
  if (!title || !course || !content) {
    alert('Please fill in all required fields');
    return;
  }
  
  const newAnnouncement = {
    id: announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) + 1 : 1,
    title,
    content,
    course,
    priority,
    author: 'John Doe',
    date: new Date().toISOString(),
    status,
    pinned,
    attachments: attachments.map(att => ({
      name: att.name,
      size: att.size
    })),
    views: 0
  };
  
  announcements.unshift(newAnnouncement);
  filteredAnnouncements = [...announcements];
  
  // Show success message
  const alert = document.createElement('div');
  alert.className = 'alert alert-success';
  alert.innerHTML = `
    <i class="fas fa-check-circle" style="font-size: 20px;"></i>
    <div>
      <strong>Success!</strong> Announcement has been ${status === 'active' ? 'published' : 'saved as draft'}.
    </div>
  `;
  
  document.querySelector('.dashboard').insertBefore(alert, document.querySelector('.dashboard').firstChild);
  
  setTimeout(() => alert.remove(), 5000);
  
  // Reset form and switch to view tab
  resetForm();
  document.querySelector('.tab[data-tab="view"]').click();
  renderAnnouncements();
}

function saveAsDraft() {
  createAnnouncement('draft');
}

function resetForm() {
  document.getElementById('announcementForm').reset();
  document.getElementById('scheduleFields').style.display = 'none';
  attachments = [];
  renderAttachments();
}

function viewAnnouncement(id) {
  const announcement = announcements.find(a => a.id === id);
  if (!announcement) return;
  
  // Increment views
  announcement.views++;
  
  const modalBody = document.getElementById('announcementModalBody');
  const announcementDate = new Date(announcement.date);
  const formattedDate = announcementDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const priorityClass = `priority-${announcement.priority}`;
  const priorityText = announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1);
  
  modalBody.innerHTML = `
    <div class="announcement-header">
      <h3 class="announcement-title">
        ${announcement.title}
        ${announcement.priority !== 'medium' ? `<span class="priority-badge ${priorityClass}">${priorityText}</span>` : ''}
        ${announcement.pinned ? '<i class="fas fa-thumbtack" style="color: var(--accent-yellow); margin-left: 8px;"></i>' : ''}
        ${announcement.status === 'draft' ? '<span class="priority-badge priority-medium">Draft</span>' : ''}
      </h3>
      <div class="announcement-meta">
        <span><i class="fas fa-user"></i> ${announcement.author}</span>
        <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
        <span><i class="fas fa-eye"></i> ${announcement.views} views</span>
      </div>
    </div>
    <div class="announcement-body">
      <div class="announcement-content" style="white-space: pre-line;">${announcement.content}</div>
      ${announcement.attachments.length > 0 ? `
        <div>
          <strong>Attachments:</strong>
          ${announcement.attachments.map(att => 
            `<div class="attachment-item">
              <div class="attachment-info">
                <i class="fas fa-paperclip attachment-icon"></i>
                <span>${att.name}</span>
                <span style="font-size: 12px; color: var(--medium-gray);">(${att.size})</span>
              </div>
              <button class="action-btn" onclick="downloadAttachment(${announcement.id}, '${att.name}')">
                <i class="fas fa-download"></i> Download
              </button>
            </div>`
          ).join('')}
        </div>
      ` : ''}
    </div>
    <div class="announcement-footer">
      <div>
        <span><i class="fas fa-book"></i> ${announcement.course}</span>
      </div>
      <div class="announcement-actions">
        <button class="action-btn" onclick="closeAnnouncementModal()">
          <i class="fas fa-times"></i> Close
        </button>
      </div>
    </div>
  `;
  
  document.getElementById('announcementModal').classList.add('active');
}

function closeAnnouncementModal() {
  document.getElementById('announcementModal').classList.remove('active');
}

function editAnnouncement(id) {
  alert(`Edit functionality for announcement ${id} would open here.`);
  // In a real application, this would populate the create form with the announcement data
}

function togglePinAnnouncement(id) {
  const announcement = announcements.find(a => a.id === id);
  if (announcement) {
    announcement.pinned = !announcement.pinned;
    renderAnnouncements();
    
    // Show notification
    const alert = document.createElement('div');
    alert.className = 'alert alert-info';
    alert.innerHTML = `
      <i class="fas fa-info-circle" style="font-size: 20px;"></i>
      <div>
        <strong>Announcement ${announcement.pinned ? 'pinned' : 'unpinned'}!</strong>
      </div>
    `;
    
    document.querySelector('.dashboard').insertBefore(alert, document.querySelector('.dashboard').firstChild);
    
    setTimeout(() => alert.remove(), 3000);
  }
}

function deleteAnnouncement(id) {
  if (confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
    announcements = announcements.filter(a => a.id !== id);
    filteredAnnouncements = [...announcements];
    renderAnnouncements();
    
    // Show notification
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.innerHTML = `
      <i class="fas fa-check-circle" style="font-size: 20px;"></i>
      <div>
        <strong>Announcement deleted successfully!</strong>
      </div>
    `;
    
    document.querySelector('.dashboard').insertBefore(alert, document.querySelector('.dashboard').firstChild);
    
    setTimeout(() => alert.remove(), 3000);
  }
}

function downloadAttachment(announcementId, fileName) {
  alert(`Downloading ${fileName} for announcement ${announcementId}`);
  // In a real application, this would initiate a file download
}