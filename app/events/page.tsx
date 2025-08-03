'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    RadioGroup,
    RadioGroupItem,
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft,
    IndianRupee,
    DollarSign,
    Check,
    Clock,
    Users,
    Calendar,
    MapPin,
    Globe,
} from 'lucide-react';
import Link from 'next/link';

type TicketType = 'conference' | 'tutorial' | 'both';

interface TicketOption {
    id: TicketType;
    name: string;
    description: string;
    features: string[];
    priceINR: number;
    priceUSD: number;
    duration: string;
    popular?: boolean;
}

const ticketOptions: TicketOption[] = [
    {
        id: 'conference',
        name: 'Conference',
        description: 'Access to all conference sessions',
        features: [
            '3 Days of Conference',
            'Keynote Speakers',
            'Networking Sessions',
            'Conference Materials',
            'Lunch & Refreshments',
        ],
        priceINR: 5000,
        priceUSD: 60,
        duration: '3 Days',
    },
    {
        id: 'tutorial',
        name: 'Tutorial',
        description: 'Hands-on tutorial sessions',
        features: [
            '2 Days of Tutorials',
            'Small Group Sessions',
            'Hands-on Learning',
            'Tutorial Materials',
            'Certificate of Completion',
        ],
        priceINR: 3000,
        priceUSD: 40,
        duration: '2 Days',
    },
    {
        id: 'both',
        name: 'Conference + Tutorial',
        description: 'Complete access to everything',
        features: [
            '5 Days Total Access',
            'All Conference Sessions',
            'All Tutorial Sessions',
            'VIP Networking Events',
            'Premium Materials',
            'Priority Support',
        ],
        priceINR: 7500,
        priceUSD: 90,
        duration: '5 Days',
        popular: true,
    },
];

