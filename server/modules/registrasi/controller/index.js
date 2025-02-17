"use strict";
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");

const { handleValidationErrors, handleServerError, messageError } = require("../../../helper/handleError");

exports.getSubscriptionPrice = async (req, res) => {
  try {
    const model_r = new Model_r(req);
    const e = await model_r.getAmraSetting();

    if (Object.keys(e).length == 0) {
      return res.status(404).json({ error: true, error_msg: 'Harga langganan tidak ditemukan' });
    }

    return res.status(200).json(e.data);
  } catch (error) {
    console.error("❌ Error mengambil harga langganan:", error);
    return res.status(500).json({ error: true, error_msg: 'Gagal mengambil harga langganan'});
  }
};

exports.registerCompany = async (req, res) => {
  // validation handling
  if (!(await handleValidationErrors(req, res))) return;
    
  try {

    const body = req.body;

    const model_r = new Model_r(req);
    
    // generated kode perusahaan
    const company_code = await model_r.generated_company_code();

    // generated refresh token
    const refresh_token = await model_r.generated_company_refresh_token();

    const price = await model_r.get_price();

    // ✅ Enkode password menggunakan JWT
    const hashedPassword = jwt.sign({ password : body.password }, process.env.SECRET_KEY);

    // ✅ Hitung tanggal akhir berlangganan
    const endSubscription = moment().add(1, "years").format("YYYY-MM-DD HH:mm:ss");

    const otp = await model_r.get_otp({ whatsapp_company_number : body.whatsapp_company_number, token : body.token });

    const order_id = `ORDER-${uuidv4()}`;

    let midtransResponse;
    try {
      midtransResponse = await axios.post(process.env.NODE_ENV === 'development' ? process.env.MIDTRANS_SANDBOX_URL : process.env.MIDTRANS_PRODUCTION_URL,
        {
          transaction_details: { order_id, gross_amount: price },
          customer_details: { email : body.email, phone: body.whatsapp_company_number },
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(process.env.MIDTRANS_SERVER_KEY + ":"
            ).toString("base64")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const midtransToken = midtransResponse.data?.token || null;

      const midtransRedirectUrl = midtransResponse.data?.redirect_url || null;

      const model_cud = new Model_cud(req);

      console.log("FeedBack-----Midtrans----");
      console.log(midtransToken);
      console.log(midtransRedirectUrl);
      console.log("FeedBack-----Midtrans----");

      // create company
      await model_cud.create_company(
        { 
          company_code : company_code, 
          company_name : body.company_name, 
          whatsapp_company_number : body.whatsapp_company_number, 
          otp_code : otp.otp_code, 
          expired_time : otp.expired_time, 
          end_subscription : endSubscription, 
          refresh_token : refresh_token, 
          username : body.username, 
          hash_password : hashedPassword, 
          order_id : order_id, 
          price : price
        });

      // get response
      if (await model_cud.response()) {
          return res.status(201).json({
            message: "Registrasi berhasil!",
            order_id : order_id,
            midtrans_token: midtransToken,
            midtrans_redirect_url: midtransRedirectUrl,
          });
      } else {
        res.status(400).json({
          error: true,
          error_msg: 'Proses simpan data Perusahaan baru gagal dilakukan.',
        });
      }
    } catch (err) {
      console.error("❌ Error Midtrans:", err.response?.data || err.message);
      return res.status(500).json({ error: true, error_msg: 'Gagal mendapatkan order ID dari Midtrans' });
    }
  } catch (error) {

    console.log('------Error1');
    console.log(error);
    console.log('------Error1');
    handleServerError(res);
  }


//   // insert new company
//   const iC = await Company.create({
//     code:,
//     kurs: "rp",
//     logo: "",
//     icon: "",
//     company_name :,
//     email: e.email,
//     type: "limited",
//     verify_status: "unverified",
//     verify_time: null,
//     whatsapp_company_number : ,
//     otp: ,
//     otp_expired_time: ,
//     invoice_logo: null,
//     invoice_title: null,
//     start_subscribtion: myDate,
//     end_subscribtion: 
//     whatsapp_device_number: null,
//     whatsapp_device_key: null,
//     refresh_token: ,
//     saldo: 0,
//     markup_ppob: 0,
//     username: ,
//     password: ,
//     start_date_subscribtion: myDate,
//     end_date_subscribtion: endSubscription,
//     transaction_date: myDate,
// });
// // insert subscribtion_payment_history
// await Subscribtion_payment_history.create({
//   company_id: iC.id,
//   order_id : ,
//   amount: ,
//   status: "pending",    
//   createdAt: myDate,
//   updatedAt: myDate,
// });

  // return res.status(201).json({
  //   message: "Registrasi berhasil!",
  //   order_id,
  //   midtrans_token: midtransToken,
  //   midtrans_redirect_url: midtransRedirectUrl,
  // });


  // delete process
  // await model_cud.add();



  // const {
  //   company_name,
  //   email,
  //   whatsapp_company_number,
  //   username,
  //   password,
  //   token,
  // } = req.body;

  // if (
  //   !company_name ||
  //   !email ||
  //   !whatsapp_company_number ||
  //   !username ||
  //   !password ||
  //   !token
  // ) {
  //   return res.status(400).json({ error: "Semua field harus diisi" });
  // }

  // try {
  //   // ✅ Cek OTP
  //   const otpRecord = await Otp.findOne({
  //     where: {
  //       mobile_number: whatsapp_company_number,
  //       otp_code: token,
  //       otp_status: "active",
  //     },
  //   });
  //   if (!otpRecord || new Date(otpRecord.expired_time) < new Date()) {
  //     return res
  //       .status(400)
  //       .json({ error: "OTP tidak valid atau sudah kadaluarsa" });
  //   }

  //   // ✅ Cek apakah nomor sudah terdaftar
  //   const existingCompany = await Company.findOne({
  //     where: { whatsapp_company_number },
  //   });
  //   if (existingCompany) {
  //     return res.status(400).json({ error: "Nomor sudah terdaftar di sistem" });
  //   }

  //   // ✅ Ambil harga paket premium dari `amra_settings`
  //   const settings = await AmraSettings.findOne({
  //     where: { name: "harga_langganan" },
  //   });
  //   const packagePrice = settings ? parseInt(settings.value, 10) : 0;
  //   if (packagePrice <= 0) {
  //     return res.status(500).json({ error: "Harga langganan tidak valid" });
  //   }

  //   // ✅ Generate kode perusahaan unik
  //   let companyCode;
  //   do {
  //     companyCode = Math.random().toString(36).substring(2, 10).toUpperCase();
  //   } while (await Company.findOne({ where: { code: companyCode } }));

  //   // ✅ Generate token unik 49 karakter
  //   let refreshToken;
  //   do {
  //     refreshToken = uuidv4().replace(/-/g, "").substring(0, 49);
  //   } while (await Company.findOne({ where: { refresh_token: refreshToken } }));

  //   // ✅ Enkode password menggunakan JWT
  //   const hashedPassword = jwt.sign({ password }, process.env.SECRET_KEY);

  //   // ✅ Hitung tanggal akhir berlangganan
  //   const endSubscription = moment()
  //     .add(1, "years")
  //     .format("YYYY-MM-DD HH:mm:ss");

  //   // ✅ Request order ID ke Midtrans
  //   const order_id = `ORDER-${uuidv4()}`;
  //   let midtransResponse;
  //   try {
  //     midtransResponse = await axios.post(
  //       "https://app.sandbox.midtrans.com/snap/v1/transactions",
  //       {
  //         transaction_details: { order_id, gross_amount: packagePrice },
  //         customer_details: { email, phone: whatsapp_company_number },
  //       },
  //       {
  //         headers: {
  //           Authorization: `Basic ${Buffer.from(
  //             process.env.MIDTRANS_SERVER_KEY + ":"
  //           ).toString("base64")}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //   } catch (err) {
  //     console.error("❌ Error Midtrans:", err.response?.data || err.message);
  //     return res
  //       .status(500)
  //       .json({ error: "Gagal mendapatkan order ID dari Midtrans" });
  //   }

  //   const midtransToken = midtransResponse.data?.token || null;
  //   const midtransRedirectUrl = midtransResponse.data?.redirect_url || null;

  //   // ✅ Simpan data ke database
  //   const newCompany = await Company.create({
  //     code: companyCode,
  //     kurs: "rp",
  //     logo: "",
  //     icon: "",
  //     company_name,
  //     email,
  //     type: "limited",
  //     verify_status: "unverified",
  //     verify_time: null,
  //     whatsapp_company_number,
  //     otp: otpRecord.otp_code,
  //     otp_expired_time: otpRecord.expired_time,
  //     invoice_logo: null,
  //     invoice_title: null,
  //     start_subscribtion: moment().format("YYYY-MM-DD HH:mm:ss"),
  //     end_subscribtion: endSubscription,
  //     whatsapp_device_number: null,
  //     whatsapp_device_key: null,
  //     refresh_token: refreshToken,
  //     saldo: 0,
  //     markup_ppob: 0,
  //     username,
  //     password: hashedPassword,
  //     start_date_subscribtion: moment().format("YYYY-MM-DD HH:mm:ss"),
  //     end_date_subscribtion: endSubscription,
  //     transaction_date: moment().format("YYYY-MM-DD HH:mm:ss"),
  //   });

  //   await SubscriptionPaymentHistory.create({
  //     company_id: newCompany.id,
  //     order_id,
  //     amount: packagePrice,
  //     status: "pending",
  //   });

  //   return res.status(201).json({
  //     message: "Registrasi berhasil!",
  //     order_id,
  //     midtrans_token: midtransToken,
  //     midtrans_redirect_url: midtransRedirectUrl,
  //   });
  // } catch (error) {
  //   console.error("❌ Error registrasi perusahaan:", error);
  //   return res
  //     .status(500)
  //     .json({ error: "Terjadi kesalahan dalam registrasi" });
  // }
};
