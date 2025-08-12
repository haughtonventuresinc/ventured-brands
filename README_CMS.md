# Ventured Brands Website & CMS

This is the official website for Ventured Brands with a complete Content Management System (CMS) backend, showcasing our venture studio model and brand licensing opportunities.

## Features

### Frontend
- Modern, responsive design
- Portfolio showcase
- Contact forms with FAQ section
- Brand categories (Work, Play, Live)
- Dynamic content loading

### Backend CMS
- **Admin Dashboard** - WordPress-like content management
- **JWT Authentication** - Secure login system
- **Content Editor** - Edit page content in real-time
- **User Management** - Admin and editor roles
- **Page Scanner** - Automatically detect editable content
- **RESTful API** - Full CRUD operations for content

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
   - Check `.env` file and update with your settings
   - Default admin credentials: `admin@venturedbrands.com` / `admin123`
   - Update `JWT_SECRET` for production

3. **Start MongoDB:**
   - Local: `mongod`
   - Or use MongoDB Atlas cloud service

4. **Run the application:**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

5. **Access the application:**
   - Main website: `http://localhost:3000`
   - Admin dashboard: `http://localhost:3000/admin`

## CMS Usage

### First Time Setup
1. Navigate to `/admin`
2. Login with default credentials
3. Click "Scan Pages" to automatically detect editable content
4. Start editing your content!

### Content Management
- **Dashboard**: View statistics and recent updates
- **Pages**: Overview of all pages and their content
- **Content Editor**: Edit individual content items
- **Users**: Manage admin and editor accounts

### Making Content Editable
Add `data-cms-section` attributes to HTML elements:
```html
<h1 data-cms-section="hero-title" data-cms-type="text">Welcome to Ventured Brands</h1>
<div data-cms-section="about-content" data-cms-type="html">Your content here</div>
<img data-cms-section="hero-image" data-cms-type="image" src="image.jpg" alt="Hero">
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Content Management
- `GET /api/content/:page` - Get page content
- `PUT /api/content/:id` - Update content
- `POST /api/content` - Create new content
- `DELETE /api/content/:id` - Delete content

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/pages` - All pages overview
- `POST /api/admin/scan-pages` - Scan HTML for content
- `GET /api/admin/users` - User management

## Project Structure

```
├── admin/                 # Admin dashboard frontend
│   ├── index.html        # Dashboard HTML
│   ├── admin.css         # Dashboard styles
│   └── admin.js          # Dashboard JavaScript
├── models/               # Database models
│   ├── User.js          # User model
│   └── Content.js       # Content model
├── routes/              # API routes
│   ├── auth.js          # Authentication routes
│   ├── admin.js         # Admin routes
│   └── content.js       # Content routes
├── middleware/          # Express middleware
│   └── auth.js          # JWT authentication
├── utils/               # Utility functions
│   └── createAdmin.js   # Default admin creation
├── server.js            # Main server file
├── package.json         # Dependencies
└── .env                 # Environment variables
```

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation with Joi

## Deployment

1. Set `NODE_ENV=production` in environment
2. Update MongoDB connection string
3. Change default admin credentials
4. Set strong JWT secret
5. Configure CORS for your domain

## Contact

For more information about Ventured Brands, visit our website or contact us through the contact form.
