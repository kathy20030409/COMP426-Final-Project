import {User} from './user.mjs';
import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
//import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_secret_key'; // Change this to a secure random string

app.use(bodyParser.json());

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/api/register', async (req, res) => {
    let ing= await User.create(req.body);
    if (ing == null) {
        res.status(400).json({ message: 'Invalid request body' });
        return;
    } 
    res.json(ing.json());
});


app.post('/api/login', async (req, res) => {

    let ing = await User.login(req.body);

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

app.put('/api/user/:userId/account', async (req, res) => {

    let ing = await User.changePassword(req.params.userId, req.body.password);

    if (ing == 401) {
        res.status(401).json({ message: 'Invalid username or password' });
        return;
    } else if (ing == 500){
        res.status(500).json({ message: 'Errors occur during chaning password' });
        return;
    } else if (ing== 400) {
        res.status(400).json({ message: 'Invalid request body' });
        return;
    }
    res.json(ing);
});

// Get user-specific selections
app.get('/api/user/:userId/selections', async (req, res) => {
    const userId = req.params.userId;
    let ing = await User.getLocations(userId);
    if (ing == 400) {
        res.status(400).json({ message: 'Invalid request body' });
        return;
    } else if (ing == 500){
        res.status(500).json({ message: 'Errors occur getting locations' });
        return;
    }
    res.json(ing);
});

app.post('/api/user/:userId/cart', async(req, res) => {
    const userId = req.params.userId;
    let ing = await User.addLocation(userId, req.body.location);

    if (ing == 400){
        res.status(400).json({ message: 'Invalid request body' });
        return;
    } else if (ing == 500){
        res.status(500).json({ error: 'Failed to add item to cart' });
        return;
    }
    res.json(ing);
});

app.delete('/api/user/:userId/cart', async(req, res) => {
    const userId = req.params.userId;
    let ing = await User.deleteLocation(userId, req.body.location);

    if (ing == 400){
        res.status(400).json({ message: 'Invalid request body' });
        return;
    } else if (ing == 500){
        res.status(500).json({ error: 'Failed to delete item in cart' });
        return;
    }
    res.json(ing);
});

app.put('/api/user/:userId/cart/desc', async(req, res) => {
    const userId = req.params.userId;
    let ing = await User.sortLocations_desc(userId);

    if (ing == 400){
        res.status(400).json({ message: 'Invalid request body' });
        return;
    } else if (ing == 500){
        res.status(500).json({ error: 'Failed to sort items' });
        return;
    }
    res.json(ing);
});

app.put('/api/user/:userId/cart/asc', async(req, res) => {
    const userId = req.params.userId;
    let ing = await User.sortLocations_asc(userId);

    if (ing == 400){
        res.status(400).json({ message: 'Invalid request body' });
        return;
    } else if (ing == 500){
        res.status(500).json({ error: 'Failed to sort items' });
        return;
    }
    res.json(ing);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
