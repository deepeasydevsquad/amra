const {
    Op,
    Jamaah,
    Paket,
    Mst_fasilitas,
    Member,
    Tabungan,
    Handover_fasilitas,
    Handover_fasilitas_detail,
    Handover_barang,
    Agen,
    Level_keagenan,
} = require("../models");

const { getCompanyIdByCode, getCabang } = require("../helper/companyHelper");
    
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
        console.log(error);
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
        console.log(error);
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
        console.log(error);
        throw error;
    }
}

validation.check_id_target_paket = async (value, { req }) => {
    try {
        const body = req.body;

        // Cek dulu apakah sudah ada handover berdasarkan tabungan_id
        const sudahHandover = await Handover_fasilitas.findOne({
            where: {
                tabungan_id: body.id,
            },
        });

        if (sudahHandover) {
            console.debug(`Paket sudah pernah dihandover, update target ditolak`);
            throw new Error(`Paket sudah pernah dihandover, update target ditolak`);
        }

        if (value === null || value === undefined) {
            return true;
        }

        const division_id = await getCabang(req);
        console.debug(`Division ID: ${division_id}`);

        // Cek Paket ada dan sesuai division
        const check = await Paket.findOne({ where: { id: value, division_id } });
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
        console.log(error);
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
        console.log(error);
        throw error;
    }
};

validation.check_refund_nominal = async (value, { req }) => {
    try {
        const division_id = await getCabang(req);
        const tabungan = await Tabungan.findOne({
            where: { id: req.body.id, division_id: division_id },
            include: {
                model: Jamaah,
                include: {
                    model: Agen,
                    include: {
                        model: Level_keagenan,
                        attributes: ["default_fee"]
                    }
                }
            }
        });

        if (!tabungan) {
            console.debug("Data Tabungan tidak ditemukan");
            throw new Error("Data Tabungan tidak ditemukan");
        }

        const agen = tabungan.Jamaah?.Agen;
        if (!agen) {
            console.debug("Data Agen tidak ditemukan");
            throw new Error("Data Agen tidak ditemukan");
        }

        const maksimal_refund = tabungan.total_tabungan - agen.Level_keagenan.default_fee || 0;
        if (value > maksimal_refund) {
            console.debug("Nominal refund melebihi batas maksimal yang dapat direfund");
            throw new Error("Nominal refund melebihi batas maksimal yang dapat direfund");
        }

        return true;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

validation.check_mst_paket = async (value, { req }) => {
    try {
        const company_id = await getCompanyIdByCode(req);
        const tabungan_id = req.body.id || req.params.id;

        if (!tabungan_id) {
            throw new Error('ID tabungan tidak ditemukan di request');
        }

        // Ambil data tabungan
        const tabungan = await Tabungan.findByPk(tabungan_id);
        if (!tabungan?.target_paket_id) {
            throw new Error('Tabungan tidak memiliki target_paket_id');
        }

        // Ambil daftar fasilitas dari paket
        const paket = await Paket.findByPk(tabungan.target_paket_id, {
            attributes: ['facilities'],
        });
        const fasilitasIds = JSON.parse(paket?.facilities || '[]').map(f => +f.id);

        // Ambil ID handover_fasilitas yang berkaitan
        const handoverIds = await Handover_fasilitas.findAll({
            attributes: ['id'],
            where: { tabungan_id },
            raw: true,
        }).then(rows => rows.map(r => r.id));

        // Ambil ID fasilitas yang sudah digunakan
        const usedIds = await Handover_fasilitas_detail.findAll({
            attributes: ['mst_fasilitas_id'],
            where: {
                handover_fasilitas_id: {
                    [Op.in]: handoverIds.length ? handoverIds : [0],
                },
            },
            raw: true,
        }).then(rows => rows.map(r => r.mst_fasilitas_id));

        // Hitung ID fasilitas yang belum digunakan
        const unusedIds = fasilitasIds.filter(id => !usedIds.includes(id));

        for (const id of value) {
            const fasilitasId = Number(id);

            // Validasi: apakah ID termasuk unused?
            if (!unusedIds.includes(fasilitasId)) {
                throw new Error(`Fasilitas ID ${fasilitasId} tidak tersedia atau sudah digunakan`);
            }

            // Validasi: apakah ID ada di Mst_fasilitas?
            const fasilitas = await Mst_fasilitas.findOne({
                where: {
                    id: fasilitasId,
                    company_id,
                },
            });

            if (!fasilitas) {
                throw new Error(`Fasilitas dengan ID ${fasilitasId} tidak ditemukan`);
            }
        }

        return true;
    } catch (error) {
        console.log('[check_mst_paket]', error);
        throw error;
    }
};

validation.check_id_handover_barang = async (value, { req }) => {
    try {
        // Validasi: apakah semua ID ada di Handover_barang?
        const handoverBarang = await Handover_barang.findAll({
            where: {
                id: {
                    [Op.in]: value,
                },
                tabungan_id: req.body.id,
            },
        });

        if (handoverBarang.length !== value.length) {
            const missingIds = value.filter(id => !handoverBarang.map(hb => hb.id).includes(id));
            throw new Error(`ID Handover Barang ${missingIds.join(', ')} tidak ditemukan`);
        }

        // Validasi: apakah status belum dikembalikan?
        const dikembalikan = handoverBarang.find(hb => hb.status.toLowerCase() === 'dikembalikan');
        if (dikembalikan) {
            throw new Error(`Handover Barang dengan ID ${dikembalikan.id} sudah dikembalikan`);
        }

        return true;
    } catch (error) {
        console.log('[check_id_handover_barang]', error);
        throw error;
    }
};

module.exports = validation;

