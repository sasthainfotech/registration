'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { createOrderId } from '@/lib/utils/createOrderId';

import {
    RazorpayResponse,
    RazorpayOptions,
} from '@/lib/types';

export default function PaymentButton() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handlePayment = async () => {
        setIsLoading(true);
        const price = 500; // Amount in rupees

        try {
            const orderId: string = await createOrderId(
                price,
                'INR'
            );

            const options: RazorpayOptions = {
                key:
                    process.env
                        .NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
                amount: price * 100, // Amount in paise
                currency: 'INR',
                name: 'Event Management App',
                description: 'Payment for your order',
                order_id: orderId,
                handler: async function (
                    response: RazorpayResponse
                ) {
                    try {
                        const paymentResponse = await fetch(
                            '/api/razorpay/verify',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type':
                                        'application/json',
                                },
                                body: JSON.stringify({
                                    razorpay_order_id:
                                        orderId,
                                    razorpay_payment_id:
                                        response.razorpay_payment_id,
                                    razorpay_signature:
                                        response.razorpay_signature,
                                }),
                            }
                        );

                        const result =
                            await paymentResponse.json();

                        if (result.success) {
                            alert('Payment Successful!');
                            router.push('/payment-success');
                        } else {
                            alert(
                                'Payment verification failed. Please contact support.'
                            );
                        }
                    } catch (error) {
                        alert(
                            'Payment verification failed. Please contact support.'
                        );
                        console.error(error);
                    }
                },
                prefill: {
                    name: 'Test User',
                    email: 'testuser@example.com',
                    contact: '9999999999',
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on(
                'payment.failed',
                function (response: {
                    error: { description: string };
                }) {
                    alert('Payment failed');
                    console.error(response.error);
                }
            );
            razorpay.open();
        } catch (error) {
            alert('Payment failed. Please try again.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                className="p-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
                onClick={handlePayment}
                disabled={isLoading}
            >
                {isLoading
                    ? 'Processing...'
                    : 'Pay Now ₹500'}
            </button>
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
        </>
    );
}
