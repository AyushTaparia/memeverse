"use client"

import Link from "next/link"

import { useState } from "react"
import Image from "next/image"
import { useUser } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const UserProfile = () => {
  const { user, updateProfile } = useUser()
  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState(user?.username || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [avatar, setAvatar] = useState(user?.avatar || "")
  const [error, setError] = useState("")

  const handleSave = () => {
    if (!username.trim()) {
      setError("Username cannot be empty")
      return
    }
    updateProfile({ username, bio, avatar })
    setEditing(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-muted">
          <Image
            src={avatar || "/placeholder.svg?height=96&width=96"}
            alt="User avatar"
            width={96}
            height={96}
            className="object-cover"
          />
        </div>
        <div>
          {editing ? (
            <>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="mb-2"
              />
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Bio"
                rows={3}
                className="mb-2 resize-none"
              />
              <div className="flex gap-2">
                <Button onClick={handleSave}>Save</Button>
                <Button variant="ghost" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold">{username}</h2>
              <p>{bio}</p>
              <Button onClick={() => setEditing(true)}>Edit Profile</Button>
            </>
          )}
        </div>
      </div>
      {user && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Liked Memes</h3>
          <ul>
            {user.likedMemes.map((memeId) => (
              <li key={memeId}>
                <Link href={`/meme/${memeId}`}>Meme {memeId}</Link>
              </li>
            ))}
          </ul>
          <h3 className="text-lg font-semibold">Uploaded Memes</h3>
          <ul>
            {user.uploadedMemes.map((memeId) => (
              <li key={memeId}>
                <Link href={`/meme/${memeId}`}>Meme {memeId}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default UserProfile

