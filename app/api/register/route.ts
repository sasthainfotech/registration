import {
    type NextRequest,
    NextResponse,
} from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            firstName,
            lastName,
            email,
            phone,
            country,
            password,
        } = body;

        // Validate required fields
        if (
            !firstName ||
            !lastName ||
            !email ||
            !phone ||
            !country ||
            !password
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'All fields are required',
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

        // Validate password strength
        if (password.length < 6) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Password must be at least 6 characters long',
                },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = db.users.findByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'An account with this email already exists. Please log in instead.',
                    code: 'USER_EXISTS',
                    suggestion: 'login',
                },
                { status: 409 }
            );
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(
            password,
            saltRounds
        );

        // Create user using database module
        console.log(
            '📝 Register API: Creating user with email:',
            email
        );
        const user = db.users.create({
            firstName,
            lastName,
            email,
            phone,
            country,
            password: hashedPassword,
        });
        console.log(
            '✅ Register API: User created successfully:',
            { id: user.id, email: user.email }
        );

        console.log('User registered successfully:', {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            country: user.country,
            createdAt: user.createdAt,
        });

        // Generate JWT token for auto-login
        const JWT_SECRET =
            process.env.JWT_SECRET ||
            'your-secret-key-change-in-production';
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

        // Return user data without password and token
        const {
            password: _password,
            ...userWithoutPassword
        } = user;
        return NextResponse.json({
            success: true,
            message: 'User registered successfully',
            user: userWithoutPassword,
            token,
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error',
            },
            { status: 500 }
        );
    }
}
