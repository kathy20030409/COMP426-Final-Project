import {User} from './user.mjs'
import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
//import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 5501;
const SECRET_KEY = 'your_secret_key'; // Change this to a secure random string

const db = new sqlite3.Database('./data.db');

app.use(bodyParser.json());


app.post('/api/register', async (req, res) => {
    let ing= User.create(req.body);
    if (!ing) {
        res.status(400).json({ message: 'Invalid request body' });
        return;
    } 
    res.json(ing.json());
});


app.post('/api/login', async (req, res) => {

    let ing = User.login(req.body);

    if (ing == 401) {
        res.status(401).json({ message: 'Invalid username or password' });
        return;
    } else if (ing == 500){
        res.status(500).json({ message: 'Errors occur during login' });
        return;
    } else if (ing== 400) {
        res.status(400).json({ message: 'Invalid request body' });
        return;
    }
    res.json(ing);
});

// Get user-specific selections
app.get('/api/selections', (req, res) => {
    const userId = req.userId;
    let ing = User.getLocations(userId);
    if (ing == 400) {
        res.status(400).json({ message: 'Invalid request body' });
        return;
    } else if (ing == 500){
        res.status(500).json({ message: 'Errors occur getting locations' });
        return;
    }
    res.json(ing);
});


app.post('/api/user/:userId/cart/add', (req, res) => {
    const userId = req.params.userId;
    let ing = User.addLocation(userId, req.body.location);

    if (ing == 400){
        res.status(400).json({ message: 'Invalid request body' });
        return;
    } else if (ing == 500){
        res.status(500).json({ error: 'Failed to add item to cart' });
        return;
    }
    res.json(ing);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
