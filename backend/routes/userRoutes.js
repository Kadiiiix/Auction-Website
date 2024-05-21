const express = require("express");
const userController = require("../controllers/userControllers");
const commentController = require('../controllers/commentController');

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/:userId/favorites",userController.listFavorites); // Apply the middleware here
router.get("/:userId", userController.getUsernameFromUserId);
router.get("/comments/:userId", commentController.getCommentsByUserId);
router.put("/:userId", userController.editUserInfo);
router.post("/:userId/rate", userController.addVendorRating);
router.get("/recommendations/:userId", userController.getRecommendations);

module.exports = router;
