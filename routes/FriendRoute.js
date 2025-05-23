const express=require("express")
const router=express.Router()
const {requestFriend,findRequest,acceptRequest,rejectRequest,requestaccepted,accessChat, getMessage}=require("../controllers/requestController")
router.post("/requestfriend",requestFriend)
router.post("/getfriends",findRequest)
router.post("/getfriendsaccepted",requestaccepted)
router.post("/accept",acceptRequest)
router.post("/reject",rejectRequest)
router.post("/access-chat",accessChat)
router.post("/getmessage",getMessage)

module.exports=router