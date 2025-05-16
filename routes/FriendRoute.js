const express=require("express")
const router=express.Router()
const {requestFriend,findRequest,acceptRequest,rejectRequest}=require("../controllers/requestController")
router.post("/requestfriend",requestFriend)
router.post("/getfriends",findRequest)
router.post("/accept",acceptRequest)
router.post("/reject",rejectRequest)
module.exports=router