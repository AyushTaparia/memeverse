import Link from "next/link";
import { Github, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-6 py-8 px-4 md:px-6 lg:px-8 md:flex-row md:py-6 lg:py-8">
        <div className="flex flex-col items-center gap-4 px-4 md:items-start md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} MemeVerse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
