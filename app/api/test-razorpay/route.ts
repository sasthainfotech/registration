import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: 'rzp_live_qzEA66nHs1SIL1',
    key_secret: 'YcTEEP6hLeKbsCVR77MRGvRS',
});

export async function GET() {
    try {
        console.log('Testing Razorpay connection...');

        // Try to create a simple order
        const order = await razorpay.orders.create({
            amount: 50000, // 500 INR in paise
            currency: 'INR',
            receipt: `test_${Date.now()}`, // Shortened receipt
        });

        console.log(
            'Test order created successfully:',
            order
        );

        return NextResponse.json({
            success: true,
            message: 'Razorpay is working correctly',
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
            },
        });
    } catch (error) {
        console.error('Razorpay test failed:', error);
        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
