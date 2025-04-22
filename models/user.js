const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:Number,
        require:true
    }
    ,
    password:{
        type:String,
        require:true
    }

})
module.exports=mongoose.model("User",userSchema)