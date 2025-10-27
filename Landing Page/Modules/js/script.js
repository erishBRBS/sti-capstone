// Mobile Navigation
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Scroll Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});

// FAQ Functionality
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const answer = question.nextElementSibling;
    const isActive = answer.classList.contains('active');
    
    // Close all answers
    document.querySelectorAll('.faq-answer').forEach(ans => {
      ans.classList.remove('active');
    });
    
    document.querySelectorAll('.faq-question').forEach(q => {
      q.classList.remove('active');
    });
    
    // If this answer wasn't active, open it
    if (!isActive) {
      answer.classList.add('active');
      question.classList.add('active');
    }
  });
});

// Modal Functionality
const modal = document.getElementById('loginModal');
const loginBtns = document.querySelectorAll('#loginBtn, #heroLoginBtn, #ctaLoginBtn');
const closeBtn = document.querySelector('.close');

loginBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  });
});

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// User Type Selector
const userTypeOptions = document.querySelectorAll('.user-type-option');
const userIdLabel = document.getElementById('userIdLabel');
const userIdInput = document.getElementById('userId');

userTypeOptions.forEach(option => {
  option.addEventListener('click', () => {
    // Remove active class from all options
    userTypeOptions.forEach(opt => opt.classList.remove('active'));
    
    // Add active class to clicked option
    option.classList.add('active');
    
    // Update form based on selected user type
    const userType = option.getAttribute('data-type');
    if (userType === 'student') {
      userIdLabel.textContent = 'Student ID';
      userIdInput.placeholder = 'Enter your Student ID';
    } else if (userType === 'admin') {
      userIdLabel.textContent = 'Admin ID';
      userIdInput.placeholder = 'Enter your Admin ID';
    }
  });
});

// Login Form
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const loginText = document.querySelector('.login-text');
  const loadingSpinner = document.querySelector('.loading-spinner');
  const loginButton = document.querySelector('.login-submit-btn');
  
  loginText.style.display = 'none';
  loadingSpinner.style.display = 'inline-block';
  loginButton.disabled = true;
  
  // Get selected user type
  const activeOption = document.querySelector('.user-type-option.active');
  const userType = activeOption.getAttribute('data-type');
  
  // Simulate login process
  setTimeout(() => {
    alert(`${userType.charAt(0).toUpperCase() + userType.slice(1)} login successful! Redirecting to dashboard...`);
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    loginText.style.display = 'inline';
    loadingSpinner.style.display = 'none';
    loginButton.disabled = false;
  }, 2000);
});

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 100) {
    header.style.background = 'rgba(255, 255, 255, 0.98)';
    header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.background = 'rgba(255, 255, 255, 0.95)';
    header.style.boxShadow = 'none';
  }
});

// Add some interactive elements
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-10px) scale(1.02)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) scale(1)';
  });
});