const mongoose=require("mongoose");
const noteSchema=new mongoose.Schema({
    student:{
                required:[true,"champs requis "],
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                validate:{
                    validator:async function(userId){
                        const user= await mongoose.model("User").findById(userId);
                        return user && user.role==="student"
                    },
                    message:"l utilisateur doit etre un etudiant"
                }
            },
    course:{
                required:[true,"champs requis "],
                type:mongoose.Schema.Types.ObjectId,
                ref:"Cours"
            },
    
    value:{
        type:Number,
        min:[0,"la note ne peut pas etre inferieur a 0"],
        max:[20,"la note ne peut pas etre superieur a 20"],
        required:[true,"champs requis "],
    },
    gradeAt:{
        type:Date,
        default:Date.now
    }        

            
})
module.exports=mongoose.model("Note",noteSchema);