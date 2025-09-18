const express=require("express");
const router=express.Router();
const{protect}=require("../middleware/authMiddleware")
const{adminAndProfsOnly}=require("../middleware/adminAndprofsOnly")
const{adminOnly}=require("../middleware/adminOnly")
const {sendNotification,getMyNotifications,deleteNotification,readNotif}=require("../controllers/notificationController");
router.post("/envoyerNotification",protect,sendNotification);//approuve
router.get("/mesNotifs",protect,getMyNotifications)//approuved
router.delete("/supprimerNotif/:id",protect,deleteNotification)// approuved
router.update("/modifierNotif/:id",protect,readNotif)// approuved
module.exports=router;