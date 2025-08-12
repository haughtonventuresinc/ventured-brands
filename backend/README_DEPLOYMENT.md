# 🚀 Ventured Brands - Complete Deployment Guide

Your Ventured Brands website and CMS are now fully integrated into a single Node.js backend for easy deployment!

## 📁 New Project Structure

```
backend/
├── public/                 # Website frontend files
│   ├── index.html         # Homepage
│   ├── about.html         # About page
│   ├── contact.html       # Contact page
│   ├── portfolio.html     # Portfolio page
│   ├── verticals.html     # Investment verticals
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   ├── images/           # Images and assets
│   ├── fonts/            # Font files
│   ├── work/             # Case study pages
│   ├── categories/       # Category pages
│   └── admin/            # CMS admin dashboard
├── routes/
│   ├── frontend.js       # Website page routes
│   ├── auth.js          # Authentication API
│   ├── pages.js         # Page management API
│   └── upload.js        # File upload API
├── models/              # Data models
├── utils/               # Database utilities
├── data/                # JSON database files
└── scripts/             # Setup scripts
```

## 🎯 How It Works

### Website Routes (Public)
- `http://localhost:5000/` → Homepage (index.html)
- `http://localhost:5000/about` → About page
- `http://localhost:5000/contact` → Contact page
- `http://localhost:5000/portfolio` → Portfolio page
- `http://localhost:5000/verticals` → Investment verticals
- `http://localhost:5000/work/[slug]` → Case study pages
- `http://localhost:5000/categories/[slug]` → Category pages

### Admin Dashboard
- `http://localhost:5000/admin` → CMS Admin Dashboard

### API Endpoints
- `http://localhost:5000/api/auth/*` → Authentication
- `http://localhost:5000/api/pages/*` → Page management
- `http://localhost:5000/api/upload/*` → File uploads

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Database & Admin User
```bash
npm run setup
```
This creates:
- Admin user: `admin@venturedbrands.com` / `admin123`
- All website pages in the database

### 3. Start the Server
```bash
npm start
```

### 4. Access Your Site
- **Website**: http://localhost:5000
- **Admin Dashboard**: http://localhost:5000/admin

## 🎨 Content Management

### Adding Editable Content Blocks

1. Go to http://localhost:5000/admin
2. Login with admin credentials
3. Click on "Pages" in the sidebar
4. Click "Edit" on any page
5. Add content blocks with CSS selectors

**Example Content Block:**
- **Type**: `text`
- **CSS Selector**: `.hero-title`
- **Content**: `Welcome to Ventured Brands`

This will replace any element with class `hero-title` with your new content.

### Uploading Images

1. Go to "Media Library" in admin dashboard
2. Click "Upload Images"
3. Select and upload your images
4. Use the uploaded images in your content blocks

## 🌐 Deployment Options

### Option 1: Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 2: Render
1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Deploy!

### Option 3: DigitalOcean App Platform
1. Create new app from GitHub
2. Set build command: `npm install`
3. Set run command: `npm start`
4. Deploy!

### Option 4: Heroku
```bash
# Install Heroku CLI
heroku create ventured-brands-cms
git push heroku main
```

## 🔧 Environment Variables for Production

Create a `.env` file with:
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secure-jwt-secret-here
ADMIN_EMAIL=admin@venturedbrands.com
ADMIN_PASSWORD=your-secure-password
```

## 📊 Features

### ✅ What's Included
- **Complete Website**: All pages served with proper routing
- **CMS Dashboard**: WordPress-like content management
- **File Uploads**: Image management system
- **User Management**: Admin and editor roles
- **JSON Database**: No external database required
- **Security**: JWT authentication, rate limiting, CORS protection
- **SEO Ready**: Proper meta tags and structure

### 🎯 Content Editing Features
- **Visual Content Blocks**: Edit text, headings, paragraphs
- **Image Management**: Upload and organize media files
- **Page Publishing**: Publish/unpublish pages
- **User Roles**: Admin and editor permissions
- **Real-time Updates**: Changes reflect immediately

## 🔒 Security Features

- **JWT Authentication**: Secure token-based login
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevent brute force attacks
- **CORS Protection**: Configurable cross-origin requests
- **File Validation**: Image upload restrictions
- **Role-based Access**: Admin vs Editor permissions

## 📝 Maintenance

### Backup Data
Your data is stored in `backend/data/`:
- `users.json` - User accounts
- `pages.json` - Page content and settings

### Update Content
1. Use the admin dashboard at `/admin`
2. Or directly edit JSON files (not recommended)

### Add New Pages
1. Add HTML file to `public/` directory
2. Add route in `routes/frontend.js`
3. Create page entry in admin dashboard

## 🆘 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 5000
npx kill-port 5000
```

**Admin login not working:**
```bash
# Reset admin user
npm run init-admin
```

**Pages not loading:**
```bash
# Reinitialize pages
npm run init-pages
```

### Support
- Check server logs for errors
- Verify all files are in `public/` directory
- Ensure JSON database files exist in `data/`

## 🎉 Success!

Your Ventured Brands website is now a fully integrated CMS-powered site ready for deployment! 

**Next Steps:**
1. Customize content through the admin dashboard
2. Add your own branding and styling
3. Deploy to your preferred hosting platform
4. Set up your custom domain

The entire application is now contained in the `backend/` folder and can be deployed as a single unit to any Node.js hosting service.
