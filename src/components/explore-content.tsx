"use client";

import type React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { MemeGrid } from "@/components/meme-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Meme, useMeme } from "@/context/meme-context";
import { searchMemes } from "@/lib/api";
import { debounce } from "@/lib/utils";

interface ExploreContentProps {
  initialSearch?: string;
  initialCategory?: string;
}

export default function ExploreContent({
  initialSearch = "",
  initialCategory = "trending",
}: ExploreContentProps) {
  const { memes, loading, fetchMemes } = useMeme();
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [searchResults, setSearchResults] = useState<Meme[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const isInitialMount = useRef(true);
  const currentCategory = useRef(initialCategory);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Category options
  const categories = [
    { label: "Trending", value: "trending" },
    { label: "New", value: "new" },
    { label: "Classic", value: "classic" },
    { label: "Random", value: "random" },
  ];

  // Update URL when search or category changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams(searchParams);

    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }

    if (category && category !== "trending") {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [searchTerm, category, pathname, router, searchParams]);

  // Fetch memes by category when category changes, but not on initial render
  useEffect(() => {
    if (isInitialMount.current) {
      return;
    }

    if (!searchTerm && category !== currentCategory.current) {
      fetchMemes(category);
      setPage(1);
      currentCategory.current = category;
    }
  }, [category, fetchMemes, searchTerm]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query) {
        setIsSearching(true);
        try {
          const results = await searchMemes(query);
          setSearchResults(results);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500),
    []
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
    debouncedSearch(query);
    setPage(1);
  };

  // Handle category change
  const handleCategoryChange = (newCategory: string) => {
    if (newCategory === category) return;
    setCategory(newCategory);

    if (searchTerm) {
      setSearchTerm("");
      setSearchResults([]);
    }
  };

  // Handle load more
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // Calculate pagination
  const displayMemes = searchTerm ? searchResults : memes;
  const paginatedMemes = displayMemes.slice(0, page * itemsPerPage);
  const hasMore = paginatedMemes.length < displayMemes.length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={category === cat.value ? "default" : "outline"}
              onClick={() => handleCategoryChange(cat.value)}
              className="min-w-24"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        <div className="w-full md:w-auto">
          <Input
            type="search"
            placeholder="Search memes..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="md:w-[300px]"
          />
        </div>
      </div>

      <MemeGrid
        memes={paginatedMemes}
        loading={loading || isSearching}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
