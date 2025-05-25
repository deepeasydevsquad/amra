const {
  Op,
  Jamaah,
  Paket,
  Member,
  Tabungan
} = require("../models");

const { getCabang } = require("../helper/companyHelper");
    
const validation = {};

validation.check_id_tabungan = async ( value, { req } ) => {
    try {
        const division_id = await getCabang(req);
        var check = await Tabungan.findOne({where: { id : value, division_id : division_id }});
        if (!check) {
            console.debug(`ID Tabungan tidak terdaftar di pangkalan data`);
            throw new Error("ID Tabungan tidak terdaftar di pangkalan data");
        }
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

validation.check_sumber_dana = async ( value, { req } ) => {
    try {
        if (value === 'deposit' || value === 'cash') {
            return true;
        }
        throw new Error("Sumber dana hanya menerima deposit atau cash");
    } catch (error) {
        console.error(error);
        throw error;
    }
}

validation.check_id_jamaah = async ( value,  { req } ) => {
    try {
        const division_id = await getCabang(req);
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
        if (value === null) return true;

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

validation.check_saldo_deposit_dan_biaya = async (value, { req }) => {
    try {
        const division_id = await getCabang(req);

        if (req.body.sumber_dana !== "deposit") {
            console.debug(`Skip validasi, sumber dana tidak deposit`);
            return true; // Skip validasi jika bukan dari deposit
        }

        let totalDeposit = 0;

        if (req.body.id) {
            // Menabung ulang (pakai ID tabungan)
            const tabungan = await Tabungan.findOne({
                where: { id: req.body.id, division_id: division_id },
                include: {
                    model: Jamaah,
                    include: {
                        model: Member,
                        attributes: ['total_deposit']
                    }
                }
            });

            totalDeposit = tabungan?.Jamaah?.Member?.total_deposit || 0;

        } else {
            // Menabung pertama kali (pakai ID jamaah)
            const jamaah = await Jamaah.findOne({
                where: { id: req.body.jamaah_id, division_id: division_id },
                include: {
                    model: Member,
                    attributes: ['total_deposit']
                }
            });

            totalDeposit = jamaah?.Member?.total_deposit || 0;
        }

        if (totalDeposit <= 0) {
            console.debug(`Jamaah tidak memiliki dana deposit`);
            throw new Error("Jamaah tidak memiliki dana deposit");
        }

        if (Number(value) > totalDeposit) {
            console.debug(`Biaya deposit melebihi saldo deposit yang tersedia`);
            throw new Error("Biaya deposit melebihi saldo deposit yang tersedia");
        }

        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = validation;

