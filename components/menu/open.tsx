import {
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";
import Link from "next/link";

export default async function OpenMenu() {
  return (
    <MenubarMenu>
      <MenubarTrigger>Open</MenubarTrigger>
      <MenubarContent>
        <MenubarItem asChild>
          <Link href="/workspace-open">Workspace</Link>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
}
