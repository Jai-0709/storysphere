const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All admin routes require authentication and admin role
router.get('/users', authMiddleware, roleMiddleware('admin'), adminController.getAllUsers);
router.put('/users/:id/role', authMiddleware, roleMiddleware('admin'), adminController.updateUserRole);
router.delete('/users/:id', authMiddleware, roleMiddleware('admin'), adminController.deleteUser);
router.get('/stats', authMiddleware, roleMiddleware('admin'), adminController.getStats);

module.exports = router;
