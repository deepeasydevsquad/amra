const { User, Member, Grup, Division } = require("../../../models");
const { Op } = require("sequelize");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async daftar_pengguna() {
    const body = this.req.body;
    var limit = body.perpage || 10;
    var page = body.pageNumber || 1;

    var where = {};
    if (body.search) {
      where = {
        ...where,
        [Op.or]: [{ id: { [Op.like]: `%${body.search}%` } }],
      };
    }

    var sql = {
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [["id", "ASC"]],
      attributes: ["id", "createdAt", "updatedAt"],
      where,
      include: [
        { model: Member, attributes: ["fullname"], as: "Member" },
        { model: Division, attributes: ["name"], as: "Division" },
        { model: Grup, attributes: ["name"], as: "Grup" },
      ],
    };

    try {
      const { count, rows } = await User.findAndCountAll(sql);
      return { data: rows, total: count };
    } catch (error) {
      console.error("Error fetching users:", error);
      return { data: [], total: 0 };
    }
  }

  async infoPengguna(id) {
    try {
      const pengguna = await User.findOne({
        where: { id },
        attributes: ["id", "createdAt", "updatedAt"],
        include: [
          { model: Member, attributes: ["fullname"], as: "Member" },
          { model: Division, attributes: ["name"], as: "Division" },
          { model: Grup, attributes: ["name"], as: "Grup" },
        ],
      });
      return pengguna || {};
    } catch (error) {
      console.error("Error fetching user info:", error);
      return {};
    }
  }
}

module.exports = Model_r;
