"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/user-context";
import { useMeme } from "@/context/meme-context";
import { formatRelativeTime, truncateText } from "@/lib/utils";
import { IMeme } from "../../types/meme";

interface MemeCardProps {
  meme: IMeme;
  priority?: boolean;
}

export function MemeCard({ meme, priority = false }: MemeCardProps) {
  const { likeMeme } = useMeme();
  const { user, likeMeme: userLikeMeme, unlikeMeme, isMemeLiked } = useUser();
  const [isLiked, setIsLiked] = useState(isMemeLiked(meme.id));
  const [likeCount, setLikeCount] = useState(meme.likes);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);

  const handleLike = () => {
    if (!user) return;

    if (isLiked) {
      setLikeCount((prev) => prev - 1);
      unlikeMeme(meme.id);
    } else {
      setLikeCount((prev) => prev + 1);
      likeMeme(meme.id);
      userLikeMeme(meme.id);
      setIsLikeAnimating(true);
      setTimeout(() => setIsLikeAnimating(false), 500);
    }

    setIsLiked(!isLiked);
  };

  const shareLink = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/meme/${meme.id}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: meme.name,
          text: `Check out this meme: ${meme.name}`,
          url: shareLink,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(shareLink);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg overflow-hidden border bg-card shadow-sm meme-card-hover"
    >
      <div className="p-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
            <Image
              src={meme.url}
              quality={1}
              alt="User avatar"
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium">{meme.creator || "Anonymous"}</p>
            <p className="text-xs text-muted-foreground">
              {formatRelativeTime(meme.createdAt)}
            </p>
          </div>
        </div>

        <Link href={`/meme/${meme.id}`} className="block">
          <h3 className="text-base font-semibold mb-2">
            {truncateText(meme.name, 60)}
          </h3>

          <div className="relative aspect-square rounded-md overflow-hidden bg-muted">
            <Image
              src={meme.url || "/placeholder.svg"}
              alt={meme.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={priority}
            />
          </div>

          {meme.caption && (
            <p className="mt-2 text-sm text-muted-foreground">
              {truncateText(meme.caption, 100)}
            </p>
          )}
        </Link>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 ${
                isLikeAnimating ? "like-button-animation" : ""
              } ${isLiked ? "text-red-500" : ""}`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500" : ""}`} />
              <span>{likeCount}</span>
            </Button>

            <Link href={`/meme/${meme.id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{meme.comments.length}</span>
              </Button>
            </Link>
          </div>

          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
