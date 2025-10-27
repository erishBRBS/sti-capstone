// announcements.js
// Clean UI behaviors for announcements dashboard

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

/* ---------- App initialization ---------- */
function initializeApp() {
  setupEventListeners();
  renderAnnouncements();
  updateStats();
}

/* ---------- Data ---------- */
let announcements = [
  {
    id: 1,
    title: "Enrollment for Second Semester Opens",
    content: "Enrollment for the Second Semester 2024-2025 will begin on October 15, 2024. Please prepare your documents and visit the Registrar's Office during office hours. Early enrollment is encouraged to secure your preferred schedule.",
    priority: "urgent",
    audience: ["students"],
    author: "Admin User",
    date: "2024-10-01",
    status: "active",
    pinned: true,
    views: 1247,
    attachments: [
      {
        name: "enrollment-schedule.jpg",
        type: "image/jpeg",
        url: "https://via.placeholder.com/400x300/1a4b8c/ffffff?text=Enrollment+Schedule"
      }
    ]
  },
  {
    id: 2,
    title: "Faculty Meeting - October 10",
    content: "All faculty members are required to attend the monthly faculty meeting on October 10, 2024, at 2:00 PM in the Conference Room. Agenda includes curriculum updates and semester planning.",
    priority: "high",
    audience: ["teachers"],
    author: "Admin User",
    date: "2024-09-28",
    status: "active",
    pinned: false,
    views: 89,
    attachments: []
  },
  {
    id: 3,
    title: "Student Organization Fair - October 20",
    content: "Join us for the Student Organization Fair on October 20! All registered student organizations can set up booths to showcase activities and recruit new members. Registration deadline: October 15.",
    priority: "normal",
    audience: ["students", "organizations"],
    author: "Admin User",
    date: "2024-09-25",
    status: "active",
    pinned: true,
    views: 856,
    attachments: [
      {
        name: "organization-fair-poster.jpg",
        type: "image/jpeg",
        url: "https://via.placeholder.com/400x600/2d68b8/ffffff?text=Organization+Fair"
      },
      {
        name: "fair-preview.mp4",
        type: "video/mp4",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      }
    ]
  },
  {
    id: 4,
    title: "System Maintenance Notice",
    content: "The student portal will undergo scheduled maintenance on October 5, 2024, from 12:00 AM to 4:00 AM. All online services will be temporarily unavailable during this period.",
    priority: "high",
    audience: ["students", "teachers", "staff"],
    author: "Admin User",
    date: "2024-09-30",
    status: "active",
    pinned: false,
    views: 2134,
    attachments: []
  },
  {
    id: 5,
    title: "Library Extended Hours During Finals",
    content: "The library will extend its operating hours during the final examination period. Hours will be 7:00 AM to 10:00 PM from October 25 to November 5. Study rooms are available for reservation.",
    priority: "normal",
    audience: ["students"],
    author: "Admin User",
    date: "2024-09-22",
    status: "active",
    pinned: false,
    views: 634,
    attachments: [
      {
        name: "library-hours.jpg",
        type: "image/jpeg",
        url: "https://via.placeholder.com/400x300/43a047/ffffff?text=Library+Hours"
      }
    ]
  }
];

let currentEditId = null;
let currentAttachments = [];

