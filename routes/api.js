const express = require("express");
const { catchErrors } = require("../handlers/errorHandlers");

const router = express.Router();

const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");

//_______________________________ Admin management_______________________________

router.route("/admin/create").post(catchErrors(adminController.create));
router.route("/admin/read/:id").get(catchErrors(adminController.read));
router.route("/admin/update/:id").patch(catchErrors(adminController.update));
router.route("/admin/delete/:id").delete(catchErrors(adminController.delete));
router.route("/admin/search").get(catchErrors(adminController.search));
router.route("/admin/list").get(catchErrors(adminController.list));
router
  .route("/admin/password-update/:id")
  .patch(catchErrors(adminController.updatePassword));
//list of admins ends here

//_____________________________________ API for users __________________________
router.route("/user/create").post(catchErrors(userController.create));
router.route("/user/read/:id").get(catchErrors(userController.read));
router.route("/user/update/:id").patch(catchErrors(userController.update));
router.route("/user/delete/:id").delete(catchErrors(userController.delete));
router.route("/user/search").get(catchErrors(userController.search));
router.route("/user/list").get(catchErrors(userController.list));

module.exports = router;
