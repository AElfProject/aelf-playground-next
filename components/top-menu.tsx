"use client";

import { Link } from "react-router-dom";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

export default function TopMenu() {
  const { resolvedTheme, setTheme } = useTheme();

  const links = [
    { to: "/", children: "Home" },
    { to: "/workspaces", children: "Workspaces" },
    { to: "/tutorials", children: "Tutorials" },
    { to: "/deployments", children: "Deployments" },
    { to: "/settings", children: "Settings" },
    { to: "https://github.com/AElfProject", children: "GitHub" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-sm transition-colors dark:bg-background-dark">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="text-lg font-semibold">
          aelf Playground
        </Link>
        <nav className="max-md:hidden md:flex space-x-4">
          {links.map((link) => (
            <Link
              key={link.children}
              className="text-sm font-medium transition-colors hover:text-primary dark:hover:text-primary-dark"
              {...link}
            />
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          {resolvedTheme === "dark" ? (
            <Button onClick={() => setTheme("light")} variant="ghost">
              <SunIcon className="h-5 w-5 transition-colors" />
            </Button>
          ) : (
            <Button onClick={() => setTheme("dark")} variant="ghost">
              <MoonIcon className="h-5 w-5 transition-colors" />
            </Button>
          )}
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
