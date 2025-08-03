'use client';

import type React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import AuthError from '@/components/auth-error';

export default function LoginPage() {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [errorCode, setErrorCode] = useState('');
    const [
        showRegisterSuggestion,
        setShowRegisterSuggestion,
    ] = useState(false);

    // Handle pre-filled email from URL parameters
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(
                window.location.search
            );
            const email = urlParams.get('email');
            if (email) {
                setFormData((prev) => ({
                    ...prev,
                    email: email,
                }));
            }
        }
    }, []);

    const handleInputChange = (
        field: string,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear error when user starts typing
        if (error) setError('');
        if (showRegisterSuggestion)
            setShowRegisterSuggestion(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setErrorCode('');
        setShowRegisterSuggestion(false);

        try {
            const success = await login(
                formData.email,
                formData.password
            );

            if (success) {
                // Redirect to category selection after successful login
                window.location.href = '/select-category';
            }
        } catch (error) {
            console.error('Login error:', error);

            // Handle specific error cases from the auth hook
            if (error instanceof Error) {
                const errorMessage = error.message;

                if (
                    errorMessage.includes(
                        'User not found'
                    ) ||
                    errorMessage.includes('USER_NOT_FOUND')
                ) {
                    setError(
                        'No account found with this email address.'
                    );
                    setErrorCode('USER_NOT_FOUND');
                    setShowRegisterSuggestion(true);
                } else if (
                    errorMessage.includes(
                        'Invalid email or password'
                    )
                ) {
                    setError(
                        'Invalid email or password. Please try again.'
                    );
                    setErrorCode('INVALID_CREDENTIALS');
                } else {
                    setError(errorMessage);
                    setErrorCode('GENERAL_ERROR');
                }
            } else {
                setError('Login failed. Please try again.');
                setErrorCode('NETWORK_ERROR');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        console.log(`Login with ${provider}`);
        // Implement social login logic
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
            <div className="max-w-md mx-auto px-4">
                <div className="mb-6">
                    <Link
                        href="/"
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>

                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">
                            Welcome Back
                        </CardTitle>
                        <CardDescription>
                            Sign in to your vlsid account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        className="pl-10"
                                        value={
                                            formData.email
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                'email',
                                                e.target
                                                    .value
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        className="pl-10"
                                        value={
                                            formData.password
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                'password',
                                                e.target
                                                    .value
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {error && (
                                <AuthError
                                    error={error}
                                    code={errorCode}
                                    onRegisterClick={() => {
                                        const registerUrl =
                                            formData.email
                                                ? `/register?email=${encodeURIComponent(
                                                      formData.email
                                                  )}`
                                                : '/register';
                                        window.location.href =
                                            registerUrl;
                                    }}
                                    onRetry={() => {
                                        setError('');
                                        setErrorCode('');
                                        setShowRegisterSuggestion(
                                            false
                                        );
                                    }}
                                />
                            )}

                            {showRegisterSuggestion && (
                                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                    <p className="text-blue-800 text-sm mb-3">
                                        Don&apos;t have an
                                        account yet? Create
                                        one to get started.
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                // Pre-fill email in registration
                                                const registerUrl = `/register?email=${encodeURIComponent(
                                                    formData.email
                                                )}`;
                                                window.location.href =
                                                    registerUrl;
                                            }}
                                            className="flex-1"
                                        >
                                            Register with
                                            this email
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setShowRegisterSuggestion(
                                                    false
                                                )
                                            }
                                            className="text-gray-600"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? 'Signing In...'
                                    : 'Sign In'}
                            </Button>
                        </form>

                        <div className="mt-6">
                            <Separator className="my-4" />
                            <p className="text-center text-sm text-gray-600 mb-4">
                                Or continue with
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        handleSocialLogin(
                                            'google'
                                        )
                                    }
                                    className="w-full"
                                >
                                    Google
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        handleSocialLogin(
                                            'facebook'
                                        )
                                    }
                                    className="w-full"
                                >
                                    Facebook
                                </Button>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don&apos;t have an account?{' '}
                                <Link
                                    href="/register"
                                    className="text-blue-600 hover:underline"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>

                        {/* Quick Register Section */}
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-3">
                                New to VLSID? Create an
                                account in seconds
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const registerUrl =
                                        formData.email
                                            ? `/register?email=${encodeURIComponent(
                                                  formData.email
                                              )}`
                                            : '/register';
                                    window.location.href =
                                        registerUrl;
                                }}
                                className="w-full"
                            >
                                Quick Register
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
