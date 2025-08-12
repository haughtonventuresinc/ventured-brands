# Ventured Brands CMS Backend

A Node.js/Express backend with MongoDB for managing the Ventured Brands website content like WordPress.

## 🚀 Features

- **JWT Authentication** - Secure login system for admin users
- **Page Management** - Edit website content through a web dashboard
- **Media Library** - Upload and manage images
- **User Management** - Admin can create editor accounts
- **Content Blocks** - WordPress-like content editing system
- **File Upload** - Image upload with validation
- **Security** - Rate limiting, CORS, helmet protection

## 📁 Project Structure

```
backend/
├── models/           # MongoDB schemas
│   ├── User.js      # User authentication model
│   └── Page.js      # Page content model
├── routes/          # API endpoints
│   ├── auth.js      # Authentication routes
│   ├── pages.js     # Page management routes
│   └── upload.js    # File upload routes
├── middleware/      # Custom middleware
│   └── auth.js      # JWT authentication middleware
├── public/admin/    # Admin dashboard frontend
│   ├── index.html   # Dashboard UI
│   └── js/admin.js  # Dashboard JavaScript
├── scripts/         # Utility scripts
│   └── init-admin.js # Create initial admin user
├── uploads/         # Uploaded files directory
├── server.js        # Main server file
└── package.json     # Dependencies
```

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your settings
# - Set MongoDB connection string
# - Set JWT secret (use a strong random string)
# - Configure admin credentials
```

### 3. Database Setup
Make sure MongoDB is running, then create the initial admin user:
```bash
node scripts/init-admin.js
```

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Create new user (admin only)
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Pages
- `GET /api/pages` - Get all pages
- `GET /api/pages/:id` - Get single page
- `POST /api/pages` - Create new page
- `PUT /api/pages/:id` - Update page
- `DELETE /api/pages/:id` - Delete page (admin only)
- `POST /api/pages/:id/content` - Update page content blocks
- `POST /api/pages/scan/html` - Scan HTML files and create page entries

### File Upload
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/multiple` - Upload multiple images
- `GET /api/upload/list` - List uploaded files
- `DELETE /api/upload/:filename` - Delete uploaded file

### Health Check
- `GET /api/health` - Server health status

## 🎨 Admin Dashboard

Access the admin dashboard at: `http://localhost:5000/admin`

**Default Login:**
- Email: `admin@venturedbrands.com`
- Password: `admin123`

### Dashboard Features

1. **Pages Management**
   - View all website pages
   - Edit page content using content blocks
   - Publish/unpublish pages
   - Scan HTML files to create page entries

2. **Media Library**
   - Upload images
   - View uploaded files
   - Delete files

3. **User Management**
   - View user accounts
   - Create new editor accounts (admin only)

## 🔧 Content Editing System

The CMS uses a "Content Blocks" system similar to WordPress:

1. **Scan HTML Files** - Automatically detect pages from your HTML files
2. **Define Content Blocks** - Specify CSS selectors for editable content
3. **Edit Content** - Use the dashboard to edit text, headings, paragraphs
4. **Auto-Update** - Changes are applied to both database and HTML files

### Content Block Types
- `text` - Plain text content
- `html` - Rich HTML content
- `heading` - Page headings
- `paragraph` - Text paragraphs
- `image` - Image sources

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - Prevent brute force attacks
- **CORS Protection** - Configurable cross-origin requests
- **Helmet Security** - Security headers
- **File Validation** - Image upload restrictions
- **Role-based Access** - Admin vs Editor permissions

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your-super-secure-jwt-secret
PORT=5000
```

### Recommended Deployment Stack
- **Database**: MongoDB Atlas
- **Hosting**: Railway, Render, or DigitalOcean
- **File Storage**: Local uploads (or extend to AWS S3)

## 📝 Usage Examples

### 1. First Time Setup
```bash
# Install and setup
npm install
cp .env.example .env
# Edit .env with your settings
node scripts/init-admin.js
npm run dev
```

### 2. Access Dashboard
1. Go to `http://localhost:5000/admin`
2. Login with admin credentials
3. Click "Scan HTML Files" to import your pages
4. Start editing content!

### 3. Edit Page Content
1. Go to Pages section
2. Click "Edit" on any page
3. Add content blocks with CSS selectors
4. Save changes - HTML files are updated automatically

## 🤝 Contributing

This CMS is specifically designed for the Ventured Brands website but can be adapted for other static sites.

## 📄 License

ISC License - See package.json for details
