const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const Page = require('../models/PageModel');
const HomepageModel = require('../models/HomepageModel');
const HomepageTemplate = require('../utils/homepageTemplate');

const router = express.Router();

// Helper function to serve HTML with dynamic content
async function servePageWithContent(req, res, htmlFile, pageSlug) {
  try {
    const htmlPath = path.join(__dirname, '../public', htmlFile);
    let htmlContent = await fs.readFile(htmlPath, 'utf8');
    
    // Try to find page data in database
    const page = await Page.findBySlug(pageSlug);
    
    if (page && page.contentBlocks && page.contentBlocks.length > 0) {
      // Apply content blocks to HTML
      for (const block of page.contentBlocks) {
        const { selector, content, type } = block;
        
        // Simple content replacement based on CSS selectors
        // This is a basic implementation - in production you'd want a proper HTML parser
        if (selector && content) {
          // Remove the dot from class selector for regex
          const className = selector.replace('.', '');
          
          // Create regex to find elements with this class
          const regex = new RegExp(
            `(<[^>]*class="[^"]*\\b${className}\\b[^"]*"[^>]*>)([^<]*)(</[^>]*>)`,
            'gi'
          );
          
          if (type === 'text' || type === 'paragraph' || type === 'heading') {
            htmlContent = htmlContent.replace(regex, `$1${content}$3`);
          }
        }
      }
    }
    
    res.send(htmlContent);
  } catch (error) {
    console.error('Error serving page:', error);
    res.status(500).send('Error loading page');
  }
}

// Home page route with CMS content
router.get('/', async (req, res) => {
  try {
    const homepageModel = new HomepageModel();
    const homepageTemplate = new HomepageTemplate();
    
    // Get CMS content
    const homepageData = await homepageModel.getContent();
    
    // Generate dynamic homepage
    const dynamicHtml = await homepageTemplate.generateHomepage(homepageData);
    
    res.send(dynamicHtml);
  } catch (error) {
    console.error('Error serving homepage:', error);
    // Fallback to static homepage
    await servePageWithContent(req, res, 'index.html', 'home');
  }
});

// About page route
router.get('/about', async (req, res) => {
  await servePageWithContent(req, res, 'about.html', 'about');
});

// Contact page route
router.get('/contact', async (req, res) => {
  await servePageWithContent(req, res, 'contact.html', 'contact');
});

// Portfolio page route
router.get('/portfolio', async (req, res) => {
  await servePageWithContent(req, res, 'portfolio.html', 'portfolio');
});

// Verticals page route
router.get('/verticals', async (req, res) => {
  await servePageWithContent(req, res, 'verticals.html', 'verticals');
});

// Work/case study pages
router.get('/work/:slug', async (req, res) => {
  const slug = req.params.slug;
  const htmlFile = `work/${slug}.html`;
  
  try {
    const htmlPath = path.join(__dirname, '../public', htmlFile);
    await fs.access(htmlPath); // Check if file exists
    await servePageWithContent(req, res, htmlFile, `work-${slug}`);
  } catch (error) {
    res.status(404).send('Page not found');
  }
});

// Categories pages
router.get('/categories/:slug', async (req, res) => {
  const slug = req.params.slug;
  const htmlFile = `categories/${slug}.html`;
  
  try {
    const htmlPath = path.join(__dirname, '../public', htmlFile);
    await fs.access(htmlPath); // Check if file exists
    await servePageWithContent(req, res, htmlFile, `category-${slug}`);
  } catch (error) {
    res.status(404).send('Page not found');
  }
});

module.exports = router;
