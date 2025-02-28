import { Suspense } from "react"
import MemeDetail from "@/components/meme-detail"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Meme Details - MemeVerse",
  description: "View and interact with memes on MemeVerse",
}

export default function MemePage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-8">
      <Suspense fallback={<MemeDetailSkeleton />}>
        <MemeDetail id={params.id} />
      </Suspense>
    </div>
  )
}

function MemeDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <Skeleton className="h-8 w-3/4 mb-4" />
      <Skeleton className="h-4 w-1/2 mb-8" />

      <div className="mb-8">
        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>

      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>

      <Skeleton className="h-6 w-32 mb-4" />

      <div className="space-y-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-16 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-20 w-full rounded-md mb-2" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  )
}

