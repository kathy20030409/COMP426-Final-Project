
import sqlite3 from 'sqlite3';
import cors from 'cors';
//import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { WeatherCard } from './weather.mjs';
import { User } from "./user.mjs";
import express from "express";
import bodyParser from "body-parser";
import { login, register } from "./authController.mjs";
import { authenticate } from "./authMiddleware.mjs";
import cookieParser from 'cookie-parser'; // Import cookie-parser


const app = express();
const PORT = 3000;

// CORS configuration
const corsOptions = {
    origin: 'http://127.0.0.1:5501',  // Allow this origin to send requests
    credentials: true  // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));
// app.use(cors());
app.use(cookieParser())
app.use(bodyParser.json());

app.post("/register", async (req, res) => {
  register(req, res);
});

app.post("/login", async (req, res) => {
  login(req, res);
});

app.put('/user/account', authenticate, async (req, res) => {

    let ing = await User.changePassword(req.body.userId, req.body.password);

    if (ing == 401) {
        res.status(401).json({ message: 'Invalid username or password' });
        return;
    } else if (ing == 500){
        res.status(500).json({ message: 'Errors occur during changing password' });
        return;
    } else if (ing== 400) {
        res.status(400).json({ message: 'Invalid request body' });
        return;
    }
    res.status(200).json({message: 'Successfully reset password'});
});

// Get user-specific selections
app.get('/user/cart', authenticate, async (req, res) => {
    const userId = req.body.userId;
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

app.post('/user/cart', authenticate, async(req, res) => {
    const userId = req.body.userId;
    let ing = await User.addLocation(userId, req.body.location);
    // use weather card here?

  if (ing == 400) {
    res.status(400).json({ message: "Invalid request body" });
    return;
  } else if (ing == 500) {
    res.status(500).json({ error: "Failed to add item to cart" });
    return;
  }
  res.json(ing);
});

app.delete('/user/cart', authenticate, async(req, res) => {
    const userId = req.body.userId;
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

app.get('/user/cart/order=desc', authenticate, async(req, res) => {
    const userId = req.body.userId;
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

app.get('/user/cart/order=asc', authenticate, async(req, res) => {
    const userId = req.body.userId;
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

app.get('/user/cart/order=desc_temp', authenticate, async(req, res) => {
    const userId = req.body.userId;
    let ing = await User.sortLocations_desc_temp(userId);

    if (ing == 400){
        res.status(400).json({ message: 'Invalid request body' });
        return;
    } else if (ing == 500){
        res.status(500).json({ error: 'Failed to sort items' });
        return;
    }
    res.json(ing);
});

app.get('/user/cart/order=asc_temp', authenticate, async(req, res) => {
    const userId = req.body.userId;
    let ing = await User.sortLocations_asc_temp(userId);

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
