'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function TestAuthPage() {
    const [testResults, setTestResults] = useState<
        string[]
    >([]);
    const [isLoading, setIsLoading] = useState(false);

    const addResult = (message: string) => {
        setTestResults((prev) => [
            ...prev,
            `${new Date().toLocaleTimeString()}: ${message}`,
        ]);
    };

    const testRegistration = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'test@example.com',
                    phone: '1234567890',
                    country: 'IN',
                    password: '123456',
                }),
            });

            const data = await response.json();
            if (data.success) {
                addResult('✅ Registration successful');
            } else {
                addResult(
                    `❌ Registration failed: ${data.error}`
                );
            }
        } catch (error) {
            addResult(`❌ Registration error: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    const testLogin = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: '123456',
                }),
            });

            const data = await response.json();
            if (data.success) {
                addResult('✅ Login successful');
            } else {
                addResult(`❌ Login failed: ${data.error}`);
            }
        } catch (error) {
            addResult(`❌ Login error: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    const testAuthHook = async () => {
        setIsLoading(true);
        try {
            // Test the auth hook by trying to register and login
            const registerResponse = await fetch(
                '/api/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName: 'Hook',
                        lastName: 'Test',
                        email: 'hook@example.com',
                        phone: '1234567890',
                        country: 'IN',
                        password: '123456',
                    }),
                }
            );

            const registerData =
                await registerResponse.json();
            if (registerData.success) {
                addResult(
                    '✅ Auth hook registration successful'
                );

                // Now test login
                const loginResponse = await fetch(
                    '/api/login',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type':
                                'application/json',
                        },
                        body: JSON.stringify({
                            email: 'hook@example.com',
                            password: '123456',
                        }),
                    }
                );

                const loginData =
                    await loginResponse.json();
                if (loginData.success) {
                    addResult(
                        '✅ Auth hook login successful'
                    );
                } else {
                    addResult(
                        `❌ Auth hook login failed: ${loginData.error}`
                    );
                }
            } else {
                addResult(
                    `❌ Auth hook registration failed: ${registerData.error}`
                );
            }
        } catch (error) {
            addResult(`❌ Auth hook error: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Authentication Test Page
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <Button
                                    onClick={
                                        testRegistration
                                    }
                                    disabled={isLoading}
                                >
                                    Test Registration
                                </Button>
                                <Button
                                    onClick={testLogin}
                                    disabled={isLoading}
                                >
                                    Test Login
                                </Button>
                                <Button
                                    onClick={testAuthHook}
                                    disabled={isLoading}
                                >
                                    Test Auth Hook Flow
                                </Button>
                            </div>

                            <div className="mt-6">
                                <Label>Test Results:</Label>
                                <div className="mt-2 p-4 bg-gray-100 rounded-md max-h-96 overflow-y-auto">
                                    {testResults.length ===
                                    0 ? (
                                        <p className="text-gray-500">
                                            No tests run
                                            yet. Click a
                                            button above to
                                            start testing.
                                        </p>
                                    ) : (
                                        testResults.map(
                                            (
                                                result,
                                                index
                                            ) => (
                                                <div
                                                    key={
                                                        index
                                                    }
                                                    className="text-sm font-mono mb-1"
                                                >
                                                    {result}
                                                </div>
                                            )
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
