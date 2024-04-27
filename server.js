const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5501;
const SECRET_KEY = 'your_secret_key'; // Change this to a secure random string

const db = new sqlite3.Database('./data.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS user_selections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      selection TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.run(`CREATE TABLE items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT
);
`);

  db.run(`CREATE TABLE user_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (item_id) REFERENCES items(id),
  UNIQUE(user_id, item_id)
);
`)
});

app.use(bodyParser.json());

// Function to generate JWT token
function generateToken(user) {
  return jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
}

app.post('/api/register', async (req, res) => {
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


app.post('/api/login', async (req, res) => {
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
