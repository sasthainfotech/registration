import {
    type NextRequest,
    NextResponse,
} from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

const JWT_SECRET =
    process.env.JWT_SECRET ||
    'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Email and password are required',
                },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid email format',
                },
                { status: 400 }
            );
        }

        // Find user by email using database module
        console.log(
            '🔐 Login API: Searching for user with email:',
            email
        );
        const user = db.users.findByEmail(email);
        if (!user) {
            console.log(
                '❌ Login API: User not found for email:',
                email
            );
            return NextResponse.json(
                {
                    success: false,
                    error: 'User not found. Please register first.',
                    code: 'USER_NOT_FOUND',
                    suggestion: 'register',
                },
                { status: 404 }
            );
        }
        console.log('✅ Login API: User found:', {
            id: user.id,
            email: user.email,
        });

        // Verify password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );
        if (!isPasswordValid) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid email or password',
                },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('User logged in successfully:', {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        });

        // Return user data and token (without password)
        const {
            password: _password,
            ...userWithoutPassword
        } = user;
        return NextResponse.json({
            success: true,
            message: 'Login successful',
            user: userWithoutPassword,
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error',
            },
            { status: 500 }
        );
    }
}
