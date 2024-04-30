import pkg from 'jsonwebtoken';
import { SECRET_KEY } from './authController.mjs';
const { verify } = pkg;


export function authenticate(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = decoded.userId;
    next();
  });
}

/**
 * Sets a cookie with the JWT token.
 * @param {object} res - The response object.
 * @param {string} token - The JWT token.
 */
export function setTokenCookie(res, token) {
  res.cookie("token", token, {
    // httpOnly: true, // Cookie not accessible via client-side JavaScript.
    // secure: true, // Cookie is sent only over HTTPS.
    maxAge: 8 * 3600000 // cookie will be removed after 8 hours
  });
  console.log('Cookie set:', res.get('Set-Cookie'));  // Logging the cookie
}

export function clearTokenCookie(res) {
  res.clearCookie("token");
}
