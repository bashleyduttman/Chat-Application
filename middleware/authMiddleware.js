const jwt=require("jsonwebtoken")
const authenticate=(req,res,next)=>{
    const token=req.header('Authorization')?.replace('Bearer ','');
    if(!token){
        return res.status(403).json({"message":"authenctication failed"})
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_TOKEN);
        req.user=decoded;
        next();
    }
    catch(err){
        return res.status(401).json({ message: "Invalid Token" });
    }
    next()
}
module.exports=authenticate