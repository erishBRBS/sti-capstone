// Navigation management
class NavigationManager {
    constructor() {
        this.menuToggle = document.getElementById('menuToggle');
        this.sidebar = document.querySelector('.sidebar');
        this.init();
    }

    init() {
        this.bindEvents();
        this.setActiveNavItem();
    }

    bindEvents() {
        // Mobile menu toggle
        if (this.menuToggle && this.sidebar) {
            this.menuToggle.addEventListener('click', () => {
                this.sidebar.classList.toggle('open');
            });

            // Close sidebar when clicking outside on mobile
            document.addEventListener('click', (event) => {
                if (window.innerWidth < 992 && 
                    !this.sidebar.contains(event.target) && 
                    !this.menuToggle.contains(event.target) &&
                    this.sidebar.classList.contains('open')) {
                    this.sidebar.classList.remove('open');
                }
            });
        }

        // Handle navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!item.classList.contains('active')) {
                    document.querySelectorAll('.nav-item').forEach(nav => {
                        nav.classList.remove('active');
                    });
                    item.classList.add('active');
                }
            });
        });
    }

    setActiveNavItem() {
        const currentPage = window.location.pathname.split('/').pop();
        document.querySelectorAll('.nav-item').forEach(item => {
            const link = item.querySelector('a');
            if (link && link.getAttribute('href') === currentPage) {
                item.classList.add('active');
            }
        });
    }

    // Navigate to different pages
    static navigateTo(url) {
        window.location.href = url;
    }

    // Show loading state during navigation
    static showLoading() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-spinner"></div>
            <p>Loading...</p>
        `;
        document.body.appendChild(loader);
    }

    static hideLoading() {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            loader.remove();
        }
    }
}