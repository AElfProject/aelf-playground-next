"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { MenubarRadioGroup, MenubarRadioItem } from "@/components/ui/menubar";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <MenubarRadioGroup value={theme} onValueChange={setTheme}>
      <MenubarRadioItem value="light">Light</MenubarRadioItem>
      <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
      <MenubarRadioItem value="system">System</MenubarRadioItem>
    </MenubarRadioGroup>
  );
}
