import { hash, compare } from "bcrypt";
import pkg from "jsonwebtoken";
const { sign } = pkg;
import { setTokenCookie } from "./authMiddleware.mjs";
import dotenv from "dotenv";
dotenv.config();
export const SECRET_KEY = process.env.JWT_SECRET; // Get the secret key from the environment
import { User } from "./user.mjs";

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not defined in the environment.");
  process.exit(1); // Exit application with an error
}

function generateToken(id) {
  return sign({ userId: id }, SECRET_KEY, { expiresIn: "90 days" });
}
export async function register(req, res) {
  req.body.password = await hash(req.body.password, 10);

  let newUser = await User.create(req.body);
  if (newUser instanceof Error){
    res.status(500).json({ message: newUser.message });
    return;
  } else if (!newUser) {
    res.status(400).json({ message: "Invalid request body" });
    return;
  }
  const token = generateToken(newUser.id);
  setTokenCookie(res, token);
  res.json({ message: "User registered successfully" });
}

export async function login(req, res) {
  let returnUser = await User.login(req.body);
  let { ing, user } = returnUser;
  if (ing == 401) {
    res.status(401).json({ message: "Invalid username or password" });
    return;
  } else if (ing == 500) {
    res.status(500).json({ message: "Errors occur during login" });
    return;
  } else if (ing == 400) {
    res.status(400).json({ message: "Invalid request body" });
    return;
  } else if (ing == 200) {
    const token = generateToken(user.id);
    setTokenCookie(res, token);
    res.status(200).json({ message: "Logged in successfully", user: user,
    token: token
  });
    return;
  } else {
    res.status(500).json({ message: "ing is not 200, Unknown error" });
    return;
  }
}
