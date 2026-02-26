const db = require('../config/database');

// @desc    Get comments by book ID
// @route   GET /api/comments/book/:bookId
// @access  Public
exports.getCommentsByBook = async (req, res) => {
    try {
        const [comments] = await db.query(
            `SELECT c.*, u.username 
       FROM comments c 
       LEFT JOIN users u ON c.user_id = u.id 
       WHERE c.book_id = ? 
       ORDER BY c.created_at DESC`,
            [req.params.bookId]
        );

        res.json({
            success: true,
            count: comments.length,
            data: comments
        });
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Create comment
// @route   POST /api/comments
// @access  Private
exports.createComment = async (req, res) => {
    try {
        const { book_id, content } = req.body;

        if (!book_id || !content) {
            return res.status(400).json({
                success: false,
                message: 'Please provide book ID and comment content'
            });
        }

        const [result] = await db.query(
            'INSERT INTO comments (book_id, user_id, content) VALUES (?, ?, ?)',
            [book_id, req.user.id, content]
        );

        const [comments] = await db.query(
            `SELECT c.*, u.username 
       FROM comments c 
       LEFT JOIN users u ON c.user_id = u.id 
       WHERE c.id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: comments[0]
        });
    } catch (error) {
        console.error('Create comment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (Owner/Admin)
exports.deleteComment = async (req, res) => {
    try {
        const [comments] = await db.query(
            'SELECT * FROM comments WHERE id = ?',
            [req.params.id]
        );

        if (comments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        if (comments[0].user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this comment'
            });
        }

        await db.query('DELETE FROM comments WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Like a book
// @route   POST /api/books/:id/like
// @access  Private
exports.likeBook = async (req, res) => {
    try {
        const [result] = await db.query(
            'INSERT INTO likes (book_id, user_id) VALUES (?, ?)',
            [req.params.id, req.user.id]
        );

        res.status(201).json({
            success: true,
            message: 'Book liked successfully'
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'You have already liked this book'
            });
        }
        console.error('Like book error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Unlike a book
// @route   DELETE /api/books/:id/unlike
// @access  Private
exports.unlikeBook = async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM likes WHERE book_id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Like not found'
            });
        }

        res.json({
            success: true,
            message: 'Book unliked successfully'
        });
    } catch (error) {
        console.error('Unlike book error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get like status for a book
// @route   GET /api/books/:id/like-status
// @access  Private
exports.getLikeStatus = async (req, res) => {
    try {
        const [likes] = await db.query(
            'SELECT * FROM likes WHERE book_id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        res.json({
            success: true,
            isLiked: likes.length > 0
        });
    } catch (error) {
        console.error('Get like status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
