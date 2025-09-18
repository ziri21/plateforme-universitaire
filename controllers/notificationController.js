const Notification = require("../models/Notification");
const User = require("../models/User");

exports.sendNotification=async(req,res)=>{
    const {title,message,recipients}=req.body;
    const sender=req.user._id;
     try{
        const recepteur=await User.find({_id:recipients})
        if(recepteur.length<recipients.length){
            return res.status(404).json({message:"destinataire introuvable "})
        }
        const notification= await Notification.create({title:title,message:message,sender:sender,recipients:recipients});
        return res.status(201).json(notification)


     }
     catch(err){
        return res.status(500).json({message:err.message});

     }

}
exports.getMyNotifications=async(req,res)=>{
   
   try
{ const mesNofications=await Notification.find({recipients: req.user._id}).populate("sender");
   return res.status(200).json(mesNofications)}
   catch(err){
      return res.status(500).json({message:err.message})
   }


}
exports.deleteNotification=async(req,res)=>{
   const id=req.params.id;
   try
  {const supression=await Notification.findByIdAndDelete(id);
  if (!supression){
   return res.status(404).json({message:"notification non retrouvée"})
  }
  return res.status(201).json({message:"notification supprimée avec succes"})
}catch(err){
   return res.status(500).json({message:err})
}
}
exports.readNotif=async()=>{
   const {status}=req.body;

   const id=req.params.id;
   const notifStatus= await Notification.findOneAndUpdate({id:id},{status:status},{ runValidators: true })
   res.status(200).json({message:"Notification lue",
      data:notifStatus
   })

}