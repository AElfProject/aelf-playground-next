import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { MenubarComponent } from "@/components/menu";
import { Shell } from "@/components/shell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  bottom,
  left,
  top,
  bottomLeft,
}: Readonly<{
  bottom: React.ReactNode;
  left: React.ReactNode;
  top: React.ReactNode;
  bottomLeft: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MenubarComponent />
          <Shell left={left} top={top} bottom={bottom} bottomLeft={bottomLeft}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
