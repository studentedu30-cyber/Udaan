// Main JavaScript Functions
document.addEventListener('DOMContentLoaded', function() {
  // Initialize smooth scrolling for navigation links
  initializeSmoothScrolling();
  
  // Initialize animations
  initializeAnimations();
  
  // Initialize tooltips and popovers
  initializeBootstrapComponents();
  
  // Initialize contact form
  initializeContactForm();
  
  console.log('CareerPath website initialized successfully');
});

// Initialize smooth scrolling
function initializeSmoothScrolling() {
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
}

// Initialize animations
function initializeAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
      }
    });
  }, observerOptions);
  
  // Observe elements that should animate
  document.querySelectorAll('.career-card, .govt-job-card, .gallery-item, .about-feature').forEach(el => {
    observer.observe(el);
  });
}

// Initialize Bootstrap components
function initializeBootstrapComponents() {
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
  
  // Initialize popovers
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });
}

// Initialize contact form
function initializeContactForm() {
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(e.target);
      const contactData = {};
      for (let [key, value] of formData.entries()) {
        contactData[key] = value;
      }
      
      // Simulate form submission
      showSuccessMessage('Thank you for your message! We will get back to you soon.');
      e.target.reset();
    });
  }
}

// Utility function to format dates
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Utility function to capitalize first letter
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
  // Recalculate any responsive elements if needed
  handleResponsiveNavigation();
});

// Handle responsive navigation
function handleResponsiveNavigation() {
  const navbar = document.querySelector('.navbar-collapse');
  if (window.innerWidth > 992) {
    navbar.classList.remove('show');
  }
}

// Search functionality (for future implementation)
function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase();
      // Implement search logic here
      console.log('Searching for:', searchTerm);
    });
  }
}

// Dark/Light theme toggle (for future implementation)
function toggleTheme() {
  const body = document.body;
  if (body.classList.contains('dark-theme')) {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  }
}

// Load saved theme preference
function loadThemePreference() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(savedTheme + '-theme');
  }
}

// Error handling for network issues
window.addEventListener('error', function(e) {
  console.error('Global error caught:', e.error);
});

// Handle offline/online events
window.addEventListener('offline', function() {
  showErrorMessage('You are currently offline. Some features may not work properly.');
});

window.addEventListener('online', function() {
  showSuccessMessage('Connection restored!');
});

// Performance monitoring
function logPerformance() {
  window.addEventListener('load', function() {
    setTimeout(function() {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
    }, 0);
  });
}



// Initialize performance monitoring
logPerformance();

// Scroll to section function
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Show success message
function showSuccessMessage(message) {
  showToast(message, 'success');
}

// Show error message
function showErrorMessage(message) {
  showToast(message, 'error');
}

// Show toast notification
function showToast(message, type) {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }
  
  toastContainer.appendChild(toast);
  
  // Show toast
  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();
  
  // Remove toast after it's hidden
  toast.addEventListener('hidden.bs.toast', () => {
    toast.remove();
  });
}

// Global keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Ctrl + K for search (future implementation)
  if (e.ctrlKey && e.key === 'k') {
    e.preventDefault();
    console.log('Search shortcut triggered');
  }
  
  // Escape to close modals
  if (e.key === 'Escape') {
    const openModals = document.querySelectorAll('.modal.show');
    openModals.forEach(modal => {
      const bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) bsModal.hide();
    });
  }
});

console.log('Main JavaScript loaded successfully');