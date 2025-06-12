const {
  Op,
  Agen,
  Pembayaran_fee_agen,
  Member,
  Fee_agen,
  Level_keagenan,
} = require("../../../models");
const { getCompanyIdByCode } = require("../../../helper/companyHelper");
const { convertToRP } = require("../../../helper/currencyHelper");
