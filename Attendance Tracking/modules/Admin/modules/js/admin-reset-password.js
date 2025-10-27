/**
 * Admin Reset Password Management
 * Handles password reset functionality for admin accounts
 */
class AdminResetPassword {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        console.log('Admin Reset Password initialized!');
    }

    bindEvents() {
        // Search form submission
        document.getElementById('searchForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.searchAdmin();
        });

        // Reset form submission
        document.getElementById('resetForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.resetPassword();
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

    searchAdmin() {
        const query = document.getElementById('searchAdmin').value.trim();
        if (query === '') {
            this.showAlert('Please enter a username or email address to search.', 'warning');
            return;
        }
        
        // In a real app, you would make an API call here
        // For demonstration, we'll simulate a successful search
        this.showAlert(`Searching for admin: ${query}`, 'info');
        
        setTimeout(() => {
            // Show reset section with the searched admin name
            document.getElementById('resetSection').style.display = 'block';
            document.getElementById('adminName').textContent = query;
            
            // Scroll to reset section
            document.getElementById('resetSection').scrollIntoView({ behavior: 'smooth' });
            
            this.showAlert(`Admin account found: ${query}`, 'success');
        }, 1500);
    }

    resetPassword() {
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const adminName = document.getElementById('adminName').textContent;
        
        // Validate password
        if (password.length < 8) {
            this.showAlert('Password must be at least 8 characters long!', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showAlert('New passwords do not match!', 'error');
            return;
        }

        // In a real app, you would make an API call to reset the password
        this.showAlert(`Resetting password for ${adminName}...`, 'info');
        
        // Simulate API call
        setTimeout(() => {
            this.showAlert(`Password successfully reset for ${adminName}`, 'success');
            
            // Reset form
            document.getElementById('resetForm').reset();
            document.querySelector('.password-strength-bar').style.width = '0%';
            document.querySelector('.password-strength').className = 'password-strength';
            
            // Hide reset section
            document.getElementById('resetSection').style.display = 'none';
        }, 2000);
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

// Make it available globally
if (typeof window !== 'undefined') {
    window.AdminResetPassword = AdminResetPassword;
}