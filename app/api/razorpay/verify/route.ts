import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Lazy initialization of Razorpay client
function getRazorpayClient() {
    return new Razorpay({
        key_id: 'rzp_live_qzEA66nHs1SIL1',
        key_secret: 'YcTEEP6hLeKbsCVR77MRGvRS',
    });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            ticketType,
            userCategory,
            userId,
            userEmail,
        } = body;

        // Validate required fields
        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return NextResponse.json(
                {
                    error: 'Missing required payment verification fields',
                },
                { status: 400 }
            );
        }

        // Verify the payment signature
        const text = `${razorpay_order_id}|${razorpay_payment_id}`;
        const signature = crypto
            .createHmac(
                'sha256',
                'YcTEEP6hLeKbsCVR77MRGvRS'
            )
            .update(text)
            .digest('hex');

        if (signature !== razorpay_signature) {
            console.error(
                'Payment signature verification failed'
            );
            return NextResponse.json(
                { error: 'Payment verification failed' },
                { status: 400 }
            );
        }

        // Initialize Razorpay client only when needed
        const razorpay = getRazorpayClient();

        // Fetch payment details from Razorpay
        const payment = await razorpay.payments.fetch(
            razorpay_payment_id
        );
        await razorpay.orders.fetch(razorpay_order_id);

        console.log('Payment verified successfully:', {
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
        });

        // Generate ticket confirmation details
        const confirmationNumber = `VLSID-${
            ticketType?.toUpperCase() || 'TICKET'
        }-${Date.now().toString().slice(-6)}`;
        const ticketId = `TKT-${
            userId?.substring(0, 8) || 'USER'
        }-${Date.now()}`;

        const confirmationDetails = {
            confirmationNumber,
            ticketId,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            userEmail: userEmail || 'user@example.com',
            ticketType:
                ticketType || 'main-conference-tutorials',
            userCategory: userCategory || 'international',
            amount: {
                value: payment.amount,
                currency: payment.currency,
                formatted:
                    payment.currency === 'INR'
                        ? `₹${(
                              (payment.amount as number) /
                              100
                          ).toLocaleString()}`
                        : `$${(
                              (payment.amount as number) /
                              100
                          ).toFixed(2)}`,
            },
            event: {
                name: 'VLSID Conference',
                date: '2026-01-03 to 2026-01-07',
                venue: 'VLSID Convention Center, Bangalore',
            },
            ticket: {
                type:
                    ticketType ||
                    'main-conference-tutorials',
                category: userCategory || 'international',
            },
            verificationTimestamp: new Date().toISOString(),
        };

        return NextResponse.json({
            success: true,
            paymentVerified: true,
            confirmation: confirmationDetails,
            message:
                'Payment verified successfully and ticket confirmed',
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Payment verification failed',
                details:
                    error instanceof Error
                        ? error.message
                        : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

// GET endpoint to fetch payment verification status
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const paymentId = searchParams.get('paymentId');
        const orderId = searchParams.get('orderId');

        if (!paymentId && !orderId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Either payment ID or order ID is required',
                },
                { status: 400 }
            );
        }

        // In a real implementation, you would query your database
        // For now, we'll return a mock status
        const mockStatus = {
            verified: true,
            paymentId: paymentId || 'pay_example',
            orderId: orderId || 'order_example',
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
