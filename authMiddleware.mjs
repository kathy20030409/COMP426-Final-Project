import pkg from 'jsonwebtoken';
const { verify } = pkg;
const SECRET_KEY = "your_secret_key";

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

export function setTokenCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 3600000, // 1 hour
  });
}

export function clearTokenCookie(res) {
  res.clearCookie("token");
}
