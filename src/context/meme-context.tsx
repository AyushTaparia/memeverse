"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { fetchTrendingMemes, fetchMemesByCategory } from "@/lib/api";

export type Meme = {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count?: number;
  caption?: string;
  likes: number;
  comments: Comment[];
  category: string;
  createdAt: string;
  creator?: string;
};

export type Comment = {
  id: string;
  text: string;
  username: string;
  createdAt: string;
};

type MemeContextType = {
  memes: Meme[];
  trendingMemes: Meme[];
  loading: boolean;
  error: string | null;
  fetchMemes: (category?: string) => Promise<void>;
  addMeme: (meme: Meme) => void;
  likeMeme: (id: string) => void;
  addComment: (
    memeId: string,
    comment: Omit<Comment, "id" | "createdAt">
  ) => void;
  getMemeById: (id: string) => Meme | undefined;
};

const MemeContext = createContext<MemeContextType | undefined>(undefined);

export const MemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [trendingMemes, setTrendingMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialFetchCompleted = useRef(false);

  // Initialize with local storage on client side
  useEffect(() => {
    const storedMemes = localStorage.getItem("memes");
    const storedTrendingMemes = localStorage.getItem("trendingMemes");

    if (storedMemes) {
      setMemes(JSON.parse(storedMemes));
    }

    if (storedTrendingMemes) {
      setTrendingMemes(JSON.parse(storedTrendingMemes));
    }

    // Only fetch initially if we don't have stored data
    if (
      (!storedMemes || !storedTrendingMemes) &&
      !initialFetchCompleted.current
    ) {
      fetchInitialMemes();
      initialFetchCompleted.current = true;
    } else {
      setLoading(false);
    }
  }, []);

  // Sync to localStorage whenever state changes
  useEffect(() => {
    if (memes.length > 0) {
      localStorage.setItem("memes", JSON.stringify(memes));
    }

    if (trendingMemes.length > 0) {
      localStorage.setItem("trendingMemes", JSON.stringify(trendingMemes));
    }
  }, [memes, trendingMemes]);

  const fetchInitialMemes = async () => {
    try {
      setLoading(true);
      const trending = await fetchTrendingMemes();
      setTrendingMemes(trending);
      setMemes(trending);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch memes");
      setLoading(false);
      console.error(err);
    }
  };

  const fetchMemes = async (category = "trending") => {
    try {
      setLoading(true);
      const fetchedMemes = await fetchMemesByCategory(category);
      setMemes(fetchedMemes);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch memes");
      setLoading(false);
      console.error(err);
    }
  };

  const addMeme = (meme: Meme) => {
    setMemes((prev) => [meme, ...prev]);
  };

  const likeMeme = (id: string) => {
    setMemes((prev) =>
      prev.map((meme) =>
        meme.id === id ? { ...meme, likes: meme.likes + 1 } : meme
      )
    );

    setTrendingMemes((prev) =>
      prev.map((meme) =>
        meme.id === id ? { ...meme, likes: meme.likes + 1 } : meme
      )
    );
  };

  const addComment = (
    memeId: string,
    comment: Omit<Comment, "id" | "createdAt">
  ) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setMemes((prev) =>
      prev.map((meme) =>
        meme.id === memeId
          ? { ...meme, comments: [...meme.comments, newComment] }
          : meme
      )
    );

    setTrendingMemes((prev) =>
      prev.map((meme) =>
        meme.id === memeId
          ? { ...meme, comments: [...meme.comments, newComment] }
          : meme
      )
    );
  };

  const getMemeById = (id: string) => {
    return memes.find((meme) => meme.id === id);
  };

  const value = {
    memes,
    trendingMemes,
    loading,
    error,
    fetchMemes,
    addMeme,
    likeMeme,
    addComment,
    getMemeById,
  };

  return <MemeContext.Provider value={value}>{children}</MemeContext.Provider>;
};

export const useMeme = () => {
  const context = useContext(MemeContext);
  if (context === undefined) {
    throw new Error("useMeme must be used within a MemeProvider");
  }
  return context;
};
