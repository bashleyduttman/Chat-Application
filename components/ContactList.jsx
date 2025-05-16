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

import "./ContactList.css";

function ContactList() {
  const [box, setBox] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [group, setGroup] = useState(false);
  const [name, setName] = useState("");
  const [hamBox, setHamBox] = useState("");
  const [insideName, setInsideName] = useState("prev");

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
  const handleHam=()=>{
    if(hamBox===""){setHamBox("true")}
    else(setHamBox(""))
  }
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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dummy = [
    { contact: "deepak", recentText: "good morning ", time: "19:23" },
    { contact: "anishkha", recentText: "lets see tmr ", time: "18:23" },
    { contact: "nibba", recentText: "watch me", time: "19:23" },
    { contact: "jackie", recentText: "good man!", time: "29:23" },
    { contact: "sabari", recentText: "whatsapp bruh?", time: "17:03" },
    { contact: "srinivasan", recentText: "glad", time: "09:23" },
  ];

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
                {dummy.map((item, i) => (
                  <div className="group-box" key={`f-${i}`}>
                    <div>
                      <CgProfile />
                    </div>
                    <div>{item.contact}</div>
                  </div>
                ))}

                <div className="frequent">All Contacts</div>
                {dummy.map((item, i) => (
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
                {dummy.map((item, i) => (
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
                    {dummy.map((item, i) => (
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
              <div onClick={()=>navigate('/friendrequest')}>requests</div>
              <div onClick={()=>navigate('/addfriend')}>add friends</div>
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

      {dummy.map((item, ind) => (
        <div
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
