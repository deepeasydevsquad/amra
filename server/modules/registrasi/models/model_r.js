const {
  Company,
  Member,
  Division,
  Menu,
  Submenu,
  Amra_setting,
  Otp,
} = require("../../../models");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async getAmraSetting() {
    // sql["attributes"] = ["id","nomor_akun_bank","nama_akun_bank","tipe","updatedAt"];
    try {
      var data = {};
      await Amra_setting.findOne({
        attributes: ["value"],
        where: { name: "harga_langganan" },
      }).then(async (e) => {
        if (e) {
          data["harga_langganan"] = e.value;
        }
      });
      return { data };
    } catch (error) {
      console.log("zzzz");
      console.log(error);
      console.log("zzzz");
      return {};
    }
  }

  async generated_company_code() {
    let companyCode;
    do {
      companyCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    } while (await Company.findOne({ where: { code: companyCode } }));

    return companyCode;
  }

  //   helper.randomString = async (length, chars) => {
  //     var result = "";
  //     for (var i = length; i > 0; --i)
  //       result += chars[Math.floor(Math.random() * chars.length)];
  //     return result;
  //   };

  async randomString(length, chars) {
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  async generated_company_refresh_token() {
    var refreshToken = "";
    let condition = true;
    while (condition) {
      refreshToken = await this.randomString(
        49,
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      );
      var check = await Company.findOne({
        where: { refresh_token: refreshToken },
      });
      if (!check) condition = false;
    }
    return refreshToken;
  }

  async get_price() {
    const settings = await Amra_setting.findOne({
      attributes: ["value"],
      where: { name: "harga_langganan" },
    });

    return settings ? parseInt(settings.value, 10) : 0;
  }

  async get_otp(i) {
    const otpRecord = await Otp.findOne({
      where: {
        mobile_number: i.whatsapp_company_number,
        otp_code: i.token,
        otp_status: "active",
        otp_type: "registration",
      },
    });
    return otpRecord;
  }

  //   async get_user_information() {
  //     const body = this.req.body;
  //     try {
  //         var data = {};
  //         if( body.type === 'administrator') {
  //             await Company.findOne({
  //                 where: { username: body.username },
  //             }).then(async (e) => {
  //                 if (e) {
  //                     data["company_code"] = e.code;
  //                     data["password"] = e.password;
  //                     data["start_subscribtion"] = e.start_subscribtion;
  //                     data["end_subscribtion"] = e.end_subscribtion;
  //                     data["refresh_token"] = e.refresh_token;
  //                 }
  //             });
  //         }else if( body.type === 'staff' ) {
  //             await Member.findOne({
  //                 where: { whatsapp_number: body.username },
  //                 includes : {
  //                     required : true,
  //                     model : Division,
  //                     includes : {
  //                         required : true,
  //                         model : Company,
  //                         where : { code : body.company_code }
  //                     }
  //                 }
  //             }).then(async (e) => {
  //                 if (e) {
  //                     data["company_code"] = e.Division.Company.code;
  //                     data["password"] = e.password;
  //                     data["start_subscribtion"] = e.Division.Company.start_subscribtion;
  //                     data["end_subscribtion"] = e.Division.Company.end_subscribtion;
  //                     data["refresh_token"] = e.Division.Company.refresh_token;
  //                 }
  //             });
  //         }
  //         return data;
  //     } catch (error) {
  //         return {}
  //     }
  //   }

  //   async get_menu_submenu_tab() {
  //     try {
  //         const authHeader = this.req.headers['authorization'];
  //         const token = authHeader && authHeader.split(' ')[1];
  //         const decoded = jwt.decode(token);
  //         const company_code = decoded.company_code;
  //         const type = decoded.type;
  //         const username = decoded.username;

  //         var menu = {};
  //         await Menu.findAll().then(async (value) => {
  //           await Promise.all(
  //             await value.map(async (e) => {
  //               menu[e.id] = { id : e.id, name : e.name, path : e.path, icon : e.icon, tab : JSON.parse(e.tab)};
  //             })
  //           );
  //         });

  //         var submenu = {};
  //         await Submenu.findAll().then(async (value) => {
  //           await Promise.all(
  //             await value.map(async (e) => {
  //                 if(submenu[e.menu_id] === undefined ) {
  //                     submenu = {...submenu,...{[e.menu_id] : [{ id: e.id, name : e.name, path: e.path, tab : JSON.parse(e.tab) }]}}
  //                 }else{
  //                     submenu[e.menu_id].push({ id: e.id, name : e.name, path: e.path, tab : JSON.parse(e.tab) });
  //                 }
  //             })
  //           );
  //         });

  //         var tab = {};
  //         await Tab.findAll().then(async (value) => {
  //             await Promise.all(
  //               await value.map(async (e) => {
  //                 tab = {...tab,...{[e.id] : { id : e.id, name : e.name, icon : e.icon, path: e.path, desc : e.desc }}};
  //               })
  //             );
  //         });

  //         var defaut_tab = {};
  //         // if( Object.keys(defaut_tab).length === 0 ) {

  //         // }

  //         return { menu_info : { menu , submenu, tab }, user_info : { company_code, username, type} };
  //     } catch (error) {

  //       console.log("----------error")
  //       console.log(error)
  //       console.log("----------error")
  //         return {}
  //     }
  //   }
}

module.exports = Model_r;
