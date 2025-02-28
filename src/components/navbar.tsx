"use client";

import type React from "react";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setShowSearch(false);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSearch = () => setShowSearch(!showSearch);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "Upload", href: "/upload" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Profile", href: "/profile" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/explore?search=${encodeURIComponent(
        searchTerm
      )}`;
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-10">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl">MemeVerse</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2 md:justify-end">
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-foreground/60"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-2">
            <AnimatePresence>
              {showSearch && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="relative"
                  onSubmit={handleSearch}
                >
                  <Input
                    type="search"
                    placeholder="Search memes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </motion.form>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle menu"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="container py-4 space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Search memes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </form>
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === link.href
                        ? "text-primary"
                        : "text-foreground/60"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm font-medium">Theme</span>
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
