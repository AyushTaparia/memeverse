"use client";

import type React from "react";
import { useEffect } from "react";
import { useState, useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { MemeGrid } from "@/components/meme-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchMemes, fetchMemesByCategory } from "@/lib/api";
import { debounce } from "@/lib/utils";
import { MemeCategory } from "../../types/meme";

interface ExploreContentProps {
  initialSearch?: string;
  initialCategory?: MemeCategory;
}

export default function ExploreContent({
  initialSearch = "",
  initialCategory = "trending",
}: ExploreContentProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [category, setCategory] = useState<MemeCategory>(initialCategory);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Categories with proper typing
  const categories: Array<{ label: string; value: MemeCategory }> = [
    { label: "Trending", value: "trending" },
    { label: "New", value: "new" },
    { label: "Classic", value: "classic" },
    { label: "Random", value: "random" },
  ];

  // Use React Query for caching and managing API calls
  const {
    data: memes = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["memes", category, searchTerm],
    queryFn: () =>
      searchTerm ? searchMemes(searchTerm) : fetchMemesByCategory(category),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  // Update URL when search or category changes
  useEffect(() => {
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

  // Memoize the debounced search function
  const debouncedSearch = useMemo(() => {
    return debounce((query: string) => {
      setSearchTerm(query);
      setPage(1);
    }, 500);
  }, []);

  // Handle search input change
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      debouncedSearch(query);
    },
    [debouncedSearch]
  );

  // Handle category change
  const handleCategoryChange = useCallback((newCategory: MemeCategory) => {
    setCategory(newCategory);
    setSearchTerm("");
    setPage(1);
  }, []);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  // Calculate pagination
  const paginatedMemes = memes.slice(0, page * itemsPerPage);
  const hasMore = paginatedMemes.length < memes.length;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">
          Error loading memes. Please try again later.
        </p>
      </div>
    );
  }

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
            defaultValue={searchTerm}
            onChange={handleSearchChange}
            className="md:w-[300px]"
          />
        </div>
      </div>

      <MemeGrid
        memes={paginatedMemes}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
