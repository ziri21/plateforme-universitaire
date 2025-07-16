const mongoose=require("mongoose");
const InscriptionSchema= new mongoose.Schema(
    {
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
        enrolledAt:{
            type:Date,
            default:Date.now
        }
    }
)
module.exports=mongoose.model("Inscription",InscriptionSchema);