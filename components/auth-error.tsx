'use client';

import {
    AlertTriangle,
    UserPlus,
    Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthErrorProps {
    error: string;
    code?: string;
    onRegisterClick?: () => void;
    onRetry?: () => void;
}

export default function AuthError({
    error,
    code,
    onRegisterClick,
    onRetry,
}: AuthErrorProps) {
    const isUserNotFound = code === 'USER_NOT_FOUND';
    const isUserExists = code === 'USER_EXISTS';

    return (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                    <p className="text-red-800 text-sm mb-3">
                        {error}
                    </p>

                    {isUserNotFound && onRegisterClick && (
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={onRegisterClick}
                                className="flex items-center gap-2"
                            >
                                <UserPlus className="w-4 h-4" />
                                Create Account
                            </Button>
                            {onRetry && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={onRetry}
                                    className="text-gray-600"
                                >
                                    Try Again
                                </Button>
                            )}
                        </div>
                    )}

                    {isUserExists && onRegisterClick && (
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={onRegisterClick}
                                className="flex items-center gap-2"
                            >
                                <Mail className="w-4 h-4" />
                                Log In Instead
                            </Button>
                            {onRetry && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={onRetry}
                                    className="text-gray-600"
                                >
                                    Try Again
                                </Button>
                            )}
                        </div>
                    )}

                    {!isUserNotFound &&
                        !isUserExists &&
                        onRetry && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={onRetry}
                            >
                                Try Again
                            </Button>
                        )}
                </div>
            </div>
        </div>
    );
}
