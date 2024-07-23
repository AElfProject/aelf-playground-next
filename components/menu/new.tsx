import {
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";
import Link from "next/link";

export default async function NewMenu() {
  return (
    <MenubarMenu>
      <MenubarTrigger>New</MenubarTrigger>
      <MenubarContent>
        <MenubarItem asChild>
          <Link href="/workspace-new">Workspace</Link>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
}
