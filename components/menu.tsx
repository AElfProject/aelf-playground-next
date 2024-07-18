import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { ModeToggle } from "./mode-toggle";
import Modal from "./modal";
import { ChatBot } from "./deepchat";

export function MenubarComponent() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Theme</MenubarTrigger>
        <MenubarContent>
          <ModeToggle />
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <Modal
            trigger={<span>Chat</span>}
            title="Chat"
            body={<ChatBot />}
          />
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  );
}
