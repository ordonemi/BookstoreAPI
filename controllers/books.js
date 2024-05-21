const { response } = require('express');
const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res, next) => {
    const result = await mongodb.getDb().db('bookstore').collection('books').find();
    result.toArray().then((lists) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);
    });
};

const addBook = async (req, res) => {
    const book = {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        price: req.body.price,
        ISBN: req.body.ISBN,
        publicationDate: req.body.publicationDate,
        stock: req.body.stock
    };
    const result = await mongodb.getDb().db('bookstore').collection('books').insertOne(book);
    if (result.acknowledged){
        res.status(201).json(result);
    } else {
        res.status(500).json(result.error || "Some error ocurred while adding the book to the database.")
    }
}

module.exports = { getAll, addBook};