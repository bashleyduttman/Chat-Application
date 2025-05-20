const user = require("../models/user");
const friendRequestDB = require("../models/friendRequest");
const Chat = require("../models/chat");
const requestFriend = async (req, res) => {
  try {
    const { USER, friend_id } = req.body;
    console.log(USER);
    const isUser = await user.findOne({ username: USER }).select("_id");
    if (!isUser) {
      return res.status(400).json({ message: "no user available" });
    }

    const isReqAlready = await friendRequestDB.findOne({
      sender: isUser._id,
      receiver: friend_id,
    });
    if (isReqAlready) {
      return res.status(200).json({ message: "request already sent" });
    }
    const fq = new friendRequestDB({ sender: isUser._id, receiver: friend_id });

    await fq.save();
    return res.status(200).json({ message: "Friend request sent" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "error occured" });
  }
};
const requestaccepted = async (req, res) => {
  try {
    const { USER } = req.body;
    console.log(USER);

    const isUser = await user.findOne({ username: USER }).select("_id");
    if (!isUser) {
      return res.status(400).json({ message: "no user available" });
    }

    // Get all accepted friend requests where the user is either sender or receiver
    const fq = await friendRequestDB.find({
      status: "accepted",
      $or: [{ receiver: isUser._id }, { sender: isUser._id }],
    });

    // Extract friend IDs (the "other" person in the request)
    const friendIds = fq.map((req) =>
      req.sender.equals(isUser._id) ? req.receiver : req.sender
    );

    // Fetch their usernames
    const friends = await user
      .find({ _id: { $in: friendIds } })
      .select("username");

    // Map for fast lookup
    const friendMap = {};
    friends.forEach((friend) => {
      friendMap[friend._id.toString()] = friend.username;
    });

    // Prepare final output
    const combined = fq.map((req) => {
      const friendId = req.sender.equals(isUser._id)
        ? req.receiver
        : req.sender;
      return {
        username: friendMap[friendId.toString()],
        status: req.status,
      };
    });

    console.log(combined);
    return res.json({ requests: combined });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "error occurred" });
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
    const fq = await friendRequestDB.find({
      receiver: isUser._id,
      status: "pending",
    });

    // Extract sender IDs
    const senderIds = fq.map((req) => req.sender.toString());

    // Fetch sender details
    const senders = await user
      .find({ _id: { $in: senderIds } })
      .select("username _id"); // you can add more fields

    // Create a map for quick lookup
    const senderMap = {};
    senders.forEach((sender) => {
      senderMap[sender._id.toString()] = sender;
    });

    // Combine sender details with friend request status
    const combined = fq.map((request) => {
      const sender = senderMap[request.sender.toString()];
      return {
        sender: sender || null,
        status: request.status,
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
    const userDoc = await user.findOne({ username }).select("_id");
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

    const userDoc = await user.findOne({ username }).select("_id");
    if (!userDoc) return res.status(404).json({ message: "User not found" });

    await friendRequestDB.deleteOne({
      sender: sender_id,
      receiver: userDoc._id,
    });

    res.status(200).json({ message: "Friend request rejected" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Can't reject friend request" });
  }
};
const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    const loggedUserId = req.user._id;

    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

   
    let existingChat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: [loggedUserId, userId] },
    }).populate("participants", "-password"); 
    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    
    const newChat = await Chat.create({
      isGroupChat: false,
      participants: [loggedUserId, userId],
    });

    return res.status(201).json(newChat);
  } catch (error) {
    console.error("Error in accessChat:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  requestFriend,
  findRequest,
  acceptRequest,
  rejectRequest,
  requestaccepted,
  accessChat,
};
