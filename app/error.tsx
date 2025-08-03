'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({
    error,
    reset,
}: ErrorProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
            <div className="max-w-md">
                <Alert
                    variant="destructive"
                    className="mb-6"
                >
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>
                        Something went wrong!
                    </AlertTitle>
                    <AlertDescription className="mt-2">
                        {error.message ||
                            'An unexpected error occurred. Please try again.'}
                    </AlertDescription>
                </Alert>

                <div className="space-y-4">
                    <Button
                        onClick={reset}
                        className="w-full"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() =>
                            (window.location.href = '/')
                        }
                        className="w-full"
                    >
                        Go to Homepage
                    </Button>
                </div>

                {error.digest && (
                    <div className="mt-6 text-center text-xs text-muted-foreground">
                        Error ID: {error.digest}
                    </div>
                )}
            </div>
        </div>
    );
}
