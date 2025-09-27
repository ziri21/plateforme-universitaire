const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// CORRECTION ICI : Utilisez la désélection pour récupérer la fonction si elle est exportée
// dans vos fichiers middleware sous la clé du même nom (ex: module.exports = { adminOnly: ... })
const { adminOnly } = require("../middleware/adminOnly");
const { profOnly } = require("../middleware/profOnly");
const { adminAndprofsOnly } = require("../middleware/adminAndprofsOnly");

const {
    createUser,
    login,
    getProfile,
    getUsers,
    updateMyProfil
} = require("../controllers/userController");
const multer = require("multer");

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
}); 

router.post("/register", createUser);
router.post("/connexion", login);

router.get("/profil", protect, getProfile);
router.put(
    "/modifierProfil", 
    protect, 
    upload.single("image"), 
    updateMyProfil
);

// Cette ligne causait probablement le problème d'importation
router.get(
    "/", 
    protect, 
    adminOnly, 
    getUsers
);

module.exports = router;