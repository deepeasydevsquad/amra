const moment = require("moment");

const { System_log,System_log_surveyor, User, Survey_kegiatan, Surveyor } = require("../../db/models");
const { jwt_value } = require("../../helpers/jwt");

const helper = {};

helper.info_user = async (req) => {
  const jwt = await jwt_value(req);
  var list = {};
  await User.findOne({
    where: { kode: jwt.kode },
  }).then(async (val) => {
    if (val) {
      list["id"] = val.id;
      list["name"] = val.name;
    }
  });
  return list;
};

// helper.info_surveyor = async (req) => {
//   const token = req.query.token;
//   var list = {};
//   await Survey_kegiatan.findOne({
//     include : {
//       required : true,
//       model : Surveyor,
//       attributes: ['name']
//     },
//     where: { access_code: token },
//   }).then(async (val) => {
//     if (val) {
//       list["surveyor_id"] = val.surveyor_id;
//       list['nama_surveyor'] = val.Surveyor.name;
//     }
//   });
//   return list;
// }

// helper.write_log = async (req, t, param) => {
//   const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
//   const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
//   const info = await helper.info_user(req);
//   const data = {};
//   data["user_id"] = info.id;
//   data["msg"] = info.name + " " + param.msg;
//   data["ip"] = ip;
//   data["createdAt"] = myDate;
//   data["updatedAt"] = myDate;

//   await System_log.create(data, {
//     transaction: t,
//   });
// };

// helper.write_log_survey = async (req, t, param) => {
//   const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
//   const info = await helper.info_surveyor(req);
//   await System_log_surveyor.create({
//     ip: ip, 
//     surveyor_id: info.surveyor_id,
//     msg : info.nama_surveyor + " " + param.msg, 
//   }, {
//     transaction: t,
//   });
// }



module.exports = helper;
