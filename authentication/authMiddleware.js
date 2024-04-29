const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key";

exports.authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = decoded.userId;
    next();
  });
};

exports.setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 3600000, // 1 hour
  });
};

exports.clearTokenCookie = (res) => {
  res.clearCookie("token");
};
