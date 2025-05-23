import React, { useState, useRef, useEffect } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import "./ChatSpace.css";
import { GrEmoji } from "react-icons/gr";
import { AiOutlineSend } from "react-icons/ai";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", { autoConnect: false }); 

function ChatSpace({ data: chatId }) {
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [chatMessage, setChatMessage] = useState([]);
 const [newMessage, setNewMessage] = useState({ text: "", userName: "" });

  const inputRef = useRef(null);
  const pickerRef = useRef(null);
  const NAME = localStorage.getItem("token");

  // Connect socket once
  useEffect(() => {
    socket.connect(); // now safe to connect
    socket.emit("joinChat", { chatId, user: NAME });

    
      socket.on("chatMessage", (message) => {
  console.log("new message:", message);
 const incoming = { text: message.message, userName: "none" };

setChatMessage((prev) => [...prev, incoming]);

});

  

    return () => {
      socket.off("chatMessage");
      socket.disconnect();
    };
  }, [chatId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    console.log(message);

    socket.emit("chatMessage", { chatId, message });
    setChatMessage((prev) => [...prev, { text: message, senderName: NAME }]);

    setMessage("");
  };

  const handleEmojiSelect = (emoji) => {
    const cursorPos = inputRef.current.selectionStart;
    const textBefore = message.substring(0, cursorPos);
    const textAfter = message.substring(cursorPos);
    const newMessage = textBefore + emoji.native + textAfter;
    setMessage(newMessage);

    setTimeout(() => {
      inputRef.current.focus();
      inputRef.current.selectionEnd = cursorPos + emoji.native.length;
    }, 0);
  };

  // Hide emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        event.target.className !== "emoji-pickers"
      ) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    setChatMessage([]);
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/friend/getmessage",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ chatId }), 
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();

        setChatMessage((prev) => [...prev, ...data.messages]);
        console.log(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

    return (
    <div className="main-chatspace">
      <div className="chatarea">
        {chatMessage.map((item, index) => {
          const isSender = item.senderName === NAME;
          return (
            <div key={index} className={isSender ? "sender" : "receiver"}>
              <div>{item.text}</div>
              <div className="message-time">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="chatbox-inp">
        <form onSubmit={handleSendMessage}>
          <input
            ref={inputRef}
            className="chatinput"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="button"
            className="emoji-pickers"
            onClick={() => setShowPicker((prev) => !prev)}
          >
            <GrEmoji />
          </button>
          <button type="submit" className="send-button">
            <AiOutlineSend />
          </button>
        </form>
      </div>

      {showPicker && (
        <div className="emoji-picker-container" ref={pickerRef}>
          <Picker 
            data={data} 
            onEmojiSelect={handleEmojiSelect}
            theme="dark"
            previewPosition="none"
            skinTonePosition="none"
          />
        </div>
      )}
    </div>
  );
}


export default ChatSpace;
