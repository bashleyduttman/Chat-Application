const user = require("../models/user");
const friendRequestDB = require("../models/friendRequest");
const Chat = require("../models/chat");
const Message = require("../models/message");
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

    // Find the user by username
    const isUser = await user.findOne({ username: USER }).select("_id");
    if (!isUser) {
      return res.status(400).json({ message: "no user available" });
    }

    // Find all accepted friend requests involving this user
    const fq = await friendRequestDB.find({
      status: "accepted",
      $or: [{ receiver: isUser._id }, { sender: isUser._id }],
    });

    // Extract the IDs of the user's friends
    const friendIds = fq.map((req) =>
      req.sender.equals(isUser._id) ? req.receiver : req.sender
    );

    // Fetch usernames and IDs of friends
    const friends = await user
      .find({ _id: { $in: friendIds } })
      .select(["username", "_id"]);

    // Create a map for fast lookup
    const friendMap = {};
    friends.forEach((friend) => {
      friendMap[friend._id.toString()] = {
        username: friend.username,
        _id: friend._id,
      };
    });

    // Prepare final result
    const combined = fq.map((req) => {
      const friendId = req.sender.equals(isUser._id)
        ? req.receiver
        : req.sender;
      const friendData = friendMap[friendId.toString()];
      return {
        username: friendData.username,
        _id: friendData._id,
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
    const { USER, userId } = req.body;

    const isUser = await user.findOne({ username: USER });
    const loggedUserId = isUser._id;
    
    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }
    console.log(`logged in id ${loggedUserId} frined id ${userId}`)
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

    return res.status(201).json({ message: "chat created" });
  } catch (error) {
    console.error("Error in accessChat:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getMessage = async (req, res) => {
  console.log("hello");
  try {
    const { chatId } = req.body;

    const chats = await Message.find({ chatId });

    res.status(200).json({ messages: chats });
  } catch (err) {
    console.error(err);
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
  getMessage,
};
