// middleware/jwtLogic.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwt_Token = process.env.JWT_SECRET;

const jwtDecoding = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).send({ error: "Please authenticate using a valid token." });
  }

  try {
    const data = jwt.verify(token, jwt_Token);
    req.user = data.user; // Includes id and role
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token." });
  }
};

module.exports = jwtDecoding;
