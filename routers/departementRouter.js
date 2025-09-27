// routers/departementRouter.js (Version Corrigée)

const express = require("express");
const router = express.Router();
// Si vous les utilisez ailleurs, vous devez les importer, mais NE PAS les utiliser sur la route publique.
// const { protect } = require("../middleware/authMiddleware"); 
// const { adminOnly } = require("../middleware/adminOnly"); 
const { 
    createDepartement, 
    getDepartements, 
    getDepartementById
} = require("../controllers/departementController");
const { adminOnly } = require("../middleware/adminOnly");
const { protect } = require("../middleware/authMiddleware");


// 1. POST /api/departements : Créer (DOIT être protégé, par exemple, ADMIN SEULEMENT)
// router.post("/", protect, adminOnly, createDepartement); 


// 2. 🚨 GET /api/departements : Récupérer TOUS les départements. 🚨
// DOIT ÊTRE PUBLIC pour que le formulaire d'inscription puisse charger la liste.
router.get("/", getDepartements);
router.post("/",protect,adminOnly, createDepartement);


// 3. GET /api/departements/:id : Obtenir par ID
// router.get("/:id", getDepartementById); 

module.exports = router;