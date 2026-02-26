const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapterController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public routes
router.get('/book/:bookId', chapterController.getChaptersByBook);
router.get('/:id', chapterController.getChapterById);

// Protected routes
router.post('/', authMiddleware, roleMiddleware('writer', 'admin'), chapterController.createChapter);
router.put('/:id', authMiddleware, roleMiddleware('writer', 'admin'), chapterController.updateChapter);
router.delete('/:id', authMiddleware, roleMiddleware('writer', 'admin'), chapterController.deleteChapter);

module.exports = router;
