import ContactList from "../../components/ContactList";
import ChatSpace from "../../components/ChatSpace";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "./Chat.css";
import { useState } from "react";



function Chat() {

  const [chatId,setChatId]=useState('')
  return (
     <div className="chat-mainPage">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={25} minSize={15} maxSize={40}>
          <ContactList setData={setChatId} />
        </Panel>
        <PanelResizeHandle className="resize-handle" />
        <Panel defaultSize={75}>
          <ChatSpace data={chatId}/>
        </Panel>
      </PanelGroup>
    </div>
  );
}
export default Chat;
