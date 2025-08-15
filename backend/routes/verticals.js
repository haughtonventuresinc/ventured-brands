const express = require('express');
const Joi = require('joi');
const { auth } = require('../middleware/auth');
const database = require('../utils/database');

const router = express.Router();

// Validation schema for verticals content
const verticalsSchema = Joi.object({
  sections: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      title: Joi.string().required(),
      shortDescription: Joi.string().required(),
      longDescription: Joi.string().required()
    })
  ).required()
});

// @route   GET /api/verticals
// @desc    Get verticals content
// @access  Public
router.get('/', async (req, res) => {
  try {
    const verticals = await database.getVerticals();
    res.json(verticals);
  } catch (error) {
    console.error('Get verticals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/verticals
// @desc    Update verticals content
// @access  Private (Admin/Editor)
router.put('/', auth, async (req, res) => {
  try {
    // Validate request body
    const { error } = verticalsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updatedVerticals = await database.updateVerticals(req.body);
    
    if (!updatedVerticals) {
      return res.status(500).json({ message: 'Failed to update verticals' });
    }

    res.json({
      message: 'Verticals updated successfully',
      data: updatedVerticals
    });
  } catch (error) {
    console.error('Update verticals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
