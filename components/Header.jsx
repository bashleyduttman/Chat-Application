import "./Header.css"
import { RiNotificationLine } from "react-icons/ri";
import { BsChat } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
function Header(){
    const navigate=useNavigate()


    return(
        <div className="header-box">
            <div className="font-change">Link Up</div>
            <div className="header-inside-box">
            <div className="icons"><RiNotificationLine/></div>
            <div className="icons" onClick={()=>navigate("/chatPage")}><BsChat/></div>
            </div>
            
        </div>
    )
}
export default Header