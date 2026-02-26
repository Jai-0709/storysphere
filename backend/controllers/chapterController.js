const db = require('../config/database');

// @desc    Get chapters by book ID
// @route   GET /api/chapters/book/:bookId
// @access  Public
exports.getChaptersByBook = async (req, res) => {
    try {
        const [chapters] = await db.query(
            'SELECT * FROM chapters WHERE book_id = ? ORDER BY chapter_number',
            [req.params.bookId]
        );

        res.json({
            success: true,
            count: chapters.length,
            data: chapters
        });
    } catch (error) {
        console.error('Get chapters error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get single chapter
// @route   GET /api/chapters/:id
// @access  Public
exports.getChapterById = async (req, res) => {
    try {
        const [chapters] = await db.query(
            'SELECT c.*, b.title as book_title, b.user_id FROM chapters c LEFT JOIN books b ON c.book_id = b.id WHERE c.id = ?',
            [req.params.id]
        );

        if (chapters.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Chapter not found'
            });
        }

        res.json({
            success: true,
            data: chapters[0]
        });
    } catch (error) {
        console.error('Get chapter error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Create chapter
// @route   POST /api/chapters
// @access  Private (Writer/Admin)
exports.createChapter = async (req, res) => {
    try {
        const { book_id, chapter_number, title, content } = req.body;

        if (!book_id || !chapter_number || !title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if book exists and user is owner or admin
        const [books] = await db.query(
            'SELECT * FROM books WHERE id = ?',
            [book_id]
        );

        if (books.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        if (books[0].user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to add chapters to this book'
            });
        }

        const [result] = await db.query(
            'INSERT INTO chapters (book_id, chapter_number, title, content) VALUES (?, ?, ?, ?)',
            [book_id, chapter_number, title, content]
        );

        const [chapters] = await db.query(
            'SELECT * FROM chapters WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Chapter created successfully',
            data: chapters[0]
        });
    } catch (error) {
        console.error('Create chapter error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Chapter number already exists for this book'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update chapter
// @route   PUT /api/chapters/:id
// @access  Private (Owner/Admin)
exports.updateChapter = async (req, res) => {
    try {
        const { chapter_number, title, content } = req.body;

        // Check if chapter exists and user is owner or admin
        const [chapters] = await db.query(
            'SELECT c.*, b.user_id FROM chapters c LEFT JOIN books b ON c.book_id = b.id WHERE c.id = ?',
            [req.params.id]
        );

        if (chapters.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Chapter not found'
            });
        }

        if (chapters[0].user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this chapter'
            });
        }

        await db.query(
            'UPDATE chapters SET chapter_number = ?, title = ?, content = ? WHERE id = ?',
            [chapter_number, title, content, req.params.id]
        );

        const [updatedChapters] = await db.query(
            'SELECT * FROM chapters WHERE id = ?',
            [req.params.id]
        );

        res.json({
            success: true,
            message: 'Chapter updated successfully',
            data: updatedChapters[0]
        });
    } catch (error) {
        console.error('Update chapter error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Delete chapter
// @route   DELETE /api/chapters/:id
// @access  Private (Owner/Admin)
exports.deleteChapter = async (req, res) => {
    try {
        // Check if chapter exists and user is owner or admin
        const [chapters] = await db.query(
            'SELECT c.*, b.user_id FROM chapters c LEFT JOIN books b ON c.book_id = b.id WHERE c.id = ?',
            [req.params.id]
        );

        if (chapters.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Chapter not found'
            });
        }

        if (chapters[0].user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this chapter'
            });
        }

        await db.query('DELETE FROM chapters WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Chapter deleted successfully'
        });
    } catch (error) {
        console.error('Delete chapter error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
