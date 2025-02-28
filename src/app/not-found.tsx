import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center">
      <div className="mb-8 relative w-full max-w-md h-64">
        <Image
          src="/images/404_bg.jpg"
          alt="404 Meme"
          fill
          className="object-contain"
          priority
        />
        <div className="absolute top-4 left-0 right-0 text-center">
          <p className="text-white text-2xl font-bold uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
            404 Error
          </p>
        </div>
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-white text-2xl font-bold uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
            Page not found
          </p>
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-4">Oops! Meme not found</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        The page you&apos;re looking for has disappeared faster than a viral meme.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <Link href="/explore">
          <Button variant="outline" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Explore Memes
          </Button>
        </Link>
      </div>
    </div>
  );
}
