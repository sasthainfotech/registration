'use client';

import React, { useState } from 'react';
import Script from 'next/script';

import {
    RazorpayResponse,
    RazorpayOptions,
} from '@/lib/types';

export default function PaymentButton() {
    const [isprocessing, setIsprocessing] = useState(false);

    const handlePayment = async () => {
        setIsprocessing(true);

        // Step 1: Check if the Razorpay object is available
        console.log(window.Razorpay);
        if (typeof window.Razorpay === 'undefined') {
            console.error('Razorpay SDK not loaded.');
            alert(
                'Razorpay SDK not loaded. Please try again.'
            );
            setIsprocessing(false);
            return;
        }

        try {
            const res = await fetch('/api/razorpay/order', {
                method: 'POST',
            });
            const data = await res.json();

            const options: RazorpayOptions = {
                key: 'rzp_live_qzEA66nHs1SIL1',
                amount: 600000,
                currency: 'INR',
                name: 'Test Payment',
                description: 'Test Payment',
                order_id: data.orderId,
                handler: function (
                    response: RazorpayResponse
                ) {
                    console.log(
                        'Payment successful',
                        response
                    );
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
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error('Error creating order:', error);
        } finally {
            setIsprocessing(false);
        }
    };

    return (
        <div>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <button
                onClick={handlePayment}
                disabled={isprocessing}
                className="p-4 bg-blue-500 text-white rounded-md"
            >
                {isprocessing ? 'Processing...' : 'Pay Now'}
            </button>
        </div>
    );
}
