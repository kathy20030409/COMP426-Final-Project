import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
app.use(cors());
const SECRET_KEY = 'your_secret_key'; // Change this to a secure random string

const db = new sqlite3.Database('./db.sqlite');

app.use(bodyParser.json());

// Function to generate JWT token
function generateToken(user) {
  return jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
}

app.post('/register', async (req, res) => {
  if (!req.body || !req.body.username || !req.body.password) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  db.run(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashedPassword])

  const token = generateToken({ id: this.lastID });
  res.json({ token });

});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
      if (!row) {
        res.status(401).json({ message: 'Invalid username or password' });
      } else {
        const passwordMatch = await bcrypt.compare(password, row.password);
        if (passwordMatch) {
          const token = generateToken({ id: row.id });
          res.json({ token });
        } else {
          res.status(401).json({ message: 'Invalid username or password' });
        }
      }
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

function authenticate(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = decoded.userId;
    next();
  });
}

// Get user-specific selections
app.get('/selections', authenticate, (req, res) => {
  const userId = req.userId;

  db.all('SELECT * FROM user_selections WHERE user_id = ?', [userId], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

// Store user-specific selections
app.post('/selections', authenticate, (req, res) => {
  const userId = req.userId;
  const { selection } = req.body;

  db.run(
    'INSERT INTO user_selections (user_id, selection) VALUES (?, ?)',
    [userId, selection],
    function (err) {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.json({ message: 'Selection stored successfully' });
      }
    }
  );
});


app.post('/user/:userId/locations/add', (req, res) => {
  const userId = req.params.userId;
  const { itemId, quantity } = req.body;

  db.run("INSERT INTO user_items (user_id, item_id, quantity) VALUES (?, ?, ?)", [userId, itemId, quantity], function(err) {
      if (err) {
          return res.status(500).json({ error: 'Failed to add item to cart' });
      }
      res.status(200).json({ message: 'Item added to cart successfully' });
  });
});

// Retrieve items from a user's shopping cart
app.get('/user/:userId/locations', (req, res) => {
  const userId = req.params.userId;

  db.all("SELECT items.id, items.name, items.price, items.description, user_items.quantity FROM user_items INNER JOIN items ON user_items.item_id = items.id WHERE user_items.user_id = ?", [userId], function(err, rows) {
      if (err) {
          return res.status(500).json({ error: 'Failed to retrieve cart items' });
      }
      res.status(200).json(rows);
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
