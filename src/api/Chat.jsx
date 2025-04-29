import ContactList from "../../components/ContactList";

function Chat() {
  return (
    <div>
      <div>
        <ContactList/>
      </div>
      <div>
        <div className="message-box">

        </div>
        <div>
            {/* <input type="text" className="chat-inp"></input> */}
        </div>

      </div>
    </div>
  );
}
export default Chat;
