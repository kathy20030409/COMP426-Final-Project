/**
 * Sets a cookie with the JWT token.
 * @param {object} res - The response object.
 * @param {string} token - The JWT token.
 */
exports.setAuthToken = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true, // Cookie not accessible via client-side JavaScript.
    secure: true, // Cookie is sent only over HTTPS.
    maxAge: 3600000, // Cookie expiration time in milliseconds (1 hour).
  });
};

/**
 * Clears the authentication token cookie.
 * @param {object} res - The response object.
 */
exports.clearAuthToken = (res) => {
  res.clearCookie("token");
};
