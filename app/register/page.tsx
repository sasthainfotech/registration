'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    ArrowLeft,
    Mail,
    Phone,
    User,
    Globe,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import AuthError from '@/components/auth-error';

const countries = [
    { code: 'IN', name: 'India', currency: 'INR' },
    { code: 'US', name: 'United States', currency: 'USD' },
    { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
    { code: 'CA', name: 'Canada', currency: 'CAD' },
    { code: 'AU', name: 'Australia', currency: 'AUD' },
    { code: 'DE', name: 'Germany', currency: 'EUR' },
    { code: 'FR', name: 'France', currency: 'EUR' },
    { code: 'SG', name: 'Singapore', currency: 'SGD' },
];

export default function RegisterPage() {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: '',
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [errorCode, setErrorCode] = useState('');

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
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setErrorCode('');

        try {
            // Validate passwords match
            if (
                formData.password !==
                formData.confirmPassword
            ) {
                setError('Passwords do not match');
                return;
            }

            // Validate password strength
            if (formData.password.length < 6) {
                setError(
                    'Password must be at least 6 characters long'
                );
                return;
            }

            const success = await register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                country: formData.country,
                password: formData.password,
            });

            if (success) {
                // Redirect to category selection after successful registration
                window.location.href = '/select-category';
            }
        } catch (error) {
            console.error('Registration error:', error);

            // Handle specific error cases from the auth hook
            if (error instanceof Error) {
                const errorMessage = error.message;

                if (
                    errorMessage.includes(
                        'already exists'
                    ) ||
                    errorMessage.includes('USER_EXISTS')
                ) {
                    setError(
                        'An account with this email already exists. Please log in instead.'
                    );
                    setErrorCode('USER_EXISTS');
                } else if (
                    errorMessage.includes(
                        'Invalid email format'
                    )
                ) {
                    setError(
                        'Please enter a valid email address.'
                    );
                    setErrorCode('INVALID_EMAIL');
                } else if (
                    errorMessage.includes(
                        'Password must be at least 6 characters'
                    )
                ) {
                    setError(
                        'Password must be at least 6 characters long.'
                    );
                    setErrorCode('WEAK_PASSWORD');
                } else {
                    setError(errorMessage);
                    setErrorCode('GENERAL_ERROR');
                }
            } else {
                setError(
                    'Registration failed. Please try again.'
                );
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
                            Create Account
                        </CardTitle>
                        <CardDescription>
                            Join vlsid and connect with the
                            global community
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">
                                        First Name
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="firstName"
                                            placeholder="John"
                                            className="pl-10"
                                            value={
                                                formData.firstName
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'firstName',
                                                    e.target
                                                        .value
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">
                                        Last Name
                                    </Label>
                                    <Input
                                        id="lastName"
                                        placeholder="Doe"
                                        value={
                                            formData.lastName
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                'lastName',
                                                e.target
                                                    .value
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </div>

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
                                <Label htmlFor="phone">
                                    Phone Number
                                </Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+91 9876543210"
                                        className="pl-10"
                                        value={
                                            formData.phone
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                'phone',
                                                e.target
                                                    .value
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="country">
                                    Country
                                </Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                                    <Select
                                        onValueChange={(
                                            value
                                        ) =>
                                            handleInputChange(
                                                'country',
                                                value
                                            )
                                        }
                                    >
                                        <SelectTrigger className="pl-10">
                                            <SelectValue placeholder="Select your country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries.map(
                                                (
                                                    country
                                                ) => (
                                                    <SelectItem
                                                        key={
                                                            country.code
                                                        }
                                                        value={
                                                            country.code
                                                        }
                                                    >
                                                        {
                                                            country.name
                                                        }
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Create a strong password"
                                    value={
                                        formData.password
                                    }
                                    onChange={(e) =>
                                        handleInputChange(
                                            'password',
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={
                                        formData.confirmPassword
                                    }
                                    onChange={(e) =>
                                        handleInputChange(
                                            'confirmPassword',
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>

                            {error && (
                                <AuthError
                                    error={error}
                                    code={errorCode}
                                    onRegisterClick={() => {
                                        // For existing users, redirect to login
                                        if (
                                            errorCode ===
                                            'USER_EXISTS'
                                        ) {
                                            const loginUrl =
                                                formData.email
                                                    ? `/login?email=${encodeURIComponent(
                                                          formData.email
                                                      )}`
                                                    : '/login';
                                            window.location.href =
                                                loginUrl;
                                        }
                                    }}
                                    onRetry={() => {
                                        setError('');
                                        setErrorCode('');
                                    }}
                                />
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? 'Creating Account...'
                                    : 'Create Account'}
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
                                Already have an account?{' '}
                                <Link
                                    href="/login"
                                    className="text-blue-600 hover:underline"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
