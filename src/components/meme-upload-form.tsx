"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, UploadCloud, ImageIcon, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { generateAICaption, uploadMeme } from "@/lib/api"
import { useMeme } from "@/context/meme-context"
import { useUser } from "@/context/user-context"

export default function MemeUploadForm() {
  const router = useRouter()
  const { addMeme } = useMeme()
  const { user, addUploadedMeme } = useUser()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState("")
  const [caption, setCaption] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [generatingCaption, setGeneratingCaption] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, GIF)")
      return
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB")
      return
    }

    setError("")
    setSelectedFile(file)

    // Create a preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, GIF)")
      return
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB")
      return
    }

    setError("")
    setSelectedFile(file)

    // Create a preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleGenerateCaption = async () => {
    if (!selectedFile) return

    setGeneratingCaption(true)
    try {
      const aiCaption = await generateAICaption(selectedFile.name)
      setCaption(aiCaption)
    } catch (error) {
      console.error("Error generating caption:", error)
      setError("Failed to generate AI caption. Please try again.")
    } finally {
      setGeneratingCaption(false)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setPreviewUrl("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile || !title) {
      setError("Please provide a title and select an image")
      return
    }

    if (!user) {
      setError("You need to be logged in to upload memes")
      return
    }

    setUploading(true)
    try {
      // In a real app, we would upload the file to a server/storage
      // For this demo, we'll just use the file URL directly

      const newMeme = await uploadMeme({
        name: title,
        url: previewUrl, // In a real app, this would be the URL from the server
        caption: caption,
        creator: user.username,
      })

      addMeme(newMeme)
      addUploadedMeme(newMeme.id)

      // Navigate to the new meme
      router.push(`/meme/${newMeme.id}`)
    } catch (error) {
      console.error("Error uploading meme:", error)
      setError("Failed to upload meme. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Meme Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your meme"
            required
          />
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            previewUrl ? "border-primary" : "border-muted-foreground"
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square max-h-[300px] mx-auto"
              >
                <Image
                  src={previewUrl || "/placeholder.svg"}
                  alt="Meme preview"
                  className="object-contain mx-auto rounded-lg max-h-[300px] w-auto"
                  width={300}
                  height={300}
                />
              </motion.div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-3 -right-3 rounded-full"
                onClick={handleRemoveFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <UploadCloud className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-lg font-medium mb-1">Drop your image here or click to browse</p>
              <p className="text-sm text-muted-foreground mb-4">Supports JPG, PNG, GIF (Max 5MB)</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                Browse Files
              </Button>
              <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="caption">Caption (Optional)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateCaption}
              disabled={!selectedFile || generatingCaption}
              className="text-xs flex items-center gap-1"
            >
              {generatingCaption ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3" />
                  Generate AI Caption
                </>
              )}
            </Button>
          </div>
          <Textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a funny caption to your meme"
            rows={3}
            className="resize-none"
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-md bg-destructive/10 text-destructive border border-destructive"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end">
          <Button type="submit" disabled={!selectedFile || uploading || !title} className="flex items-center gap-2">
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Meme
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

