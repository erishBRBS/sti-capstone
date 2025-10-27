// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
  initializeFormValues();
  initializeTheme();
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

  // Form submissions
  document.getElementById('personalForm').addEventListener('submit', function(e) {
    e.preventDefault();
    savePersonalInfo();
  });

  // Avatar upload
  document.getElementById('avatarUploadBtn').addEventListener('click', function() {
    document.getElementById('avatarInput').click();
  });
  
  document.getElementById('avatarInput').addEventListener('change', handleAvatarUpload);

  // Button event listeners
  document.getElementById('resetPersonalBtn').addEventListener('click', resetPersonalForm);
  document.getElementById('updatePasswordBtn').addEventListener('click', updatePassword);
  document.getElementById('savePreferencesBtn').addEventListener('click', savePreferences);
  document.getElementById('resetPreferencesBtn').addEventListener('click', resetPreferences);
  document.getElementById('exportDataBtn').addEventListener('click', exportData);
  document.getElementById('configure2faBtn').addEventListener('click', configureTwoFactor);
  document.getElementById('signOutAllBtn').addEventListener('click', signOutAllDevices);

  // Password strength indicator
  document.getElementById('newPassword').addEventListener('keyup', checkPasswordStrength);

  // Theme preference dropdown
  document.getElementById('themePreference').addEventListener('change', function() {
    applyTheme(this.value);
  });

  // Session actions
  document.querySelectorAll('.session-action').forEach(button => {
    button.addEventListener('click', function() {
      const session = this.getAttribute('data-session');
      revokeSession(session);
    });
  });

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

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    applyTheme(newTheme);
  });
}

function initializeFormValues() {
  // Set initial values for form elements
  document.getElementById('department').value = 'cs';
  
  // Set theme preference based on current theme
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  document.getElementById('themePreference').value = currentTheme;
}

function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let theme = 'light';
  
  if (savedTheme) {
    theme = savedTheme;
  } else if (prefersDark) {
    theme = 'dark';
  }
  
  applyTheme(theme);
}

function applyTheme(theme) {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');
  const themePreference = document.getElementById('themePreference');
  
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
    if (themePreference) themePreference.value = 'dark';
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeIcon.classList.replace('fa-sun', 'fa-moon');
    if (themePreference) themePreference.value = 'light';
  }
  
  // Save theme preference
  localStorage.setItem('theme', theme);
}

function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    showAlert('Please select an image file', 'warning');
    return;
  }
  
  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    showAlert('File size exceeds 5MB limit', 'warning');
    return;
  }
  
  // Create preview
  const reader = new FileReader();
  reader.onload = function(e) {
    const avatarImage = document.querySelector('.avatar-image');
    avatarImage.innerHTML = '';
    avatarImage.style.backgroundImage = `url(${e.target.result})`;
    avatarImage.style.backgroundSize = 'cover';
    avatarImage.style.backgroundPosition = 'center';
  };
  reader.readAsDataURL(file);
  
  // Show success message
  showAlert('Profile picture updated successfully!', 'success');
}

function savePersonalInfo() {
  // In a real application, this would send data to the server
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  
  // Update profile header
  document.querySelector('.profile-name').textContent = `${firstName} ${lastName}`;
  document.querySelector('.user-name').textContent = `${firstName} ${lastName}`;
  document.querySelector('.teacher-profile div:last-child').textContent = `${firstName} ${lastName}`;
  
  showAlert('Personal information updated successfully!', 'success');
}

function resetPersonalForm() {
  document.getElementById('personalForm').reset();
  document.getElementById('department').value = 'cs';
  showAlert('Form has been reset to original values', 'info');
}

function checkPasswordStrength() {
  const password = document.getElementById('newPassword').value;
  const strengthIndicator = document.getElementById('passwordStrength');
  
  let strength = 0;
  let feedback = '';
  
  // Check password length
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  
  // Check for mixed case
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
  
  // Check for numbers
  if (password.match(/\d/)) strength++;
  
  // Check for special characters
  if (password.match(/[^a-zA-Z\d]/)) strength++;
  
  // Update strength indicator
  strengthIndicator.className = 'security-strength';
  
  if (password.length === 0) {
    strengthIndicator.style.width = '0%';
  } else if (strength <= 2) {
    strengthIndicator.classList.add('strength-weak');
    feedback = 'Weak password';
  } else if (strength <= 3) {
    strengthIndicator.classList.add('strength-medium');
    feedback = 'Medium strength password';
  } else if (strength <= 4) {
    strengthIndicator.classList.add('strength-strong');
    feedback = 'Strong password';
  } else {
    strengthIndicator.classList.add('strength-very-strong');
    feedback = 'Very strong password';
  }
}

function updatePassword() {
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  if (!currentPassword) {
    showAlert('Please enter your current password', 'warning');
    return;
  }
  
  if (!newPassword) {
    showAlert('Please enter a new password', 'warning');
    return;
  }
  
  if (newPassword !== confirmPassword) {
    showAlert('New passwords do not match', 'warning');
    return;
  }
  
  if (newPassword.length < 8) {
    showAlert('Password must be at least 8 characters long', 'warning');
    return;
  }
  
  // In a real application, this would verify current password and update to new one
  showAlert('Password updated successfully!', 'success');
  
  // Clear password fields
  document.getElementById('currentPassword').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmPassword').value = '';
  document.getElementById('passwordStrength').style.width = '0%';
}

function savePreferences() {
  // Get theme preference
  const themePreference = document.getElementById('themePreference').value;
  
  // Apply theme preference
  if (themePreference === 'auto') {
    // For auto mode, use system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  } else {
    applyTheme(themePreference);
  }
  
  // Save other preferences here in a real application
  
  showAlert('Preferences saved successfully!', 'success');
}

function resetPreferences() {
  if (confirm('Are you sure you want to reset all preferences to their default values?')) {
    document.getElementById('themePreference').value = 'light';
    document.getElementById('compactMode').checked = false;
    applyTheme('light');
    showAlert('Preferences reset to default values', 'info');
  }
}

function exportData() {
  // In a real application, this would initiate data export
  showAlert('Data export has been initiated. You will receive an email when it is ready.', 'info');
}

function configureTwoFactor() {
  // In a real application, this would open 2FA configuration
  showAlert('Two-factor authentication configuration opened', 'info');
}

function signOutAllDevices() {
  if (confirm('Are you sure you want to sign out all other devices?')) {
    // In a real application, this would sign out all other sessions
    showAlert('All other devices have been signed out', 'success');
  }
}

function revokeSession(session) {
  if (confirm('Are you sure you want to revoke this session?')) {
    // In a real application, this would revoke the session
    showAlert('Session revoked successfully', 'success');
  }
}

function showAlert(message, type) {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}" style="font-size: 20px;"></i>
    <div>${message}</div>
  `;
  
  document.querySelector('.dashboard').insertBefore(alert, document.querySelector('.dashboard').firstChild);
  
  setTimeout(() => alert.remove(), 5000);
}