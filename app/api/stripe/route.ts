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
            paymentMethod,
            userId,
            userEmail,
        } = body;

        // Validate required fields
        if (
            !ticketType ||
            !userCategory ||
            !country ||
            !paymentMethod ||
            !userId ||
            !userEmail
        ) {
            console.error('Missing required fields:', {
                ticketType,
                userCategory,
                country,
                paymentMethod,
                userId,
                userEmail,
            });
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields: ticketType, userCategory, country, paymentMethod, userId, userEmail',
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

        // Calculate pricing with appropriate currency and GST
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

        // Create unique payment intent ID
        const timestamp = Date.now();
        const randomId = Math.random()
            .toString(36)
            .substring(2, 8);
        const paymentIntentId = `pi_vlsid_${ticketType}_${userId.substring(
            0,
            8
        )}_${timestamp}_${randomId}`;

        // Convert amount to smallest currency unit (paise for INR, cents for USD)
        const stripeAmount =
            pricing.currency === 'INR'
                ? pricing.totalPrice * 100 // Convert to paise
                : Math.round(pricing.totalPrice * 100); // Convert to cents

        console.log('Creating Stripe payment intent:', {
            paymentIntentId,
            amount: stripeAmount,
            currency: pricing.currency.toLowerCase(),
            paymentMethod,
            userCategory,
        });

        // Here you would create an actual Stripe Payment Intent
        // For now, we'll simulate the response
        const mockPaymentIntent = {
            id: paymentIntentId,
            amount: stripeAmount,
            currency: pricing.currency.toLowerCase(),
            status: 'requires_payment_method',
            client_secret: `${paymentIntentId}_secret_mock`,
            metadata: {
                ticketType,
                userId,
                userEmail,
                userCategory,
                basePrice: pricing.basePrice.toString(),
                gstAmount: pricing.gstAmount.toString(),
                gstRate: pricing.gstRate.toString(),
                ticketName: ticketDetails.name,
                eventName: 'vlsid',
                timestamp: new Date().toISOString(),
            },
        };

        // In a real implementation, you would use:
        // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        // const paymentIntent = await stripe.paymentIntents.create({
        //     amount: stripeAmount,
        //     currency: pricing.currency.toLowerCase(),
        //     payment_method_types: ['card'],
        //     metadata: mockPaymentIntent.metadata,
        // });

        console.log(
            'Stripe payment intent created successfully:',
            {
                paymentIntentId: mockPaymentIntent.id,
                amount: mockPaymentIntent.amount,
                currency: mockPaymentIntent.currency,
            }
        );

        // Return payment intent details for frontend
        const response = {
            success: true,
            paymentIntentId: mockPaymentIntent.id,
            amount: mockPaymentIntent.amount,
            currency: mockPaymentIntent.currency,
            clientSecret: mockPaymentIntent.client_secret,
            paymentMethod,
            pricing: {
                basePrice: pricing.basePrice,
                gstAmount: pricing.gstAmount,
                gstRate: pricing.gstRate,
                totalPrice: pricing.totalPrice,
                currency: pricing.currency,
            },
            ticket: {
                type: ticketType,
                name: ticketDetails.name,
                description: ticketDetails.description,
                duration: ticketDetails.duration,
            },
            metadata: mockPaymentIntent.metadata,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error(
            'Stripe payment intent creation error:',
            error
        );

        // Handle specific Stripe errors
        if (error instanceof Error) {
            // Check for network errors
            if (
                error.message.includes('ECONNREFUSED') ||
                error.message.includes('ENOTFOUND')
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Network error: Unable to connect to payment service',
                        details:
                            'Please check your internet connection and try again',
                    },
                    { status: 503 }
                );
            }

            // Check for authentication errors
            if (
                error.message.includes('authentication') ||
                error.message.includes('unauthorized')
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Payment service configuration error',
                        details: 'Please contact support',
                    },
                    { status: 500 }
                );
            }

            return NextResponse.json(
                {
                    success: false,
                    error: 'Failed to create payment intent',
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

// GET endpoint to fetch payment intent details
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const paymentIntentId = searchParams.get(
            'paymentIntentId'
        );

        if (!paymentIntentId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Payment Intent ID is required',
                },
                { status: 400 }
            );
        }

        // Validate payment intent ID format
        if (!paymentIntentId.startsWith('pi_')) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid payment intent ID format',
                },
                { status: 400 }
            );
        }

        console.log(
            'Fetching Stripe payment intent:',
            paymentIntentId
        );

        // In a real implementation, you would use:
        // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        // const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        // Mock response for demonstration
        const mockPaymentIntent = {
            id: paymentIntentId,
            status: 'succeeded',
            amount: 850000, // Example amount in smallest currency unit
            currency: 'inr',
            created: Math.floor(Date.now() / 1000),
        };

        console.log(
            'Payment intent fetched successfully:',
            {
                paymentIntentId: mockPaymentIntent.id,
                status: mockPaymentIntent.status,
                amount: mockPaymentIntent.amount,
            }
        );

        return NextResponse.json({
            success: true,
            paymentIntent: mockPaymentIntent,
        });
    } catch (error) {
        console.error(
            'Error fetching Stripe payment intent:',
            error
        );

        if (
            error instanceof Error &&
            error.message.includes('not found')
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Payment intent not found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch payment intent details',
            },
            { status: 500 }
        );
    }
}
