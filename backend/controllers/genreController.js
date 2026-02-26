const db = require('../config/database');

// @desc    Get all genres
// @route   GET /api/genres
// @access  Public
exports.getAllGenres = async (req, res) => {
    try {
        const [genres] = await db.query(
            'SELECT g.*, COUNT(b.id) as book_count FROM genres g LEFT JOIN books b ON g.id = b.genre_id GROUP BY g.id ORDER BY g.name'
        );

        res.json({
            success: true,
            count: genres.length,
            data: genres
        });
    } catch (error) {
        console.error('Get genres error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get single genre
// @route   GET /api/genres/:id
// @access  Public
exports.getGenreById = async (req, res) => {
    try {
        const [genres] = await db.query(
            'SELECT * FROM genres WHERE id = ?',
            [req.params.id]
        );

        if (genres.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Genre not found'
            });
        }

        res.json({
            success: true,
            data: genres[0]
        });
    } catch (error) {
        console.error('Get genre error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Create genre
// @route   POST /api/genres
// @access  Private/Admin
exports.createGenre = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Genre name is required'
            });
        }

        const [result] = await db.query(
            'INSERT INTO genres (name, description) VALUES (?, ?)',
            [name, description]
        );

        const [genres] = await db.query(
            'SELECT * FROM genres WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Genre created successfully',
            data: genres[0]
        });
    } catch (error) {
        console.error('Create genre error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Genre already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update genre
// @route   PUT /api/genres/:id
// @access  Private/Admin
exports.updateGenre = async (req, res) => {
    try {
        const { name, description } = req.body;

        const [result] = await db.query(
            'UPDATE genres SET name = ?, description = ? WHERE id = ?',
            [name, description, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Genre not found'
            });
        }

        const [genres] = await db.query(
            'SELECT * FROM genres WHERE id = ?',
            [req.params.id]
        );

        res.json({
            success: true,
            message: 'Genre updated successfully',
            data: genres[0]
        });
    } catch (error) {
        console.error('Update genre error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Delete genre
// @route   DELETE /api/genres/:id
// @access  Private/Admin
exports.deleteGenre = async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM genres WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Genre not found'
            });
        }

        res.json({
            success: true,
            message: 'Genre deleted successfully'
        });
    } catch (error) {
        console.error('Delete genre error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
