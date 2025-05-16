import { useEffect, useState } from "react";
import "./AddFriend.css";
import { FaSearch } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";

import { CgProfile } from "react-icons/cg";
function AddFriend() {
  const [allUsers, setAllUsers] = useState({users:[],options:[]});
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const USER = localStorage.getItem("token");
  console.log(USER);
  const handleFriendRequest = async (friend_id) => {
    console.log(friend_id);
    //api call
    const result = await fetch(
      "http://localhost:3000/api/friend/requestfriend",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ USER: USER, friend_id: friend_id }),
      }
    );
    const data = await result.json();
    console.log(data);
  };
  useEffect(() => {
    const searchUsers = async () => {
      try {
        const users = await fetch(
          `http://localhost:3000/api/search/searchuser?query=${search}`,
          {
            method: "POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({
              NAME:USER
            })
          }
        );
        if (users.ok) {
          const result = await users.json();
          console.log(result)
         
          setAllUsers(result);

         
        } else {
          setAllUsers({ users: [], options: [] });

        }

        console.log(result);
      } catch (err) {
        setError(err);
      }
    };
    searchUsers();
  }, [search]);
  return (
    <div className="header-AF">
      <div>
        <FaSearch className="search-icon2" />

        <input
          onChange={(e) => setSearch(e.target.value)}
          className="search-users"
          type="text"
          placeholder="Search name or Number"
        ></input>
      </div>
      <div className="user-name-box">
        {allUsers.users.map((item) => (
          <div className="user-name-innerbox">
            <div>
              {" "}
              <CgProfile className="user-profile" />
            </div>
            <div className="user-name">{item.username}</div>
            <div>
              <FaUserFriends
                onClick={() => handleFriendRequest(item._id)}
                className="friend-icon"
              />
            </div>
          </div>
        ))}
      </div>
      <div>{error.error}</div>
    </div>
  );
}
export default AddFriend;
