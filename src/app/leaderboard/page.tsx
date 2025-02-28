import { Suspense } from "react";
import LeaderboardContent from "@/components/leaderboard-content";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Meme Leaderboard - MemeVerse",
  description: "See the top memes and users on MemeVerse",
};

export default function LeaderboardPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Meme Leaderboard</h1>

      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardContent />
      </Suspense>
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Top 10 Memes</h2>
        <div className="grid gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-lg border"
            >
              <div className="font-bold text-2xl text-muted-foreground w-8 text-center">
                {i + 1}
              </div>
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="flex-1">
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Top Users</h2>
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-lg border"
            >
              <div className="font-bold text-2xl text-muted-foreground w-8 text-center">
                {i + 1}
              </div>
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
