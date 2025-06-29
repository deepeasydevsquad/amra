const express = require("express");
const { body } = require("express-validator");
const { authenticateToken } = require("../middleware/authenticateToken");
const controllers = require("../modules/pengguna/controllers/index");
const validation = require("../validation/daftar_mobil");
const router = express.Router();

console.log("Controllers Object:", controllers);
console.log("editPengguna Function:", controllers.editPengguna);


router.get("/get-pengguna", authenticateToken, controllers.getPengguna);

router.post("/pengguna/add-pengguna", 
  authenticateToken, 
  [
    body("member_id").custom(validation.check_id_member),
    body("grup_id").trim().notEmpty().withMessage("Group ID tidak boleh kosong.").custom(validation.check_id_grup),
    body("division_id").custom(validation.check_id_cabang),

    body("fullname").custom(validation.check_fullname),
    body("identity_number").custom(validation.check_identity_number),
    body("identity_type").custom(validation.check_identity_type),
    body("gender").custom(validation.check_gender),
    body("birth_place").custom(validation.check_birth_place),
    body("birth_date").custom(validation.check_birth_date),
    body("whatsapp_number").custom(validation.check_whatsapp_number),
    body("password").custom(validation.check_password),

    // fullname, identity_number, identity_type, gender, birth_place, birth_date, whatsapp_number, password

  ],
  controllers.addPengguna
);

router.put("/edit-pengguna", authenticateToken, controllers.editPengguna);
router.post("/delete-pengguna", authenticateToken, controllers.deletePengguna)

router.get("/pengguna/get-member", 
  authenticateToken, 
  controllers.get_member
);

router.get("/pengguna/get-grup", 
  authenticateToken, 
  controllers.get_grup
);


module.exports = router;
