const Cours=require("../models/Cours")
exports.getAllCourses=async(req,res)=>{
    try{
    const cours=await Cours.find();
   return res.status(200).json({message:"la liste de cours a ete recuperee avec succés",
    cours})}
    catch(err){
return res.status(500).json({message:err.message})
    }
}
exports.getFiltrdCourse=async(req,res)=>{//la requete dois etre sous le forme : api/cours?champ=name&valeur="ia"
                                        // on peut faire mieux dans le sens ou on peut ajouter des controles sur les valeur des attribut grace a regex
    const champ=req.query.champ;
    const  valeur=req.query.valeur;
    const plageChamp=["code","name","professor"];
    try{
    if(!plageChamp.includes(champ)){
        return res.status(404).json({message:"vous ne pouvez pas effectuer une recherche avec cet attribut"})

    }
    const filtre= await Cours.find({[champ]:valeur});
    return res.status(200).json({message:"les cours retrouvee sont ",
    filtre
    })
    }
    catch(err){
        res.status(500).json({message:"erreur de paramettre de recherche"})

    }
}
exports.getAllcoursesOfProf=async(req,res)=>{
    const prof=req.user.id;
    try{

    const cours= await Cours.find({professor:prof})
    return res.status(200).json({
        cours

    })
}
    catch(err){
        return res.status(500).json({message:err.message})
    }

}
exports.createCourse=async(req,res)=>{
    const cours=req.body;
    const codeMaj=cours.code.toUpperCase();
    try{
      
        const exists=await Cours.findOne({code:codeMaj});
        if(exists){return res.status(400).json({message:"le cours existe deja"})}
       const newCourse= await Cours.create({...cours,code:codeMaj})
        return res.status(201).json({message:"cours crée avec succés",
             data:newCourse
        })

    }
    catch(err){    console.error("Error creating course:", err);
        return res.status(500).json({
            message:"creation de cours a echouée"
        })
    
    }

}
exports.updateCourse=async(req,res)=>{
    const{id}=req.params;
    const{code,name,description,professor}=req.body;
    try{
         const cours=await Cours.findByIdAndUpdate(id,{code,name,description,professor},{new:true})
         
     if(!cours){return res.status(404).json({message:"cours non retrouvé"})
        
    }
    return res.status(200).json({message:"mise a jours reussit",
            cours
         })
   }
    catch(err){
        return res.status(500).json({message:"mise a jour non effectuée"})
    }
   


}
exports.deleteCourse=async(req,res)=>{
    const{id}=req.params;
    try{
    const cours=await Cours.findByIdAndDelete(id)
;
    if(!cours){ return res.status(404).json({message:"cours non retrouvé"},
    
    )}
    return res.status(200).json({message:"supression effectuée avec succes"},
    
    )
}catch(err){
    console.error("Error creating course:", err);
    return res.status(500).json({message:"supression echouée"})
}
}

