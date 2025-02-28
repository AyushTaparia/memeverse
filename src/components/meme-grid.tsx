"use client";

import { useRef, useEffect } from "react";
import { useInView } from "framer-motion";
import { MemeCard } from "@/components/meme-card";
import { Skeleton } from "@/components/ui/skeleton";
import { IMeme } from "../../types/meme";

interface MemeGridProps {
  memes: IMeme[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export function MemeGrid({
  memes,
  loading = false,
  onLoadMore,
  hasMore = false,
}: MemeGridProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(loadMoreRef, { once: false });

  useEffect(() => {
    if (isInView && onLoadMore && hasMore && !loading) {
      onLoadMore();
    }
  }, [isInView, onLoadMore, hasMore, loading]);

  if (loading && memes.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg overflow-hidden border bg-card shadow-sm"
          >
            <div className="p-2">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-64 w-full rounded-md" />
              <div className="flex justify-between mt-4">
                <div className="flex gap-4">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {memes.map((meme, index) => (
          <MemeCard key={meme.id} meme={meme} priority={index < 4} />
        ))}

        {loading &&
          hasMore &&
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="rounded-lg overflow-hidden border bg-card shadow-sm"
            >
              <div className="p-2">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-64 w-full rounded-md" />
                <div className="flex justify-between mt-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          ))}
      </div>

      {hasMore && <div ref={loadMoreRef} className="h-10 w-full" />}

      {memes.length === 0 && !loading && (
        <div className="text-center py-10">
          <h3 className="text-lg font-semibold">No memes found</h3>
          <p className="text-muted-foreground">
            Try a different search or category
          </p>
        </div>
      )}
    </>
  );
}
