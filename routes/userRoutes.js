const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware")(1);

router.use(auth); // yêu cầu JWT
router.use(isAdmin); // chỉ admin

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
