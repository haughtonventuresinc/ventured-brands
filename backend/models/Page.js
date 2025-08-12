const mongoose = require('mongoose');

const contentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'html', 'image', 'heading', 'paragraph', 'list'],
    required: true
  },
  selector: {
    type: String,
    required: true // CSS selector to identify the element
  },
  content: {
    type: String,
    required: true
  },
  attributes: {
    type: Map,
    of: String,
    default: {}
  }
});

const pageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  htmlFile: {
    type: String,
    required: true // Path to the HTML file
  },
  contentBlocks: [contentBlockSchema],
  isPublished: {
    type: Boolean,
    default: true
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Update lastModified on save
pageSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

module.exports = mongoose.model('Page', pageSchema);