export default function EventsPage() {
    const [selectedTicket, setSelectedTicket] =
        useState<TicketType>('both');
    const [userCategory, setUserCategory] = useState<
        'indian' | 'international'
    >('indian');
    const [userCountry, setUserCountry] = useState<
        'IN' | 'INTL'
    >('IN');
    const [isLoading, setIsLoading] = useState(false);

    // Add useEffect to read category from localStorage
    useEffect(() => {
        const category = localStorage.getItem(
            'userCategory'
        ) as 'indian' | 'international';
        if (category) {
            setUserCategory(category);
            setUserCountry(
                category === 'indian' ? 'IN' : 'INTL'
            );
        } else {
            // Redirect back to category selection if no category is selected
            window.location.href = '/select-category';
        }
    }, []);

    // Remove the country toggle section and replace with category display
    const CategoryDisplay = () => (
        <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center justify-center gap-2">
                    {userCategory === 'indian' ? (
                        <>
                            <MapPin className="w-5 h-5 text-orange-600" />
                            <span className="font-medium">
                                Indian Resident
                            </span>
                            <Badge variant="secondary">
                                INR Pricing
                            </Badge>
                        </>
                    ) : (
                        <>
                            <Globe className="w-5 h-5 text-blue-600" />
                            <span className="font-medium">
                                International
                            </span>
                            <Badge variant="secondary">
                                USD Pricing
                            </Badge>
                        </>
                    )}
                    <Link
                        href="/select-category"
                        className="ml-4"
                    >
                        <Button variant="outline" size="sm">
                            Change
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );

    const handleTicketSelection = async () => {
        setIsLoading(true);

        const selectedOption = ticketOptions.find(
            (option) => option.id === selectedTicket
        );
        const price =
            userCountry === 'IN'
                ? selectedOption?.priceINR
                : selectedOption?.priceUSD;
        const currency =
            userCountry === 'IN' ? 'INR' : 'USD';

        // Simulate API call to store ticket selection and send notification
        await new Promise((resolve) =>
            setTimeout(resolve, 2000)
        );

        console.log('Ticket selected:', {
            ticket: selectedTicket,
            price,
            currency,
            country: userCountry,
        });

        setIsLoading(false);

        // Redirect to checkout page
        window.location.href = `/checkout?ticket=${selectedTicket}&country=${userCountry}`;
    };

    // Update the formatPrice function to use the category
    const formatPrice = (
        priceINR: number,
        priceUSD: number
    ) => {
        if (userCategory === 'indian') {
            return (
                <div className="flex items-center">
                    <IndianRupee className="w-5 h-5 mr-1" />
                    <span className="text-3xl font-bold">
                        {priceINR.toLocaleString()}
                    </span>
                </div>
            );
        } else {
            return (
                <div className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-1" />
                    <span className="text-3xl font-bold">
                        {priceUSD}
                    </span>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-6">
                    <Link
                        href="/"
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>

                {/* Event Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        vlsid
                    </h1>
                    <div className="flex flex-wrap justify-center gap-6 mb-6">
                        <div className="flex items-center text-gray-600">
                            <Calendar className="w-5 h-5 mr-2" />
                            March 15-17, 2024
                        </div>
                        <div className="flex items-center text-gray-600">
                            <MapPin className="w-5 h-5 mr-2" />
                            Bangalore, India
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Users className="w-5 h-5 mr-2" />
                            5000+ Expected Attendees
                        </div>
                    </div>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Choose your ticket type and join the
                        most comprehensive technology
                        conference of the year.
                    </p>
                </div>

                {/* Replace the existing country toggle with: */}
                <CategoryDisplay />

                {/* Ticket Selection */}
                <div className="mb-12">
                    <RadioGroup
                        value={selectedTicket}
                        onValueChange={(value) =>
                            setSelectedTicket(
                                value as TicketType
                            )
                        }
                        className="grid md:grid-cols-3 gap-6"
                    >
                        {ticketOptions.map((option) => (
                            <div
                                key={option.id}
                                className="relative"
                            >
                                <RadioGroupItem
                                    value={option.id}
                                    id={option.id}
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor={option.id}
                                    className="cursor-pointer"
                                >
                                    <Card
                                        className={`relative overflow-hidden transition-all hover:shadow-lg ${
                                            selectedTicket ===
                                            option.id
                                                ? 'ring-2 ring-blue-500 shadow-lg'
                                                : ''
                                        } ${
                                            option.popular
                                                ? 'border-2 border-blue-500'
                                                : ''
                                        }`}
                                    >
                                        {option.popular && (
                                            <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm font-medium">
                                                Best Value
                                            </div>
                                        )}

                                        <CardHeader className="text-center">
                                            <CardTitle className="text-xl">
                                                {
                                                    option.name
                                                }
                                            </CardTitle>
                                            <CardDescription>
                                                {
                                                    option.description
                                                }
                                            </CardDescription>
                                            <div className="mt-4">
                                                {formatPrice(
                                                    option.priceINR,
                                                    option.priceUSD
                                                )}
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                className="mt-2"
                                            >
                                                <Clock className="w-4 h-4 mr-1" />
                                                {
                                                    option.duration
                                                }
                                            </Badge>
                                        </CardHeader>

                                        <CardContent>
                                            <ul className="space-y-3">
                                                {option.features.map(
                                                    (
                                                        feature,
                                                        index
                                                    ) => (
                                                        <li
                                                            key={
                                                                index
                                                            }
                                                            className="flex items-center text-sm"
                                                        >
                                                            <Check className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                                                            {
                                                                feature
                                                            }
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </CardContent>

                                        {selectedTicket ===
                                            option.id && (
                                            <div className="absolute top-4 left-4 bg-blue-500 text-white rounded-full p-1">
                                                <Check className="w-4 h-4" />
                                            </div>
                                        )}
                                    </Card>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                {/* Selection Summary */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>
                            Your Selection
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold">
                                    {
                                        ticketOptions.find(
                                            (option) =>
                                                option.id ===
                                                selectedTicket
                                        )?.name
                                    }
                                </h3>
                                <p className="text-gray-600">
                                    {
                                        ticketOptions.find(
                                            (option) =>
                                                option.id ===
                                                selectedTicket
                                        )?.description
                                    }
                                </p>
                            </div>
                            <div className="text-right">
                                {formatPrice(
                                    ticketOptions.find(
                                        (option) =>
                                            option.id ===
                                            selectedTicket
                                    )?.priceINR || 0,
                                    ticketOptions.find(
                                        (option) =>
                                            option.id ===
                                            selectedTicket
                                    )?.priceUSD || 0
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Proceed Button */}
                <div className="text-center">
                    <Button
                        size="lg"
                        onClick={handleTicketSelection}
                        disabled={isLoading}
                        className="px-12 py-3 text-lg"
                    >
                        {isLoading
                            ? 'Processing...'
                            : 'Proceed to Payment'}
                    </Button>
                    <p className="text-sm text-gray-600 mt-4">
                        You&apos;ll receive a confirmation
                        email with payment details
                    </p>
                </div>
            </div>
        </div>
    );
}
