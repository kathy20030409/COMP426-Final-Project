import { hash, compare } from "bcrypt";
import pkg from "jsonwebtoken";
const { sign } = pkg;
import { setTokenCookie } from "./authMiddleware.mjs";
import sqlite3 from "sqlite3";
const db = new sqlite3.Database("./data.db");
import dotenv from "dotenv";
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET; // Get the secret key from the environment

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not defined in the environment.");
  process.exit(1); // Exit application with an error
}

function generateToken(id) {
  return sign({ userId: id }, SECRET_KEY, { expiresIn: "90 days" });
}

export async function register(req, res) {
  const { username, password } = req.body;
  const hashedPassword = await hash(password, 10);

  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    function (err) {
      if (err) {
        return res.status(500).send(err.message);
      }
      const token = generateToken(this.lastID);
      setTokenCookie(res, token);
      res.json({ message: "User registered successfully" });
    }
  );
}

export async function login(req, res) {
  const { username, password } = req.body;
  db.get(
    "SELECT * FROM users WHERE username = ?",
    username,
    async (err, user) => {
      if (err || !user) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }
      const match = await compare(password, user.password);
      if (match) {
        const token = generateToken(user.id);
        setTokenCookie(res, token);
        res.json({ message: "Logged in successfully" });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    }
  );
}
