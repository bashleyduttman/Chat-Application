const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");

const RegisterRoute = require("./routes/RegisterRoute");
const FriendRoute = require("./routes/FriendRoute");
const SearchRoute = require("./routes/SearchRoute");
const connectDB = require("./config/db");
const authenticate = require("./middleware/authMiddleware");
const User=require('./models/user')
const Message=require('./models/message')
dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());


app.use("/api/users", RegisterRoute);
app.use("/api/search", SearchRoute);
app.use("/api/friend", FriendRoute);

app.use(authenticate);


const PORT = process.env.PORT || 3000;
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store active users and chat rooms (optional enhancement)
const connectedUsers = new Map();
io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  socket.on("joinChat", async ({ chatId, user }) => {
    try {
      const userData = await User.findOne({ username: user });
      if (!userData) {
        console.log(`User not found: ${user}`);
        socket.emit("error", { message: "User not found" });
        return;
      } 

      // Store userId and chatId in the socket object for later use
      socket.userId = userData._id.toString();
      socket.userName=user
      console.log(socket.userId)
      socket.join(chatId);

      console.log(`✅ User ${user} (${socket.userId}) joined chat room: ${chatId} name ${socket.userName}`);
    } catch (err) {
      console.error("Error in joinChat:", err);
      socket.emit("error", { message: "Internal server error" });
    }
  });

  socket.on("chatMessage", async({ chatId, message }) => {
    console.log(message)
    console.log(socket.userId)
    // Ensure userId exists on socket (meaning user joined first)
    if (!socket.userId) {
        console.log("no userid")
      socket.emit("error", { message: "Unauthorized: Join chat first" });
      return;
    }

    console.log(`Message from userId ${socket.userId} in chat ${chatId}: ${message}`);

    // Broadcast message to others in the chat room except sender
    socket.to(chatId).emit("chatMessage", {
      userId: socket.userId,
      message,
      timestamp: new Date(),
    });
    const saveMsg=await Message.create({chatId,sender:socket.userId,senderName:socket.userName,text:message})
console.log(saveMsg)
    // You can also save message to DB here if you want
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
