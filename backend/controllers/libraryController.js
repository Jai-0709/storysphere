const db = require('../config/database');

// @desc    Get user's library
// @route   GET /api/library
// @access  Private
exports.getLibrary = async (req, res) => {
    try {
        const [books] = await db.query(
            `SELECT b.*, g.name as genre_name, l.added_at,
      (SELECT COUNT(*) FROM likes WHERE book_id = b.id) as like_count,
      rp.progress_percentage, rp.last_read
      FROM library l
      LEFT JOIN books b ON l.book_id = b.id
      LEFT JOIN genres g ON b.genre_id = g.id
      LEFT JOIN reading_progress rp ON rp.book_id = b.id AND rp.user_id = l.user_id
      WHERE l.user_id = ?
      ORDER BY l.added_at DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        console.error('Get library error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Add book to library
// @route   POST /api/library/:bookId
// @access  Private
exports.addToLibrary = async (req, res) => {
    try {
        const [result] = await db.query(
            'INSERT INTO library (user_id, book_id) VALUES (?, ?)',
            [req.user.id, req.params.bookId]
        );

        res.status(201).json({
            success: true,
            message: 'Book added to library successfully'
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Book already in library'
            });
        }
        console.error('Add to library error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Remove book from library
// @route   DELETE /api/library/:bookId
// @access  Private
exports.removeFromLibrary = async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM library WHERE user_id = ? AND book_id = ?',
            [req.user.id, req.params.bookId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Book not found in library'
            });
        }

        res.json({
            success: true,
            message: 'Book removed from library successfully'
        });
    } catch (error) {
        console.error('Remove from library error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update reading progress
// @route   POST /api/reading-progress
// @access  Private
exports.updateProgress = async (req, res) => {
    try {
        const { book_id, chapter_id, progress_percentage } = req.body;

        if (!book_id) {
            return res.status(400).json({
                success: false,
                message: 'Book ID is required'
            });
        }

        // Check if progress exists
        const [existing] = await db.query(
            'SELECT * FROM reading_progress WHERE user_id = ? AND book_id = ?',
            [req.user.id, book_id]
        );

        if (existing.length > 0) {
            // Update existing progress
            await db.query(
                'UPDATE reading_progress SET chapter_id = ?, progress_percentage = ?, last_read = NOW() WHERE user_id = ? AND book_id = ?',
                [chapter_id, progress_percentage || 0, req.user.id, book_id]
            );
        } else {
            // Create new progress
            await db.query(
                'INSERT INTO reading_progress (user_id, book_id, chapter_id, progress_percentage) VALUES (?, ?, ?, ?)',
                [req.user.id, book_id, chapter_id, progress_percentage || 0]
            );
        }

        res.json({
            success: true,
            message: 'Reading progress updated successfully'
        });
    } catch (error) {
        console.error('Update progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get reading progress for a book
// @route   GET /api/reading-progress/:bookId
// @access  Private
exports.getProgress = async (req, res) => {
    try {
        const [progress] = await db.query(
            'SELECT * FROM reading_progress WHERE user_id = ? AND book_id = ?',
            [req.user.id, req.params.bookId]
        );

        res.json({
            success: true,
            data: progress.length > 0 ? progress[0] : null
        });
    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Check if book is in library
// @route   GET /api/library/check/:bookId
// @access  Private
exports.checkInLibrary = async (req, res) => {
    try {
        const [library] = await db.query(
            'SELECT * FROM library WHERE user_id = ? AND book_id = ?',
            [req.user.id, req.params.bookId]
        );

        res.json({
            success: true,
            inLibrary: library.length > 0
        });
    } catch (error) {
        console.error('Check library error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
