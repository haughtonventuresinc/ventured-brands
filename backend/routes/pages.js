const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const Joi = require('joi');
const Page = require('../models/PageModel');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const pageSchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  htmlFile: Joi.string().required(),
  contentBlocks: Joi.array().items(Joi.object({
    type: Joi.string().valid('text', 'html', 'image', 'heading', 'paragraph', 'list').required(),
    selector: Joi.string().required(),
    content: Joi.string().required(),
    attributes: Joi.object().pattern(Joi.string(), Joi.string())
  })),
  isPublished: Joi.boolean().default(true)
});

// @route   GET /api/pages
// @desc    Get all pages
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const pages = await Page.find();
    
    // Populate modifiedBy field for each page
    for (let page of pages) {
      await page.populate('modifiedBy', 'email');
    }
    
    // Sort by lastModified
    pages.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
    
    res.json({ pages });
  } catch (error) {
    console.error('Get pages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/pages/:id
// @desc    Get single page
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    
    if (page) {
      await page.populate('modifiedBy', 'email');
    }
    
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.json({ page });
  } catch (error) {
    console.error('Get page error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/pages
// @desc    Create new page
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { error } = pageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const pageData = {
      ...req.body,
      modifiedBy: req.user.id
    };

    const page = await Page.create(pageData);
    await page.populate('modifiedBy', 'email');

    res.status(201).json({ 
      message: 'Page created successfully',
      page: page 
    });
  } catch (error) {
    console.error('Create page error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Page with this name or slug already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// @route   PUT /api/pages/:id
// @desc    Update page
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { error } = pageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    // Update page data
    Object.assign(page, req.body);
    page.modifiedBy = req.user.id;
    page.lastModified = new Date().toISOString();

    await page.save();
    await page.populate('modifiedBy', 'email');

    res.json({ 
      message: 'Page updated successfully',
      page: page 
    });
  } catch (error) {
    console.error('Update page error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Page with this name or slug already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// @route   DELETE /api/pages/:id
// @desc    Delete page
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    await Page.findByIdAndDelete(req.params.id);

    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Delete page error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/pages/:id/content
// @desc    Update page content blocks
// @access  Private
router.post('/:id/content', auth, async (req, res) => {
  try {
    const { contentBlocks } = req.body;
    
    if (!Array.isArray(contentBlocks)) {
      return res.status(400).json({ message: 'Content blocks must be an array' });
    }

    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    page.contentBlocks = contentBlocks;
    page.modifiedBy = req.user.id;
    page.lastModified = new Date().toISOString();

    await page.save();

    // Also update the actual HTML file
    await updateHtmlFile(page);

    await page.populate('modifiedBy', 'email');

    res.json({ 
      message: 'Page content updated successfully',
      page: page 
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to update HTML file
async function updateHtmlFile(page) {
  try {
    const htmlPath = path.join(__dirname, '../../', page.htmlFile);
    let htmlContent = await fs.readFile(htmlPath, 'utf8');

    // Apply content blocks to HTML
    for (const block of page.contentBlocks) {
      const { selector, content, type, attributes } = block;
      
      // This is a simplified approach - in production, you'd want to use a proper HTML parser
      // For now, we'll use regex replacement (not recommended for complex HTML)
      const regex = new RegExp(`(<[^>]*class="[^"]*${selector.replace('.', '')}[^"]*"[^>]*>)([^<]*)(</[^>]*>)`, 'gi');
      
      if (type === 'text' || type === 'paragraph' || type === 'heading') {
        htmlContent = htmlContent.replace(regex, `$1${content}$3`);
      }
    }

    await fs.writeFile(htmlPath, htmlContent, 'utf8');
  } catch (error) {
    console.error('Error updating HTML file:', error);
    throw error;
  }
}

// @route   GET /api/pages/scan/html
// @desc    Scan HTML files and create page entries
// @access  Private (Admin only)
router.post('/scan/html', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const htmlFiles = [
      { name: 'Homepage', slug: 'home', file: 'index.html', title: 'Ventured Brands - Home' },
      { name: 'About', slug: 'about', file: 'about.html', title: 'About - Ventured Brands' },
      { name: 'Contact', slug: 'contact', file: 'contact.html', title: 'Contact - Ventured Brands' },
      { name: 'Portfolio', slug: 'portfolio', file: 'portfolio.html', title: 'Portfolio - Ventured Brands' },
      { name: 'Verticals', slug: 'verticals', file: 'verticals.html', title: 'Investment Verticals - Ventured Brands' }
    ];

    const createdPages = [];

    for (const htmlFile of htmlFiles) {
      const existingPage = await Page.findOne({ slug: htmlFile.slug });
      
      if (!existingPage) {
        const page = await Page.create({
          name: htmlFile.name,
          slug: htmlFile.slug,
          title: htmlFile.title,
          htmlFile: htmlFile.file,
          contentBlocks: [],
          modifiedBy: req.user.id
        });
        createdPages.push(page);
      }
    }

    res.json({ 
      message: `Scanned HTML files. Created ${createdPages.length} new pages.`,
      createdPages 
    });
  } catch (error) {
    console.error('Scan HTML error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
