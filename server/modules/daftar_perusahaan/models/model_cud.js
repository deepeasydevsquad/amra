const { sequelize, Company } = require("../../../models");
const bcrypt = require("bcryptjs");
// const Model_r = require("../models/model_r");
const { writeLog } = require("../../../helper/writeLogHelper");
const {
  generated_code,
  generated_refresh_token,
} = require("../../../helper/randomHelper");
const moment = require("moment");

class Model_cud {
  constructor(req) {
    this.req = req;
    this.company_id;
  }

  async initialize() {
    this.t = await sequelize.transaction();
    this.state = true;
  }

  // Tambah Perusahaan
  async add() {
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;
    const code = await generated_code();
    const refresh_token = await generated_refresh_token();

    try {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      // insert process
      await Company.create(
        {
          code,
          kurs: "rp",
          logo: null,
          icon: null,
          company_name: body.company_name,
          email: body.email,
          type: body.type,
          verify_status: "verified",
          verify_time: myDate,
          whatsapp_company_number: body.whatsapp_company_number,
          otp: null,
          otp_expired_time: myDate,
          invoice_logo: null,
          invoice_title: null,
          start_subscribtion: body.start_subscribtion,
          end_subscription:
            body.type == "limited" ? body.end_subscription : null,
          whatsapp_device_number: null,
          whatsapp_device_key: null,
          refresh_token,
          saldo: 0,
          markup_ppob: 0,
          username: body.username,
          password: hashedPassword,
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          transaction: this.t,
        }
      );
    } catch (error) {
      this.state = false;
    }
  }

  // update data perusahaan
  async update() {
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {
      var data = {
        company_name: body.company_name,
        email: body.email,
        type: body.type,
        whatsapp_company_number: body.whatsapp_company_number,
        start_subscribtion: body.start_subscribtion,
        end_subscription: body.type == "limited" ? body.end_subscription : null,
        saldo: 0,
        username: body.username,
        updatedAt: myDate,
      };

      if (body.password != "") {
        const hashedPassword = await bcrypt.hash(body.password, 10);
        data = { ...data, ...{ ["password"]: hashedPassword } };
      }

      // update process
      await Company.update(
        data,
        {
          where: { id: body.id },
        },
        {
          transaction: this.t,
        }
      );
    } catch (error) {
      this.state = false;
    }
  }

  // delete data perusahaan
  async delete() {
    await this.initialize();
    const body = this.req.body;

    try {
      // delete company
      await Company.destroy(
        {
          where: {
            id: body.id,
          },
        },
        {
          transaction: this.t,
        }
      );
    } catch (error) {
      this.state = false;
    }
  }

  // response
  async response() {
    if (this.state) {
      // commit
      await this.t.commit();
      return true;
    } else {
      // rollback
      await this.t.rollback();
      return false;
    }
  }
}

module.exports = Model_cud;
