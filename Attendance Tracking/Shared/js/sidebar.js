// Sidebar functionality
class SidebarManager {
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

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 992 && this.sidebar) {
                this.sidebar.classList.remove('open');
            }
        });
    }

    setActiveNavItem() {
        const currentPage = window.location.pathname.split('/').pop();
        document.querySelectorAll('.nav-item').forEach(item => {
            const href = item.getAttribute('href');
            if (href === currentPage) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}