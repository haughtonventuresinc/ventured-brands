const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { auth } = require('../middleware/auth');
const db = require('../utils/database');

// Validation schema for contact content
const contactSchema = Joi.object({
  form: Joi.object({
    title: Joi.string().required(),
    fields: Joi.object({
      name: Joi.object({
        label: Joi.string().required(),
        placeholder: Joi.string().required()
      }).required(),
      email: Joi.object({
        label: Joi.string().required(),
        placeholder: Joi.string().required()
      }).required(),
      company: Joi.object({
        label: Joi.string().required(),
        placeholder: Joi.string().required()
      }).required(),
      message: Joi.object({
        label: Joi.string().required(),
        placeholder: Joi.string().required()
      }).required()
    }).required(),
    submitButton: Joi.string().required()
  }).required(),
  faq: Joi.object({
    title: Joi.string().required(),
    items: Joi.array().items(
      Joi.object({
        id: Joi.string().required(),
        number: Joi.string().required(),
        question: Joi.string().required(),
        answer: Joi.string().required(),
        column: Joi.number().integer().min(1).max(2).required(),
        sortOrder: Joi.number().integer().min(1).required()
      })
    ).required()
  }).required()
});

// GET /api/contact - Get contact page content
router.get('/', async (req, res) => {
  try {
    const contactData = await db.getContact();
    res.json(contactData);
  } catch (error) {
    console.error('Error fetching contact data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/contact - Update contact page content (protected)
router.put('/', auth, async (req, res) => {
  try {
    console.log('Contact PUT request body:', JSON.stringify(req.body, null, 2));
    const { error } = contactSchema.validate(req.body);
    if (error) {
      console.log('Validation error:', error.details[0].message);
      return res.status(400).json({ message: error.details[0].message });
    }

    const updatedData = await db.updateContact(req.body);
    if (!updatedData) {
      return res.status(500).json({ message: 'Failed to update contact data' });
    }

    res.json(updatedData);
  } catch (error) {
    console.error('Error updating contact data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
