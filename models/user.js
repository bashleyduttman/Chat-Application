const mongoose=require("mongoose")
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    profilePic: { type: String }, // optional
    password: { type: String, required: true }, // hashed password
    socketId: { type: String, default: null } // (optional, used for live users)
  }, { timestamps: true });
  
module.exports=mongoose.model("User",userSchema)