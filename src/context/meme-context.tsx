"use client";

import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTrendingMemes, fetchMemesByCategory } from "@/lib/api";
import { IComment, IMeme } from "../../types/meme";

interface MemeContextType {
  memes: IMeme[];
  trendingMemes: IMeme[];
  loading: boolean;
  error: string | null;
  fetchMemes: (category?: string) => Promise<void>;
  addMeme: (meme: IMeme) => void;
  likeMeme: (id: string) => void;
  addComment: (
    memeId: string,
    comment: Omit<IComment, "id" | "createdAt">
  ) => void;
  getMemeById: (id: string) => IMeme | undefined;
}

const MemeContext = createContext<MemeContextType | undefined>(undefined);

export const MemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [memes, setMemes] = useState<IMeme[]>([]);
  const [trendingMemes, setTrendingMemes] = useState<IMeme[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Use React Query for caching and managing API calls
  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ["trending-memes"],
    queryFn: fetchTrendingMemes,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

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
  }, []);

  // Update trending memes when data changes
  useEffect(() => {
    if (trendingData) {
      setTrendingMemes(trendingData);
      setMemes(trendingData);
    }
  }, [trendingData]);

  // Sync to localStorage whenever state changes
  useEffect(() => {
    if (memes.length > 0) {
      localStorage.setItem("memes", JSON.stringify(memes));
    }

    if (trendingMemes.length > 0) {
      localStorage.setItem("trendingMemes", JSON.stringify(trendingMemes));
    }
  }, [memes, trendingMemes]);

  const fetchMemes = async (category = "trending") => {
    try {
      const fetchedMemes = await fetchMemesByCategory(category);
      setMemes(fetchedMemes);
    } catch (err) {
      setError("Failed to fetch memes");
      console.error(err);
    }
  };

  const addMeme = (meme: IMeme) => {
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
    comment: Omit<IComment, "id" | "createdAt">
  ) => {
    const newComment: IComment = {
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
    loading: trendingLoading,
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
