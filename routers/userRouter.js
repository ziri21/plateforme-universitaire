const express= require("express");
const router=express.Router();
const {protect}=require("../middleware/authMiddleware");
const{createUser,login,getProfile,getUsers,updateMyProfil}=require("../controllers/userController");
router.post("/register",createUser);
router.post("/connexion",login);
router.get("/profil",protect,getProfile);
router.put("/modifierProfil",protect,updateMyProfil);
router.get("/",getUsers)
module.exports = router;
