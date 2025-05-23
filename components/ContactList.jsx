import { useState, useRef, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { FaBarsStaggered, FaPoop } from "react-icons/fa6";
import { MdOutlineAdd } from "react-icons/md";
import { FaMapPin } from "react-icons/fa";
import { ImVolumeMute2 } from "react-icons/im";
import { MdFormatClear } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import {io} from 'socket.io-client'

import "./ContactList.css";

function ContactList({setData}) {
  const [box, setBox] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [group, setGroup] = useState(false);
  const [name, setName] = useState("");
  const [hamBox, setHamBox] = useState("");
  const [friendList, setFriendList] = useState([]);
  const [insideName, setInsideName] = useState("prev");
  const NAME = localStorage.getItem("token");
  
  const socketRef = useRef(null); 
  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    return () => {
      socketRef.current.disconnect();
    };
  }, []);


  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleCancel = () => {
    setName("");
  };

  const handlePlusClick = () => {
    setTimeout(() => {
      setName("options");
    }, 100);
  };

  const handleNextGroup = () => {
    setInsideName("next");
    setTimeout(() => {
      setName("createGroup");
    }, 100);
  };
  const handleHam = () => {
    if (hamBox === "") {
      setHamBox("true");
    } else setHamBox("");
  };
  const handleBack = () => {
    setName("options");
    setInsideName("prev");
  };

  const handleNewGroup = () => {
    setTimeout(() => {
      setName("newGroup");
    }, 100);
  };

  const handleRightClick = (e, id) => {
    e.preventDefault();
    setBox(id);
    setVisible(false);
    setTimeout(() => {
      setPosition({ x: e.pageX, y: e.pageY });
      setVisible(true);
    }, 10);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setVisible(false);
      setBox(null);
      setName("");
    }
  };
  const handleChatSpace = async (id) => {
    try {
      
      const response = await fetch("http://localhost:3000/api/friend/access-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          USER: NAME,
          userId: id,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (socketRef.current && data._id) {
        socketRef.current.emit("joinChat", {
          chatId: data._id,
          user: NAME,
        });
      }

      setData(data._id);
    } catch (err) {
      console.error("Failed to join chat:", err);
    }
  };


  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
    useEffect(() => {
    const list = async () => {
      const result = await fetch("http://localhost:3000/api/friend/getfriendsaccepted", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ USER: NAME }),
      });

      const ls = await result.json();
      const temp = ls.requests.map((item) => ({
        contact: item.username,
        id: item._id,
        recentText: item.recentText,
        time: item.time,
      }));
      setFriendList(temp);
    };

    list();
  }, [NAME]);

  return (
   
    <div className="contactList">
      <div className="contactList-header">
        <div>Chats</div>
        <div className="visible-menu" ref={dropdownRef}>
          <MdOutlineAdd className="react-icons" onClick={handlePlusClick} />

          {name === "options" && (
            <div className="hidden-menu">
              <div className="list-box">
                <div className="group-box" onClick={handleNewGroup}>
                  <div>
                    <CgProfile />
                  </div>
                  <div>New Group</div>
                </div>

                <div className="frequent">frequently Contacted</div>
                {friendList.map((item, i) => (
                  <div className="group-box" key={`f-${i}`}>
                    <div>
                      <CgProfile />
                    </div>
                    <div>{item.contact}</div>
                  </div>
                ))}

                <div className="frequent">All Contacts</div>
                {friendList.map((item, i) => (
                  <div className="group-box" key={`a-${i}`}>
                    <div>
                      <CgProfile />
                    </div>
                    <div>{item.contact}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {name === "newGroup" && (
            <div className="hidden-menu">
              <div className="list-box">
                <div className="group-box">
                  <div onClick={handleBack}>
                    <FaLongArrowAltLeft />
                  </div>
                  <div>New Group</div>
                </div>
                <div className="nextStep">
                  <div className="nextStep-first" onClick={handleNextGroup}>
                    Next
                  </div>
                  <div className="nextStep-second" onClick={handleCancel}>
                    Cancel
                  </div>
                </div>
                <input
                  placeholder="Search"
                  type="text"
                  className="seachGroup-inp"
                />
                <div className="frequent">All Contacts</div>
                {friendList.map((item, i) => (
                  <div className="newGroup-box" key={`ng-${i}`}>
                    <div>
                      <CgProfile />
                    </div>
                    <div>{item.contact}</div>
                    <div>
                      <input type="checkbox" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {name === "createGroup" && (
            <div className="hidden-menu">
              <div className="list-box">
                <div className="group-box">
                  <div onClick={handleBack}>
                    <FaLongArrowAltLeft />
                  </div>
                  <div>New Group</div>
                </div>

                {insideName === "prev" && (
                  <>
                    <div className="nextStep">
                      <div className="nextStep-first" onClick={handleNextGroup}>
                        Next
                      </div>
                      <div className="nextStep-second" onClick={handleCancel}>
                        Cancel
                      </div>
                    </div>
                    <input
                      placeholder="Search"
                      type="text"
                      className="seachGroup-inp"
                    />
                    <div className="frequent">All Contacts</div>
                    {friendList.map((item, i) => (
                      <div className="newGroup-box" key={`cg-${i}`}>
                        <div>
                          <CgProfile />
                        </div>
                        <div>{item.contact}</div>
                        <div>
                          <input type="checkbox" />
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {insideName === "next" && (
                  <div className="outerGroup-box">
                    <div className="createGroup-box">
                      <div className="group-profile">
                        <div>
                          <CgProfile />
                        </div>
                        <div>Add Group Icon (optional)</div>
                      </div>
                      <input
                        className="groupName-inp"
                        type="text"
                        placeholder="Provide Group Name"
                      />
                    </div>
                    <div className="nextStep">
                      <div className="nextStep-first">Create</div>
                      <div className="nextStep-second" onClick={handleCancel}>
                        Cancel
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="outerham">
          <FaBarsStaggered onClick={handleHam} className="react-icons" />
          {hamBox === "true" && (
            <div className="ham-box">
              <div onClick={()=>navigate('/friendrequest')}>Requests</div>
              <div onClick={()=>navigate('/addfriend')}>Add friends</div>
            </div>
          )}
        </div>
      </div>

      <div className="search-box">
        <IoSearch className="search-icon" />
        <input
          placeholder="search for chats"
          className="chat-inp"
          type="text"
        />
      </div>

      {visible && (
        <div
          className="menu-box"
          style={{ position: "absolute", top: position.y, left: position.x }}
        >
          <div className="menu-inside-box">
            <FaMapPin />
            <div>Pin to top</div>
          </div>
          <div className="menu-inside-box">
            <ImVolumeMute2 />
            <div>Mute</div>
          </div>
          <div className="menu-inside-box">
            <MdFormatClear />
            <div>Clear messages</div>
          </div>
          <div className="menu-inside-box">
            <MdDelete />
            <div>Delete</div>
          </div>
        </div>
      )}

      {friendList.map((item, ind) => (
        <div onClick={()=>handleChatSpace(item.id)}
          className="contact-box"
          key={ind}
          onContextMenu={(e) => handleRightClick(e, ind)}
          style={{
            backgroundColor: box === ind ? "darkslategray" : "",
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
