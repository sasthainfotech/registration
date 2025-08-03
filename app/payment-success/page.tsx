'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    CheckCircle,
    Download,
    Mail,
    Calendar,
    MapPin,
    Clock,
    Users,
    Printer,
    Star,
    Home,
    AlertCircle,
} from 'lucide-react';

interface PaymentConfirmation {
    confirmationNumber: string;
    ticketId: string;
    paymentId: string;
    orderId: string;
    userEmail: string;
    ticketType: string;
    userCategory: 'indian' | 'international';
    amount: {
        value: number;
        currency: string;
        formatted: string;
    };
    event: {
        name: string;
        date: string;
        venue: string;
    };
    ticket: {
        type: string;
        category: string;
    };
    verificationTimestamp: string;
}

interface TicketData {
    id: string;
    eventName: string;
    ticketType: string;
    ticketDetails: {
        name: string;
        description: string;
        duration: string;
        features: string[];
    };
    amount: string;
    currency: 'INR' | 'USD';
    paymentId: string;
    orderId: string;
    userName: string;
    userEmail: string;
    userCategory: 'indian' | 'international';
    paymentDate: string;
    eventDate: string;
    venue: string;
}

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const [ticketData, setTicketData] =
        useState<TicketData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPaymentData = async () => {
            try {
                // Get payment parameters from URL
                const razorpayOrderId = searchParams.get(
                    'razorpay_order_id'
                );
                const razorpayPaymentId = searchParams.get(
                    'razorpay_payment_id'
                );
                const razorpaySignature = searchParams.get(
                    'razorpay_signature'
                );
                const ticketType =
                    searchParams.get('ticketType');
                const userCategory = searchParams.get(
                    'userCategory'
                ) as 'indian' | 'international';
                const userId = searchParams.get('userId');
                const userEmail =
                    searchParams.get('userEmail');

                // Validate required parameters
                if (
                    !razorpayOrderId ||
                    !razorpayPaymentId ||
                    !razorpaySignature
                ) {
                    setError(
                        'Missing payment verification parameters'
                    );
                    setLoading(false);
                    return;
                }

                // Call verification API
                const verificationResponse = await fetch(
                    '/api/razorpay/verify',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type':
                                'application/json',
                        },
                        body: JSON.stringify({
                            razorpay_order_id:
                                razorpayOrderId,
                            razorpay_payment_id:
                                razorpayPaymentId,
                            razorpay_signature:
                                razorpaySignature,
                            ticketType,
                            userCategory,
                            userId,
                            userEmail,
                        }),
                    }
                );

                if (!verificationResponse.ok) {
                    const errorData =
                        await verificationResponse.json();
                    throw new Error(
                        errorData.error ||
                            'Payment verification failed'
                    );
                }

                const verificationData =
                    await verificationResponse.json();
                const confirmation: PaymentConfirmation =
                    verificationData.confirmation;

                // Get user data from localStorage
                const userData = JSON.parse(
                    localStorage.getItem('userData') || '{}'
                );

                // Define ticket details based on type
                const ticketDetails = {
                    'conference-day-1': {
                        name: 'Conference Day 1',
                        description:
                            'Access to Day 1 conference sessions and networking',
                        duration: '1 Day',
                        features: [
                            'Day 1 conference sessions',
                            'Keynote presentations',
                            'Technical paper presentations',
                            'Networking breaks and lunch',
                            'Digital conference materials',
                            'Certificate of attendance',
                        ],
                    },
                    'conference-day-2': {
                        name: 'Conference Day 2',
                        description:
                            'Access to Day 2 conference sessions and networking',
                        duration: '1 Day',
                        features: [
                            'Day 2 conference sessions',
                            'Panel discussions and Q&A',
                            'Technical presentations',
                            'Networking breaks and lunch',
                            'Digital conference materials',
                            'Certificate of attendance',
                        ],
                    },
                    'conference-day-3': {
                        name: 'Conference Day 3',
                        description:
                            'Access to Day 3 conference sessions and networking',
                        duration: '1 Day',
                        features: [
                            'Day 3 conference sessions',
                            'Closing keynote',
                            'Award ceremonies',
                            'Networking breaks and lunch',
                            'Digital conference materials',
                            'Certificate of attendance',
                        ],
                    },
                    'conference-all-days': {
                        name: 'Conference All Days',
                        description:
                            'Access to all conference sessions and networking events',
                        duration: '3 Days',
                        features: [
                            'All 3 days of conference sessions',
                            'Keynote presentations by industry leaders',
                            'Technical paper presentations',
                            'Panel discussions and Q&A sessions',
                            'Networking breaks and lunch',
                            'Digital conference materials',
                            'Certificate of attendance',
                        ],
                    },
                    'tutorials-day-1': {
                        name: 'Tutorials Day 1',
                        description:
                            'Hands-on tutorial sessions with practical learning',
                        duration: '1 Day',
                        features: [
                            'Day 1 hands-on tutorials',
                            'Small group interactive sessions',
                            'Practical coding and design exercises',
                            'One-on-one mentorship opportunities',
                            'Tutorial materials and code samples',
                            'Certificate of completion',
                        ],
                    },
                    'tutorials-day-1-2': {
                        name: 'Tutorials Day 1-2',
                        description:
                            'Hands-on tutorial sessions with practical learning',
                        duration: '2 Days',
                        features: [
                            'Day 1-2 hands-on tutorials',
                            'Small group interactive sessions',
                            'Practical coding and design exercises',
                            'One-on-one mentorship opportunities',
                            'Tutorial materials and code samples',
                            'Practice datasets and tools',
                            'Certificate of completion',
                        ],
                    },
                    'main-conference-tutorials': {
                        name: 'Main Conference + Tutorials',
                        description:
                            'Complete access to everything - the ultimate learning experience',
                        duration: '5 Days',
                        features: [
                            'All 5 days of complete access',
                            'All conference sessions and tutorials',
                            'VIP networking events and dinners',
                            'Priority seating in all sessions',
                            'Complete digital and practice materials',
                            'Extended mentorship opportunities',
                            'Premium certificates for both tracks',
                            'Exclusive access to speaker meetups',
                        ],
                    },
                };

                const selectedTicket =
                    ticketDetails[
                        confirmation.ticketType as keyof typeof ticketDetails
                    ] ||
                    ticketDetails[
                        'main-conference-tutorials'
                    ];

                const ticketData: TicketData = {
                    id: confirmation.ticketId,
                    eventName: confirmation.event.name,
                    ticketType: selectedTicket.name,
                    ticketDetails: selectedTicket,
                    amount: confirmation.amount.formatted,
                    currency: confirmation.amount
                        .currency as 'INR' | 'USD',
                    paymentId: confirmation.paymentId,
                    orderId: confirmation.orderId,
                    userName: userData.name || 'Attendee',
                    userEmail: confirmation.userEmail,
                    userCategory: confirmation.userCategory,
                    paymentDate: new Date(
                        confirmation.verificationTimestamp
                    ).toLocaleDateString(),
                    eventDate: confirmation.event.date,
                    venue: confirmation.event.venue,
                };

                setTicketData(ticketData);
                setLoading(false);
            } catch (err) {
                console.error(
                    'Error loading payment data:',
                    err
                );
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to load payment data'
                );
                setLoading(false);
            }
        };

        loadPaymentData();
    }, [searchParams]);

    const handleDownloadTicket = () => {
        // In a real app, this would download a PDF ticket
        alert(
            'Ticket download feature would be implemented here'
        );
    };

    const handlePrintTicket = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        Processing your payment...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="mx-auto mb-6 w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-12 h-12 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Payment Verification Failed
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {error}
                    </p>
                    <div className="space-y-3">
                        <Link href="/">
                            <Button className="w-full">
                                Return to Home
                            </Button>
                        </Link>
                        <Link href="/select-category">
                            <Button
                                variant="outline"
                                className="w-full"
                            >
                                Try Again
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!ticketData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">
                        Unable to load ticket information.
                    </p>
                    <Link href="/">
                        <Button>Return to Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto mb-6 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Registration Successful!
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Thank you for registering for VLSID
                        2026. Your payment has been
                        confirmed and you&apos;ll receive a
                        confirmation email shortly with all
                        the details.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Ticket Details */}
                    <Card className="overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                            <CardTitle className="flex items-center">
                                <Calendar className="w-5 h-5 mr-2" />
                                Your Conference Ticket
                            </CardTitle>
                            <CardDescription className="text-blue-100">
                                Keep this information for
                                your records
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="text-center border-b pb-4">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {ticketData.eventName}
                                </h3>
                                <Badge
                                    variant="secondary"
                                    className="mb-2"
                                >
                                    {ticketData.ticketType}
                                </Badge>
                                <p className="text-sm text-gray-600">
                                    Ticket ID:{' '}
                                    {ticketData.id}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Amount Paid:
                                    </span>
                                    <span className="font-semibold text-lg">
                                        {ticketData.amount}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Payment ID:
                                    </span>
                                    <span className="font-mono text-sm">
                                        {
                                            ticketData.paymentId
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Order ID:
                                    </span>
                                    <span className="font-mono text-sm">
                                        {ticketData.orderId}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Payment Date:
                                    </span>
                                    <span className="text-sm">
                                        {
                                            ticketData.paymentDate
                                        }
                                    </span>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Attendee:
                                    </span>
                                    <span className="font-medium">
                                        {
                                            ticketData.userName
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Email:
                                    </span>
                                    <span className="text-sm">
                                        {
                                            ticketData.userEmail
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Category:
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className="capitalize"
                                    >
                                        {
                                            ticketData.userCategory
                                        }
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Event Details */}
                    <Card className="overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                            <CardTitle className="flex items-center">
                                <MapPin className="w-5 h-5 mr-2" />
                                Event Details
                            </CardTitle>
                            <CardDescription className="text-green-100">
                                Important information about
                                your event
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            Event Dates
                                        </h4>
                                        <p className="text-gray-600">
                                            {
                                                ticketData.eventDate
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            Venue
                                        </h4>
                                        <p className="text-gray-600">
                                            {
                                                ticketData.venue
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            Duration
                                        </h4>
                                        <p className="text-gray-600">
                                            {
                                                ticketData
                                                    .ticketDetails
                                                    .duration
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Users className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            Ticket Type
                                        </h4>
                                        <p className="text-gray-600">
                                            {
                                                ticketData
                                                    .ticketDetails
                                                    .description
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">
                                    What&apos;s Included:
                                </h4>
                                <ul className="space-y-2">
                                    {ticketData.ticketDetails.features.map(
                                        (
                                            feature,
                                            index
                                        ) => (
                                            <li
                                                key={index}
                                                className="flex items-start space-x-2"
                                            >
                                                <Star className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-gray-600">
                                                    {
                                                        feature
                                                    }
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={handleDownloadTicket}
                        className="flex items-center space-x-2"
                    >
                        <Download className="w-4 h-4" />
                        <span>Download Ticket</span>
                    </Button>
                    <Button
                        onClick={handlePrintTicket}
                        variant="outline"
                        className="flex items-center space-x-2"
                    >
                        <Printer className="w-4 h-4" />
                        <span>Print Ticket</span>
                    </Button>
                    <Link href="mailto:support@vlsid.com?subject=VLSID 2026 Registration Question">
                        <Button
                            variant="outline"
                            className="flex items-center space-x-2"
                        >
                            <Mail className="w-4 h-4" />
                            <span>Contact Support</span>
                        </Button>
                    </Link>
                </div>

                {/* Return Home */}
                <div className="mt-8 text-center">
                    <Link href="/">
                        <Button
                            variant="ghost"
                            className="flex items-center space-x-2 mx-auto"
                        >
                            <Home className="w-4 h-4" />
                            <span>Return to Home</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
