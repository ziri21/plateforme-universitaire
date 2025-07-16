const User=require("../models/User");
const Cours=require("../models/Cours")
const Inscription=require("../models/Inscription")
exports.enrollToCourse=async(req,res)=>{    
const student=req.user._id; //pour recuperer le user authentifiee .......req.user.......
const {course}=req.body
try{

const cours=await Cours.findOne({_id:course});
const exists=await Inscription.findOne({student,course});
if (req.user.role !== "student") {
  return res.status(403).json({ message: "Seuls les étudiants peuvent s'inscrire aux cours" });
}

if(exists){
    return res.status(400).json({message:"etudiant deja inscrit au cours voulue "})
}
if(!cours){
    return res.status(404).json({message:"etudiant ou cours non retrouvé"})
}
const inscription= await Inscription.create({student,course});
return res.status(201).json({message:"Inscription reussie",data:inscription})
}
    catch(err){
    return res.status(500).json({message:err.message})
}
}
exports.getMyEnrollments=async(req,res)=>{
const student=req.user._id;

try
{


if(req.user.role!=="student"){
    return res.status(403).json({message:"l utilisateur n est pas un etudiant"})
}const mesCours= await Inscription.find({student})
.populate(
    {
        path:"course",
        select:"code name professor",
        populate:{
            path:"professor",
            select:"name email "
    
        }

    })

if(!mesCours){
    return res.status(401).json({message:"etudiant est inscrit a aucun cours"})
}
return res.status(200).json({message:"voici vos inscriptions",mesCours})
}catch(err){return res.status(500).json({message:err.message})}
}
exports.deleteEnrollments=async(req,res)=>{
    const {id}=req.params;
    try{
        console.log(id)
        const inscr=await Inscription.deleteOne({_id:id});
        if(inscr.deletedCount===0){
            return res.status(404).json({message:"inscription non retrouvée"})
        }
        return res.status(200).json({message:"supression reussie"})

    }catch(err){
        return res.status(500).json({message:err.message})
    }
}
exports.getAllStudentsEnrolledToMyCourse=async(req,res)=>{

    const prof=req.user.id;
    try{
        const mesCours=await Cours.find({professor:prof})
        const mesCoursId=mesCours.map(c=>c._id);
    const mesEtudiants=await Inscription.find({course: {$in :mesCoursId} }).populate([{path:"course",select:"code professor "},{path:"student",select:"name email"}]);
   
    return res.status(200).json({
        message:" voici la liste des etudiants inscrit a vos cours",
        mesEtudiants
    })
   
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}
exports.getAllStudentsEnrolledToMyCourseFiltred=async(req,res)=>{

    const prof=req.user.id;
    const codecours=req.query.code;
    try{
        const mesCours=await Cours.find({professor:prof,code:codecours})
        console.log(codecours);
        
        const mesCoursId=mesCours.map(c=>c._id);
    const mesEtudiantsCours=await Inscription.find({course: { $in: mesCoursId}}).populate([{path:"student",select:"name email "},{path:"course",select:"code name "}]);
   
    return res.status(200).json({
        message:" voici la liste des etudiants inscrit au cours choisit",
        mesEtudiantsCours
    })
   
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}
exports.getStudentsEnrolledToACourse=async(req,res)=>{
    const code=req.query.code;
    try{
        console.log(code)
        const course=await Cours.findOne({code:code});
        if(!course){
           return res.status(404).json({message:"cours introuvable"}) 
        }
        const studentsByCourse=await Inscription.find({course:course._id}).populate({path:"student",select:"name,email"});
        return res.status(200).json({message:" voici les etudiant inscrit au cours selectioné",studentsByCourse})
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }


}