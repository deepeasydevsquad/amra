const { Paket_la, Fasilitas_paket_la } = require("../models"); // Model Kostumer Paket LA

const fasilitas_paket_la = {}

fasilitas_paket_la.getIdbyPaketLa = async (req) => {
    if (!req?.body?.register_number) {
        throw new Error("Nomor registrasi tidak boleh kosong.");
    }

    try {
        const data = await Paket_la.findOne({
            where: { register_number: req.body.register_number },
            attributes: ["id"]
        });

        return data ? data.id : null;
    } catch (error) {
        console.error("Error in getIdbyPaketLa:", error);
        throw new Error("Gagal mendapatkan ID Paket LA.");
    }
};


fasilitas_paket_la.getIdbyFasilitasPaketLa = async (req) => {
    try {
        const paket_la_id = await fasilitas_paket_la.getIdbyPaketLa(req);
        const data = await Fasilitas_paket_la.findOne({
            where: { paket_la_id: paket_la_id, invoice: req.body.invoice },
            attributes: ["id"],
        });
        
        return data ? data.id : null;
    } catch (error) {
        console.error("Error in getIdbyFasilitasPaketLa:", error);
        throw new Error("Cannot read properties of undefined (reading '0')");
    }
};

module.exports = fasilitas_paket_la
