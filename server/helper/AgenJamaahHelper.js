const {
  Jamaah,
  Fee_agen,
  Level_keagenan,
  Agen,
  Member
} = require ("../models");

const AgenJamaahHelper = {};

AgenJamaahHelper.getAgenById = async (id) => {
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

module.exports = AgenJamaahHelper;
