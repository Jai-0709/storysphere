const db = require('../config/database');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
        );

        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!['reader', 'writer', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }

        const [result] = await db.query(
            'UPDATE users SET role = ? WHERE id = ?',
            [role, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User role updated successfully'
        });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        // Prevent admin from deleting themselves
        if (req.params.id == req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        const [result] = await db.query(
            'DELETE FROM users WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
    try {
        const [userCount] = await db.query('SELECT COUNT(*) as count FROM users');
        const [bookCount] = await db.query('SELECT COUNT(*) as count FROM books');
        const [genreCount] = await db.query('SELECT COUNT(*) as count FROM genres');
        const [commentCount] = await db.query('SELECT COUNT(*) as count FROM comments');
        const [chapterCount] = await db.query('SELECT COUNT(*) as count FROM chapters');

        const [readerCount] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "reader"');
        const [writerCount] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "writer"');
        const [adminCount] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "admin"');

        const [totalViews] = await db.query('SELECT SUM(views) as total FROM books');
        const [totalLikes] = await db.query('SELECT COUNT(*) as total FROM likes');

        // Get recent books
        const [recentBooks] = await db.query(
            `SELECT b.id, b.title, b.author, u.username as writer_name, b.created_at 
       FROM books b 
       LEFT JOIN users u ON b.user_id = u.id 
       ORDER BY b.created_at DESC 
       LIMIT 10`
        );

        // Get top books by views
        const [topBooks] = await db.query(
            `SELECT b.id, b.title, b.author, b.views,
       (SELECT COUNT(*) FROM likes WHERE book_id = b.id) as like_count
       FROM books b 
       ORDER BY b.views DESC 
       LIMIT 10`
        );

        res.json({
            success: true,
            data: {
                users: {
                    total: userCount[0].count,
                    readers: readerCount[0].count,
                    writers: writerCount[0].count,
                    admins: adminCount[0].count
                },
                books: bookCount[0].count,
                genres: genreCount[0].count,
                comments: commentCount[0].count,
                chapters: chapterCount[0].count,
                totalViews: totalViews[0].total || 0,
                totalLikes: totalLikes[0].total || 0,
                recentBooks,
                topBooks
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
