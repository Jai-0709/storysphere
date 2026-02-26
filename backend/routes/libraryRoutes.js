const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');
const authMiddleware = require('../middleware/authMiddleware');

// All library routes require authentication
router.get('/', authMiddleware, libraryController.getLibrary);
router.get('/check/:bookId', authMiddleware, libraryController.checkInLibrary);
router.post('/:bookId', authMiddleware, libraryController.addToLibrary);
router.delete('/:bookId', authMiddleware, libraryController.removeFromLibrary);

// Reading progress routes
router.post('/reading-progress', authMiddleware, libraryController.updateProgress);
router.get('/reading-progress/:bookId', authMiddleware, libraryController.getProgress);

module.exports = router;
