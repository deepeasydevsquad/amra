const { Company } = require("../models"); // Sesuaikan dengan model Company
const jwt = require("jsonwebtoken");

const companyHelper = {};


companyHelper.getCompanyIdByCode = async (req) => {
    try {

      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      const decoded = jwt.decode(token);
      const company_code = decoded.company_code;

      const company = await Company.findOne({
        where: { code: company_code },
        attributes: ["id"], // Hanya ambil field 'id' dari Company
      });



      console.log('==============Company ID');
      console.log(company.id);
      console.log('==============Company ID');


      return company ? company.id : null;
    } catch (error) {
      console.error("Error fetching company ID:", error);
      throw error;
    }
};

module.exports = companyHelper;

