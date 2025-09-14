const express= require("express");
const router=express.Router();
const {protect}=require("../middleware/authMiddleware");
const{createUser,login,getProfile,getUsers}=require("../controllers/userController");
router.post("/register",createUser);
router.post("/connexion",login);
router.get("/profil",protect,getProfile);
router.get("/",getUsers)
module.exports = router;
