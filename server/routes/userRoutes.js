const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /users - Get all users with pagination, filtering and sorting
router.get('/', userController.getUsers);

// GET /users/:id - Get user by ID
router.get('/:id', userController.getUserById);

// POST /users - Create new user
router.post('/', userController.createUser);

// PUT /users/:id - Update user
router.put('/:id', userController.updateUser);

// DELETE /users/:id - Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router; 