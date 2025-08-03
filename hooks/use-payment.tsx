'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPaymentSummary } from '@/lib/utils/payment';
import { TicketType } from '@/lib/config/app-data';
import { useAuth } from './use-auth';

interface IEEEMembershipData {
    isMember: boolean;
    membershipLevel?:
        | 'student'
        | 'professional'
        | 'senior'
        | 'fellow';
    membershipId?: string;
    memberSince?: string;
    membershipStatus?: 'active' | 'expired' | 'suspended';
    discountEligible?: boolean;
    discountPercentage?: number;
}

interface PaymentState {
    isLoading: boolean;
    paymentMethod: string;
    paymentSummary: any;
}

interface UsePaymentProps {
    ticketType: TicketType;
    userCategory: 'indian' | 'international';
    country: 'IN' | 'INTL';
    ieeeMembershipData?: IEEEMembershipData | null;
    userData?: {
        name: string;
        email: string;
        contact: string;
    };
    finalAmount?: number; // Add support for discounted amount
}

interface UsePaymentReturn extends PaymentState {
    setPaymentMethod: (method: string) => void;
    processPayment: () => Promise<void>;
    resetPaymentState: () => void;
}

export const usePayment = ({
    ticketType,
    userCategory,
    country,
    ieeeMembershipData,
    userData,
    finalAmount,
}: UsePaymentProps): UsePaymentReturn => {
    const [state, setState] = useState<PaymentState>({
        isLoading: false,
        paymentMethod: '',
        paymentSummary: null,
    });

    // Initialize payment summary
    useEffect(() => {
        if (ticketType && country) {
            console.log('Creating payment summary for:', {
                ticketType,
                country,
                ieeeMembershipData,
            });

            // Check if ticket type is valid
            const validTicketTypes = [
                'conference-day-1',
                'conference-day-2',
                'conference-day-3',
                'conference-all-days',
                'tutorials-day-1',
                'tutorials-day-1-2',
                'main-conference-tutorials',
            ];

            if (!validTicketTypes.includes(ticketType)) {
                console.error(
                    'Invalid ticket type:',
                    ticketType
                );
                return;
            }

            const summary = createPaymentSummary(
                ticketType,
                country,
                ieeeMembershipData
            );

            console.log(
                'Payment summary created:',
                summary
            );

            setState((prev) => ({
                ...prev,
                paymentSummary: summary,
            }));
        }
    }, [ticketType, country, ieeeMembershipData]);

    // Process payment using Razorpay
    const processPayment = useCallback(async () => {
        try {
            setState((prev) => ({
                ...prev,
                isLoading: true,
            }));

            // Check if Razorpay is available
            if (typeof window.Razorpay === 'undefined') {
                console.error('Razorpay SDK not loaded.');
                alert(
                    'Razorpay SDK not loaded. Please try again.'
                );
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                }));
                return;
            }

            // Use provided user data or fallback
            const user = userData || {
                name: 'Test User',
                email: 'testuser@example.com',
                contact: '9999999999',
            };

            // Use finalAmount (discounted) if provided, otherwise use original amount
            const calculatedAmount =
                finalAmount ||
                state.paymentSummary?.pricing?.totalPrice;
            const amount =
                calculatedAmount && calculatedAmount > 0
                    ? calculatedAmount
                    : 500; // Fallback to 500
            const currency =
                userCategory === 'indian' ? 'INR' : 'USD';

            console.log('Creating order with:', {
                calculatedAmount,
                fallbackAmount: amount,
                currency,
                ticketType,
                userCategory,
                userEmail: user.email,
                paymentSummary: state.paymentSummary,
            });

            // Create Razorpay order
            const orderResponse = await fetch(
                '/api/razorpay/order',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount,
                        currency,
                        ticketType,
                        userCategory,
                        userId: crypto.randomUUID(),
                        userEmail: user.email,
                    }),
                }
            );

            if (!orderResponse.ok) {
                const errorData =
                    await orderResponse.json();
                throw new Error(
                    `Order creation failed: ${
                        errorData.error ||
                        orderResponse.statusText
                    }`
                );
            }

            const orderData = await orderResponse.json();

            console.log('Order response:', orderData);

            if (!orderData.id) {
                throw new Error(
                    'Failed to create Razorpay order - no order ID returned'
                );
            }

            console.log('Processing Razorpay payment:', {
                ticket: ticketType,
                currency,
                amount,
                paymentMethod: state.paymentMethod,
                orderId: orderData.id,
            });

            // Configure Razorpay options
            const options = {
                key: 'rzp_live_qzEA66nHs1SIL1',
                amount: amount * 100, // Convert to smallest currency unit
                currency,
                name: 'VLSID Conference',
                description: `${ticketType} - ${userCategory} pricing`,
                order_id: orderData.id,
                handler: function (response: any) {
                    console.log(
                        'Payment successful',
                        response
                    );
                    // Redirect to success page
                    window.location.href =
                        '/payment-success';
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.contact,
                },
                theme: {
                    color: '#3399cc',
                },
                modal: {
                    ondismiss: function () {
                        setState((prev) => ({
                            ...prev,
                            isLoading: false,
                        }));
                    },
                },
            };

            // Open Razorpay modal
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error(
                'Payment processing error:',
                error
            );
            let errorMessage =
                'Payment failed. Please try again.';

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            alert(errorMessage);
            setState((prev) => ({
                ...prev,
                isLoading: false,
            }));
        }
    }, [
        ticketType,
        userCategory,
        country,
        state.paymentMethod,
        state.paymentSummary,
        userData,
        finalAmount,
    ]);

    // Utility functions
    const setPaymentMethod = useCallback(
        (method: string) => {
            setState((prev) => ({
                ...prev,
                paymentMethod: method,
            }));
        },
        []
    );

    const resetPaymentState = useCallback(() => {
        setState((prev) => ({
            ...prev,
            isLoading: false,
            paymentMethod: '',
        }));
    }, []);

    return {
        ...state,
        setPaymentMethod,
        processPayment,
        resetPaymentState,
    };
};
