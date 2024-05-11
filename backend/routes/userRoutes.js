const express = require("express");
const userController = require("../controllers/userControllers");

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/:userId/favorites",userController.listFavorites); // Apply the middleware here
router.get("/:userId", userController.getUsernameFromUserId);
module.exports = router;