/* ---------- Event listeners ---------- */
function setupEventListeners() {
  // Search and filter events
  const searchInput = document.getElementById('searchAnnouncement');
  const filterPriority = document.getElementById('filterPriority');
  const filterAudience = document.getElementById('filterAudience');
  const filterStatus = document.getElementById('filterStatus');
  
  if (searchInput) searchInput.addEventListener('input', filterAnnouncements);
  if (filterPriority) filterPriority.addEventListener('change', filterAnnouncements);
  if (filterAudience) filterAudience.addEventListener('change', filterAnnouncements);
  if (filterStatus) filterStatus.addEventListener('change', filterAnnouncements);
  
  // Form submission
  const announcementForm = document.getElementById('announcementForm');
  if (announcementForm) {
    announcementForm.addEventListener('submit', function(e) {
      e.preventDefault();
      submitAnnouncement();
    });
  }
  
  // File input handler
  const fileInput = document.getElementById('fileInput');
  if (fileInput) {
    fileInput.addEventListener('change', handleFileSelect);
  }
  
  // Button events
  const createBtn = document.getElementById('createAnnouncementBtn');
  if (createBtn) createBtn.addEventListener('click', openCreateModal);
  
  const closeModalBtn = document.getElementById('closeAnnouncementModalBtn');
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeAnnouncementModal);
  
  const cancelBtn = document.getElementById('cancelAnnouncementBtn');
  if (cancelBtn) cancelBtn.addEventListener('click', closeAnnouncementModal);
  
  const closeViewBtn = document.getElementById('closeViewModalBtn');
  if (closeViewBtn) closeViewBtn.addEventListener('click', closeViewModal);
  
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetFilters);
  
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
  
  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  
  if (themeToggle && themeIcon) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
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
  
  // Close modals with Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeAnnouncementModal();
      closeViewModal();
    }
  });
  
  // Close modals on outside click
  document.addEventListener('click', function(e) {
    const modals = ['announcementModal', 'viewModal'];
    modals.forEach(modalId => {
      const modal = document.getElementById(modalId);
      if (modal && e.target === modal) {
        if (modalId === 'announcementModal') closeAnnouncementModal();
        if (modalId === 'viewModal') closeViewModal();
      }
    });
  });
}

/* ---------- File handling ---------- */
function handleFileSelect(event) {
  const files = event.target.files;
  const previewContainer = document.getElementById('attachmentPreview');
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // Check if file is image or video
    if (!file.type.match('image.*') && !file.type.match('video.*')) {
      showNotification('Only image and video files are allowed', 'error');
      continue;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showNotification('File size must be less than 10MB', 'error');
      continue;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const attachment = {
        name: file.name,
        type: file.type,
        url: e.target.result,
        file: file
      };
      
      currentAttachments.push(attachment);
      renderAttachmentPreview();
    };
    
    reader.readAsDataURL(file);
  }
  
  // Reset file input
  event.target.value = '';
}

function renderAttachmentPreview() {
  const previewContainer = document.getElementById('attachmentPreview');
  if (!previewContainer) return;
  
  previewContainer.innerHTML = '';
  
  currentAttachments.forEach((attachment, index) => {
    const attachmentItem = document.createElement('div');
    attachmentItem.className = 'attachment-item';
    
    if (attachment.type.startsWith('image/')) {
      attachmentItem.innerHTML = `
        <img src="${attachment.url}" alt="${attachment.name}">
        <button type="button" class="remove-attachment" onclick="removeAttachment(${index})">
          <i class="fas fa-times"></i>
        </button>
      `;
    } else if (attachment.type.startsWith('video/')) {
      attachmentItem.innerHTML = `
        <video controls>
          <source src="${attachment.url}" type="${attachment.type}">
          Your browser does not support the video tag.
        </video>
        <button type="button" class="remove-attachment" onclick="removeAttachment(${index})">
          <i class="fas fa-times"></i>
        </button>
      `;
    } else {
      attachmentItem.innerHTML = `
        <div class="file-icon">
          <i class="fas fa-file"></i>
          <span class="file-name">${attachment.name}</span>
        </div>
        <button type="button" class="remove-attachment" onclick="removeAttachment(${index})">
          <i class="fas fa-times"></i>
        </button>
      `;
    }
    
    previewContainer.appendChild(attachmentItem);
  });
}

function removeAttachment(index) {
  currentAttachments.splice(index, 1);
  renderAttachmentPreview();
}

