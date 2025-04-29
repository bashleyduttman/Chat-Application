import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { FaBarsStaggered } from "react-icons/fa6";
import { MdOutlineAdd } from "react-icons/md";
import { FaMapPin } from "react-icons/fa";
import { ImVolumeMute2 } from "react-icons/im";
import { MdFormatClear } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { CgProfile } from "react-icons/cg";


import "./ContactList.css";
function ContactList() {
  const [box, setBox] = useState(null);
  const [boxVar, setBoxVar] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const handlePlusClick = () => {
    setBoxVar(true);
    console.log()
  };
  const handleRightClick = (e, id) => {
    e.preventDefault();
    if(boxVar){
      setBoxVar((prev)=>(!prev))
    }
    setBox(id);
    if (visible) {
      setVisible(false);
    }
    setTimeout(() => {
      setPosition({ x: e.pageX, y: e.pageY });
      setVisible(true);
    }, 10);
  };
  const handleClick = () => {
    setVisible(false);
    setBox(null);
    if(boxVar){
      setBoxVar((prev)=>(!prev))
    }
  };

  const dummy = [
    { contact: "deepak", recentText: "good morning ", time: "19:23" },
    { contact: "anishkha", recentText: "lets see tmr ", time: "18:23" },
    { contact: "nibba", recentText: "watch me", time: "19:23" },
    { contact: "jackie", recentText: "good man!", time: "29:23" },
    { contact: "sabari", recentText: "whatsapp bruh?", time: "17:03" },
    { contact: "srinivasan", recentText: "glad", time: "09:23" },
  ];
  return (
    <div className="contactList" onClick={handleClick}>
      <div className="contactList-header">
        <div>Chats</div>
        <div className="visible-menu">
          <MdOutlineAdd  className="react-icons" onClick={handlePlusClick} />
          {boxVar && (
           
            <div className="hidden-menu"> 
            <div className="list-box">
              <div className="group-box">
              <div><CgProfile/></div>
              <div>New Group</div>
            
              </div>
              {/* change the bottom dummy array to frequently contacted arr */}
              <div className="frequent">frequently Contacted</div>
              {dummy.map((item)=>(
               <div className="group-box">
               <div><CgProfile/></div>
               <div>{item.contact}</div>
               </div>
            ))}
            {/* change the bottom dummy array too actual all contacts */}
            <div className="frequent">All Contacts</div>
            {dummy.map((item)=>(
               <div className="group-box">
               <div><CgProfile/></div>
               <div>{item.contact}</div>
               </div>
            ))}
            </div>
            
            </div>
           )}
        </div>

        <div>
          <FaBarsStaggered className="react-icons" />
        </div>
      </div>
      <div className="search-box">
        <IoSearch className="search-icon" />
        <input
          placeholder="search for chats"
          className="chat-inp"
          type="text"
        ></input>
      </div>
      {visible && (
        <div
          className="menu-box"
          style={{
            position: "absolute",
            top: position.y,
            left: position.x,
          }}
        >
          <div className="menu-inside-box">
            <div>
              {" "}
              <FaMapPin />
            </div>

            <div>Pin to top</div>
          </div>
          <div className="menu-inside-box">
            <div>
              {" "}
              <ImVolumeMute2 />
            </div>
            <div style={{ marginTop: "-2px", marginLeft: "2px" }}> Mute</div>
          </div>
          <div className="menu-inside-box">
            <div>
              <MdFormatClear />
            </div>
            <div style={{ marginTop: "-2px" }}>Clear messages</div>
          </div>
          <div className="menu-inside-box">
            <div>
              <MdDelete />
            </div>
            <div style={{ marginTop: "-2px" }}>Delete</div>
          </div>
        </div>
      )}
      {dummy.map((item, ind) => (
        <div
          className="contact-box"
          onContextMenu={(e) => handleRightClick(e, ind)}
          style={{
            backgroundColor: box === ind ? "darkslategray	" : "",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <div className="contact-outer-box">
            <div className="prof-pic"></div>
            <div className="contact-in-box">
              <div className="contact-name">{item.contact}</div>
              <div className="recent-msg">{item.recentText}</div>
            </div>
          </div>
          <div className="others">{item.time}</div>
        </div>
      ))}
    </div>
  );
}
export default ContactList;
