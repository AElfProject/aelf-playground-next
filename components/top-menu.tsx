"use client";

import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon, MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function TopMenu() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-sm transition-colors dark:bg-background-dark">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-lg font-semibold">
          AElf Playground
        </Link>
        <nav className="hidden space-x-4 md:flex">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary dark:hover:text-primary-dark"
          >
            Home
          </Link>
          <Link
            href="/workspace-open"
            className="text-sm font-medium transition-colors hover:text-primary dark:hover:text-primary-dark"
          >
            Workspaces
          </Link>
          <Link
            href="#"
            className="text-sm font-medium transition-colors hover:text-primary dark:hover:text-primary-dark"
            prefetch={false}
          >
            Settings
          </Link>
          <Link
            href="#"
            className="text-sm font-medium transition-colors hover:text-primary dark:hover:text-primary-dark"
            prefetch={false}
          >
            Contact
          </Link>
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
                <Link
                  href="#"
                  className="text-sm font-medium transition-colors hover:text-primary dark:hover:text-primary-dark"
                  prefetch={false}
                >
                  Home
                </Link>
                <Link
                  href="#"
                  className="text-sm font-medium transition-colors hover:text-primary dark:hover:text-primary-dark"
                  prefetch={false}
                >
                  About
                </Link>
                <Link
                  href="#"
                  className="text-sm font-medium transition-colors hover:text-primary dark:hover:text-primary-dark"
                  prefetch={false}
                >
                  Services
                </Link>
                <Link
                  href="#"
                  className="text-sm font-medium transition-colors hover:text-primary dark:hover:text-primary-dark"
                  prefetch={false}
                >
                  Contact
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
