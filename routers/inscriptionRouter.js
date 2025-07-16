const express=require("express");
const router=express.Router();
const {protect}=require("../middleware/authMiddleware");
const { studentsOnly } = require("../middleware/studentsOnly");
const{enrollToCourse
    ,getMyEnrollments,
    getAllStudentsEnrolledToMyCourse,
    getStudentsEnrolledToACourse,
    getAllStudentsEnrolledToMyCourseFiltred,
    deleteEnrollments
}=require("../controllers/inscriptionController");
const { adminOnly } = require("../middleware/adminOnly");
const { profOnly } = require("../middleware/profOnly");
router.post("/inscrir",protect,studentsOnly,enrollToCourse);//testéeee
router.get("/mesInscriptions",protect,studentsOnly,getMyEnrollments);//testeeee
router.get("/etudiantsInscritAMesCours",protect,profOnly,getAllStudentsEnrolledToMyCourse),//testee
router.get("/etudiantsInscritAMesCoursParCours",protect,profOnly,getAllStudentsEnrolledToMyCourseFiltred)//approuved
router.get("/etudiantsInscritParCours",protect,adminOnly,getStudentsEnrolledToACourse)//approuved
router.delete("/supprimer/:id",protect,adminOnly,deleteEnrollments)//approuved      url:inscriptions/supprimer/464886e86666ef
module.exports=router;