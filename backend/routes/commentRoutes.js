const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/book/:bookId', commentController.getCommentsByBook);

// Protected routes
router.post('/', authMiddleware, commentController.createComment);
router.delete('/:id', authMiddleware, commentController.deleteComment);

// Like routes
router.post('/books/:id/like', authMiddleware, commentController.likeBook);
router.delete('/books/:id/unlike', authMiddleware, commentController.unlikeBook);
router.get('/books/:id/like-status', authMiddleware, commentController.getLikeStatus);

module.exports = router;
