    const mongoose=require("mongoose");
const bcrypt=require("bcrypt")
const UserShema= new mongoose.Schema(
    {
    name:{
        type:String,
        required:[true,"champs requis"],
        minlength:[3,"il faut au moins 3 caracteres"],
        trim:true
    },image:{
        type:String,
        default:null
    }
    ,
    email:{
        type:String,
        required:[true,"champs requis"],
        unique:true,
        trim:true,
        match: [/\S+@\S+\.\S+/, 'Format invalide']
    },
    password:{
        type:String,
        required:[true,"champs requis"],
        minlenghth:[6,"au moins 6 caracteres "]
    },
    role:{
        required:[true,"champs requis"],
        type:String,
        enum:["student","professor","admin"],
        default:"student"

    },
    createdAt:{
        type:Date,
        default:Date.now


    
    }
    }
)
UserShema.methods.comparer= async function(mdpSaisi){
return bcrypt.compare(mdpSaisi,this.password)

}

UserShema.pre("save",async function(next){
    if (!this.isModified("password")) return next();
    const salt= await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password,salt)
})
module.exports= mongoose.model("User",UserShema)