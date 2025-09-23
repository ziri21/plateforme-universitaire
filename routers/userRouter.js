const express= require("express");
const router=express.Router();
const {protect}=require("../middleware/authMiddleware");
const{createUser,login,getProfile,getUsers,updateMyProfil}=require("../controllers/userController");
const multer = require("multer");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

 
router.post("/register",createUser);
router.post("/connexion",login);
router.get("/profil",protect,getProfile);
router.put("/modifierProfil", protect, upload.single("image"), updateMyProfil);


router.get("/",getUsers)

module.exports = router;
