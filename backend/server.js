const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const pageRoutes = require('./routes/pages');
const uploadRoutes = require('./routes/upload');
const homepageRoutes = require('./routes/homepage');
const frontendRoutes = require('./routes/frontend');

const app = express();

// Security middleware with custom CSP for Webflow compatibility
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Allow inline scripts for Webflow
        "'unsafe-hashes'", // Allow inline event handlers for admin dashboard
        "https://cdn.prod.website-files.com",
        "https://assets.website-files.com",
        "https://js.website-files.com",
        "https://d3e54v103j8qbb.cloudfront.net",
        "https://ajax.googleapis.com",
        "https://www.google-analytics.com",
        "https://www.googletagmanager.com"
      ],
      scriptSrcAttr: [
        "'unsafe-inline'", // Allow inline event handlers (onclick, etc.)
        "'unsafe-hashes'"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Allow inline styles for Webflow
        "https://cdn.prod.website-files.com",
        "https://assets.website-files.com",
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com" // Font Awesome and other CDN resources
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https://cdn.prod.website-files.com",
        "https://assets.website-files.com",
        "https://uploads-ssl.webflow.com",
        "https://d3e54v103j8qbb.cloudfront.net", // Webflow CloudFront CDN
        "https://www.google-analytics.com"
      ],
      fontSrc: [
        "'self'",
        "data:", // Allow data URI fonts
        "https://fonts.gstatic.com",
        "https://cdn.prod.website-files.com",
        "https://assets.website-files.com",
        "https://cdnjs.cloudflare.com" // Font Awesome fonts
      ],
      connectSrc: [
        "'self'",
        "https://www.google-analytics.com",
        "https://analytics.google.com"
      ],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"]
    }
  }
}));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000', 'http://127.0.0.1:5500'],
  credentials: true
}));

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });

// app.use(limiter);

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Set proper MIME types for static files
app.use((req, res, next) => {
  if (req.path.endsWith('.css')) {
    res.type('text/css');
  } else if (req.path.endsWith('.js')) {
    res.type('application/javascript');
  }
  next();
});

// Static files
app.use('/uploads', express.static('uploads'));
app.use('/admin', express.static('public/admin'));
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
app.use('/images', express.static('public/images'));
app.use('/fonts', express.static('public/fonts'));
app.use('/work', express.static('public/work'));
app.use('/categories', express.static('public/categories'));

// Initialize JSON database
const database = require('./utils/database');
console.log('✅ JSON Database initialized');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/homepage', homepageRoutes);

// Frontend Routes (serve website pages)
app.use('/', frontendRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
