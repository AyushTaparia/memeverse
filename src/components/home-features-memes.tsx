"use client"

import { useState, useEffect } from "react"
import { MemeGrid } from "@/components/meme-grid"
import { useMeme } from "@/context/meme-context"

export default function HomeFeaturesMemes() {
  const { trendingMemes, loading } = useMeme()
  const [displayMemes, setDisplayMemes] = useState([])

  useEffect(() => {
    // Only show top 8 trending memes on homepage
    if (trendingMemes.length > 0) {
      setDisplayMemes(trendingMemes.slice(0, 8))
    }
  }, [trendingMemes])

  return <MemeGrid memes={displayMemes} loading={loading} />
}

