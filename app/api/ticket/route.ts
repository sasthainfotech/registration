import {
    type NextRequest,
    NextResponse,
} from 'next/server';
import {
    calculateTicketPricing,
    getTicketDetails,
} from '@/lib/utils/payment';
import { TicketType } from '@/lib/config/app-data';

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();
        const {
            ticketType,
            userCategory,
            country,
            userId,
            userEmail,
            userName,
        } = body;

        // Validate required fields
        if (
            !ticketType ||
            !userCategory ||
            !country ||
            !userId ||
            !userEmail ||
            !userName
        ) {
            console.error('Missing required fields:', {
                ticketType,
                userCategory,
                country,
                userId,
                userEmail,
                userName,
            });
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields: ticketType, userCategory, country, userId, userEmail, userName',
                },
                { status: 400 }
            );
        }

        // Validate ticket type
        const validTicketTypes: TicketType[] = [
            'conference-day-1',
            'conference-day-2',
            'conference-day-3',
            'conference-all-days',
            'tutorials-day-1',
            'tutorials-day-1-2',
            'main-conference-tutorials',
        ];
        if (
            !validTicketTypes.includes(
                ticketType as TicketType
            )
        ) {
            console.error(
                'Invalid ticket type:',
                ticketType
            );
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid ticket type. Must be one of: conference, tutorial, both',
                },
                { status: 400 }
            );
        }

        // Validate user category
        if (
            !['indian', 'international'].includes(
                userCategory
            )
        ) {
            console.error(
                'Invalid user category:',
                userCategory
            );
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid user category. Must be indian or international',
                },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
            console.error(
                'Invalid email format:',
                userEmail
            );
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid email format',
                },
                { status: 400 }
            );
        }

        // Calculate pricing
        const pricing = calculateTicketPricing(
            ticketType as TicketType,
            country
        );
        const ticketDetails = getTicketDetails(
            ticketType as TicketType
        );

        // Validate pricing
        if (
            !pricing.totalPrice ||
            pricing.totalPrice <= 0
        ) {
            console.error(
                'Invalid pricing calculated:',
                pricing
            );
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unable to calculate ticket pricing',
                },
                { status: 500 }
            );
        }

        // Generate unique identifiers
        const timestamp = Date.now();
        // Generate a random ID for the ticket
        Math.random().toString(36).substring(2, 8);
        const ticketId = `TKT-${ticketType.toUpperCase()}-${userId.substring(
            0,
            8
        )}-${timestamp}`;
        const confirmationNumber = `VLSID-${ticketType.toUpperCase()}-${timestamp
            .toString()
            .slice(-6)}`;

        // Determine payment gateway (Stripe for both)
        const paymentGateway = 'Stripe';

        console.log('Creating ticket:', {
            ticketId,
            confirmationNumber,
            userCategory,
            paymentGateway,
            pricing: {
                basePrice: pricing.basePrice,
                gstAmount: pricing.gstAmount,
                totalPrice: pricing.totalPrice,
                currency: pricing.currency,
            },
            timestamp: new Date().toISOString(),
        });

        // Create ticket record (in a real app, this would be in a database)
        const ticketRecord = {
            id: ticketId,
            userId,
            userEmail,
            userName,
            eventId: 'vlsid-2024',
            type: ticketType,
            status: 'pending',
            paymentStatus: 'pending',
            confirmationNumber,
            basePrice: pricing.basePrice,
            gstAmount: pricing.gstAmount,
            gstRate: pricing.gstRate,
            totalPrice: pricing.totalPrice,
            currency: pricing.currency,
            userCategory,
            paymentGateway: 'stripe',
            purchaseDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Create Stripe payment intent for the ticket
        const stripeResponse = await fetch(
            `${request.nextUrl.origin}/api/stripe`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ticketType,
                    userCategory,
                    country,
                    paymentMethod: 'stripe-card', // Default to card
                    userId,
                    userEmail,
                }),
            }
        );

        const stripeData = await stripeResponse.json();

        if (!stripeData.success) {
            console.error(
                'Failed to create Stripe payment intent:',
                stripeData.error
            );
            return NextResponse.json(
                {
                    success: false,
                    error: 'Failed to initialize payment. Please try again.',
                    details: stripeData.error,
                },
                { status: 500 }
            );
        }

        console.log('Ticket created successfully:', {
            ticketId: ticketRecord.id,
            paymentIntentId: stripeData.paymentIntentId,
            currency: pricing.currency,
            amount: pricing.totalPrice,
        });

        // Simulate database save
        // In a real application, you would save the ticket to your database here
        // await database.tickets.create(ticketRecord);

        // Prepare response
        const response = {
            success: true,
            ticket: {
                id: ticketRecord.id,
                confirmationNumber:
                    ticketRecord.confirmationNumber,
                type: ticketRecord.type,
                status: ticketRecord.status,
                paymentStatus: ticketRecord.paymentStatus,
                userCategory: ticketRecord.userCategory,
                currency: ticketRecord.currency,
            },
            payment: {
                paymentIntentId: stripeData.paymentIntentId,
                clientSecret: stripeData.clientSecret,
                amount: stripeData.amount,
                currency: stripeData.currency,
                paymentGateway: 'stripe',
            },
            pricing: {
                basePrice: pricing.basePrice,
                gstAmount: pricing.gstAmount,
                gstRate: pricing.gstRate,
                totalPrice: pricing.totalPrice,
                currency: pricing.currency,
            },
            ticketDetails: {
                name: ticketDetails.name,
                description: ticketDetails.description,
                duration: ticketDetails.duration,
                features: ticketDetails.features,
            },
            metadata: stripeData.metadata,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Ticket creation error:', error);

        // Handle specific error types
        if (error instanceof Error) {
            // Network errors
            if (
                error.message.includes('ECONNREFUSED') ||
                error.message.includes('ENOTFOUND')
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Network error: Unable to process ticket creation',
                        details:
                            'Please check your internet connection and try again',
                    },
                    { status: 503 }
                );
            }

            // JSON parsing errors
            if (error instanceof SyntaxError) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Invalid request format',
                        details:
                            'Request body must be valid JSON',
                    },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                {
                    success: false,
                    error: 'Ticket creation failed',
                    details: error.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error',
                details: 'An unexpected error occurred',
            },
            { status: 500 }
        );
    }
}

// GET endpoint to fetch ticket details
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const ticketId = searchParams.get('ticketId');
        const confirmationNumber = searchParams.get(
            'confirmationNumber'
        );

        if (!ticketId && !confirmationNumber) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Either ticket ID or confirmation number is required',
                },
                { status: 400 }
            );
        }

        console.log('Fetching ticket details:', {
            ticketId,
            confirmationNumber,
        });

        // In a real implementation, you would query your database
        // For now, we'll return a mock ticket
        const mockTicket = {
            id: ticketId || 'TKT-BOTH-12345678-1234567890',
            confirmationNumber:
                confirmationNumber || 'VLSID-BOTH-123456',
            type: 'both',
            status: 'confirmed',
            paymentStatus: 'completed',
            userCategory: 'indian',
            currency: 'INR',
            basePrice: 7500,
            gstAmount: 1350,
            totalPrice: 8850,
            purchaseDate: new Date().toISOString(),
            event: {
                name: 'vlsid',
                date: '2026-01-03 to 2026-01-07',
                venue: 'vlsid Convention Center, Bangalore',
            },
        };

        return NextResponse.json({
            success: true,
            ticket: mockTicket,
        });
    } catch (error) {
        console.error('Error fetching ticket:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch ticket details',
            },
            { status: 500 }
        );
    }
}
