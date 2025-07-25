const bcrypt = require("bcryptjs");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const Model_r = require("../models/model_r");
const { handleValidationErrors, handleServerError } = require("../../../helper/handleError");

const controllers = {};

let refreshTokens = [];

controllers.login_process = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const body = req.body;
    const model_r = new Model_r(req);
    const data = await model_r.get_user_information();

    if (Object.keys(data).length > 0) {
      const valid_password = await bcrypt.compare(body.password, data.password);
      if (!valid_password) {
        return res.status(400).json({
          error: true,
          error_msg: "Username atau Password anda tidak valid.",
        });
      }

      const endDate = moment(data.end_subscribtion);
      const now = moment();

      if (endDate.isBefore(now, 'day')) {
        return res.status(400).json({
          error: true,
          error_msg: "Masa Berlangganan Anda Sudah Berakhir. Silahkan Hubungi Administrator.",
        });
      }

      const userPayload = {
        username: body.username,
        company_code: data.company_code,
        type: body.type,
        ...(body.type === "staff" && { division_id: data.division_id }), // Hanya untuk staff yang memiliki division_id
      };

      console.log(userPayload);

      const accessToken = jwt.sign(userPayload, process.env.SECRET_KEY, { expiresIn: "10s" });
      const refreshToken = jwt.sign(userPayload, process.env.REFRESH_SECRET_KEY, { expiresIn: "7d" });

      refreshTokens.push(refreshToken); // optional: bisa dikelola lebih baik via DB

      return res.status(200).json({
        access_token: accessToken,
        refresh_token: refreshToken,
        error: false,
        error_msg: "Sukses.",
      });
    } else {
      return res.status(400).json({
        error: true,
        error_msg: "Username atau Password anda tidak ditemukan di pangkalan data.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.user = async (req, res) => {
  try {
    const model_r = new Model_r(req);
    const data = await model_r.get_menu_submenu_tab();

    res.status(200).json({
      error: false,
      error_msg: "Data Berhasil Ditemukan.",
      menu_info: data.menu_info,
      user_info: data.user_info,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.refreshToken = async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(401).json({ error: true, error_msg: "Token diperlukan" });
  }

  // Optional: validasi kalau token memang tersimpan
  if (!refreshTokens.includes(refresh_token)) {
    return res.status(403).json({ error: true, error_msg: "Token tidak dikenali" });
  }

  jwt.verify(refresh_token, process.env.REFRESH_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: true, error_msg: "Token kadaluarsa atau tidak valid" });
    }

    const { exp, iat, ...cleanUser } = user;

    const accessToken = jwt.sign(cleanUser, process.env.SECRET_KEY, { expiresIn: "15m" });

    res.status(200).json({
      access_token: accessToken,
      error: false,
      error_msg: "Token baru berhasil dibuat",
    });
  });
};

module.exports = controllers;
