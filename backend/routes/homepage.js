const express = require('express');
const router = express.Router();
const HomepageModel = require('../models/HomepageModel');
const { auth, adminAuth } = require('../middleware/auth');

const homepageModel = new HomepageModel();

// Get homepage content
router.get('/content', async (req, res) => {
  try {
    const content = await homepageModel.getContent();
    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch homepage content' });
  }
});

// Update entire homepage content (admin only)
router.put('/content', adminAuth, async (req, res) => {
  try {
    const updatedContent = await homepageModel.updateContent(req.body);
    res.json({ success: true, data: updatedContent, message: 'Homepage content updated successfully' });
  } catch (error) {
    console.error('Error updating homepage content:', error);
    res.status(500).json({ success: false, message: 'Failed to update homepage content' });
  }
});

// Update specific section
router.put('/section/:sectionName', auth, async (req, res) => {
  try {
    const { sectionName } = req.params;
    const sectionData = req.body;
    
    const updatedContent = await homepageModel.updateSection(sectionName, sectionData);
    res.json({ 
      success: true, 
      data: updatedContent, 
      message: `${sectionName} section updated successfully` 
    });
  } catch (error) {
    console.error('Error updating homepage section:', error);
    res.status(500).json({ success: false, message: 'Failed to update section' });
  }
});

// Update hero section
router.put('/hero', auth, async (req, res) => {
  try {
    const { title, subtitle, description } = req.body;
    const updatedContent = await homepageModel.updateSection('hero', {
      title,
      subtitle, 
      description
    });
    res.json({ success: true, data: updatedContent.hero, message: 'Hero section updated successfully' });
  } catch (error) {
    console.error('Error updating hero section:', error);
    res.status(500).json({ success: false, message: 'Failed to update hero section' });
  }
});

// Update logo section
router.put('/logo-section', auth, async (req, res) => {
  try {
    const { title, description, buttonText } = req.body;
    const updatedContent = await homepageModel.updateSection('logoSection', {
      title,
      description,
      buttonText
    });
    res.json({ success: true, data: updatedContent.logoSection, message: 'Logo section updated successfully' });
  } catch (error) {
    console.error('Error updating logo section:', error);
    res.status(500).json({ success: false, message: 'Failed to update logo section' });
  }
});

// Update benefits section
router.put('/benefits', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedContent = await homepageModel.updateSection('benefitsSection', {
      title,
      description
    });
    res.json({ success: true, data: updatedContent.benefitsSection, message: 'Benefits section updated successfully' });
  } catch (error) {
    console.error('Error updating benefits section:', error);
    res.status(500).json({ success: false, message: 'Failed to update benefits section' });
  }
});

// Update process cards
router.put('/process-cards', auth, async (req, res) => {
  try {
    const { processCards } = req.body;
    const updatedContent = await homepageModel.updateSection('processCards', processCards);
    res.json({ success: true, data: updatedContent.processCards, message: 'Process cards updated successfully' });
  } catch (error) {
    console.error('Error updating process cards:', error);
    res.status(500).json({ success: false, message: 'Failed to update process cards' });
  }
});

// Update portfolio section
router.put('/portfolio', auth, async (req, res) => {
  try {
    const { title, description, buttonText, image } = req.body;
    const updatedContent = await homepageModel.updateSection('portfolioSection', {
      title,
      description,
      buttonText,
      image
    });
    res.json({ success: true, data: updatedContent.portfolioSection, message: 'Portfolio section updated successfully' });
  } catch (error) {
    console.error('Error updating portfolio section:', error);
    res.status(500).json({ success: false, message: 'Failed to update portfolio section' });
  }
});

// Update team section
router.put('/team', auth, async (req, res) => {
  try {
    const { title, description, buttonText } = req.body;
    const updatedContent = await homepageModel.updateSection('teamSection', {
      title,
      description,
      buttonText
    });
    res.json({ success: true, data: updatedContent.teamSection, message: 'Team section updated successfully' });
  } catch (error) {
    console.error('Error updating team section:', error);
    res.status(500).json({ success: false, message: 'Failed to update team section' });
  }
});

// Update logos
router.put('/logos', auth, async (req, res) => {
  try {
    const { logos } = req.body;
    // Update the logos within the logoSection
    const currentContent = await homepageModel.getContent();
    const updatedLogoSection = {
      ...currentContent.logoSection,
      logos: logos
    };
    const updatedContent = await homepageModel.updateSection('logoSection', updatedLogoSection);
    res.json({ success: true, data: updatedContent.logoSection.logos, message: 'Logos updated successfully' });
  } catch (error) {
    console.error('Error updating logos:', error);
    res.status(500).json({ success: false, message: 'Failed to update logos' });
  }
});

module.exports = router;
