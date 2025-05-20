import ContactList from "../../components/ContactList";
import ChatSpace from "../../components/ChatSpace";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "./Chat.css";
function Chat() {
  return (
     <div className="chat-mainPage">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={25} minSize={15} maxSize={40}>
          <ContactList />
        </Panel>
        <PanelResizeHandle className="resize-handle" />
        <Panel defaultSize={75}>
          <ChatSpace />
        </Panel>
      </PanelGroup>
    </div>
  );
}
export default Chat;
