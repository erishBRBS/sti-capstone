// FAQs Page JavaScript - parent-faqs.js

// FAQ data structure
const faqData = [
  {
    id: 1,
    question: "How to log-in",
    answer: "Sign-in using your STI Microsoft Office 365 account. If you don't know your account yet, get your credentials from the School Laboratory Facilitator or refer to your Registration and Assessment Form to get your official school email address. You may locate it at the lower-left corner of the form.",
    category: "account",
    tags: ["login", "credentials", "email"]
  },
  {
    id: 2,
    question: "My email account is not working",
    answer: "You might be using the old email address format (sti.ph). Please update it using the new format (sti.edu.ph). When a message appears that your email account needs to link up with your record, talk to your School Registrar and request for a record update.",
    category: "account",
    tags: ["email", "format", "update"]
  },
  {
    id: 3,
    question: "My default password is not working",
    answer: "Verify the password from your School Laboratory Facilitator. You may also request for a new one by approaching the School Laboratory Facilitator then ask for a password reset.",
    category: "account",
    tags: ["password", "reset", "credentials"]
  },
  {
    id: 4,
    question: "Child's Grades",
    answer: "All the grades indicated in your child's Grades section are encoded only by the corresponding teacher or instructor of every subject. For grade-related concerns, you may discuss it with your child's teacher or the School Registrar.",
    category: "academic",
    tags: ["grades", "teacher", "subjects"]
  },
  {
    id: 5,
    question: "Child's Class Schedule",
    answer: "Missing time, room, number, or questionable subject periods? Confirm your child's class schedules through the Registrar's Office.",
    category: "academic",
    tags: ["schedule", "registrar", "classes"]
  },
  {
    id: 6,
    question: "Program Curriculum",
    answer: "For issues regarding the status of your child's subject list and units taken, proceed to the Registrar's Office to verify the information or report it using our feedback page.",
    category: "academic",
    tags: ["curriculum", "subjects", "registrar"]
  },
  {
    id: 7,
    question: "Financial Balances",
    answer: "To validate your child's financial balances, check with the Registrar's Office for clarification.",
    category: "financial",
    tags: ["balances", "fees", "registrar"]
  }
];

// Initialize FAQ functionality
function initializeFAQs() {
  setupSearchFunctionality();
  setupCategoryFilter();
  initializeFAQInteractions();
  setupFAQActions();
  updateFAQCounter();
}

// Add search functionality
function setupSearchFunctionality() {
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', filterFAQs);
  }
}

// Add category filter
function setupCategoryFilter() {
  const categoryButtons = document.querySelectorAll('.category-btn');
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active category button
      document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      this.classList.add('active');
      
      filterByCategory(this.dataset.category);
    });
  });
}

// Initialize FAQ interactions (expand/collapse)
function initializeFAQInteractions() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const isActive = this.classList.contains('active');
      
      // Close all other FAQs
      document.querySelectorAll('.faq-question.active').forEach(activeQuestion => {
        if (activeQuestion !== this) {
          activeQuestion.classList.remove('active');
          activeQuestion.nextElementSibling.classList.remove('show');
        }
      });
      
      // Toggle current FAQ
      this.classList.toggle('active');
      answer.classList.toggle('show');
      
      // Add animation delay for smooth transition
      if (!isActive) {
        answer.style.transition = 'max-height 0.3s ease, margin-top 0.3s ease';
      }
    });
  });
  
  // Open first FAQ by default
  if (faqQuestions.length > 0) {
    faqQuestions[0].classList.add('active');
    faqQuestions[0].nextElementSibling.classList.add('show');
  }
}

// Add FAQ actions (print, expand all, etc.)
function setupFAQActions() {
  const expandAllBtn = document.getElementById('expandAllBtn');
  const collapseAllBtn = document.getElementById('collapseAllBtn');
  const printFaqsBtn = document.getElementById('printFaqsBtn');
  
  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', expandAllFAQs);
  }
  
  if (collapseAllBtn) {
    collapseAllBtn.addEventListener('click', collapseAllFAQs);
  }
  
  if (printFaqsBtn) {
    printFaqsBtn.addEventListener('click', printFAQs);
  }
}

