const express = require('express');
const router = express.Router();

const booksController = require('../controllers/books');

// Get all books
router.get('/', booksController.getAll);

// Add a new book
router.post('/', booksController.addBook);

// Get a book by id
router.get('/:id', booksController.getBook);

// Update book
router.put('/:id', booksController.updateBook);

// Delete book
router.delete('/:id', booksController.deleteBook);

module.exports = router;