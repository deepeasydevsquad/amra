
const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const { handleValidationErrors, handleServerError } = require("../../../helper/handleError");

const controllers = {};

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
module.exports = controllers;