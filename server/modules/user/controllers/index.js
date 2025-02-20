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

            console.log("User--------");
            console.log(user);
            console.log("User--------");

            const accessToken = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '15m' });
            const refreshToken = jwt.sign(user, data.refresh_token, { expiresIn: '7d' });
            // success response
            res.status(200).json({ 
              access_token: accessToken, 
              refresh_token: refreshToken,
              error: false,
              error_msg: 'Username atau Password anda tidak ditemukan dipangkalan data.'
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
    console.log('Tes-----') ;
    console.log(error) ;
    console.log('Tes-----') ;
    handleServerError(res, error);
  }
}

controllers.user = async (req, res) => {

  // process
  try {
    const model_r = new Model_r(req);

    console.log("--------XXXXXXXXXXXXXXXXX");
    console.log("--------XXXXXXXXXXXXXXXXX");
    console.log("--------XXXXXXXXXXXXXXXXX");
    const data = await model_r.get_menu_submenu_tab();

    console.log('------------DDD');
    console.log(data);
    console.log('------------DDD');
  
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


//   const { username } = req.body;

//   console.log("Username");
//   console.log(username);
//   console.log("Username");

//   if (!username) return res.status(400).json({ message: 'Username diperlukan' });

//   const user = { username };
//   const accessToken = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '15m' });
//   const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET_KEY, { expiresIn: '7d' });
//   refreshTokens.push(refreshToken);

//   res.json({ access_token: accessToken, refresh_token: refreshToken });
// /**
//  * Login Area Views
//  **/
// controllers.Login_area = async (req, res) => {
//   res.render("login/index");
// };

// /**
//  * Melakukan authentikasi proses login user
//  **/
// controllers.Login_process = async (req, res) => {
//   const vals = validationResult(req);
//   const errors = vals.errors;
//   if (errors.length > 0 ) {
//     const err_msg = await error_msg(errors);
//     res.status(400).json({ error: true, error_msg: err_msg });
//   } else {
//     const model_r = new Model_r(req);
//     try {
//       const data = await model_r.get_one_user();
//       if (data) {
//         const body = req.body;
//         const valid_password = await bcrypt.compare(
//           body.password,
//           data.password
//         );
//         if (!valid_password) {
//           res.status(400).json({ error: true,  error_msg: "Password Tidak Valid" });
//         } else {
//           if (typeof req.session.administrator_session !== "undefined") {
//             if (!req.session.administrator_session.hasOwnProperty(data.kode)) {
//               var list = [];
//               if( Object.keys(req.session.administrator_session).length > 0 ) {
//                 req.session.administrator_session.forEach((element, key) => {
//                   list[key] = element;
//                 });
//                 list[data.kode] = { name: data.name };
//                 req.session.administrator_session = list;
//               }else{
//                 req.session.administrator_session = {
//                   [data.kode]: { name: data.name },
//                 };
//               }
//             }
//           } else {
//             req.session.administrator_session = {
//               [data.kode]: { name: data.name },
//             };
//           }
//           const access_token = jwt.sign(
//             { kode: data.kode, name: data.name },
//             process.env.ACCESS_TOKEN_SECRET,
//             { expiresIn: "360d" }
//           );
//           res.status(200).json({
//             msg: "Login Berhasih Dilakukan",
//             kode: data.kode,
//             access_token: access_token,
//           });
//         }
//       } else {
//         res.status(400).json({ error_msg : true, error_msg: "Username tidak ditemukan" });
//       }
//     } catch (error) {
//       res.status(400).json({ msg: error });
//     }
//   }
// };

// controllers.Logout = async (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//     if (!err) {
//       delete req.session.administrator_session[decoded.kode];  
//       res.send({error : false , error_msg :  `Logout berhasil dilakukan.`});
//     } 
//   });
// }

// controllers.Info_profil = async (req, res ) => {
//     const token = req.query.token;
//     try {
//       jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
//         if (err) {
//           return res.status(400).json({
//             error_msg: "Kode tidak ditemukan",
//           });
//         } else {
//           var data = {};
//           await User.findOne({
//             where: { kode: decoded.kode },
//           }).then(async (val) => {
//             if (val) {
//               data["id"] = val.id;
//               data["name"] = val.name;
//             }
//           });
//           res.status(200).json({
//             error: false,
//             error_msg: 'Data profil ditemukan',
//             data : data, 
//           });
//         }
//       });
      
//     } catch (error) {
//       res.status(400).json({
//         error: true,
//         error_msg: 'Data profil tidak ditemukan',
//       });
//     }
// }

// controllers.UpdateProfile = async (req, res) => {
//   // validation handling
//   if (!(await handleValidationErrors(req, res))) return;
//   // process
//   try {
//     const token = req.query.token;
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
//       if (err) {
//         return res.status(400).json({
//           error_msg: "Kode tidak ditemukan",
//         });
//       } else {
//         const model_cud = new Model_cud(req);
//         // delete process
//         await model_cud.UpdateProfile(decoded.kode);
//         // get response
//         if (await model_cud.response()) {
//           res.status(200).json({
//             error: false,
//             error_msg: 'Update Profil Berhasil Ditambahkan.',
//           });
//         } else {
//           res.status(400).json({
//             error: true,
//             error_msg: 'Update Profil Gagal Ditambahkan.',
//           });
//         }
//       }
//     });
//   } catch (error) {
//     handleServerError(res);
//   }
// }

module.exports = controllers;
