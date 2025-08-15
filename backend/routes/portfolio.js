const express = require('express');
const Joi = require('joi');
const { auth } = require('../middleware/auth');
const database = require('../utils/database');

const router = express.Router();

// Validation schema for portfolio content
const portfolioSchema = Joi.object({
  hero: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required()
  }).required(),
  projects: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      title: Joi.string().required(),
      category: Joi.string().required(),
      description: Joi.string().allow('').optional(),
      url: Joi.string().required(),
      tags: Joi.array().items(Joi.string()).optional(),
      isActive: Joi.boolean().default(true),
      sortOrder: Joi.number().integer().min(1).optional()
    })
  ).required()
});

// @route   GET /api/portfolio
// @desc    Get portfolio content
// @access  Public
router.get('/', async (req, res) => {
  try {
    const portfolio = await database.getPortfolio();
    res.json(portfolio);
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/portfolio
// @desc    Update portfolio content
// @access  Private (Admin/Editor)
router.put('/', auth, async (req, res) => {
  try {
    // Debug: Log the incoming request body
    console.log('Portfolio PUT request body:', JSON.stringify(req.body, null, 2));
    
    // Validate request body
    const { error } = portfolioSchema.validate(req.body);
    if (error) {
      console.log('Validation error:', error.details[0].message);
      console.log('Full validation error:', error.details);
      return res.status(400).json({ message: error.details[0].message });
    }

    const updatedPortfolio = await database.updatePortfolio(req.body);
    
    if (!updatedPortfolio) {
      return res.status(500).json({ message: 'Failed to update portfolio' });
    }

    res.json({
      message: 'Portfolio updated successfully',
      data: updatedPortfolio
    });
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
