'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
            <div className="text-center">
                <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                    <AlertCircle className="h-10 w-10 text-destructive" />
                </div>

                <h1 className="mb-4 text-6xl font-bold text-muted-foreground">
                    404
                </h1>

                <h2 className="mb-4 text-2xl font-semibold">
                    Page Not Found
                </h2>

                <p className="mb-8 text-muted-foreground">
                    Sorry, we couldn&apos;t find the page
                    you&apos;re looking for. It might have
                    been moved, deleted, or you may have
                    entered the wrong URL.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Button asChild>
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Go Home
                        </Link>
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() =>
                            window.history.back()
                        }
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                </div>

                <div className="mt-12 text-sm text-muted-foreground">
                    If you believe this is an error, please{' '}
                    <Link
                        href="/contact"
                        className="text-primary underline-offset-4 hover:underline"
                    >
                        contact support
                    </Link>
                </div>
            </div>
        </div>
    );
}
