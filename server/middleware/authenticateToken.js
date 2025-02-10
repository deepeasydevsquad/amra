const jwt = require("jsonwebtoken");
const hashEquals = require("hash-equals");
const crypto = require("crypto");
const fs = require("fs");

module.exports = {
  authenticateToken : (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  },
};
