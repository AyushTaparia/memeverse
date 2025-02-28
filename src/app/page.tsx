import Image from "next/image";
import Link from "next/link";
import { ArrowRight, TrendingUp, Upload, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import HomeFeaturesMemes from "@/components/home-features-memes";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_650px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Welcome to MemeVerse: Your Ultimate Meme Hub
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Explore, share, and interact with the best memes on the
                  internet. Join our community and unleash your creativity!
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/explore">
                  <Button className="inline-flex items-center gap-2">
                    Explore Memes <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/upload">
                  <Button
                    variant="outline"
                    className="inline-flex items-center gap-2"
                  >
                    Upload Your Own <Upload className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[500px] rotate-2">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-1 lg:gap-6">
                <Image
                  src="/images/meme_bg.jpg"
                  alt="Featured Meme"
                  width={800}
                  height={400}
                  className="aspect-[16/9] rounded-xl object-cover shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Everything You Need for Your Meme Journey
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                MemeVerse offers a comprehensive platform for meme enthusiasts
                to discover, create, and share memes.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Trending Memes</h3>
                <p className="text-muted-foreground">
                  Stay updated with the latest viral memes that are breaking the
                  internet.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Upload className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Upload & Create</h3>
                <p className="text-muted-foreground">
                  Upload your memes or create new ones with our easy-to-use meme
                  generator.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Community</h3>
                <p className="text-muted-foreground">
                  Join a community of meme enthusiasts, share laughs, and make
                  friends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Memes Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Trending Memes
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Check out what&apos;s making everyone laugh right now.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-7xl py-8">
            <HomeFeaturesMemes />
            <div className="mt-8 flex justify-center">
              <Link href="/explore">
                <Button
                  variant="outline"
                  className="inline-flex items-center gap-2"
                >
                  View All Memes <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Join the MemeVerse?
              </h2>
              <p className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Start exploring, creating, and sharing memes with our growing
                community today.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/explore">
                <Button
                  variant="secondary"
                  className="inline-flex items-center gap-2"
                >
                  Start Exploring
                </Button>
              </Link>
              <Link href="/upload">
                <Button
                  variant="outline"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 inline-flex items-center gap-2"
                >
                  Upload a Meme
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
