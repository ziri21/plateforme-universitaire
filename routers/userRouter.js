const express= require("express");
const router=express.Router();
const {protect}=require("../middleware/authMiddleware");
const{createUser,login,getProfile}=require("../controllers/userController");
router.post("/register",createUser);
router.post("/connexion",login);
router.get("/profil",protect,getProfile);
module.exports = router;
