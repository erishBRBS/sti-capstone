// Data Management specific functionality
class DataManagement {
    constructor() {
        this.selectedFormat = '';
        this.init();
    }

    init() {
        this.bindEvents();
        console.log('Data Management initialized!');
    }

    bindEvents() {
        // Tab switching
        document.querySelectorAll('.data-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });

        // File upload handling
        const dropZone = document.getElementById('importDropZone');
        const fileInput = document.getElementById('importFileInput');
        const browseFilesBtn = document.getElementById('browseFilesBtn');
        const removeFileBtn = document.getElementById('removeFileBtn');
        
        browseFilesBtn.addEventListener('click', () => {
            fileInput.click();
        });
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFile(e.target.files[0]);
            }
        });
        
        removeFileBtn.addEventListener('click', () => {
            this.clearImportFile();
        });

        // Import button
        document.getElementById('importBtn').addEventListener('click', () => {
            this.startImport();
        });
        
        // Template buttons
        document.getElementById('showTemplatesBtn').addEventListener('click', () => {
            this.showTemplates();
        });
        
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => {
                this.downloadTemplate(card.dataset.template);
            });
        });
        
        document.getElementById('viewHistoryBtn').addEventListener('click', () => {
            this.viewHistory();
        });

        // Filter toggle
        document.getElementById('filterToggle').addEventListener('change', (e) => {
            const filterContent = document.getElementById('filterContent');
            if (e.target.checked) {
                filterContent.classList.add('show');
            } else {
                filterContent.classList.remove('show');
            }
        });

        // Data type change
        document.getElementById('exportDataType').addEventListener('change', () => {
            this.updateSummary();
        });
        
        // Export format selection
        document.querySelectorAll('.export-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectFormat(card.dataset.format);
            });
        });
        
        // Export buttons
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.startExport();
        });
        
        document.getElementById('previewDataBtn').addEventListener('click', () => {
            this.previewData();
        });
        
        document.getElementById('exportHistoryBtn').addEventListener('click', () => {
            this.viewExportHistory();
        });
    }

    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.data-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`.data-tab[data-tab="${tabName}"]`).classList.add('active');
        
        // Update active content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    handleFile(file) {
        const validTypes = ['.csv', '.xlsx', '.xls'];
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!validTypes.includes(fileExt)) {
            alert('Invalid file type. Please upload CSV or Excel files only.');
            return;
        }
        
        if (file.size > 50 * 1024 * 1024) {
            alert('File size exceeds 50MB limit.');
            return;
        }
        
        document.getElementById('importFileName').textContent = file.name;
        document.getElementById('importFileSize').textContent = this.formatFileSize(file.size);
        document.getElementById('importFileInfo').classList.add('show');
        document.getElementById('importDropZone').style.display = 'none';
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
    
    clearImportFile() {
        document.getElementById('importFileInput').value = '';
        document.getElementById('importFileInfo').classList.remove('show');
        document.getElementById('importDropZone').style.display = 'block';
    }
    
    startImport() {
        const dataType = document.getElementById('importDataType').value;
        const fileName = document.getElementById('importFileName').textContent;
        
        if (!dataType) {
            alert('Please select a data type.');
            return;
        }
        
        if (!fileName) {
            alert('Please select a file to import.');
            return;
        }
        
        const progressContainer = document.getElementById('importProgress');
        const progressFill = document.getElementById('importProgressFill');
        const statusMsg = document.getElementById('importStatus');
        
        progressContainer.classList.add('show');
        statusMsg.className = 'status-message show info';
        statusMsg.textContent = 'Validating file...';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            progressFill.style.width = progress + '%';
            progressFill.textContent = Math.round(progress) + '%';
            
            if (progress < 30) {
                statusMsg.textContent = 'Validating file structure...';
            } else if (progress < 60) {
                statusMsg.textContent = 'Processing records...';
            } else if (progress < 90) {
                statusMsg.textContent = 'Importing data into database...';
            }
            
            if (progress >= 100) {
                clearInterval(interval);
                statusMsg.className = 'status-message show success';
                statusMsg.innerHTML = '<i class="fas fa-check-circle"></i> Import completed successfully! 1,234 records imported.';
            }
        }, 200);
    }
    
    showTemplates() {
        const templateSection = document.getElementById('templateSection');
        templateSection.style.display = templateSection.style.display === 'none' ? 'block' : 'none';
    }
    
    downloadTemplate(type) {
        alert(`Downloading ${type} template...`);
        // In a real application, you would trigger a file download here
    }
    
    viewHistory() {
        alert('Opening import history...');
        // In a real application, you would navigate to a history page
    }
    
    viewExportHistory() {
        alert('Opening export history...');
        // In a real application, you would navigate to a history page
    }

    selectFormat(format) {
        this.selectedFormat = format;
        const cards = document.querySelectorAll('.export-card');
        cards.forEach(card => card.classList.remove('selected'));
        event.currentTarget.classList.add('selected');
        this.updateSummary();
    }

    updateSummary() {
        const dataType = document.getElementById('exportDataType').value;
        const summaryBox = document.getElementById('summaryBox');
        
        if (dataType && this.selectedFormat) {
            summaryBox.classList.add('show');
            
            const dataTypeText = document.getElementById('exportDataType').selectedOptions[0].text;
            document.getElementById('summaryDataType').textContent = dataTypeText;
            document.getElementById('summaryFormat').textContent = this.selectedFormat.toUpperCase();
            
            // Simulate estimated records and size
            const records = Math.floor(Math.random() * 5000) + 500;
            const size = (records * 0.5 + Math.random() * 100).toFixed(2);
            
            document.getElementById('summaryRecords').textContent = records.toLocaleString();
            document.getElementById('summarySize').textContent = size + ' KB';
        } else {
            summaryBox.classList.remove('show');
        }
    }

    startExport() {
        const dataType = document.getElementById('exportDataType').value;
        
        if (!dataType) {
            alert('Please select a data type to export.');
            return;
        }
        
        if (!this.selectedFormat) {
            alert('Please select an export format.');
            return;
        }
        
        const progressContainer = document.getElementById('exportProgress');
        const progressFill = document.getElementById('exportProgressFill');
        const statusMsg = document.getElementById('exportStatus');
        
        progressContainer.classList.add('show');
        statusMsg.className = 'status-message show info';
        statusMsg.textContent = 'Preparing export...';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 12;
            if (progress > 100) progress = 100;
            
            progressFill.style.width = progress + '%';
            progressFill.textContent = Math.round(progress) + '%';
            
            if (progress < 25) {
                statusMsg.textContent = 'Gathering data from database...';
            } else if (progress < 50) {
                statusMsg.textContent = 'Applying filters and processing records...';
            } else if (progress < 75) {
                statusMsg.textContent = 'Formatting data to ' + this.selectedFormat.toUpperCase() + '...';
            } else if (progress < 95) {
                statusMsg.textContent = 'Generating export file...';
            }
            
            if (progress >= 100) {
                clearInterval(interval);
                statusMsg.className = 'status-message show success';
                statusMsg.innerHTML = '<i class="fas fa-check-circle"></i> Export completed successfully! Your download will begin shortly...';
                
                // Simulate file download
                setTimeout(() => {
                    const fileName = `export_${dataType}_${Date.now()}.${this.selectedFormat}`;
                    statusMsg.innerHTML = '<i class="fas fa-check-circle"></i> Export completed! File: <strong>' + fileName + '</strong> downloaded.';
                }, 1000);
            }
        }, 250);
    }

    previewData() {
        const dataType = document.getElementById('exportDataType').value;
        if (!dataType) {
            alert('Please select a data type first.');
            return;
        }
        alert('Opening preview of ' + document.getElementById('exportDataType').selectedOptions[0].text + '...');
        // In a real application, you would show a modal with data preview
    }
}

// Initialize data management when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dataManagement = new DataManagement();
});