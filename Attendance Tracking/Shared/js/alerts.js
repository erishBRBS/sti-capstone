// Modern Alert System
class AlertManager {
    static showAlert(message, type = 'info', duration = 5000) {
        const alertContainer = document.getElementById('alertContainer');
        if (!alertContainer) {
            console.warn('Alert container not found');
            return null;
        }

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
            <button class="alert-close" onclick="AlertManager.removeAlert('${alertId}')">
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
    
    static removeAlert(alertId) {
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

    // Convenience methods
    static success(message, duration = 5000) {
        return this.showAlert(message, 'success', duration);
    }

    static info(message, duration = 5000) {
        return this.showAlert(message, 'info', duration);
    }

    static warning(message, duration = 5000) {
        return this.showAlert(message, 'warning', duration);
    }

    static error(message, duration = 5000) {
        return this.showAlert(message, 'error', duration);
    }
}

// Make it available globally
if (typeof window !== 'undefined') {
    window.AlertManager = AlertManager;
}