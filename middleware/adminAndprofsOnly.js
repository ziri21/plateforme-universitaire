exports.adminAndProfsOnly=(req,res,next)=>{
    const roles=["admin","professor"];
    if(req.user&&roles.includes(req.user.role)){
        next();
    }
    else{
        return res.status(403).json({message:`acces refuse pour ${req.user.role}` })
    }
}