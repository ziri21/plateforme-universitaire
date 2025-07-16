const express=require("express");
const router=express.Router();
const {addGrade,updateGrade,getGradesByStudent,getGradesByCourse}=require("../controllers/noteController");
const {profOnly}=require("../middleware/profOnly");
const {protect}=require("../middleware/authMiddleware");
const { studentsOnly } = require("../middleware/studentsOnly");
router.post("/ajouterNote",protect,profOnly,addGrade);//approuved
router.put("/modifierNote/:id",protect,profOnly,updateGrade);//approuved
router.get("/voirMesNotes",protect,studentsOnly,getGradesByStudent);//approuved
router.get("/voirNotesParCours",protect,profOnly,getGradesByCourse);//approuved
module.exports=router;
 
 