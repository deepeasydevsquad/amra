const {
  Jamaah,
  Agen,
  Member,
  Level_keagenan,
  Fee_agen,
} = require ("../models");

const JamaahHelper = {};

JamaahHelper.getJamaahInfo = async (id) => {
    try {
        const jamaah = await Jamaah.findOne({
            where: { id },
            include: [
                {
                    model: Agen,
                    include: [
                        {
                            model: Level_keagenan,
                        }
                    ]
                },
                {
                    model: Member,
                }
            ]
        })
        console.log(jamaah);
        return jamaah;
    } catch (error) {
        console.error("Error fetching jamaah by id:", error.message);
        throw error;
    }
};

JamaahHelper.getAgenById = async (id) => {
    try {
        const jamaah = await Jamaah.findOne({
            where: { id },
            include: [
                {
                    model: Agen,
                    include: [
                        {
                            model: Member,
                            attributes: ['fullname'],
                        },
                        {
                            model: Fee_agen,
                            attributes: ['id', 'name'],
                        }
                    ]
                }
            ]
        })
        console.log(jamaah);
        return jamaah;
    } catch (error) {
        console.error("Error fetching agen jamaah by id:", error.message);
        throw error;
    }
};

module.exports = JamaahHelper;

