const fs = require("fs");
const { Company, Member, Division, Menu, Submenu, Tab } = require("../../../models");
const jwt = require("jsonwebtoken");
const moment = require("moment");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async get_user_information() {
    const body = this.req.body;
    try {
        var data = {};
        if( body.type === 'administrator') {
            await Company.findOne({
                where: { username: body.username },
            }).then(async (e) => {
                if (e) {
                    data["company_code"] = e.code;
                    data["password"] = e.password;
                    data["start_subscribtion"] = e.start_subscribtion;
                    data["end_subscribtion"] = e.end_subscribtion;
                    data["refresh_token"] = e.refresh_token;
                }
            });
        }else if( body.type === 'staff' ) {
            await Member.findOne({
                where: { whatsapp_number: body.username },
                includes : {
                    required : true, 
                    model : Division,
                    includes : {
                        required : true, 
                        model : Company,
                        where : { code : body.company_code }
                    }
                }
            }).then(async (e) => {
                if (e) {
                    data["company_code"] = e.Division.Company.code;
                    data["password"] = e.password;
                    data["start_subscribtion"] = e.Division.Company.start_subscribtion;
                    data["end_subscribtion"] = e.Division.Company.end_subscribtion;
                    data["refresh_token"] = e.Division.Company.refresh_token;
                }
            });
        }
        return data;
    } catch (error) {
        return {}        
    }
  }

  async get_menu_submenu_tab() {
    try {
        const authHeader = this.req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const decoded = jwt.decode(token);
        const company_code = decoded.company_code;
        const type = decoded.type;
        const username = decoded.username;

        var user_info = { company_code, username, type };
        await Company.findOne({
            where: { code: company_code },
        }).then(async (e) => {
            if (e) {
              user_info['logo'] = e.logo;
              user_info['company_name'] = e.company_name;
              user_info['tipe_berlangganan'] = e.type;
              user_info['akhir_berlangganan'] = moment(e.end_subscribtion).format("D MMMM YYYY");
            }
        });

        var posisiLogo = "/uploads/pengaturan/" + user_info.logo;
        if ( ! await fs.existsSync(posisiLogo) ) {
          user_info.logo = "default.png"; // Update jika file tidak ada
        }

        var menu = {};
        await Menu.findAll().then(async (value) => {
          await Promise.all(
            await value.map(async (e) => {
              menu[e.id] = { id : e.id, name : e.name, path : e.path, icon : e.icon, tab : e.path === '#' ? '' : JSON.parse(e.tab)};
            })
          );
        });
  
        var submenu = {};
        await Submenu.findAll().then(async (value) => {
          await Promise.all(
            await value.map(async (e) => {
                if(submenu[e.menu_id] === undefined ) {
                    submenu = {...submenu,...{[e.menu_id] : [{ id: e.id, name : e.name, path: e.path, tab : e.tab === '' ? '' : JSON.parse(e.tab) }]}}
                }else{
                    submenu[e.menu_id].push({ id: e.id, name : e.name, path: e.path, tab : e.tab === '' ? '' : JSON.parse(e.tab) });
                }
            })
          );
        });

        var tab = {};
        await Tab.findAll().then(async (value) => {
            await Promise.all(
              await value.map(async (e) => {
                tab = {...tab,...{[e.id] : { id : e.id, name : e.name, icon : e.icon, path: e.path, desc : e.desc }}};
              })
            );
        });

        var defaut_tab = {};
        // if( Object.keys(defaut_tab).length === 0 ) {

        // }

        return { menu_info : { menu , submenu, tab }, user_info : user_info };
    } catch (error) {
        return {}    
    }
  }
}

module.exports = Model_r;
