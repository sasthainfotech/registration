import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password = 'test123' } = body;

        if (!email) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Email is required',
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
                    error: 'User already exists',
                    user: {
                        id: existingUser.id,
                        email: existingUser.email,
                    },
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

        // Add test user
        const testUser = db.users.addTestUser(
            email,
            hashedPassword
        );

        // Return user data without password
        const {
            password: _password,
            ...userWithoutPassword
        } = testUser;

        return NextResponse.json({
            success: true,
            message: 'Test user created successfully',
            user: userWithoutPassword,
            credentials: {
                email,
                password: 'test123', // Return the plain password for testing
            },
        });
    } catch (error) {
        console.error('Add test user error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create test user',
            },
            { status: 500 }
        );
    }
}
