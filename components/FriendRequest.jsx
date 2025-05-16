import { useEffect, useState } from "react";
import "./FriendRequest.css";
import { MdOutlineDoneOutline } from "react-icons/md";
import {RxCross1} from "react-icons/rx"
import { CgProfile } from "react-icons/cg";
const FriendRequest = () => {
  const [friends, setFriends] = useState([]);
  const NAME = localStorage.getItem("token");
  const [flg,setFlg]=useState(false)
  console.log(NAME);
  useEffect(() => {
    const getFriendList = async () => {
      const result = await fetch(
        "http://localhost:3000/api/friend/getfriends",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ USER: NAME }),
        }
      );
      const data = await result.json();

      setFriends(data.requests);
      console.log(data);
     
    };
    getFriendList();
    console.log(friends);
  }, [flg]);
  const handleRejectFriend=async(sender)=>{
    console.log(sender)
    const result=await fetch("http://localhost:3000/api/friend/reject",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      }
      ,body:JSON.stringify({
        sender_id:sender,
        username:NAME
      })
    })
    if(result.ok){
      setFlg(!flg)
      console.log("Rejected Successfully")
    }

  }
  const handleAcceptFriend=async(sender)=>{
const result=await fetch("http://localhost:3000/api/friend/accept",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      }
      ,body:JSON.stringify({
        sender_id:sender,
        username:NAME
      })
    })
    if(result.ok){
       setFlg(!flg)
      console.log("accepted Successfully")
    }
  }

  return (
    <div className="friendsrequest-main">
      <div className="request-heading">Friend Requests</div>
      
      <div className="outerfriends-box">
        {friends.map((item) => (
          <div className="friends-box">
            <div><CgProfile/></div>
            <div className="friends-list">{item.sender.username}</div>{" "}
            <div>
              <MdOutlineDoneOutline onClick={()=>handleAcceptFriend(item.sender._id)} className="accept" />
            </div>
            <div>
              < RxCross1 onClick={()=>handleRejectFriend(item.sender._id)} className="cross"/>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default FriendRequest;
