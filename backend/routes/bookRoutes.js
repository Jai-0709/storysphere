const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.get('/genre/:genreId', bookController.getBooksByGenre);
router.post('/:id/view', bookController.incrementViews);

// Protected routes
router.get('/writer/my-books', authMiddleware, roleMiddleware('writer', 'admin'), bookController.getMyBooks);
router.post('/', authMiddleware, roleMiddleware('writer', 'admin'), bookController.createBook);
router.put('/:id', authMiddleware, roleMiddleware('writer', 'admin'), bookController.updateBook);
router.delete('/:id', authMiddleware, roleMiddleware('writer', 'admin'), bookController.deleteBook);

module.exports = router;
