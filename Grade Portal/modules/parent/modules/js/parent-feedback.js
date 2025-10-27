// Feedback Page JavaScript

// Form submission handling
function initializeFeedbackForm() {
  const feedbackForm = document.getElementById('feedbackForm');
  
  if (!feedbackForm) return;
  
  feedbackForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const feedbackType = document.getElementById('feedbackType');
    const feedbackMessage = document.getElementById('feedbackMessage');
    
    // Clear previous errors
    clearErrors();
    
    // Validate form
    let isValid = true;
    
    if (!feedbackType.value) {
      showError('typeError', 'Please select a feedback type');
      feedbackType.classList.add('error');
      isValid = false;
    }
    
    if (!feedbackMessage.value.trim()) {
      showError('messageError', 'Please enter your feedback message');
      feedbackMessage.classList.add('error');
      isValid = false;
    } else if (feedbackMessage.value.trim().length < 10) {
      showError('messageError', 'Feedback message must be at least 10 characters long');
      feedbackMessage.classList.add('error');
      isValid = false;
    } else if (feedbackMessage.value.trim().length > 1000) {
      showError('messageError', 'Feedback message must be less than 1000 characters');
      feedbackMessage.classList.add('error');
      isValid = false;
    }
    
    if (isValid) {
      submitFeedback(
        feedbackType.value, 
        feedbackMessage.value.trim()
      );
    }
  });
  
  // Add real-time validation
  const feedbackMessage = document.getElementById('feedbackMessage');
  if (feedbackMessage) {
    feedbackMessage.addEventListener('input', function() {
      if (this.value.trim().length > 0) {
        clearError('messageError');
        this.classList.remove('error');
      }
      updateCharacterCounter();
    });
  }
  
  const feedbackType = document.getElementById('feedbackType');
  if (feedbackType) {
    feedbackType.addEventListener('change', function() {
      if (this.value) {
        clearError('typeError');
        this.classList.remove('error');
      }
    });
  }
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }
}

function clearError(elementId) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.classList.remove('show');
  }
}

function clearErrors() {
  const errorInputs = document.querySelectorAll('.error');
  errorInputs.forEach(input => input.classList.remove('error'));
  
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach(message => message.classList.remove('show'));
}

function submitFeedback(type, message) {
  // Show loading state
  const submitBtn = document.querySelector('.submit-btn');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
  submitBtn.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    // In a real application, you would send this data to a server
    console.log('Feedback submitted:', { 
      type, 
      message,
      timestamp: new Date().toISOString(),
      user: 'Maria Yap'
    });
    
    // Show success message
    showSuccessMessage();
    
    // Reset form
    document.getElementById('feedbackForm').reset();
    updateCharacterCounter(); // Reset counter
    
    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }, 2000);
}

function showSuccessMessage() {
  let successMessage = document.querySelector('.success-message');
  
  if (!successMessage) {
    successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <div>
        <strong>Thank you for your feedback!</strong><br>
        We appreciate your input and will review it carefully to improve your experience.
      </div>
    `;
    
    const feedbackForm = document.querySelector('.feedback-form');
    feedbackForm.appendChild(successMessage);
  }
  
  successMessage.classList.add('show');
  
  // Hide success message after 5 seconds
  setTimeout(() => {
    successMessage.classList.remove('show');
  }, 5000);
}

// Character counter for feedback message
function initializeCharacterCounter() {
  updateCharacterCounter(); // Initialize counter
}

function updateCharacterCounter() {
  const feedbackMessage = document.getElementById('feedbackMessage');
  const counter = document.getElementById('charCounter');
  
  if (!feedbackMessage || !counter) return;
  
  const length = feedbackMessage.value.length;
  counter.textContent = `${length} characters`;
  
  if (length > 800) {
    counter.className = 'character-counter error';
  } else if (length > 500) {
    counter.className = 'character-counter warning';
  } else {
    counter.className = 'character-counter';
  }
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

// Initialize page functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeFeedbackForm();
  initializeCharacterCounter();
  setupStudentSelector();
  
  // Add interactive elements
  addInteractiveElements();
});

function addInteractiveElements() {
  // Add hover effects to content cards
  const contentCards = document.querySelectorAll('.content-card');
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