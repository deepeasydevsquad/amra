const { Company } = require("../models"); // Sesuaikan dengan model Company

const companyHelper = {};


companyHelper.getCompanyIdByCode = async (companyCode) => {
    try {
        
    //   console.log("============================================");
    //   console.log("Fetching company ID for companyCode:", companyCode);
    //   console.log("============================================");

      const company = await Company.findOne({
        where: { code: companyCode },
        attributes: ["id"], // Hanya ambil field 'id' dari Company
      });

      return company ? company.id : null;
    } catch (error) {
      console.error("Error fetching company ID:", error);
      throw error;
    }
};

module.exports = companyHelper;

