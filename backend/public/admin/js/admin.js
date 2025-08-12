class VenturedBrandsCMS {
    constructor() {
        this.apiUrl = 'http://localhost:5000/api';
        this.token = localStorage.getItem('cms_token');
        this.currentUser = null;
        this.currentPage = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuth();
    }

    bindEvents() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.login();
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Navigation
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });

        // Scan pages
        const scanPagesBtn = document.getElementById('scanPagesBtn');
        if (scanPagesBtn) {
            scanPagesBtn.addEventListener('click', () => {
                this.scanPages();
            });
        }

        // Upload files
        const uploadBtn = document.getElementById('uploadBtn');
        const fileInput = document.getElementById('fileInput');
        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', () => {
                fileInput.click();
            });

            fileInput.addEventListener('change', (e) => {
                this.uploadFiles(e.target.files);
            });
        }

        // Page editor
        const closeEditorBtn = document.getElementById('closeEditorBtn');
        if (closeEditorBtn) {
            closeEditorBtn.addEventListener('click', () => {
                this.closePageEditor();
            });
        }

        const cancelEditBtn = document.getElementById('cancelEditBtn');
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', () => {
                this.closePageEditor();
            });
        }

        const savePageBtn = document.getElementById('savePageBtn');
        if (savePageBtn) {
            savePageBtn.addEventListener('click', () => {
                this.savePage();
            });
        }
    }

    async checkAuth() {
        if (!this.token) {
            this.showLogin();
            return;
        }

        try {
            const response = await fetch(`${this.apiUrl}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.currentUser = data.user;
                this.showDashboard();
            } else {
                this.showLogin();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            this.showLogin();
        }
    }

    async login() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');

        try {
            const response = await fetch(`${this.apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.token;
                this.currentUser = data.user;
                localStorage.setItem('cms_token', this.token);
                this.showDashboard();
            } else {
                errorDiv.textContent = data.message;
                errorDiv.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Login failed:', error);
            errorDiv.textContent = 'Login failed. Please try again.';
            errorDiv.classList.remove('hidden');
        }
    }

    logout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('cms_token');
        this.showLogin();
    }

    showLogin() {
        const loginModal = document.getElementById('loginModal');
        const dashboard = document.getElementById('dashboard');
        
        if (loginModal) loginModal.classList.remove('hidden');
        if (dashboard) dashboard.classList.add('hidden');
    }

    showDashboard() {
        const loginModal = document.getElementById('loginModal');
        const dashboard = document.getElementById('dashboard');
        const userEmail = document.getElementById('userEmail');
        
        if (loginModal) loginModal.classList.add('hidden');
        if (dashboard) dashboard.classList.remove('hidden');
        if (userEmail && this.currentUser) userEmail.textContent = this.currentUser.email;
        
        // Only call showSection if we're on a page that has sections
        if (document.getElementById('pagesSection')) {
            this.showSection('pages');
        }
    }

    showSection(section) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
        
        // Show selected section
        const targetSection = document.getElementById(`${section}Section`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
        
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(link => {
            link.classList.remove('active');
        });
        
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Load section data
        switch (section) {
            case 'pages':
                this.loadPages();
                break;
            case 'media':
                this.loadMedia();
                break;
            case 'users':
                this.loadUsers();
                break;
        }
    }

    async loadPages() {
        try {
            const response = await fetch(`${this.apiUrl}/pages`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.renderPages(data.pages);
            }
        } catch (error) {
            console.error('Failed to load pages:', error);
        }
    }

    renderPages(pages) {
        const tbody = document.getElementById('pagesTable');
        tbody.innerHTML = '';

        pages.forEach(page => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div style="font-weight: 600;">${page.name}</div>
                    <div style="font-size: 12px; color: #666;">${page.slug}</div>
                </td>
                <td>
                    <span class="badge ${page.isPublished ? 'badge-success' : 'badge-danger'}">
                        ${page.isPublished ? 'Published' : 'Draft'}
                    </span>
                </td>
                <td>
                    ${new Date(page.lastModified).toLocaleDateString()}
                </td>
                <td>
                    <a href="#" onclick="cms.editPage('${page.id}')" class="btn-link">
                        <i class="fas fa-edit"></i> Edit
                    </a>
                    <a href="${page.htmlFile === 'index.html' ? '/' : '../' + page.htmlFile}" target="_blank" class="btn-link">
                        <i class="fas fa-external-link-alt"></i> View
                    </a>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    async scanPages() {
        try {
            const response = await fetch(`${this.apiUrl}/pages/scan/html`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                this.loadPages();
            }
        } catch (error) {
            console.error('Failed to scan pages:', error);
            alert('Failed to scan pages');
        }
    }

    async editPage(pageId) {
        try {
            const response = await fetch(`${this.apiUrl}/pages/${pageId}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.currentPage = data.page;
                
                // Check if this is the homepage - redirect to dedicated homepage editor
                if (this.currentPage.slug === 'home' || this.currentPage.htmlFile === 'index.html' || this.currentPage.name === 'Homepage') {
                    window.location.href = '/admin/homepage.html';
                    return;
                }
                
                this.showPageEditor();
            }
        } catch (error) {
            console.error('Failed to load page:', error);
        }
    }

    showPageEditor() {
        const modal = document.getElementById('pageEditorModal');
        const content = document.getElementById('pageEditorContent');
        
        content.innerHTML = `
            <div class="mb-6">
                <h4 class="text-lg font-medium mb-2">Editing: ${this.currentPage.name}</h4>
                <p class="text-gray-600">File: ${this.currentPage.htmlFile}</p>
            </div>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                    <input type="text" id="pageTitle" value="${this.currentPage.title}" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea id="pageDescription" rows="3" 
                              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">${this.currentPage.description || ''}</textarea>
                </div>
                
                <div>
                    <label class="flex items-center">
                        <input type="checkbox" id="pagePublished" ${this.currentPage.isPublished ? 'checked' : ''} 
                               class="mr-2">
                        <span class="text-sm font-medium text-gray-700">Published</span>
                    </label>
                </div>
                
                <div>
                    <h5 class="text-md font-medium text-gray-700 mb-2">Content Blocks</h5>
                    <div id="contentBlocks">
                        ${this.renderContentBlocks()}
                    </div>
                    <button type="button" onclick="cms.addContentBlock()" 
                            class="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        <i class="fas fa-plus mr-2"></i>Add Content Block
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
    }

    renderContentBlocks() {
        if (!this.currentPage.contentBlocks || this.currentPage.contentBlocks.length === 0) {
            return '<p class="text-gray-500 italic">No content blocks defined. Add some to start editing page content.</p>';
        }

        return this.currentPage.contentBlocks.map((block, index) => `
            <div class="border border-gray-200 rounded-md p-4 mb-4">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 mb-1">CSS Selector</label>
                        <input type="text" value="${block.selector}" 
                               onchange="cms.updateContentBlock(${index}, 'selector', this.value)"
                               class="w-full px-3 py-1 text-sm border border-gray-300 rounded">
                    </div>
                    <div class="ml-4">
                        <select onchange="cms.updateContentBlock(${index}, 'type', this.value)" 
                                class="px-2 py-1 text-sm border border-gray-300 rounded">
                            <option value="text" ${block.type === 'text' ? 'selected' : ''}>Text</option>
                            <option value="html" ${block.type === 'html' ? 'selected' : ''}>HTML</option>
                            <option value="heading" ${block.type === 'heading' ? 'selected' : ''}>Heading</option>
                            <option value="paragraph" ${block.type === 'paragraph' ? 'selected' : ''}>Paragraph</option>
                        </select>
                    </div>
                    <button onclick="cms.removeContentBlock(${index})" 
                            class="ml-2 text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea rows="3" onchange="cms.updateContentBlock(${index}, 'content', this.value)"
                              class="w-full px-3 py-2 text-sm border border-gray-300 rounded">${block.content}</textarea>
                </div>
            </div>
        `).join('');
    }

    addContentBlock() {
        if (!this.currentPage.contentBlocks) {
            this.currentPage.contentBlocks = [];
        }
        
        this.currentPage.contentBlocks.push({
            type: 'text',
            selector: '',
            content: ''
        });
        
        document.getElementById('contentBlocks').innerHTML = this.renderContentBlocks();
    }

    updateContentBlock(index, field, value) {
        if (this.currentPage.contentBlocks[index]) {
            this.currentPage.contentBlocks[index][field] = value;
        }
    }

    removeContentBlock(index) {
        this.currentPage.contentBlocks.splice(index, 1);
        document.getElementById('contentBlocks').innerHTML = this.renderContentBlocks();
    }

    closePageEditor() {
        document.getElementById('pageEditorModal').classList.add('hidden');
        this.currentPage = null;
    }

    async savePage() {
        if (!this.currentPage) return;

        const title = document.getElementById('pageTitle').value;
        const description = document.getElementById('pageDescription').value;
        const isPublished = document.getElementById('pagePublished').checked;

        try {
            const response = await fetch(`${this.apiUrl}/pages/${this.currentPage._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    ...this.currentPage,
                    title,
                    description,
                    isPublished
                })
            });

            if (response.ok) {
                alert('Page saved successfully!');
                this.closePageEditor();
                this.loadPages();
            } else {
                const data = await response.json();
                alert('Failed to save page: ' + data.message);
            }
        } catch (error) {
            console.error('Failed to save page:', error);
            alert('Failed to save page');
        }
    }

    async loadMedia() {
        try {
            const response = await fetch(`${this.apiUrl}/upload/list`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.renderMedia(data.files);
            }
        } catch (error) {
            console.error('Failed to load media:', error);
        }
    }

    renderMedia(files) {
        const grid = document.getElementById('mediaGrid');
        grid.innerHTML = '';

        files.forEach(file => {
            const div = document.createElement('div');
            div.className = 'media-item';
            div.innerHTML = `
                <img src="${this.apiUrl.replace('/api', '')}${file.url}" alt="${file.filename}">
                <div class="media-overlay">
                    <button onclick="cms.deleteMedia('${file.filename}')" 
                            style="color: white; background: none; border: none; cursor: pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="media-filename">${file.filename}</div>
            `;
            grid.appendChild(div);
        });
    }

    async uploadFiles(files) {
        const formData = new FormData();
        
        for (let file of files) {
            formData.append('images', file);
        }

        try {
            const response = await fetch(`${this.apiUrl}/upload/multiple`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                this.loadMedia();
            } else {
                const data = await response.json();
                alert('Upload failed: ' + data.message);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed');
        }
    }

    async deleteMedia(filename) {
        if (!confirm('Are you sure you want to delete this file?')) return;

        try {
            const response = await fetch(`${this.apiUrl}/upload/${filename}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                this.loadMedia();
            }
        } catch (error) {
            console.error('Failed to delete file:', error);
        }
    }

    async loadUsers() {
        // For now, just show current user info
        const tbody = document.getElementById('usersTable');
        tbody.innerHTML = `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${this.currentUser.email}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        ${this.currentUser.role}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${this.currentUser.lastLogin ? new Date(this.currentUser.lastLogin).toLocaleDateString() : 'Never'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                    </span>
                </td>
            </tr>
        `;
    }
}

// Initialize CMS
const cms = new VenturedBrandsCMS();
