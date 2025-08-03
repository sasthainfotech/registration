import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const status = db.users.getStatus();
        const allUsers = db.users.getAll();

        return NextResponse.json({
            success: true,
            status,
            users: allUsers,
            message:
                'Database status retrieved successfully',
        });
    } catch (error) {
        console.error('Database status error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to get database status',
            },
            { status: 500 }
        );
    }
}
