const { Company, Member, Division } = require("../models"); // Sesuaikan dengan model Company
const jwt = require("jsonwebtoken");

const companyHelper = {};

companyHelper.getSeluruhCabangId = async ( company_id ) => {
  var data = [];
  await Division.findAll( { where : { company_id : company_id } }).then(async (value) => {
    await Promise.all(
      await value.map(async (e) => {
        data.push(e.id);
      })
    );
  });
  return data;
}

companyHelper.getCompanyIdByCode = async (req) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.decode(token);
    const company_code = decoded.company_code;
    const company = await Company.findOne({
      where: { code: company_code },
      attributes: ["id"], // Hanya ambil field 'id' dari Company
    });

    return company ? company.id : null;
  } catch (error) {
    throw error;
  }
};

companyHelper.tipe = async (req) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.decode(token);

    return decoded.type;
  } catch (error) {
    console.log("sssss");
    console.log(error);
    console.log("sssss");
    return "";
  }
};




companyHelper.username = async (req) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.decode(token);
    return decoded.username;
  } catch (error) {
    return "";
  }
};

companyHelper.getCabang = async (req) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decoded = jwt.decode(token);
  if (decoded.type === "administrator") {
    const company = await Company.findOne({
      where: { code: decoded.company_code },
      attributes: ["division_id"],
    });
    return company.division_id;
  } else {
    const company = await Member.findOne({
      where: { whatsapp_number: decoded.username },
      attributes: ["division_id"],
      include: {
        required: true,
        model: Division,
        include: {
          required: true,
          model: Company,
          where: { code: decoded.company_code },
        },
      },
    });
    return company.division_id;
  }
};

module.exports = companyHelper;
