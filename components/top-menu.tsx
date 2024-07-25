"use client";

import Link from "next/link";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon, MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function TopMenu() {
  const { theme, setTheme } = useTheme();

  const links = [
    { href: "/", children: "Home" },
    { href: "/workspaces", children: "Workspaces" },
    { href: "https://github.com/AElfProject", children: "GitHub" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-sm transition-colors dark:bg-background-dark">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-lg font-semibold">
          AElf Playground
        </Link>
        <nav className="hidden space-x-4 md:flex">
          {links.map((link) => (
            <Link
              key={link.children}
              className="text-sm font-medium transition-colors hover:text-primary dark:hover:text-primary-dark"
              {...link}
            />
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <ToggleGroup type="single" value={theme} onValueChange={setTheme}>
            <ToggleGroupItem value="system" aria-label="Toggle system">
              <SunMoonIcon className="h-5 w-5 transition-colors" />
            </ToggleGroupItem>
            <ToggleGroupItem value="light" aria-label="Toggle light">
              <SunIcon className="h-5 w-5 transition-colors" />
            </ToggleGroupItem>
            <ToggleGroupItem value="dark" aria-label="Toggle dark">
              <MoonIcon className="h-5 w-5 transition-colors" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full max-w-xs bg-background dark:bg-background-dark"
            >
              <div className="flex flex-col gap-4 p-4">
                {links.map((link) => (
                  <SheetClose key={link.children} asChild>
                    <Link
                      className="text-sm font-medium transition-colors hover:text-primary dark:hover:text-primary-dark"
                      {...link}
                    />
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
