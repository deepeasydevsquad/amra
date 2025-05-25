const bcrypt = require("bcryptjs");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const Model_r = require("../models/model_r");
const { handleValidationErrors, handleServerError } = require("../../../helper/handleError");
const controllers = {};

controllers.login_process = async (req, res) => {
  // validation handling
  if (!(await handleValidationErrors(req, res))) return;
  // process
  try {
    const body = req.body;
    const model_r = new Model_r(req);
    const data = await model_r.get_user_information();
    // filter if data not in database
    if( Object.keys(data).length > 0 ) {
      // validasi password
      const valid_password = await bcrypt.compare( body.password, data.password );
      // validation
      if (!valid_password) {
        // bad response
        res.status(400).json({
          error: true,
          error_msg: 'Username atau Password anda tidak valid..',
        });
      } else {
        const date = moment(data.end_subscribtion);
        const now = moment();
        if ( date.isBefore(now, 'day') ) {
          // bad response
          res.status(400).json({
            error: true,
            error_msg: 'Masa Berlangganan Anda Sudah Berakhir. Silahkan Hubungi Administrator Untuk Memperpanjang Masa Berlangganan.',
          });
        }else{
            const user = { username : body.username, company_code : data.company_code, type : body.type };
            const accessToken = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '15m' });
            const refreshToken = jwt.sign(user, data.refresh_token, { expiresIn: '7d' });
            // success response
            res.status(200).json({ 
              access_token: accessToken, 
              refresh_token: refreshToken,
              error: false,
              error_msg: 'Sukses.'
            });
        } 
      }
    }else{
      // bad response
      res.status(400).json({
        error: true,
        error_msg: 'Username atau Password anda tidak ditemukan dipangkalan data.',
      });
    }
  } catch (error) {  
    handleServerError(res, error);
  }
}

controllers.user = async (req, res) => {

  // process
  try {
    const model_r = new Model_r(req);
    const data = await model_r.get_menu_submenu_tab();
  
    res.status(200).json({ 
      error: false,
      error_msg: 'Data Berhasil Ditemukan.', 
      menu_info : data.menu_info, 
      user_info : data.user_info
    });

  } catch (error) {  
    handleServerError(res, error);
  }
}

module.exports = controllers;
