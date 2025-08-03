import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request: NextRequest) {
    try {
        let amount = 50000; // Default amount
        let currency = 'INR'; // Default currency
        let ticketType = 'main-conference-tutorials';
        let userCategory = 'international';
        let userId = 'user_' + Date.now();
        let userEmail = 'user@example.com';

        // Try to parse body if it exists
        try {
            const body = await request.json();
            amount = body.amount || amount;
            currency = body.currency || currency;
            ticketType = body.ticketType || ticketType;
            userCategory =
                body.userCategory || userCategory;
            userId = body.userId || userId;
            userEmail = body.userEmail || userEmail;
        } catch (_error) {
            // If no body or invalid JSON, use defaults (like PaymentBtn.tsx)
            console.log(
                'No request body, using default values'
            );
        }

        // Convert amount to smallest currency unit (paise for INR, cents for USD)
        const amountInSmallestUnit = Math.round(
            amount * 100
        );

        const order = await razorpay.orders.create({
            amount: amountInSmallestUnit,
            currency: currency,
            receipt: `rcp_${Date.now()}`, // Shortened receipt to be under 40 chars
            notes: {
                ticketType,
                userCategory,
                userId,
                userEmail,
            },
        });

        console.log('Razorpay order created:', {
            orderId: order.id,
            amount: amountInSmallestUnit,
            currency,
            ticketType,
            userCategory,
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error(
            'Error creating Razorpay order:',
            error
        );
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}
