import React, { useState, useRef, useEffect } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import "./ChatSpace.css";
import { GrEmoji } from "react-icons/gr";
import { AiOutlineSend } from "react-icons/ai";


function ChatSpace() {
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef(null);
  const pickerRef=useRef(null)

  const dummy = [
    { isUser: false, message: "how are you ?" },
    { isUser: true, message: "fine what about?" },
    { isUser: false, message: "fine" },
  ];

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
  useEffect(()=>{
    const handleClickOutside=(event)=>{
        if(pickerRef.current && !pickerRef.current.contains(event.target) && event.target.className!=="emoji-pickers"){
            setShowPicker(false)
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  },[])
  return (
    <div>
      <div className="main-chatspace">
        <div className="chatbox-inp">
          <input
            ref={inputRef}
            className="chatinput"
            placeholder="type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="emoji-pickers" onClick={() => setShowPicker(!showPicker)}><GrEmoji/></button>

        </div>

        {showPicker && (
          <div ref={pickerRef} style={{ position: "absolute", bottom: "70px", zIndex: 1000 }}>
            <Picker data={data} onEmojiSelect={handleEmojiSelect} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatSpace;
