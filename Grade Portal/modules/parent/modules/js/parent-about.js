// About Page JavaScript - parent-about.js

// Initialize page functionality
function initializeAboutPage() {
  setupPrintButton();
  addInteractiveElements();
}

// Print functionality
function setupPrintButton() {
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', function() {
      window.print();
    });
  }
}

// Add interactive elements
function addInteractiveElements() {
  // Add click animations to feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('click', function() {
      this.style.transform = 'scale(0.98)';
      this.style.transition = 'transform 0.2s';
      
      setTimeout(() => {
        this.style.transform = '';
      }, 200);
    });
  });
  
  // Add hover effects to version cards
  const versionCards = document.querySelectorAll('.version-card');
  versionCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
  
  // Add animation to content card
  const contentCard = document.querySelector('.content-card');
  if (contentCard) {
    contentCard.style.animation = 'fadeInUp 0.6s ease-out';
  }
}

// Add current date to page
function setCurrentDate() {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateElement = document.getElementById('todayDate');
  if (dateElement) {
    dateElement.textContent = today.toLocaleDateString('en-US', options);
  }
}

// Initialize page functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeAboutPage();
  setCurrentDate();
});

// Add print styles
const printStyles = `
@media print {
  .sidebar, .header-actions, .menu-toggle, .print-btn,
  .notification-btn, .theme-toggle {
    display: none !important;
  }
  
  .main-content {
    margin: 0 !important;
    width: 100% !important;
  }
  
  .content-card {
    box-shadow: none !important;
    border: 2px solid #000 !important;
    page-break-inside: avoid;
  }
  
  body {
    background: white !important;
    color: black !important;
    font-size: 12pt !important;
  }
  
  .features-grid {
    display: block !important;
  }
  
  .feature-card {
    border: 1px solid #000 !important;
    margin-bottom: 10px;
    page-break-inside: avoid;
  }
  
  .disclaimer-box {
    border: 1px solid #000 !important;
  }
}
`;

// Add print styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = printStyles;
document.head.appendChild(styleSheet);