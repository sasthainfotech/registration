'use client';

import React from 'react';
import PaymentButton from '@/components/ui/payment-button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    IndianRupee,
    CreditCard,
    Shield,
    CheckCircle,
} from 'lucide-react';

export default function RazorpayDemoPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Razorpay Payment Demo
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Test the Razorpay payment
                        integration with your configured API
                        keys. This demo will process a test
                        payment of ₹500 (50000 paise).
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Payment Demo Card */}
                    <Card className="overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                            <CardTitle className="flex items-center">
                                <CreditCard className="w-5 h-5 mr-2" />
                                Test Payment
                            </CardTitle>
                            <CardDescription className="text-green-100">
                                Click the button below to
                                test Razorpay integration
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="text-center space-y-6">
                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="flex items-center justify-center mb-2">
                                        <IndianRupee className="w-6 h-6 text-green-600 mr-2" />
                                        <span className="text-2xl font-bold text-green-600">
                                            500
                                        </span>
                                    </div>
                                    <p className="text-sm text-green-700">
                                        Test Amount (INR)
                                    </p>
                                </div>

                                <PaymentButton />

                                <div className="text-xs text-gray-500">
                                    <p>
                                        This is a test
                                        payment using
                                        Razorpay test keys.
                                    </p>
                                    <p>
                                        No real money will
                                        be charged.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Configuration Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Shield className="w-5 h-5 mr-2" />
                                Configuration Status
                            </CardTitle>
                            <CardDescription>
                                Your Razorpay integration
                                setup
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <span className="text-sm font-medium">
                                        API Key ID:
                                    </span>
                                    <Badge
                                        variant="secondary"
                                        className="font-mono text-xs"
                                    >
                                        {process.env
                                            .NEXT_PUBLIC_RAZORPAY_KEY_ID
                                            ? 'Configured'
                                            : 'Missing'}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <span className="text-sm font-medium">
                                        API Secret:
                                    </span>
                                    <Badge
                                        variant="secondary"
                                        className="font-mono text-xs"
                                    >
                                        {process.env
                                            .RAZORPAY_KEY_SECRET
                                            ? 'Configured'
                                            : 'Missing'}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <span className="text-sm font-medium">
                                        Environment:
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className="text-green-600"
                                    >
                                        Test Mode
                                    </Badge>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-3 flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                    What&apos;s Included
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        Order creation API
                                        endpoint
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        Payment verification
                                        endpoint
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        Razorpay checkout
                                        integration
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        Success page with
                                        ticket details
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        Error handling and
                                        validation
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Instructions */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>How to Test</CardTitle>
                        <CardDescription>
                            Follow these steps to test the
                            payment integration
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ol className="space-y-3 text-sm">
                            <li className="flex items-start">
                                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">
                                    1
                                </span>
                                <span>
                                    Click the &quot;Pay
                                    Now&quot; button above
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">
                                    2
                                </span>
                                <span>
                                    The Razorpay checkout
                                    modal will open
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">
                                    3
                                </span>
                                <span>
                                    Use test card details:
                                    Card Number: 4111 1111
                                    1111 1111, Expiry: Any
                                    future date, CVV: Any 3
                                    digits
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">
                                    4
                                </span>
                                <span>
                                    Complete the payment to
                                    see the success page
                                </span>
                            </li>
                        </ol>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
