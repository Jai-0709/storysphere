const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', genreController.getAllGenres);
router.get('/:id', genreController.getGenreById);
router.post('/', authMiddleware, roleMiddleware('admin'), genreController.createGenre);
router.put('/:id', authMiddleware, roleMiddleware('admin'), genreController.updateGenre);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), genreController.deleteGenre);

module.exports = router;
