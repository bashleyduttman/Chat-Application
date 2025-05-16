const  user =require("../models/user")
const friendRequestDB= require("../models/friendRequest")
const requestFriend = async (req, res) => {
  try {
    const { USER, friend_id } = req.body;
    console.log(USER)
    const isUser = await user.findOne({ username: USER }).select("_id");
    if (!isUser) {
      return res.status(400).json({ message: "no user available" });
    }
  
    const isReqAlready=await friendRequestDB.findOne({sender:isUser._id,receiver:friend_id})
    if(isReqAlready){
      return res.status(200).json({message:"request already sent"})
    }
    const fq = new friendRequestDB({ sender: isUser._id, receiver: friend_id });

    await fq.save();
    return res.status(200).json({ message: "Friend request sent" });
  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: "error occured" });
  }
};
const findRequest = async (req, res) => {
  try {
    const { USER } = req.body;
    console.log(USER);

    const isUser = await user.findOne({ username: USER }).select("_id");
    if (!isUser) {
      return res.status(400).json({ message: "no user available" });
    }

    // Get all friend requests where the current user is the receiver
    const fq = await friendRequestDB.find({ receiver: isUser._id ,status:"pending"});

    // Extract sender IDs
    const senderIds = fq.map(req => req.sender.toString());

    // Fetch sender details
    const senders = await user.find({ _id: { $in: senderIds } }).select("username _id"); // you can add more fields

    // Create a map for quick lookup
    const senderMap = {};
    senders.forEach(sender => {
      senderMap[sender._id.toString()] = sender;
    });

    // Combine sender details with friend request status
    const combined = fq.map(request => {
      const sender = senderMap[request.sender.toString()];
      return {
        sender: sender || null,
        status: request.status
      };
    });

    return res.json({ requests: combined });
  } catch (err) {
    // console.error(err);
    return res.status(400).json({ message: "error occurred" });
  }
};
const acceptRequest = async (req, res) => {
  try {
    const { sender_id, username } = req.body;

    // Find user ID by username
    const userDoc = await user.findOne({ username }).select('_id');
    if (!userDoc) return res.status(404).json({ message: "User not found" });

    // Update friend request status
    await friendRequestDB.updateOne(
      { sender: sender_id, receiver: userDoc._id },
      { $set: { status: "accepted" } }
    );

    res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Can't accept friend request" });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const { sender_id, username } = req.body;

    const userDoc = await user.findOne({ username }).select('_id');
    if (!userDoc) return res.status(404).json({ message: "User not found" });

    await friendRequestDB.deleteOne({ sender: sender_id, receiver: userDoc._id });

    res.status(200).json({ message: "Friend request rejected" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Can't reject friend request" });
  }
};


module.exports={requestFriend,findRequest,acceptRequest,rejectRequest}
