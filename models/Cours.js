const mongoose=require("mongoose");
const courSchema= new mongoose.Schema({
    code:{
        type:String,
        required:[true,"code requis"],
        match:[/^[A-Z]{2,4}[0-9]{3}$/,"le code dois commencer par deux ou trois lettre majuscule et se terminer par trois chiffre ex:CD123"],
        unique:true,
        trim:true
    },
    name:{
        type:String,
        required:[true,"nom requis"],
        minlength:[3,"3 caractere au min"],
    },
    description:{
        type:String,
    
    },
    professor:{
        required:[true,"champs requis"],
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        validate:{
            validator:async function (userId){
                const prof= await mongoose.model("User").findById(userId);
                return prof && prof.role==="professor"

            },
            message:"l utilisateur selectionnee n est pas un professeur "

        }


    }
    
})
module.exports=mongoose.model("Cours",courSchema);
