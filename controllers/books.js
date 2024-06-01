const { response } = require('express');
const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res, next) => {
    try {
        const result = await mongodb.getDb().db('bookstore').collection('books').find();
        const lists = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the books.' });
    }
};

const addBook = async (req, res) => {
    try {
        const { title, author, genre, price, ISBN, publicationDate, stock } = req.body;

        // Check if any field is missing
        if (!title || !author || !genre || !price || !ISBN || !publicationDate || stock == null) {
            res.status(400).json({ error: 'Please enter values for every field.' });
            return;
        }

        const book = {
            title,
            author,
            genre,
            price,
            ISBN,
            publicationDate,
            stock
        };

        const result = await mongodb.getDb().db('bookstore').collection('books').insertOne(book);
        if (result.acknowledged) {
            res.status(201).json(result);
        } else {
            res.status(500).json({ error: 'An error occurred while adding the book to the database.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the book to the database.' });
    }
};

const getBook = async (req, res, next) => {
    try {
        const bookId = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('bookstore').collection('books').find({ _id: bookId });
        const lists = await result.toArray();
        if (lists.length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists[0]);
        } else {
            res.status(404).json({ error: 'Book not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the book.' });
    }
};

const updateBook = async (req, res) => {
    try {
        const bookId = new ObjectId(req.params.id);
        const book = {
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            price: req.body.price,
            ISBN: req.body.ISBN,
            publicationDate: req.body.publicationDate,
            stock: req.body.stock
        };
        const result = await mongodb.getDb().db('bookstore').collection('books').replaceOne({ _id: bookId }, book);
        if (result.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Book not found or no changes made.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the book.' });
    }
};

const deleteBook = async (req, res) => {
    try {
        const bookId = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('bookstore').collection('books').deleteOne({ _id: bookId });
        if (result.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Book not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the book.' });
    }
};

module.exports = { getAll, addBook, getBook, updateBook, deleteBook };