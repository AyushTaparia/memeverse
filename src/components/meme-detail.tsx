"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Share2, MessageCircle, Send, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useMeme } from "@/context/meme-context"
import { useUser } from "@/context/user-context"
import { formatRelativeTime } from "@/lib/utils"

interface MemeDetailProps {
  id: string
}

export default function MemeDetail({ id }: MemeDetailProps) {
  const router = useRouter()
  const { getMemeById, addComment, likeMeme } = useMeme()
  const { user, likeMeme: userLikeMeme, unlikeMeme, isMemeLiked } = useUser()

  const meme = getMemeById(id)
  const [commentText, setCommentText] = useState("")
  const [isLiked, setIsLiked] = useState(meme ? isMemeLiked(meme.id) : false)
  const [likeCount, setLikeCount] = useState(meme ? meme.likes : 0)
  const [isLikeAnimating, setIsLikeAnimating] = useState(false)

  if (!meme) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Meme not found</h1>
        <p className="mb-8">The meme you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/explore")}>Explore Other Memes</Button>
      </div>
    )
  }

  const handleLike = () => {
    if (!user) return

    if (isLiked) {
      setLikeCount((prev) => prev - 1)
      unlikeMeme(meme.id)
    } else {
      setLikeCount((prev) => prev + 1)
      likeMeme(meme.id)
      userLikeMeme(meme.id)
      setIsLikeAnimating(true)
      setTimeout(() => setIsLikeAnimating(false), 500)
    }

    setIsLiked(!isLiked)
  }

  const shareLink = `${typeof window !== "undefined" ? window.location.origin : ""}/meme/${meme.id}`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: meme.name,
          text: `Check out this meme: ${meme.name}`,
          url: shareLink,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(shareLink)
      alert("Link copied to clipboard!")
    }
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()

    if (!commentText.trim() || !user) return

    addComment(meme.id, {
      text: commentText,
      username: user.username,
    })

    setCommentText("")
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" className="mb-4 p-0" onClick={() => router.back()}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold mb-2">{meme.name}</h1>
        <p className="text-muted-foreground">
          Posted {formatRelativeTime(meme.createdAt)} by {meme.creator || "Anonymous"}
        </p>
      </div>

      <div className="mb-8 relative rounded-lg overflow-hidden bg-muted">
        <Image
          src={meme.url || "/placeholder.svg"}
          alt={meme.name}
          width={800}
          height={600}
          className="max-h-[80vh] w-full object-contain"
          priority
        />
      </div>

      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          className={`flex items-center gap-2 ${isLikeAnimating ? "like-button-animation" : ""} ${isLiked ? "text-red-500 border-red-500" : ""}`}
          onClick={handleLike}
        >
          <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500" : ""}`} />
          {likeCount} {likeCount === 1 ? "Like" : "Likes"}
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => document.getElementById("comments-section")?.scrollIntoView({ behavior: "smooth" })}
        >
          <MessageCircle className="h-5 w-5" />
          {meme.comments.length} {meme.comments.length === 1 ? "Comment" : "Comments"}
        </Button>

        <Button variant="outline" className="flex items-center gap-2" onClick={handleShare}>
          <Share2 className="h-5 w-5" />
          Share
        </Button>
      </div>

      {meme.caption && (
        <div className="mb-8">
          <p className="text-lg">{meme.caption}</p>
        </div>
      )}

      <div id="comments-section">
        <h2 className="text-xl font-bold mb-4">Comments</h2>

        {meme.comments.length > 0 ? (
          <div className="space-y-4 mb-8">
            <AnimatePresence>
              {meme.comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt={comment.username}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{comment.username}</span>
                      <span className="text-sm text-muted-foreground">{formatRelativeTime(comment.createdAt)}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">{comment.text}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-muted-foreground mb-8">No comments yet. Be the first to comment!</p>
        )}

        {user ? (
          <form onSubmit={handleSubmitComment} className="flex gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={user.avatar || "/placeholder.svg?height=40&width=40"}
                alt={user.username}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <Textarea
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="mb-2 resize-none"
                rows={3}
              />
              <Button type="submit" disabled={!commentText.trim()} className="flex items-center gap-1">
                <Send className="h-4 w-4" />
                Post Comment
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-4 rounded-lg bg-muted text-center">
            <p className="mb-2">You need to be logged in to comment</p>
            <Link href="/profile">
              <Button>Log In / Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

