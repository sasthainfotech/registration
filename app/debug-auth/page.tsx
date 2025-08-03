'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Alert,
    AlertDescription,
} from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';

export default function DebugAuthPage() {
    const {
        user,
        isAuthenticated,
        login,
        register,
        logout,
    } = useAuth();
    const [dbStatus, setDbStatus] = useState<{
        success: boolean;
        data?: {
            users: number;
            events: number;
            tickets: number;
            payments: number;
        };
        error?: string;
    } | null>(null);
    const [testUserEmail, setTestUserEmail] = useState(
        'test@example.com'
    );
    const [testUserPassword, setTestUserPassword] =
        useState('test123');
    const [message, setMessage] = useState<string | null>(
        null
    );
    const [loading, setLoading] = useState(false);

    const checkDbStatus = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                '/api/debug/db-status'
            );
            const data = await response.json();
            setDbStatus(data);
            setMessage(
                data.success
                    ? 'Database status retrieved'
                    : data.error
            );
        } catch (_error) {
            setMessage('Failed to check database status');
        } finally {
            setLoading(false);
        }
    };

    const addTestUser = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                '/api/debug/add-test-user',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: testUserEmail,
                        password: testUserPassword,
                    }),
                }
            );
            const data = await response.json();
            setMessage(
                data.success
                    ? 'Test user created'
                    : data.error
            );
            if (data.success) {
                checkDbStatus(); // Refresh status
            }
        } catch (_error) {
            setMessage('Failed to create test user');
        } finally {
            setLoading(false);
        }
    };

    const testLogin = async () => {
        try {
            setLoading(true);
            const result = await login(
                testUserEmail,
                testUserPassword
            );
            setMessage(
                result.success
                    ? 'Login successful'
                    : result.error || 'Login failed'
            );
        } catch (_error) {
            setMessage('Login failed');
        } finally {
            setLoading(false);
        }
    };

    const testRegister = async () => {
        try {
            setLoading(true);
            const result = await register({
                firstName: 'Test',
                lastName: 'User',
                email: testUserEmail,
                phone: '+1234567890',
                country: 'International',
                password: testUserPassword,
            });
            setMessage(
                result.success
                    ? 'Registration successful'
                    : result.error || 'Registration failed'
            );
        } catch (_error) {
            setMessage('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">
                Authentication Debug Page
            </h1>

            {/* Current Auth Status */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        Current Authentication Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        <strong>Authenticated:</strong>{' '}
                        {isAuthenticated ? 'Yes' : 'No'}
                    </p>
                    {user && (
                        <div>
                            <p>
                                <strong>User:</strong>{' '}
                                {user.firstName}{' '}
                                {user.lastName}
                            </p>
                            <p>
                                <strong>Email:</strong>{' '}
                                {user.email}
                            </p>
                            <p>
                                <strong>ID:</strong>{' '}
                                {user.id}
                            </p>
                        </div>
                    )}
                    {isAuthenticated && (
                        <Button
                            onClick={logout}
                            variant="destructive"
                            className="mt-2"
                        >
                            Logout
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Database Status */}
            <Card>
                <CardHeader>
                    <CardTitle>Database Status</CardTitle>
                    <CardDescription>
                        Check what users are in the database
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        onClick={checkDbStatus}
                        disabled={loading}
                    >
                        {loading
                            ? 'Checking...'
                            : 'Check Database Status'}
                    </Button>

                    {dbStatus && (
                        <div className="space-y-2">
                            <p>
                                <strong>
                                    Total Users:
                                </strong>{' '}
                                {dbStatus.data?.users}
                            </p>
                            {dbStatus.success && (
                                <p>
                                    <strong>Status:</strong>{' '}
                                    Database is connected
                                    and operational
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Test User Management */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        Test User Management
                    </CardTitle>
                    <CardDescription>
                        Create and test users
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="testEmail">
                                Email
                            </Label>
                            <Input
                                id="testEmail"
                                value={testUserEmail}
                                onChange={(e) =>
                                    setTestUserEmail(
                                        e.target.value
                                    )
                                }
                                placeholder="test@example.com"
                            />
                        </div>
                        <div>
                            <Label htmlFor="testPassword">
                                Password
                            </Label>
                            <Input
                                id="testPassword"
                                value={testUserPassword}
                                onChange={(e) =>
                                    setTestUserPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="test123"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={addTestUser}
                            disabled={loading}
                        >
                            Add Test User
                        </Button>
                        <Button
                            onClick={testLogin}
                            disabled={loading}
                        >
                            Test Login
                        </Button>
                        <Button
                            onClick={testRegister}
                            disabled={loading}
                        >
                            Test Register
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Messages */}
            {message && (
                <Alert>
                    <AlertDescription>
                        {message}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
