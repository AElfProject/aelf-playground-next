import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { ModeToggle } from "@/components/menu/mode-toggle";
import Modal from "@/components/modal";
import { getTemplateNames } from "@/data/template";
import NewMenu from "./new";
import OpenMenu from "./open";

export async function MenubarComponent() {
  return (
    <Menubar>
      <NewMenu />
      <OpenMenu />
      <MenubarMenu>
        <MenubarTrigger>Theme</MenubarTrigger>
        <MenubarContent>
          <ModeToggle />
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <Modal trigger={<span>Chat</span>} title="Chat">
            <>Put your component here.</>
          </Modal>
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  );
}
