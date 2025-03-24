const { Kostumer_paket_la } = require("../models"); // Model Kostumer Paket LA

const kostumer_paket_laHelper = {}

kostumer_paket_laHelper.getKostumerPaketLAById = async (id) => {
    const data = await Kostumer_paket_la.findOne({
        where: { id },
        attributes: ["name", "mobile_number", "address"],
    });
    return data;
};

module.exports = kostumer_paket_laHelper
