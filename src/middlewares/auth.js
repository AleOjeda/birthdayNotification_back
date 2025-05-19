const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(402).json({ error: "No token provided" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    console.error("🛑 JWT verify error:", err.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
module.exports = authenticateToken;
