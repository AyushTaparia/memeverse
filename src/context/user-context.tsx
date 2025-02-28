"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type User = {
  id: string
  username: string
  avatar: string
  bio: string
  likedMemes: string[]
  uploadedMemes: string[]
}

type UserContextType = {
  user: User | null
  loading: boolean
  error: string | null
  login: (username: string) => void
  updateProfile: (userData: Partial<User>) => void
  likeMeme: (memeId: string) => void
  unlikeMeme: (memeId: string) => void
  addUploadedMeme: (memeId: string) => void
  isMemeLiked: (memeId: string) => boolean
}

const defaultUser: User = {
  id: "1",
  username: "MemeEnthusiast",
  avatar: "/placeholder.svg?height=200&width=200",
  bio: "Just a meme lover exploring the MemeVerse",
  likedMemes: [],
  uploadedMemes: [],
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize with local storage
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      // Initialize with default user for demo purposes
      setUser(defaultUser)
    }
    setLoading(false)
  }, [])

  // Update local storage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    }
  }, [user])

  const login = (username: string) => {
    // Simple login for demo - in a real app, this would involve authentication
    setUser({
      ...defaultUser,
      username,
      id: Date.now().toString(),
    })
  }

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  const likeMeme = (memeId: string) => {
    if (user) {
      setUser({
        ...user,
        likedMemes: [...user.likedMemes, memeId],
      })
    }
  }

  const unlikeMeme = (memeId: string) => {
    if (user) {
      setUser({
        ...user,
        likedMemes: user.likedMemes.filter((id) => id !== memeId),
      })
    }
  }

  const addUploadedMeme = (memeId: string) => {
    if (user) {
      setUser({
        ...user,
        uploadedMemes: [...user.uploadedMemes, memeId],
      })
    }
  }

  const isMemeLiked = (memeId: string) => {
    return user ? user.likedMemes.includes(memeId) : false
  }

  const value = {
    user,
    loading,
    error,
    login,
    updateProfile,
    likeMeme,
    unlikeMeme,
    addUploadedMeme,
    isMemeLiked,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

