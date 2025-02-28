"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { useMeme } from "@/context/meme-context";
import { Button } from "@/components/ui/button";
import { IMeme } from "../../types/meme";

interface UserStats {
  username: string;
  totalLikes: number;
  totalMemes: number;
  avatar: string;
}

export default function LeaderboardContent() {
  const { memes } = useMeme();
  const [topMemes, setTopMemes] = useState<IMeme[]>([]);
  const [topUsers, setTopUsers] = useState<UserStats[]>([]);

  useEffect(() => {
    if (memes.length > 0) {
      // Sort memes by likes
      const sortedMemes = [...memes]
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 10);
      setTopMemes(sortedMemes);

      // Calculate top users based on meme likes
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userStats: { [key: string]: any } = {};
      memes.forEach((meme) => {
        if (meme.creator) {
          if (!userStats[meme.creator]) {
            userStats[meme.creator] = {
              username: meme.creator,
              totalLikes: 0,
              totalMemes: 0,
              avatar: "/placeholder.svg?height=48&width=48",
            };
          }
          userStats[meme.creator].totalLikes += meme.likes;
          userStats[meme.creator].totalMemes += 1;
        }
      });

      const sortedUsers = Object.values(userStats)
        .sort((a, b) => b.totalLikes - a.totalLikes)
        .slice(0, 5);

      setTopUsers(sortedUsers);
    }
  }, [memes]);

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-bold mb-4">Top 10 Memes</h2>
        <div className="grid gap-4">
          {topMemes.map((meme, index) => (
            <Link
              key={meme.id}
              href={`/meme/${meme.id}`}
              className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="font-bold text-2xl text-muted-foreground w-8 text-center">
                {index + 1}
              </div>
              <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
                <Image
                  src={meme.url || "/placeholder.svg?height=64&width=64"}
                  alt={meme.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{meme.name}</h3>
                <p className="text-sm text-muted-foreground">
                  by {meme.creator || "Anonymous"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>{meme.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{meme.comments.length}</span>
                </div>
              </div>
            </Link>
          ))}

          {topMemes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No memes found. Start uploading and liking memes!
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Top Users</h2>
        <div className="grid gap-4">
          {topUsers.map((user, index) => (
            <div
              key={user.username}
              className="flex items-center gap-4 p-4 rounded-lg border"
            >
              <div className="font-bold text-2xl text-muted-foreground w-8 text-center">
                {index + 1}
              </div>
              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted">
                <Image
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.username}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{user.username}</h3>
                <p className="text-sm text-muted-foreground">
                  {user.totalMemes} memes · {user.totalLikes} likes
                </p>
              </div>
              <Link href={`/profile/${user.username}`}>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </Link>
            </div>
          ))}

          {topUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No users found. Start creating memes to appear on the
                leaderboard!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
