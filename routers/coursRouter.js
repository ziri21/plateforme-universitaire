const express=require("express");
const router=express.Router();
const {getAllCourses,
       getFiltrdCourse,
       getAllcoursesOfProf,
       createCourse,
       updateCourse,
       deleteCourse}
       =require("../controllers/coursContoller");
const{adminAndProfsOnly}=require("../middleware/adminAndprofsOnly");
const{adminOnly}=require("../middleware/adminOnly");
const{protect}=require("../middleware/authMiddleware");



router.get("/TouLesCours",protect,getAllCourses);
router.get("/coursFilre",protect,getFiltrdCourse);
router.get("/coursDuProf",protect,adminAndProfsOnly,getAllcoursesOfProf);
router.post("/creationCour",protect,adminAndProfsOnly,createCourse);
router.put("/miseAjourCour/:id",protect,adminAndProfsOnly,updateCourse);
router.delete("/supressionCour/:id",protect,adminOnly,deleteCourse);
module.exports = router;
