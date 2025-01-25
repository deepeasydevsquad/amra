const jwt = require("jsonwebtoken");
const hashEquals = require("hash-equals");
const crypto = require("crypto");
const fs = require("fs");

module.exports = {
  verify_token: function (req, res, next) {
    const token_web = req.query.token;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token_web == token) {
      if (token == null) return res.sendStatus(401);
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(400).json({
            error_msg: "Kode tidak ditemukan",
          });
        } else {
          if (!req.session.amra_session.hasOwnProperty(decoded.kode)) {
            return res.status(400).json({
              msg: "Kode tidak 2 ditemukan",
            });
          }
        }
      });
    } else {
      return res.status(400).json({
        msg: "Kode tidak ditemukan",
      });
    }
    next();
  },
};
