  exports.profOnly=(req,res,next)=>{
    if(req.user&&req.user.role==="professor"){
    next();
   }else{
    return res.status(403).json({message:"acces reservee au professeurs "})
   }}
