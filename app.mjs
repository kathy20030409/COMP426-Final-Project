import {User} from './user.mjs'

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5501;
const SECRET_KEY = 'your_secret_key'; // Change this to a secure random string

const db = new sqlite3.Database('./data.db');

app.use(bodyParser.json());


app.post('/api/register', async (req, res) => {
    let ing = User.create(req.body);
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
        res.status(500).json({ message: 'Errors occurs during login' });
        return;
    } else if (ing == 400) {
        res.status(400).json({ message: 'Invalid request body' });
        return;
    }
    res.json(ing.json());
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
app.get('/api/selections', authenticate, (req, res) => {
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
app.post('/api/selections', authenticate, (req, res) => {
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


app.post('/api/user/:userId/cart/add', (req, res) => {
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
app.get('/api/user/:userId/cart', (req, res) => {
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
