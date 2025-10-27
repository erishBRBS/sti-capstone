class StudentSettings {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSavedSettings();
        console.log('Student Settings initialized!');
    }

    bindEvents() {
        // Profile picture upload preview
        const profileUpload = document.getElementById('profileUpload');
        profileUpload.addEventListener('change', (e) => {
            this.handleProfilePictureUpload(e);
        });

        // Form submission handlers
        document.getElementById('profileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfileSettings();
        });

        document.getElementById('preferencesForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePreferences();
        });

        document.getElementById('securityForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateSecuritySettings();
        });

        // Theme selection dropdown
        document.getElementById('theme').addEventListener('change', (e) => {
            this.handleThemeChange(e.target.value);
        });

        // Password strength indicator
        document.getElementById('newPassword').addEventListener('input', (e) => {
            this.checkPasswordStrength(e.target.value);
        });

        // Notification button
        document.querySelector('.notification-btn').addEventListener('click', () => {
            this.showNotifications();
        });
    }

    handleProfilePictureUpload(event) {
        const file = event.target.files[0];
        const profilePreview = document.getElementById('profilePreview');
        
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                this.showAlert('Please select a valid image file (JPEG, PNG, GIF)', 'error');
                event.target.value = '';
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                this.showAlert('Image size should be less than 5MB', 'error');
                event.target.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                profilePreview.src = e.target.result;
                // In a real app, you would upload to server here
                localStorage.setItem('studentProfilePicture', e.target.result);
                this.showAlert('Profile picture updated successfully!', 'success');
            };
            reader.readAsDataURL(file);
        }
    }

    saveProfileSettings() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();

        // Validate inputs
        if (!name || !email) {
            this.showAlert('Please fill in all required fields', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showAlert('Please enter a valid email address', 'error');
            return;
        }

        // Save to localStorage (in real app, this would be an API call)
        const settings = {
            name: name,
            email: email,
            desktopNotifications: document.getElementById('desktopNotifications').checked
        };
        
        localStorage.setItem('studentSettings', JSON.stringify(settings));

        // Update header name if changed
        const studentNameElements = document.querySelectorAll('.student-profile div:last-child, .user-name');
        studentNameElements.forEach(element => {
            if (element.textContent.includes('Juan')) {
                element.textContent = name;
            }
        });

        this.showAlert('Profile settings saved successfully!', 'success');
    }

    savePreferences() {
        const theme = document.getElementById('theme').value;
        const desktopNotifications = document.getElementById('desktopNotifications').checked;

        // Save preferences
        localStorage.setItem('studentThemePreference', theme);
        localStorage.setItem('studentDesktopNotifications', desktopNotifications);

        this.showAlert('Account preferences saved successfully!', 'success');
    }

    updateSecuritySettings() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate passwords
        if (!currentPassword) {
            this.showAlert('Please enter your current password', 'error');
            return;
        }

        if (newPassword && newPassword !== confirmPassword) {
            this.showAlert('New passwords do not match!', 'error');
            return;
        }
        
        if (newPassword && newPassword.length < 8) {
            this.showAlert('Password must be at least 8 characters long!', 'error');
            return;
        }

        // In a real app, you would make an API call to change the password
        if (newPassword) {
            // Simulate password change
            setTimeout(() => {
                this.showAlert('Password updated successfully!', 'success');
                document.getElementById('securityForm').reset();
            }, 1000);
        } else {
            this.showAlert('Please enter a new password', 'warning');
        }
    }

    handleThemeChange(theme) {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle.querySelector('i');

        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else if (theme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            // Auto mode - follow system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeIcon.classList.replace('fa-moon', 'fa-sun');
            } else {
                document.documentElement.removeAttribute('data-theme');
                themeIcon.classList.replace('fa-sun', 'fa-moon');
            }
            localStorage.setItem('theme', 'auto');
        }
    }

    checkPasswordStrength(password) {
        // Simple password strength check
        let strength = 0;
        const requirements = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        };

        // Calculate strength
        if (requirements.length) strength += 20;
        if (requirements.lowercase) strength += 20;
        if (requirements.uppercase) strength += 20;
        if (requirements.numbers) strength += 20;
        if (requirements.special) strength += 20;

        // Update strength indicator
        const strengthBar = document.querySelector('.password-strength-bar');
        const strengthContainer = document.querySelector('.password-strength');
        
        if (strengthBar && strengthContainer) {
            strengthBar.style.width = `${strength}%`;
            
            // Remove all classes
            strengthContainer.className = 'password-strength';
            
            // Add appropriate class
            if (strength <= 40) {
                strengthContainer.classList.add('weak');
            } else if (strength <= 80) {
                strengthContainer.classList.add('medium');
            } else {
                strengthContainer.classList.add('strong');
            }
        }
    }

    loadSavedSettings() {
        // Load profile data
        const savedSettings = localStorage.getItem('studentSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            document.getElementById('name').value = settings.name || 'Juan Dela Cruz';
            document.getElementById('email').value = settings.email || 'juan.delacruz@student.sti.edu';
            document.getElementById('desktopNotifications').checked = settings.desktopNotifications !== false;
        }

        // Load theme preference
        const theme = localStorage.getItem('studentThemePreference') || localStorage.getItem('theme') || 'auto';
        document.getElementById('theme').value = theme;

        // Load profile picture
        const savedProfilePic = localStorage.getItem('studentProfilePicture');
        if (savedProfilePic) {
            document.getElementById('profilePreview').src = savedProfilePic;
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotifications() {
        this.showAlert('You have 3 new notifications', 'info');
    }

    // Modern Alert System
    showAlert(message, type = 'info', duration = 5000) {
        const alertContainer = document.getElementById('alertContainer');
        const alertId = 'alert-' + Date.now();
        
        // Alert type configurations
        const alertConfig = {
            success: {
                icon: 'fas fa-check-circle',
                title: 'Success',
                class: 'alert-success'
            },
            info: {
                icon: 'fas fa-info-circle',
                title: 'Information',
                class: 'alert-info'
            },
            warning: {
                icon: 'fas fa-exclamation-triangle',
                title: 'Warning',
                class: 'alert-warning'
            },
            error: {
                icon: 'fas fa-times-circle',
                title: 'Error',
                class: 'alert-error'
            }
        };
        
        const config = alertConfig[type] || alertConfig.info;
        
        const alertElement = document.createElement('div');
        alertElement.className = `alert ${config.class}`;
        alertElement.id = alertId;
        alertElement.innerHTML = `
            <div class="alert-icon">
                <i class="${config.icon}"></i>
            </div>
            <div class="alert-content">
                <div class="alert-title">${config.title}</div>
                <div class="alert-message">${message}</div>
            </div>
            <button class="alert-close" onclick="this.closest('.alert').remove()">
                <i class="fas fa-times"></i>
            </button>
            <div class="alert-progress"></div>
        `;
        
        alertContainer.appendChild(alertElement);
        
        // Animate in
        setTimeout(() => {
            alertElement.classList.add('show');
        }, 10);
        
        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.removeAlert(alertId);
            }, duration);
        }
        
        return alertId;
    }
    
    removeAlert(alertId) {
        const alertElement = document.getElementById(alertId);
        if (alertElement) {
            alertElement.classList.remove('show');
            alertElement.classList.add('hide');
            
            setTimeout(() => {
                if (alertElement.parentNode) {
                    alertElement.parentNode.removeChild(alertElement);
                }
            }, 400);
        }
    }
}