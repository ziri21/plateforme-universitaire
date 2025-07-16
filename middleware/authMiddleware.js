const jwt=require("jsonwebtoken")
const User=require("../models/User")
exports. protect= async(req,res,next)=>{
    let token;
    
    if(req.headers.authorization&&req.headers.authorization.startsWith("Bearer")){
        try{
            token=req.headers.authorization.split(' ')[1];
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user= await User.findOne({_id:decoded.id}).select("-password");
             if (!req.user) {
               return res.status(401).json({ message: "Utilisateur introuvable" });
      }
            next();

        }catch(err){
            return res.status(500).json({message:err.message})
        }
    }else{
       return res.status(401).json({message:"token manquant"})
    }


}