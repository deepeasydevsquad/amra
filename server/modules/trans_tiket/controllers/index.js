
const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const { handleValidationErrors, handleServerError } = require("../../../helper/handleError");

const controllers = {};

// Generate Unique Nomor Invoice
controllers.generateNomorInvoice = async(req, res) => {
   try {
       const model_cud = new Model_cud(req);
       const response = await model_cud.generateNomorInvoice();
       return res.status(200).json(response);
   }
   catch(error) {
      handleServerError(res, error.message);
   }
};

// Generate Unique Nomor Register
controllers.generateNomorRegister = async(req, res) => {
     try {
         const model_cud = new Model_cud(req);
         const response = await model_cud.generateNomorRegister();
         return res.status(200).json(response);
     }
     catch(error) {
        handleServerError(res, error.message);
     }
};

// Menambahkan tiket baru
controllers.addTiket = async (req, res) => {
   if (!(await handleValidationErrors(req, res))) return;
   try {
        const model_cud = new Model_cud(req);
        const add = await model_cud.add();
        return res.status(200).json(add);
   }
   catch(error) {
       handleServerError(res, error.message);
   }
    
    
};
// get all tickets transactions
controllers.getTicketTransactions = async(req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  try {
     const model_r = new Model_r(req);
     const data = await model_r.ticket_transactions();
     res.status(200).json(data);
  }
  catch(error) {
     handleServerError(res, error.message);
  }
};

controllers.getAirlines = async ( req, res) => {

   try {
      const model_r = new Model_r(req);
      const data = await model_r.getAirlines();
      res.status(200).json({ error: false, data: data } );   
   } catch (error) {
      handleServerError(res, error.message);
   }
}

module.exports = controllers;