/* ---------- Announcement rendering ---------- */
function renderAnnouncements(data = announcements) {
  const announcementsList = document.getElementById('announcementsList');
  if (!announcementsList) return;
  
  if (data.length === 0) {
    announcementsList.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--medium-gray);">No announcements found matching your filters.</p>';
    return;
  }
  
  // Sort: pinned first, then by date
  const sortedData = [...data].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date) - new Date(a.date);
  });
  
  announcementsList.innerHTML = sortedData.map(ann => `
    <div class="announcement-item ${ann.pinned ? 'pinned' : ''}">
      ${ann.pinned ? '<i class="fas fa-thumbtack pin-icon"></i>' : ''}
      <div class="announcement-header">
        <div>
          <h3 class="announcement-title">${ann.title}</h3>
          <div class="announcement-meta">
            <span><i class="fas fa-user"></i> ${ann.author}</span>
            <span><i class="fas fa-calendar"></i> ${formatDate(ann.date)}</span>
            <span class="priority-badge priority-${ann.priority}">${capitalizeFirst(ann.priority)}</span>
            ${ann.audience.map(aud => `<span class="audience-badge">${capitalizeFirst(aud)}</span>`).join('')}
            <span><i class="fas fa-eye"></i> ${ann.views} views</span>
            ${ann.attachments && ann.attachments.length > 0 ? `<span><i class="fas fa-paperclip"></i> ${ann.attachments.length} attachment(s)</span>` : ''}
          </div>
        </div>
      </div>
      
      <div class="announcement-content">
        <p>${ann.content.length > 200 ? ann.content.substring(0, 200) + '...' : ann.content}</p>
      </div>
      
      ${ann.attachments && ann.attachments.length > 0 ? `
        <div class="attachments-display">
          ${ann.attachments.map(att => {
            if (att.type.startsWith('image/')) {
              return `<div class="attachment-item"><img src="${att.url}" alt="${att.name}"></div>`;
            } else if (att.type.startsWith('video/')) {
              return `<div class="attachment-item"><video controls><source src="${att.url}" type="${att.type}">Your browser does not support the video tag.</video></div>`;
            } else {
              return `<div class="attachment-item"><div class="file-icon"><i class="fas fa-file"></i><span class="file-name">${att.name}</span></div></div>`;
            }
          }).join('')}
        </div>
      ` : ''}
      
      <div class="announcement-actions">
        <button class="btn btn-primary btn-sm" onclick="viewAnnouncement(${ann.id})">
          <i class="fas fa-eye"></i> View Details
        </button>
        <button class="btn btn-secondary btn-sm" onclick="editAnnouncement(${ann.id})">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn-${ann.pinned ? 'warning' : 'success'} btn-sm" onclick="togglePin(${ann.id})">
          <i class="fas fa-thumbtack"></i> ${ann.pinned ? 'Unpin' : 'Pin'}
        </button>
        <button class="btn btn-danger btn-sm" onclick="deleteAnnouncement(${ann.id})">
          <i class="fas fa-trash"></i> Delete
        </button>
        
        <div class="status-toggle">
          <span style="font-size: 13px; color: var(--medium-gray);">${ann.status === 'active' ? 'Active' : 'Inactive'}</span>
          <div class="toggle-switch ${ann.status === 'active' ? 'active' : ''}" onclick="toggleStatus(${ann.id})">
            <div class="toggle-slider"></div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

/* ---------- Stats ---------- */
function updateStats() {
  const totalAnnouncements = document.getElementById('totalAnnouncements');
  const activeAnnouncements = document.getElementById('activeAnnouncements');
  const pinnedAnnouncements = document.getElementById('pinnedAnnouncements');
  const totalViews = document.getElementById('totalViews');
  
  if (totalAnnouncements) totalAnnouncements.textContent = announcements.length;
  if (activeAnnouncements) activeAnnouncements.textContent = announcements.filter(a => a.status === 'active').length;
  if (pinnedAnnouncements) pinnedAnnouncements.textContent = announcements.filter(a => a.pinned).length;
  if (totalViews) totalViews.textContent = announcements.reduce((sum, a) => sum + a.views, 0).toLocaleString();
}

/* ---------- Filtering ---------- */
function filterAnnouncements() {
  const searchTerm = document.getElementById('searchAnnouncement').value.toLowerCase();
  const priority = document.getElementById('filterPriority').value;
  const audience = document.getElementById('filterAudience').value;
  const status = document.getElementById('filterStatus').value;
  
  let filtered = announcements;
  
  if (searchTerm) {
    filtered = filtered.filter(a => 
      a.title.toLowerCase().includes(searchTerm) ||
      a.content.toLowerCase().includes(searchTerm) ||
      a.author.toLowerCase().includes(searchTerm)
    );
  }
  
  if (priority !== 'all') {
    filtered = filtered.filter(a => a.priority === priority);
  }
  
  if (audience !== 'all') {
    filtered = filtered.filter(a => a.audience.includes(audience));
  }
  
  if (status !== 'all') {
    filtered = filtered.filter(a => a.status === status);
  }
  
  renderAnnouncements(filtered);
}

function resetFilters() {
  document.getElementById('searchAnnouncement').value = '';
  document.getElementById('filterPriority').value = 'all';
  document.getElementById('filterAudience').value = 'all';
  document.getElementById('filterStatus').value = 'all';
  renderAnnouncements();
}

/* ---------- Modal management ---------- */
function openCreateModal() {
  currentEditId = null;
  currentAttachments = [];
  document.getElementById('modalTitle').textContent = 'Create Announcement';
  document.getElementById('submitBtnText').textContent = 'Publish Announcement';
  document.getElementById('announcementForm').reset();
  document.querySelector('input[name="audience"][value="students"]').checked = true;
  document.getElementById('attachmentPreview').innerHTML = '';
  document.getElementById('announcementModal').classList.add('active');
}

function closeAnnouncementModal() {
  document.getElementById('announcementModal').classList.remove('active');
  currentEditId = null;
  currentAttachments = [];
}

function editAnnouncement(id) {
  const announcement = announcements.find(a => a.id === id);
  if (!announcement) return;
  
  currentEditId = id;
  currentAttachments = [...announcement.attachments];
  document.getElementById('modalTitle').textContent = 'Edit Announcement';
  document.getElementById('submitBtnText').textContent = 'Update Announcement';
  
  document.getElementById('announcementTitle').value = announcement.title;
  document.getElementById('announcementContent').value = announcement.content;
  document.getElementById('announcementPriority').value = announcement.priority;
  document.getElementById('pinAnnouncement').checked = announcement.pinned;
  
  // Set audience checkboxes
  document.querySelectorAll('input[name="audience"]').forEach(cb => {
    cb.checked = announcement.audience.includes(cb.value);
  });
  
  renderAttachmentPreview();
  document.getElementById('announcementModal').classList.add('active');
}

function submitAnnouncement() {
  const title = document.getElementById('announcementTitle').value.trim();
  const content = document.getElementById('announcementContent').value.trim();
  const priority = document.getElementById('announcementPriority').value;
  const pinned = document.getElementById('pinAnnouncement').checked;
  
  const selectedAudiences = Array.from(document.querySelectorAll('input[name="audience"]:checked'))
    .map(cb => cb.value);
  
  if (!title || !content) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }
  
  if (selectedAudiences.length === 0) {
    showNotification('Please select at least one target audience', 'error');
    return;
  }
  
  if (currentEditId) {
    // Update existing
    const announcement = announcements.find(a => a.id === currentEditId);
    if (announcement) {
      announcement.title = title;
      announcement.content = content;
      announcement.priority = priority;
      announcement.audience = selectedAudiences;
      announcement.pinned = pinned;
      announcement.attachments = [...currentAttachments];
    }
    showNotification('Announcement updated successfully!', 'success');
  } else {
    // Create new
    const newAnnouncement = {
      id: announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) + 1 : 1,
      title: title,
      content: content,
      priority: priority,
      audience: selectedAudiences,
      author: 'Admin User',
      date: new Date().toISOString().split('T')[0],
      status: 'active',
      pinned: pinned,
      views: 0,
      attachments: [...currentAttachments]
    };
    announcements.unshift(newAnnouncement);
    showNotification('Announcement created successfully!', 'success');
  }
  
  renderAnnouncements();
  updateStats();
  closeAnnouncementModal();
}

/* ---------- View announcement ---------- */
function viewAnnouncement(id) {
  const announcement = announcements.find(a => a.id === id);
  if (!announcement) return;
  
  // Increment views
  announcement.views++;
  updateStats();
  
  const attachmentsHtml = announcement.attachments && announcement.attachments.length > 0 ? `
    <div style="margin-bottom: 20px;">
      <strong style="color: var(--medium-gray); font-size: 13px;">Attachments</strong>
      <div style="display: flex; gap: 12px; margin-top: 8px; flex-wrap: wrap;">
        ${announcement.attachments.map(att => {
          if (att.type.startsWith('image/')) {
            return `<div class="attachment-item"><img src="${att.url}" alt="${att.name}"></div>`;
          } else if (att.type.startsWith('video/')) {
            return `<div class="attachment-item"><video controls><source src="${att.url}" type="${att.type}">Your browser does not support the video tag.</video></div>`;
          } else {
            return `<div class="attachment-item"><div class="file-icon"><i class="fas fa-file"></i><span class="file-name">${att.name}</span></div></div>`;
          }
        }).join('')}
      </div>
    </div>
  ` : '';
  
  const detailsHtml = `
    <div style="padding: 20px 0;">
      ${announcement.pinned ? '<div style="background: var(--light-yellow); padding: 12px; border-radius: 6px; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;"><i class="fas fa-thumbtack" style="color: var(--accent-yellow);"></i><span style="font-weight: 500;">This announcement is pinned</span></div>' : ''}
      
      <h2 style="margin-bottom: 16px; color: var(--dark-gray);">${announcement.title}</h2>
      
      <div style="display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--light-gray);">
        <div style="display: flex; align-items: center; gap: 8px; color: var(--medium-gray); font-size: 14px;">
          <i class="fas fa-user"></i>
          <span>${announcement.author}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; color: var(--medium-gray); font-size: 14px;">
          <i class="fas fa-calendar"></i>
          <span>${formatDate(announcement.date)}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; color: var(--medium-gray); font-size: 14px;">
          <i class="fas fa-eye"></i>
          <span>${announcement.views} views</span>
        </div>
        <span class="priority-badge priority-${announcement.priority}">${capitalizeFirst(announcement.priority)} Priority</span>
        <span style="padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; background-color: ${announcement.status === 'active' ? '#e8f5e9' : '#ffebee'}; color: ${announcement.status === 'active' ? '#2e7d32' : '#c62828'};">${announcement.status === 'active' ? 'Active' : 'Inactive'}</span>
      </div>
      
      <div style="margin-bottom: 20px;">
        <strong style="color: var(--medium-gray); font-size: 13px;">Target Audience</strong>
        <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
          ${announcement.audience.map(aud => `<span class="audience-badge">${capitalizeFirst(aud)}</span>`).join('')}
        </div>
      </div>
      
      <div style="margin-bottom: 24px;">
        <strong style="color: var(--medium-gray); font-size: 13px;">Content</strong>
        <p style="margin-top: 12px; line-height: 1.8; color: var(--dark-gray); font-size: 15px;">${announcement.content}</p>
      </div>
      
      ${attachmentsHtml}
      
      <div class="btn-group">
        <button class="btn btn-primary" onclick="closeViewModal(); editAnnouncement(${announcement.id});">
          <i class="fas fa-edit"></i> Edit Announcement
        </button>
        <button class="btn btn-secondary" onclick="closeViewModal()">Close</button>
      </div>
    </div>
  `;
  
  document.getElementById('announcementDetails').innerHTML = detailsHtml;
  document.getElementById('viewModal').classList.add('active');
}

function closeViewModal() {
  document.getElementById('viewModal').classList.remove('active');
}

/* ---------- Announcement actions ---------- */
function togglePin(id) {
  const announcement = announcements.find(a => a.id === id);
  if (announcement) {
    announcement.pinned = !announcement.pinned;
    renderAnnouncements();
    updateStats();
    showNotification(announcement.pinned ? 'Announcement pinned' : 'Announcement unpinned', 'success');
  }
}

function toggleStatus(id) {
  const announcement = announcements.find(a => a.id === id);
  if (announcement) {
    announcement.status = announcement.status === 'active' ? 'inactive' : 'active';
    renderAnnouncements();
    updateStats();
    showNotification(`Announcement ${announcement.status === 'active' ? 'activated' : 'deactivated'}`, 'success');
  }
}

function deleteAnnouncement(id) {
  if (confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
    announcements = announcements.filter(a => a.id !== id);
    renderAnnouncements();
    updateStats();
    showNotification('Announcement deleted successfully', 'success');
  }
}

/* ---------- Helper functions ---------- */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease;
    max-width: 400px;
  `;
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}