// Expand all FAQs
function expandAllFAQs() {
  document.querySelectorAll('.faq-question').forEach(question => {
    question.classList.add('active');
    question.nextElementSibling.classList.add('show');
  });
}

// Collapse all FAQs
function collapseAllFAQs() {
  document.querySelectorAll('.faq-question').forEach(question => {
    question.classList.remove('active');
    question.nextElementSibling.classList.remove('show');
  });
}

// Print FAQs
function printFAQs() {
  window.print();
}

// Filter FAQs by search term
function filterFAQs() {
  const searchTerm = this.value.toLowerCase();
  const faqItems = document.querySelectorAll('.faq-item');
  let visibleCount = 0;
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question').textContent.toLowerCase();
    const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
    
    if (question.includes(searchTerm) || answer.includes(searchTerm)) {
      item.style.display = 'block';
      visibleCount++;
    } else {
      item.style.display = 'none';
    }
  });
  
  updateFAQCounter(visibleCount);
  toggleNoResultsMessage(visibleCount === 0);
}

// Filter FAQs by category
function filterByCategory(category) {
  const faqItems = document.querySelectorAll('.faq-item');
  let visibleCount = 0;
  
  // For simplicity, we're using data attributes. In a real app, you'd want to map questions to categories.
  // This is a simplified implementation.
  if (category === 'all') {
    faqItems.forEach(item => {
      item.style.display = 'block';
      visibleCount++;
    });
  } else {
    // This would need proper category mapping in a real implementation
    faqItems.forEach(item => {
      item.style.display = 'block';
      visibleCount++;
    });
  }
  
  updateFAQCounter(visibleCount);
  toggleNoResultsMessage(visibleCount === 0);
}

// Update FAQ counter
function updateFAQCounter(visibleCount) {
  const counter = document.getElementById('faqCounter');
  const totalFAQs = document.querySelectorAll('.faq-item').length;
  
  if (visibleCount !== undefined) {
    counter.textContent = `Showing ${visibleCount} of ${totalFAQs} FAQs`;
  } else {
    counter.textContent = `${totalFAQs} Frequently Asked Questions`;
  }
}

// Toggle no results message
function toggleNoResultsMessage(show) {
  let noResults = document.querySelector('.no-results');
  
  if (!noResults && show) {
    noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.innerHTML = `
      <i class="fas fa-search"></i>
      <h3>No FAQs Found</h3>
      <p>Try adjusting your search or filter to find what you're looking for.</p>
    `;
    
    const faqContainer = document.querySelector('.faq-container');
    faqContainer.appendChild(noResults);
  }
  
  if (noResults) {
    noResults.style.display = show ? 'block' : 'none';
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
  initializeFAQs();
  setCurrentDate();
  
  // Add some interactive elements
  addInteractiveElements();
});

function addInteractiveElements() {
  // Add hover effects to content cards
  const contentCards = document.querySelectorAll('.content-card');
  contentCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'var(--shadow)';
    });
  });
}

// Add print styles
const printStyles = `
@media print {
  .sidebar, .header-actions, .menu-toggle, .faq-search-section, .faq-actions {
    display: none !important;
  }
  
  .main-content {
    margin: 0 !important;
    width: 100% !important;
  }
  
  .content-card {
    box-shadow: none !important;
    border: 1px solid #ccc !important;
    page-break-inside: avoid;
  }
  
  body {
    background: white !important;
    color: black !important;
    font-size: 12pt !important;
  }
  
  .faq-question.active + .faq-answer {
    display: block !important;
    max-height: none !important;
  }
  
  .faq-item {
    page-break-inside: avoid;
  }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = printStyles;
document.head.appendChild(styleSheet);