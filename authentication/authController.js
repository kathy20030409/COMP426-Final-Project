const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { setTokenCookie } = require("./authMiddleware");
const db = require("./database"); // Assume you have a database module
const cookieManager = require('./cookieManager');

const SECRET_KEY = "your_secret_key";

function generateToken(id) {
  return jwt.sign({ userId: id }, SECRET_KEY, { expiresIn: "90 days" });
}

exports.register = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

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
};

exports.login = async (req, res) => {
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
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = generateToken(user.id);
        setTokenCookie(res, token);
        res.json({ message: "Logged in successfully" });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    }
  );
};
