const { Kostumer_paket_la } = require("../models"); // Model Kostumer Paket LA

const kostumer_paket_laHelper = {}

kostumer_paket_laHelper.getIdbyKostumerPaketLA = async (client_name, client_hp_number, client_address) => {
    const data = await Kostumer_paket_la.findOne({
        where: { name: client_name, mobile_number: client_hp_number, address: client_address },
        attributes: ["id"]
    });
    return data
};

module.exports = kostumer_paket_laHelper
