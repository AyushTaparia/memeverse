import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { MemeProvider } from "@/context/meme-context";
import { UserProvider } from "@/context/user-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MemeVerse - Your Ultimate Meme Hub",
  description:
    "Explore, share, and interact with the best memes on the internet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MemeProvider>
            <UserProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 px-10">{children}</main>
                <Footer />
              </div>
            </UserProvider>
          </MemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
