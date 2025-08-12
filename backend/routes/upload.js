const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: fileFilter
});

// @route   POST /api/upload/image
// @desc    Upload single image
// @access  Private
router.post('/image', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    const filePath = `uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'File uploaded successfully',
      filePath: filePath,
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: `/${filePath}`,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Upload failed' 
    });
  }
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple images
// @access  Private
router.post('/multiple', auth, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const files = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: `/uploads/${file.filename}`,
      mimetype: file.mimetype
    }));

    res.json({
      message: `${files.length} files uploaded successfully`,
      files
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// @route   DELETE /api/upload/:filename
// @desc    Delete uploaded file
// @access  Private
router.delete('/:filename', auth, async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete file
    await fs.unlink(filePath);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Failed to delete file' });
  }
});

// @route   GET /api/upload/list
// @desc    List all uploaded files
// @access  Private
router.get('/list', auth, async (req, res) => {
  try {
    const uploadDir = path.join(__dirname, '../uploads');
    
    try {
      const files = await fs.readdir(uploadDir);
      const fileList = [];

      for (const file of files) {
        const filePath = path.join(uploadDir, file);
        const stats = await fs.stat(filePath);
        
        fileList.push({
          filename: file,
          size: stats.size,
          url: `/uploads/${file}`,
          uploadDate: stats.birthtime
        });
      }

      res.json({ files: fileList });
    } catch (error) {
      // Directory doesn't exist or is empty
      res.json({ files: [] });
    }
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ message: 'Failed to list files' });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files' });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({ message: 'Only image files are allowed' });
  }

  res.status(500).json({ message: 'Upload error' });
});

module.exports = router;
