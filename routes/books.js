const express = require('express');
const router = express.Router();

const booksController = require('../controllers/books');

// Get all books
router.get('/', booksController.getAll);

// Add a new book
router.post('/', booksController.addBook);

module.exports = router;