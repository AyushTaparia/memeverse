import { Suspense } from "react";
import ExploreContent from "@/components/explore-content";
import { Skeleton } from "@/components/ui/skeleton";
import { MemeCategory } from "../../../types/meme";

export const metadata = {
  title: "Explore Memes - MemeVerse",
  description:
    "Discover and explore the best memes across different categories",
};

export default function ExplorePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search =
    typeof searchParams.search === "string" ? searchParams.search : "";
  const category =
    typeof searchParams.category === "string"
      ? searchParams.category
      : "trending";

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Explore Memes</h1>

      <Suspense fallback={<ExploreLoadingSkeleton />}>
        <ExploreContent
          initialSearch={search}
          initialCategory={category as MemeCategory}
        />
      </Suspense>
    </div>
  );
}

function ExploreLoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24" />
          ))}
        </div>
        <Skeleton className="h-9 w-64" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
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
    </div>
  );
}
