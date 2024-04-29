import { db } from './db.mjs';

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

db.run(`CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    weather TEXT NOT NULL,
    temperature REAL NOT NULL,
    user_id INTEGER NOT NULL
);
`);

db.run(`CREATE TABLE IF NOT EXISTS relationship (
  user_id INTEGER NOT NULL,
  location_id INTEGER NOT NULL,
  PRIMARY KEY (user_id, location_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (location_id) REFERENCES locations(id)
  )
`);

db.close();
