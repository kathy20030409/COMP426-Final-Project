import sqlite3 from 'sqlite3';

// Function to initialize the database schema
async function initializeDatabase() {
    const db = await new sqlite3.Database('./data.db');

    // Create tables if they don't exist
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
`);
    });

    db.close();
}

// Call the initializeDatabase function
initializeDatabase();
