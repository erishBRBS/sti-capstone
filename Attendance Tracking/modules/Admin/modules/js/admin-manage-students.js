class AdminManageStudents {
    constructor() {
        this.currentPage = 1;
        this.studentsPerPage = 10;
        this.filteredStudents = [];
        this.allStudents = [];
        this.init();
    }

    init() {
        this.loadSampleData();
        this.bindEvents();
        this.renderTable();
        console.log('Admin Manage Students initialized!');
        
        // Show welcome alert
        AlertManager.info('Manage Students module loaded successfully!');
    }

    loadSampleData() {
        // Sample student data with email and contact fields (10 students)
        this.allStudents = [
            {
                id: "2025-001",
                name: "John Michael Doe",
                course: "BSIT",
                yearSection: "3rd Year - A",
                email: "john.doe@university.edu",
                contact: "0912-345-6789",
                rfid: "RFID12345",
                faceImage: "https://via.placeholder.com/40"
            },
            {
                id: "2025-002",
                name: "Jane Marie Smith",
                course: "BSED",
                yearSection: "2nd Year - B",
                email: "jane.smith@university.edu",
                contact: "0912-345-6790",
                rfid: "RFID67890",
                faceImage: "https://via.placeholder.com/40"
            },
            {
                id: "2025-003",
                name: "Robert James Johnson",
                course: "BSCS",
                yearSection: "4th Year - C",
                email: "robert.johnson@university.edu",
                contact: "0912-345-6791",
                rfid: "RFID54321",
                faceImage: "https://via.placeholder.com/40"
            },
            {
                id: "2025-004",
                name: "Maria Santos Garcia",
                course: "BSBA",
                yearSection: "1st Year - A",
                email: "maria.garcia@university.edu",
                contact: "0912-345-6792",
                rfid: "RFID98765",
                faceImage: "https://via.placeholder.com/40"
            },
            {
                id: "2025-005",
                name: "Carlos David Reyes",
                course: "BSIT",
                yearSection: "3rd Year - B",
                email: "carlos.reyes@university.edu",
                contact: "0912-345-6793",
                rfid: "RFID45678",
                faceImage: "https://via.placeholder.com/40"
            },
            {
                id: "2025-006",
                name: "Sarah Lynn Tan",
                course: "BSED",
                yearSection: "2nd Year - C",
                email: "sarah.tan@university.edu",
                contact: "0912-345-6794",
                rfid: "RFID23456",
                faceImage: "https://via.placeholder.com/40"
            },
            {
                id: "2025-007",
                name: "Michael Anthony Cruz",
                course: "BSCS",
                yearSection: "4th Year - A",
                email: "michael.cruz@university.edu",
                contact: "0912-345-6795",
                rfid: "RFID87654",
                faceImage: "https://via.placeholder.com/40"
            },
            {
                id: "2025-008",
                name: "Andrea Nicole Lim",
                course: "BSBA",
                yearSection: "1st Year - B",
                email: "andrea.lim@university.edu",
                contact: "0912-345-6796",
                rfid: "RFID34567",
                faceImage: "https://via.placeholder.com/40"
            },
            {
                id: "2025-009",
                name: "Daniel Patrick Ong",
                course: "BSIT",
                yearSection: "3rd Year - D",
                email: "daniel.ong@university.edu",
                contact: "0912-345-6797",
                rfid: "RFID76543",
                faceImage: "https://via.placeholder.com/40"
            },
            {
                id: "2025-010",
                name: "Christine Ann Torres",
                course: "BSED",
                yearSection: "2nd Year - A",
                email: "christine.torres@university.edu",
                contact: "0912-345-6798",
                rfid: "RFID65432",
                faceImage: "https://via.placeholder.com/40"
            }
        ];
        this.filteredStudents = [...this.allStudents];
    }

    bindEvents() {
        // Export buttons
        document.getElementById('exportCSV').addEventListener('click', () => {
            this.exportTableToCSV();
        });

        document.getElementById('exportExcel').addEventListener('click', () => {
            this.exportTableToExcel();
        });

        // Filter form submission
        document.getElementById('applyFilters').addEventListener('click', (e) => {
            e.preventDefault();
            this.applyFilters();
        });

        // Search input
        document.getElementById('searchInput').addEventListener('input', () => {
            this.applyFilters();
        });

        // Filter dropdowns
        document.getElementById('filterCourse').addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('filterSection').addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('filterYear').addEventListener('change', () => {
            this.applyFilters();
        });

        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => {
            this.previousPage();
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            this.nextPage();
        });

        // Form submissions
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.registerStudent();
        });

        document.getElementById('editForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateStudent();
        });

        // Notification button
        document.querySelector('.notification-btn').addEventListener('click', () => {
            this.showNotifications();
        });
    }

    applyFilters() {
        const search = document.getElementById('searchInput').value.toLowerCase();
        const course = document.getElementById('filterCourse').value;
        const section = document.getElementById('filterSection').value;
        const year = document.getElementById('filterYear').value;

        this.filteredStudents = this.allStudents.filter(student => {
            // Search by name or ID
            const matchesSearch = !search || 
                student.name.toLowerCase().includes(search) || 
                student.id.toLowerCase().includes(search);
            
            // Filter by course
            const matchesCourse = !course || student.course === course;
            
            // Filter by section
            const matchesSection = !section || student.yearSection.includes(`- ${section}`);
            
            // Filter by year level
            const matchesYear = !year || student.yearSection.includes(year);
            
            return matchesSearch && matchesCourse && matchesSection && matchesYear;
        });
        
        this.currentPage = 1;
        this.renderTable();
        AlertManager.success('Filters applied successfully!');
    }

    renderTable() {
        const tableBody = document.getElementById('studentTableBody');
        const startIndex = (this.currentPage - 1) * this.studentsPerPage;
        const endIndex = startIndex + this.studentsPerPage;
        const pageData = this.filteredStudents.slice(startIndex, endIndex);

        tableBody.innerHTML = '';

        pageData.forEach(student => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.course}</td>
                <td>${student.yearSection}</td>
                <td>${student.email}</td>
                <td>${student.contact}</td>
                <td>${student.rfid}</td>
                <td><img src="${student.faceImage}" alt="Face ID" class="rounded-full" width="40" height="40"></td>
                <td class="action-cell">
                    <button class="action-btn view-btn" onclick="adminManageStudents.openModal('view')"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit-btn" onclick="adminManageStudents.openModal('edit')"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" onclick="adminManageStudents.confirmDelete()"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });

        this.updatePaginationInfo();
    }

    updatePaginationInfo() {
        const totalRecords = this.filteredStudents.length;
        const totalPages = Math.ceil(totalRecords / this.studentsPerPage);
        
        document.getElementById('showingCount').textContent = Math.min(this.studentsPerPage, totalRecords - (this.currentPage - 1) * this.studentsPerPage);
        document.getElementById('totalCount').textContent = totalRecords;
        document.getElementById('currentPage').textContent = this.currentPage;
        document.getElementById('totalPages').textContent = totalPages;

        // Enable/disable pagination buttons
        document.getElementById('prevPage').disabled = this.currentPage === 1;
        document.getElementById('nextPage').disabled = this.currentPage === totalPages || totalPages === 0;
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderTable();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredStudents.length / this.studentsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderTable();
        }
    }

    registerStudent() {
        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            studentId: document.getElementById('studentId').value,
            course: document.getElementById('course').value,
            yearSection: document.getElementById('yearSection').value,
            email: document.getElementById('email').value,
            contact: document.getElementById('contact').value,
            rfid: document.getElementById('rfid').value,
            faceImage: document.getElementById('faceImage').files[0]
        };

        // Validate form data
        if (!this.validateStudentForm(formData)) {
            return;
        }

        // Add student to data
        const newStudent = {
            id: formData.studentId,
            name: formData.fullName,
            course: formData.course,
            yearSection: formData.yearSection,
            email: formData.email,
            contact: formData.contact,
            rfid: formData.rfid,
            faceImage: "https://via.placeholder.com/40" // In real app, this would be the uploaded image URL
        };

        this.allStudents.push(newStudent);
        this.filteredStudents = [...this.allStudents];
        
        // Reset form
        document.getElementById('registerForm').reset();
        
        // Update table
        this.currentPage = Math.ceil(this.filteredStudents.length / this.studentsPerPage);
        this.renderTable();
        
        AlertManager.success('Student registered successfully!');
    }

    validateStudentForm(formData) {
        // Check if student ID already exists
        if (this.allStudents.some(student => student.id === formData.studentId)) {
            AlertManager.error('Student ID already exists!');
            return false;
        }

        // Check if email already exists
        if (this.allStudents.some(student => student.email === formData.email)) {
            AlertManager.error('Email already exists!');
            return false;
        }

        // Check if RFID already exists
        if (this.allStudents.some(student => student.rfid === formData.rfid)) {
            AlertManager.error('RFID code already exists!');
            return false;
        }

        return true;
    }

    updateStudent() {
        // In a real app, this would update the student in the database
        AlertManager.success('Student information updated successfully!');
        this.closeModal('edit');
    }

    confirmDelete() {
        if (confirm('Are you sure you want to delete this student record? This action cannot be undone.')) {
            AlertManager.success('Student record deleted successfully.');
        }
    }

    openModal(type) {
        document.getElementById(`${type}Modal`).classList.add('active');
    }

    closeModal(type) {
        document.getElementById(`${type}Modal`).classList.remove('active');
    }

    exportTableToCSV() {
        let csv = [];
        
        // Add headers
        const headers = ['Student ID', 'Name', 'Course', 'Year & Section', 'Email', 'Contact', 'RFID'];
        csv.push(headers.join(','));
        
        // Add data rows
        this.filteredStudents.forEach(student => {
            const row = [
                student.id,
                `"${student.name}"`, // Wrap in quotes to handle commas in names
                student.course,
                `"${student.yearSection}"`,
                student.email,
                student.contact,
                student.rfid
            ];
            csv.push(row.join(','));
        });
        
        this.downloadCSV(csv.join('\n'), 'student_list.csv');
        AlertManager.success('CSV exported successfully!');
    }

    downloadCSV(csv, filename) {
        const csvFile = new Blob([csv], { type: 'text/csv' });
        const downloadLink = document.createElement('a');
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    exportTableToExcel() {
        // Create table HTML for Excel
        let tableHTML = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="UTF-8">
                <style>
                    table { border-collapse: collapse; width: 100%; }
                    th { background-color: #1a4b8c; color: white; font-weight: bold; padding: 8px; border: 1px solid #ddd; }
                    td { padding: 8px; border: 1px solid #ddd; }
                </style>
            </head>
            <body>
                <table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Course</th>
                            <th>Year & Section</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>RFID</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // Add data rows
        this.filteredStudents.forEach(student => {
            tableHTML += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.course}</td>
                    <td>${student.yearSection}</td>
                    <td>${student.email}</td>
                    <td>${student.contact}</td>
                    <td>${student.rfid}</td>
                </tr>
            `;
        });
        
        tableHTML += `
                    </tbody>
                </table>
            </body>
            </html>
        `;
        
        // Create and trigger download
        const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel' });
        const link = document.createElement('a');
        link.download = 'student_list.xls';
        link.href = window.URL.createObjectURL(blob);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        AlertManager.success('Excel exported successfully!');
    }

    showNotifications() {
        AlertManager.info('You have 3 new notifications');
    }
}