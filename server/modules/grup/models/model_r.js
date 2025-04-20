const { Menu, Submenu, Grup, Division } = require("../../../models");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  // ✅ Ambil Semua Menu
  async getMenu() {
    try {
      const menu = await Menu.findAll({
        include: [
          {
            model: Submenu,
          },
        ],
      });

      return menu;
    } catch (error) {
      console.error("Error fetching menu:", error);
      throw new Error("Failed to fetch menu");
    }
  }

  // ✅ Ambil Semua Grup
  async getGrup() {
    try {
      const grups = await Grup.findAll({
        include: [
          {
            model: Division,
            as: "Division", // Pastikan alias sesuai dengan yang didefinisikan di model
            attributes: ["name"],
          },
        ],
        attributes: ["id", "name", "group_access", "createdAt", "updatedAt"],
      });

      // Ubah format response agar lebih rapi
      const result = grups.map((g) => ({
        id: g.id,
        division: g.Division ? g.Division.name : null, // Gunakan alias yang benar
        name: g.name,
        group_access: JSON.parse(g.group_access || "[]"), // Pastikan JSON tidak null
        createdAt: g.createdAt,
        updatedAt: g.updatedAt,
      }));

      return { success: true, data: result };
    } catch (error) {
      console.error("Error fetching grups:", error); // Tambahkan logging untuk debugging
      return { success: false, error: error.message };
    }
  }
}

module.exports = Model_r;
