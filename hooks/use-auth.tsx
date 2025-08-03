'use client';

import {
    useState,
    useEffect,
    createContext,
    useContext,
} from 'react';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    createdAt: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (
        email: string,
        password: string
    ) => Promise<{ success: boolean; error?: string }>;
    register: (
        userData: any
    ) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<
    AuthContextType | undefined
>(undefined);

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing auth on mount
    useEffect(() => {
        const checkAuth = () => {
            try {
                const storedToken =
                    localStorage.getItem('authToken');
                const storedUser =
                    localStorage.getItem('userData');

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error(
                    'Error checking auth:',
                    error
                );
                // Clear invalid data
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (
        email: string,
        password: string
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            console.log(
                '🔐 Auth Hook: Starting login process for:',
                email
            );
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log(
                '🔐 Auth Hook: Login response:',
                data
            );

            if (data.success) {
                console.log(
                    '🔐 Auth Hook: Login successful, setting user data'
                );
                setUser(data.user);
                setToken(data.token);
                localStorage.setItem(
                    'authToken',
                    data.token
                );
                localStorage.setItem(
                    'userData',
                    JSON.stringify(data.user)
                );
                return { success: true };
            } else {
                console.log(
                    '🔐 Auth Hook: Login failed:',
                    data.error
                );
                return {
                    success: false,
                    error: data.error || 'Login failed',
                };
            }
        } catch (error) {
            console.error(
                '🔐 Auth Hook: Login error:',
                error
            );
            return {
                success: false,
                error: 'Network error. Please try again.',
            };
        }
    };

    const register = async (
        userData: any
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            console.log(
                '🔐 Auth Hook: Starting registration process for:',
                userData.email
            );
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            console.log(
                '🔐 Auth Hook: Registration response:',
                data
            );

            if (data.success) {
                console.log(
                    '🔐 Auth Hook: Registration successful, setting user data and token'
                );
                setUser(data.user);
                setToken(data.token);
                localStorage.setItem(
                    'userData',
                    JSON.stringify(data.user)
                );
                localStorage.setItem(
                    'authToken',
                    data.token
                );
                return { success: true };
            } else {
                console.log(
                    '🔐 Auth Hook: Registration failed:',
                    data.error
                );
                return {
                    success: false,
                    error:
                        data.error || 'Registration failed',
                };
            }
        } catch (error) {
            console.error(
                '🔐 Auth Hook: Registration error:',
                error
            );
            return {
                success: false,
                error: 'Network error. Please try again.',
            };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            localStorage.setItem(
                'userData',
                JSON.stringify(updatedUser)
            );
        }
    };

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error(
            'useAuth must be used within an AuthProvider'
        );
    }
    return context;
}
