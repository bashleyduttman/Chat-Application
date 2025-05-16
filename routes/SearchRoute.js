const express=require('express')
const router=express.Router()
const {searchUser}=require("../controllers/seachController")
router.post("/searchuser",searchUser)
module.exports=router