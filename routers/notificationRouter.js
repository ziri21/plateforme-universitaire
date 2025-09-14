const express=require("express");
const router=express.Router();
const{protect}=require("../middleware/authMiddleware")
const{adminAndProfsOnly}=require("../middleware/adminAndprofsOnly")
const{adminOnly}=require("../middleware/adminOnly")
const {sendNotification,getMyNotifications,deleteNotification}=require("../controllers/notificationController");
router.post("/envoyerNotification",protect,sendNotification);//approuve
router.get("/mesNotifs",protect,getMyNotifications)//approuved
router.delete("/supprimerNotif/:id",protect,adminOnly,deleteNotification)// approuved
module.exports=router;