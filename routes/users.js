const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');

// Get all users
router.get('/', usersController.getAll);

// Add a user
router.post('/', usersController.addUser);

// Get an user by ID
router.get('/:id', usersController.getUser);

// Update an user
router.put('/:id', usersController.updateUser);

// Delete an user
router.delete('/:id', usersController.deleteUser);

module.exports = router;