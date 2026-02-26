const db = require('../config/database');

// @desc    Get all books with pagination, search, and filter
// @route   GET /api/books
// @access  Public
exports.getAllBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';
        const genreId = req.query.genre || '';

        let query = `
      SELECT b.*, g.name as genre_name, u.username as writer_name,
      (SELECT COUNT(*) FROM likes WHERE book_id = b.id) as like_count,
      (SELECT COUNT(*) FROM comments WHERE book_id = b.id) as comment_count
      FROM books b
      LEFT JOIN genres g ON b.genre_id = g.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE 1=1
    `;
        const params = [];

        if (search) {
            query += ' AND (b.title LIKE ? OR b.author LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        if (genreId) {
            query += ' AND b.genre_id = ?';
            params.push(genreId);
        }

        query += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [books] = await db.query(query, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM books WHERE 1=1';
        const countParams = [];

        if (search) {
            countQuery += ' AND (title LIKE ? OR author LIKE ?)';
            countParams.push(`%${search}%`, `%${search}%`);
        }

        if (genreId) {
            countQuery += ' AND genre_id = ?';
            countParams.push(genreId);
        }

        const [countResult] = await db.query(countQuery, countParams);
        const total = countResult[0].total;

        res.json({
            success: true,
            count: books.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: books
        });
    } catch (error) {
        console.error('Get books error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get single book with chapters
// @route   GET /api/books/:id
// @access  Public
exports.getBookById = async (req, res) => {
    try {
        const [books] = await db.query(
            `SELECT b.*, g.name as genre_name, u.username as writer_name,
      (SELECT COUNT(*) FROM likes WHERE book_id = b.id) as like_count,
      (SELECT COUNT(*) FROM comments WHERE book_id = b.id) as comment_count
      FROM books b
      LEFT JOIN genres g ON b.genre_id = g.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.id = ?`,
            [req.params.id]
        );

        if (books.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Get chapters
        const [chapters] = await db.query(
            'SELECT id, chapter_number, title, created_at FROM chapters WHERE book_id = ? ORDER BY chapter_number',
            [req.params.id]
        );

        const book = { ...books[0], chapters };

        res.json({
            success: true,
            data: book
        });
    } catch (error) {
        console.error('Get book error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get books by genre
// @route   GET /api/books/genre/:genreId
// @access  Public
exports.getBooksByGenre = async (req, res) => {
    try {
        const [books] = await db.query(
            `SELECT b.*, g.name as genre_name, u.username as writer_name,
      (SELECT COUNT(*) FROM likes WHERE book_id = b.id) as like_count
      FROM books b
      LEFT JOIN genres g ON b.genre_id = g.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.genre_id = ?
      ORDER BY b.created_at DESC`,
            [req.params.genreId]
        );

        res.json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        console.error('Get books by genre error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Create book
// @route   POST /api/books
// @access  Private (Writer/Admin)
exports.createBook = async (req, res) => {
    try {
        const { title, author, description, cover_image, genre_id } = req.body;

        if (!title || !author || !genre_id) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title, author, and genre'
            });
        }

        const [result] = await db.query(
            'INSERT INTO books (title, author, description, cover_image, genre_id, user_id) VALUES (?, ?, ?, ?, ?, ?)',
            [title, author, description, cover_image, genre_id, req.user.id]
        );

        const [books] = await db.query(
            'SELECT * FROM books WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: books[0]
        });
    } catch (error) {
        console.error('Create book error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private (Owner/Admin)
exports.updateBook = async (req, res) => {
    try {
        const { title, author, description, cover_image, genre_id } = req.body;

        // Check if book exists and user is owner or admin
        const [books] = await db.query(
            'SELECT * FROM books WHERE id = ?',
            [req.params.id]
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
                message: 'Not authorized to update this book'
            });
        }

        const [result] = await db.query(
            'UPDATE books SET title = ?, author = ?, description = ?, cover_image = ?, genre_id = ? WHERE id = ?',
            [title, author, description, cover_image, genre_id, req.params.id]
        );

        const [updatedBooks] = await db.query(
            'SELECT * FROM books WHERE id = ?',
            [req.params.id]
        );

        res.json({
            success: true,
            message: 'Book updated successfully',
            data: updatedBooks[0]
        });
    } catch (error) {
        console.error('Update book error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private (Owner/Admin)
exports.deleteBook = async (req, res) => {
    try {
        // Check if book exists and user is owner or admin
        const [books] = await db.query(
            'SELECT * FROM books WHERE id = ?',
            [req.params.id]
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
                message: 'Not authorized to delete this book'
            });
        }

        await db.query('DELETE FROM books WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (error) {
        console.error('Delete book error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Increment book view count
// @route   POST /api/books/:id/view
// @access  Public
exports.incrementViews = async (req, res) => {
    try {
        await db.query(
            'UPDATE books SET views = views + 1 WHERE id = ?',
            [req.params.id]
        );

        res.json({
            success: true,
            message: 'View count updated'
        });
    } catch (error) {
        console.error('Increment views error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get writer's books with stats
// @route   GET /api/books/writer/my-books
// @access  Private (Writer/Admin)
exports.getMyBooks = async (req, res) => {
    try {
        const [books] = await db.query(
            `SELECT b.*, g.name as genre_name,
      (SELECT COUNT(*) FROM likes WHERE book_id = b.id) as like_count,
      (SELECT COUNT(*) FROM comments WHERE book_id = b.id) as comment_count,
      (SELECT COUNT(*) FROM chapters WHERE book_id = b.id) as chapter_count
      FROM books b
      LEFT JOIN genres g ON b.genre_id = g.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        console.error('Get my books error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
