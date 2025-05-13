const { Op, Jamaah, Paket, Member } = require("../models");

const { getCabang } = require("../helper/companyHelper");
    
const validation = {};

validation.check_id_jamaah = async ( value,  { req } ) => {
    try {
        console.debug(`Validating id_jamaah: ${value} for req: `, req.body);

        const division_id = await getCabang(req);
        console.debug(`Division ID: ${division_id}`);
        var check = await Jamaah.findOne({where: { id : value, division_id : division_id }});
        if (!check) {
            console.debug(`ID Jamaah tidak terdaftar di pangkalan data`);
            throw new Error("ID Jamaah tidak terdaftar di pangkalan data");
        }
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

validation.check_id_target_paket = async (value, { req }) => {
    try {
        if (!value) return true;

        const division_id = await getCabang(req);
        console.debug(`Division ID: ${division_id}`);
        var check = await Paket.findOne({ where: { id: value, division_id: division_id } });

        if (!check) {
            console.debug(`ID Target Paket tidak terdaftar di pangkalan data`);
            throw new Error("ID Target Paket tidak terdaftar di pangkalan data");
        }

        const today = new Date().setHours(0, 0, 0, 0);
        const departureDate = new Date(check.departure_date).setHours(0, 0, 0, 0);

        if (departureDate <= today) {
            console.debug(`Paket sudah diberangkatkan`);
            throw new Error("Paket sudah diberangkatkan");
        }

        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

validation.check_saldo_deposit_dan_nominal_tabungan = async (value, { req }) => {
    try {
        const division_id = await getCabang(req);

        if (req.body.sumber_dana !== "deposit") {
            console.debug(`Skip validasi, sumber dana tidak deposit`);
            return true; // jika bukan deposit, skip validasi
        }

        const deposit = await Jamaah.findOne({
            where: { id: req.body.jamaah_id, division_id: division_id },
            include: {
                model: Member,
                attributes: ['total_deposit']
            }
        });

        const totalDeposit = deposit?.Member?.total_deposit || 0;

        console.debug(`Total deposit: ${totalDeposit}`);

        if (totalDeposit <= 0) {
            console.debug(`Jamaah tidak memiliki dana deposit`);
            throw new Error("Jamaah tidak memiliki dana deposit");
        }

        if (Number(value) > totalDeposit) {
            console.debug(`Nominal tabungan melebihi total deposit`);
            throw new Error("Nominal tabungan melebihi total deposit");
        }

        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }

}

module.exports = validation;

