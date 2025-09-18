const mongoose=require("mongoose");
const notificationSchema= new mongoose.Schema({
    title:{
        type:String,
        required:[true,"champs requis"],
        minlength:[3,"au mois 3 caracteres"],
        trim:true
    },
    message:{
        type:String,
        required:[true,"champs requis"],
        trim:true

    },
    sender:{
        required:[true,"champs requis"],
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        validate:{
            validator:async function(userId){
                const user= await mongoose.model("User").findById(userId);
                return user&& (user.role==="professor"||user.role==="admin")
            },
            message:"l expediteur doit etre un administrateur ou professeur"
        }

    },
    recipients:{
          required:[true,"champs requis"],
          type:[mongoose.Schema.Types.ObjectId],
          ref:"User"

    },
    createdAt:{
        type:Date,
        default:Date.now

    },
    status:{
        type:String,
        enum:["read","unread"],
        default:"unread"
    }

})
module.exports=mongoose.model("Notification",notificationSchema)