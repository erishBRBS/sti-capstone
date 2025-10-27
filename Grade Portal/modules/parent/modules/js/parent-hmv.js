// HMV Page JavaScript

// Audio functionality for STI Hymn
function initializeHymnAudio() {
  const playBtn = document.getElementById('playHymnBtn');
  const printBtn = document.getElementById('printHymnBtn');
  const shareBtn = document.getElementById('shareHymnBtn');
  
  if (playBtn) {
    playBtn.addEventListener('click', function() {
      // Simulate audio playback
      if (playBtn.innerHTML.includes('fa-play')) {
        playBtn.innerHTML = '<i class="fas fa-pause"></i> Pause STI Hymn';
        // In a real app: audioElement.play();
        showAudioMessage('STI Hymn is now playing...');
      } else {
        playBtn.innerHTML = '<i class="fas fa-play"></i> Play STI Hymn';
        // In a real app: audioElement.pause();
        showAudioMessage('STI Hymn paused');
      }
    });
  }
  
  if (printBtn) {
    printBtn.addEventListener('click', function() {
      window.print();
    });
  }
  
  if (shareBtn) {
    shareBtn.addEventListener('click', function() {
      if (navigator.share) {
        navigator.share({
          title: 'STI Mission, Vision & Hymn',
          text: 'Learn about STI\'s Mission, Vision and listen to the STI Hymn',
          url: window.location.href
        })
        .catch(error => console.log('Error sharing:', error));
      } else {
        // Fallback for browsers that don't support Web Share API
        alert('Share this page with others to spread awareness about STI\'s Mission and Vision!');
      }
    });
  }
}

function showAudioMessage(message) {
  // Create or update notification message
  let notification = document.querySelector('.audio-notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'audio-notification';
    document.body.appendChild(notification);
  }
  
  notification.textContent = message;
  notification.style.opacity = '1';
  
  // Hide after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
  }, 3000);
}

// Student selector functionality
function setupStudentSelector() {
  const studentSelect = document.getElementById('studentSelect');
  if (studentSelect) {
    studentSelect.addEventListener('change', function() {
      // In a real application, this might load student-specific content
      console.log('Selected student:', this.value);
    });
  }
}

// Add interactive elements
function addInteractiveElements() {
  // Add hover effects to content cards
  const contentCards = document.querySelectorAll('.content-card, .mission-card, .vision-card');
  contentCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
}

// Initialize page functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeHymnAudio();
  setupStudentSelector();
  addInteractiveElements();
  
  // Set current date
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateElement = document.getElementById('todayDate');
  if (dateElement) {
    dateElement.textContent = today.toLocaleDateString('en-US', options);
  }
});

// Add print styles
const printStyles = `
@media print {
  .sidebar, .header-actions, .menu-toggle, .action-btn, .student-selector,
  .notification-btn, .theme-toggle, .nav-section-divider, .sign-out {
    display: none !important;
  }
  
  .main-content {
    margin: 0 !important;
    width: 100% !important;
  }
  
  .header {
    box-shadow: none !important;
    border-bottom: 2px solid #000 !important;
  }
  
  .content-card, .mission-card, .vision-card {
    box-shadow: none !important;
    border: 2px solid #000 !important;
    page-break-inside: avoid;
    margin-bottom: 20px !important;
  }
  
  .hymn-text {
    background: white !important;
    border: 1px solid #000 !important;
    font-family: "Times New Roman", serif !important;
  }
  
  body {
    background: white !important;
    color: black !important;
    font-size: 12pt !important;
  }
  
  h1, h2, h3 {
    color: black !important;
  }
}
`;

// Add print styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = printStyles;
document.head.appendChild(styleSheet);