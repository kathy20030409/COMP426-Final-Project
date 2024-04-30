import { User } from "./user.mjs";
import express from "express";
import bodyParser from "body-parser";
import { login, register } from "./authController.mjs";
import { authenticate } from "./authMiddleware.mjs";
import cookieParser from 'cookie-parser'; // Import cookie-parser


const app = express();
const PORT = 3000;

app.use(cookieParser())
app.use(bodyParser.json());

app.post("/register", async (req, res) => {
  register(req, res);
});

app.post("/login", async (req, res) => {
  login(req, res);
});

// Get user-specific selections
app.get("/selections", authenticate, async (req, res) => {
  const userId = req.userId;
  let ing = await User.getLocations(userId);
  if (ing == 400) {
    res.status(400).json({ message: "Invalid request body" });
    return;
  } else if (ing == 500) {
    res.status(500).json({ message: "Errors occur getting locations" });
    return;
  }
  res.json(ing);
});

app.post("/user/:userId/cart/add", authenticate, async (req, res) => {
  const userId = req.params.userId;
  let ing = await User.addLocation(userId, req.body.location);

  if (ing == 400) {
    res.status(400).json({ message: "Invalid request body" });
    return;
  } else if (ing == 500) {
    res.status(500).json({ error: "Failed to add item to cart" });
    return;
  }
  res.json(ing);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
