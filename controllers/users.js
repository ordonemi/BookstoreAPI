const { response } = require('express');
const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;
const passwordUtil = require('../util/passwordValidation');

const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDb().db('bookstore').collection('users').find();
        const lists = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the users.' });
    }
};

const addUser = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password || !req.body.firstName || !req.body.lastName || !req.body.booksPurchased) {
            res.status(400).send({ message: 'Content can not be empty' });
            return;
        }

        const password = req.body.password;
        const passwordCheck = passwordUtil.passwordPass(password);
        if (passwordCheck.error) {
            res.status(400).send({ message: passwordCheck.error });
            return;
        }

        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password,
            booksPurchased: req.body.booksPurchased
        };

        const result = await mongodb.getDb().db('bookstore').collection('users').insertOne(user);
        if (result.acknowledged) {
            res.status(201).json(result);
        } else {
            res.status(500).json({ error: 'An error occurred while adding the user to the database.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the user to the database.' });
    }
};

const getUser = async (req, res) => {
    try {
        const userId = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('bookstore').collection('users').find({ _id: userId });
        const lists = await result.toArray();
        if (lists.length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists[0]);
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the user.' });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = new ObjectId(req.params.id);

        if (!req.body.email || !req.body.password || !req.body.firstName || !req.body.lastName || !req.body.booksPurchased) {
            res.status(400).send({ message: 'Content can not be empty' });
            return;
        }

        const password = req.body.password;
        const passwordCheck = passwordUtil.passwordPass(password);
        if (passwordCheck.error) {
            res.status(400).send({ message: passwordCheck.error });
            return;
        }

        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password,
            booksPurchased: req.body.booksPurchased
        };

        const result = await mongodb.getDb().db('bookstore').collection('users').replaceOne({ _id: userId }, user);
        if (result.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'User not found or no changes made.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the user.' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('bookstore').collection('users').deleteOne({ _id: userId });
        if (result.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the user.' });
    }
};

module.exports = { getAll, addUser, getUser, updateUser, deleteUser };