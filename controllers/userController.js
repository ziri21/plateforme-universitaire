const User=require("../models/User")
const bcrypt=require("bcrypt");
require('dotenv').config();
const jwt = require("jsonwebtoken");

const generateToken= async(user)=>{
    return  await jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:"7d"}) //ne jamais inclure le mot de passe 

}

exports.createUser= async(req,res)=>{
    const{name,email,password,role}=req.body;
    try{
    const exists= await User.findOne({email});
    if(exists){
        return res.status(409).json({message:"utilisateur existe deja"})
    }
    const user= await User.create({name,email,password,role,image: req.body.image || null})
    return res.status(201).json({
        message:"utilisateur cree",
        id:user._id,
        email:user.email,
        role:user.role,
        token: await generateToken(user)
        
    })}
    catch(err){
        return res.status(500).json({message:err.message})
    }
}
exports.login=async (req,res)=>{
    
    try{
    const exists= await User.findOne({email:req.body.email});
    if(!exists|| !(await exists.comparer(req.body.password))){
        return res.status(401).json({message:"utilisateur non reconnu"})
    }
    return res.status(200).json({message:"connexion reussie",
        id:exists._id,
        name:exists.name,
        email:exists.email,
        role:exists.role,
        token: await generateToken(exists)
    })}catch(err){
        return res.status(500).json({message:err.message})
    }
}
exports.getProfile= async(req,res)=>{
    const user=req.user;
    if(!user){
       return res.status(404).json({message:"user not found"})
    }
    return res.status(200).json({
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role //pas la peine d ajouter token ici l authentification est deja faite donc plus besoin du token 
    })


}
exports.updateMyProfil = async (req, res) => {
  try {
    const { name, password } = req.body;
    const id = req.user._id;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (name) user.name = name;
    if (req.file) {
      user.image = `/uploads/${req.file.filename}`; // garde le chemin vers l’image
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profil mis à jour avec succès",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUsers=async(req,res)=>{
    const users=await User.find();
    return res.status(200).json(users)
}