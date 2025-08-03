import {
    type NextRequest,
    NextResponse,
} from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();
        const {
            paymentIntentId,
            clientSecret,
            userId,
            userEmail,
            ticketType,
            userCategory,
        } = body;

        // Validate required fields
        if (
            !paymentIntentId ||
            !clientSecret ||
            !userId ||
            !userEmail ||
            !ticketType ||
            !userCategory
        ) {
            console.error(
                'Missing required fields for payment verification:',
                {
                    paymentIntentId,
                    clientSecret,
                    userId,
                    userEmail,
                    ticketType,
                    userCategory,
                }
            );
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields: paymentIntentId, clientSecret, userId, userEmail, ticketType, userCategory',
                },
                { status: 400 }
            );
        }

        // Validate payment intent ID format
        if (!paymentIntentId.startsWith('pi_')) {
            console.error(
                'Invalid payment intent ID format:',
                paymentIntentId
            );
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid payment intent ID format',
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

        console.log(
            'Starting Stripe payment verification:',
            {
                paymentIntentId,
                userId,
                userEmail,
                ticketType,
                userCategory,
                timestamp: new Date().toISOString(),
            }
        );

        // In a real implementation, you would verify the payment with Stripe:
        // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        // const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        // For now, we'll simulate verification
        const mockVerification = {
            id: paymentIntentId,
            status: 'succeeded',
            amount:
                userCategory === 'indian' ? 885000 : 9900, // Example amounts in smallest currency units
            currency:
                userCategory === 'indian' ? 'inr' : 'usd',
            metadata: {
                ticketType,
                userId,
                userEmail,
                userCategory,
            },
        };

        // Validate payment status
        if (mockVerification.status !== 'succeeded') {
            console.error('Payment not succeeded:', {
                paymentIntentId,
                status: mockVerification.status,
            });
            return NextResponse.json(
                {
                    success: false,
                    error: 'Payment not completed successfully',
                    paymentStatus: mockVerification.status,
                },
                { status: 400 }
            );
        }

        // Generate ticket confirmation details
        const confirmationNumber = `VLSID-${ticketType.toUpperCase()}-${Date.now()
            .toString()
            .slice(-6)}`;
        const ticketId = `TKT-${userId.substring(
            0,
            8
        )}-${Date.now()}`;

        console.log('Payment verified successfully:', {
            paymentIntentId,
            confirmationNumber,
            ticketId,
            amount: mockVerification.amount,
            currency: mockVerification.currency,
        });

        // Here you would typically:
        // 1. Update database with payment confirmation
        // 2. Generate ticket/receipt
        // 3. Send confirmation email
        // 4. Update inventory/availability
        // 5. Log for analytics

        const confirmationDetails = {
            confirmationNumber,
            ticketId,
            paymentIntentId,
            userEmail,
            ticketType,
            userCategory,
            amount: {
                value: mockVerification.amount,
                currency: mockVerification.currency,
                formatted:
                    userCategory === 'indian'
                        ? `₹${(
                              mockVerification.amount / 100
                          ).toLocaleString()}`
                        : `$${(
                              mockVerification.amount / 100
                          ).toFixed(2)}`,
            },
            event: {
                name: 'vlsid',
                date: '2026-01-03 to 2026-01-07',
                venue: 'vlsid Convention Center, Bangalore',
            },
            ticket: {
                type: ticketType,
                category: userCategory,
            },
            verificationTimestamp: new Date().toISOString(),
        };

        // Simulate post-payment actions
        console.log('Post-payment actions initiated:', {
            confirmationNumber,
            ticketId,
            emailSent: true,
            inventoryUpdated: true,
            analyticsLogged: true,
        });

        // Here you would trigger:
        // 1. Email confirmation service
        // 2. Database updates
        // 3. Analytics tracking
        // 4. Inventory management

        const response = {
            success: true,
            paymentVerified: true,
            confirmation: confirmationDetails,
            message:
                'Payment verified successfully and ticket confirmed',
        };

        console.log(
            'Payment verification completed successfully:',
            {
                paymentIntentId,
                confirmationNumber,
                processingTime: 'Instant',
            }
        );

        return NextResponse.json(response);
    } catch (error) {
        console.error('Payment verification error:', error);

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
                        error: 'Network error: Unable to verify payment',
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
                        error: 'Payment verification service configuration error',
                        details: 'Please contact support',
                    },
                    { status: 500 }
                );
            }

            // Check for payment not found errors
            if (
                error.message.includes('not found') ||
                error.message.includes(
                    'No such payment_intent'
                )
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Payment not found',
                        details:
                            'The payment intent could not be found',
                    },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                {
                    success: false,
                    error: 'Payment verification failed',
                    details: error.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error during payment verification',
                details: 'An unexpected error occurred',
            },
            { status: 500 }
        );
    }
}

// GET endpoint to fetch payment verification status
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const paymentIntentId = searchParams.get(
            'paymentIntentId'
        );
        const confirmationNumber = searchParams.get(
            'confirmationNumber'
        );

        if (!paymentIntentId && !confirmationNumber) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Either payment intent ID or confirmation number is required',
                },
                { status: 400 }
            );
        }

        console.log(
            'Fetching payment verification status:',
            {
                paymentIntentId,
                confirmationNumber,
            }
        );

        // In a real implementation, you would query your database
        // For now, we'll return a mock status
        const mockStatus = {
            verified: true,
            paymentIntentId:
                paymentIntentId || 'pi_example',
            confirmationNumber:
                confirmationNumber || 'VLSID-BOTH-123456',
            status: 'completed',
            verifiedAt: new Date().toISOString(),
        };

        return NextResponse.json({
            success: true,
            verificationStatus: mockStatus,
        });
    } catch (error) {
        console.error(
            'Error fetching payment verification status:',
            error
        );
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch verification status',
            },
            { status: 500 }
        );
    }
}
