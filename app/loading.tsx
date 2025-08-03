import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="space-y-8">
                {/* Header skeleton */}
                <div className="space-y-4">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>

                {/* Content skeleton */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map(
                        (_, i) => (
                            <div
                                key={i}
                                className="space-y-4 rounded-lg border p-6"
                            >
                                <Skeleton className="h-40 w-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                                <div className="flex space-x-2">
                                    <Skeleton className="h-8 w-20" />
                                    <Skeleton className="h-8 w-20" />
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
