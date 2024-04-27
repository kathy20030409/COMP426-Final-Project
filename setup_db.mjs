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
  });

  db.close();
}

// Call the initializeDatabase function
initializeDatabase();
