'use client';

import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    getAllPricing,
    SAMPLE_USERS,
    demonstratePricing,
    formatPrice,
    type TicketType,
} from '@/lib/pricing';
import {
    IndianRupee,
    DollarSign,
    Users,
    Shield,
    Award,
    Bookmark,
} from 'lucide-react';

export default function PricingDemoPage() {
    const [selectedUser, setSelectedUser] =
        useState<keyof typeof SAMPLE_USERS>(
            'indianStudent'
        );
    const [selectedTicket, setSelectedTicket] =
        useState<TicketType>('main-conference-tutorials');

    const currentUser = SAMPLE_USERS[selectedUser];
    const allPricing = getAllPricing(currentUser.profile);
    const currentPricing = allPricing[selectedTicket];

    const handleDemoInConsole = () => {
        demonstratePricing();
        console.log(
            'Check the browser console for detailed pricing demonstration!'
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Pricing System Demonstration
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Interactive demonstration of the
                        centralized pricing system. See how
                        different user profiles affect
                        ticket pricing based on location and
                        user type. All discounts are applied
                        through coupon codes only.
                    </p>
                </div>

                {/* User Selection */}
                <Card className="mb-8 bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            Select Sample User
                        </CardTitle>
                        <CardDescription>
                            Choose a sample user profile to
                            see how pricing changes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {Object.entries(
                                SAMPLE_USERS
                            ).map(([key, user]) => (
                                <Button
                                    key={key}
                                    variant={
                                        selectedUser === key
                                            ? 'default'
                                            : 'outline'
                                    }
                                    onClick={() =>
                                        setSelectedUser(
                                            key as keyof typeof SAMPLE_USERS
                                        )
                                    }
                                    className="h-auto p-4 flex flex-col items-start gap-2"
                                >
                                    <div className="font-semibold">
                                        {user.name}
                                    </div>
                                    <div className="text-xs text-left">
                                        <div>
                                            📍{' '}
                                            {
                                                user.profile
                                                    .location
                                            }
                                        </div>
                                        <div>
                                            👤{' '}
                                            {
                                                user.profile
                                                    .userType
                                            }
                                        </div>
                                        <div>
                                            💳 Coupon-based
                                            discounts only
                                        </div>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Current User Profile */}
                <Card className="mb-8 bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-green-600" />
                            Current User Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <div className="font-semibold text-blue-900">
                                    Location
                                </div>
                                <div className="flex items-center justify-center gap-1 mt-1">
                                    {currentUser.profile
                                        .location ===
                                    'india' ? (
                                        <IndianRupee className="w-4 h-4 text-orange-600" />
                                    ) : (
                                        <DollarSign className="w-4 h-4 text-blue-600" />
                                    )}
                                    <span className="capitalize">
                                        {
                                            currentUser
                                                .profile
                                                .location
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <div className="font-semibold text-green-900">
                                    Discount Type
                                </div>
                                <div className="mt-1">
                                    <Badge variant="secondary">
                                        Coupon Only
                                    </Badge>
                                </div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                                <div className="font-semibold text-purple-900">
                                    User Type
                                </div>
                                <div className="mt-1">
                                    <Badge
                                        variant="outline"
                                        className="capitalize"
                                    >
                                        {
                                            currentUser
                                                .profile
                                                .userType
                                        }
                                    </Badge>
                                </div>
                            </div>
                            <div className="text-center p-3 bg-orange-50 rounded-lg">
                                <div className="font-semibold text-orange-900">
                                    Pricing Type
                                </div>
                                <div className="mt-1">
                                    <Badge
                                        variant="outline"
                                        className="capitalize"
                                    >
                                        Fixed Base Price
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Ticket Selection */}
                <Card className="mb-8 bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-purple-600" />
                            Select Ticket Type
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {(
                                [
                                    'conference-day-1',
                                    'conference-day-2',
                                    'conference-day-3',
                                    'conference-all-days',
                                    'tutorials-day-1',
                                    'tutorials-day-1-2',
                                    'main-conference-tutorials',
                                ] as TicketType[]
                            ).map((ticketType) => (
                                <Button
                                    key={ticketType}
                                    variant={
                                        selectedTicket ===
                                        ticketType
                                            ? 'default'
                                            : 'outline'
                                    }
                                    onClick={() =>
                                        setSelectedTicket(
                                            ticketType
                                        )
                                    }
                                    className="h-auto p-4 flex flex-col items-center gap-2"
                                >
                                    <div className="font-semibold capitalize">
                                        {ticketType.replace(
                                            '-',
                                            ' '
                                        )}
                                    </div>
                                    <div className="text-xs text-center">
                                        {formatPrice(
                                            allPricing[
                                                ticketType
                                            ].originalPrice,
                                            allPricing[
                                                ticketType
                                            ].currency
                                        )}
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing Details */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Current Ticket Pricing */}
                    <Card className="bg-white/90 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bookmark className="w-5 h-5 text-red-600" />
                                {selectedTicket
                                    .replace('-', ' ')
                                    .toUpperCase()}{' '}
                                Ticket Pricing
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                    Base Price:
                                </span>
                                <span className="font-semibold">
                                    {formatPrice(
                                        currentPricing.originalPrice,
                                        currentPricing.currency
                                    )}
                                </span>
                            </div>

                            {currentPricing.eventDates && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">
                                        Event Dates:
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        📅{' '}
                                        {
                                            currentPricing
                                                .eventDates
                                                .formattedDates
                                        }
                                    </Badge>
                                </div>
                            )}

                            <Separator />

                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Final Price:</span>
                                <span className="text-green-600">
                                    {formatPrice(
                                        currentPricing.finalPrice,
                                        currentPricing.currency
                                    )}
                                </span>
                            </div>

                            {currentPricing.appliedDiscounts
                                .length > 0 && (
                                <div className="mt-4">
                                    <div className="text-sm font-semibold text-gray-700 mb-2">
                                        Applied Discounts:
                                    </div>
                                    <div className="space-y-1">
                                        {currentPricing.appliedDiscounts.map(
                                            (
                                                discount,
                                                index
                                            ) => (
                                                <div
                                                    key={
                                                        index
                                                    }
                                                    className="text-sm text-gray-600 flex items-center gap-2"
                                                >
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    {
                                                        discount
                                                    }
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* All Ticket Types Pricing */}
                    <Card className="bg-white/90 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>
                                All Ticket Types
                            </CardTitle>
                            <CardDescription>
                                Pricing for all ticket types
                                with current user profile
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(
                                    allPricing
                                ).map(
                                    ([
                                        ticketType,
                                        pricing,
                                    ]) => (
                                        <div
                                            key={ticketType}
                                            className={`p-3 rounded-lg border ${
                                                selectedTicket ===
                                                ticketType
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-semibold capitalize">
                                                    {ticketType.replace(
                                                        '-',
                                                        ' '
                                                    )}
                                                </span>
                                                <span className="text-lg font-bold text-green-600">
                                                    {formatPrice(
                                                        pricing.finalPrice,
                                                        pricing.currency
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-gray-600">
                                                <span>
                                                    Base:{' '}
                                                    {formatPrice(
                                                        pricing.originalPrice,
                                                        pricing.currency
                                                    )}
                                                </span>
                                                {pricing.eventDates && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        📅{' '}
                                                        {
                                                            pricing
                                                                .eventDates
                                                                .formattedDates
                                                        }
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Console Demo Button */}
                <div className="text-center mt-8">
                    <Button
                        onClick={handleDemoInConsole}
                        size="lg"
                        variant="outline"
                    >
                        Run Console Demo
                    </Button>
                    <p className="text-sm text-gray-600 mt-2">
                        Click to see detailed pricing
                        demonstration in browser console
                    </p>
                </div>

                {/* Pricing Rules Summary */}
                <Card className="mt-8 bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>
                            Pricing Rules Summary
                        </CardTitle>
                        <CardDescription>
                            Overview of how discounts are
                            calculated
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold mb-3">
                                    Coupon-Based Discounts
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>
                                            Early Bird:
                                        </span>
                                        <Badge variant="secondary">
                                            15% OFF
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>
                                            Student:
                                        </span>
                                        <Badge variant="secondary">
                                            50% OFF
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Author:</span>
                                        <Badge variant="secondary">
                                            25% OFF
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>
                                            Fixed Discount:
                                        </span>
                                        <Badge variant="secondary">
                                            $10/₹500 OFF
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-3">
                                    Other Charges
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>
                                            GST (India):
                                        </span>
                                        <Badge variant="secondary">
                                            +18%
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>
                                            Base Pricing:
                                        </span>
                                        <Badge variant="secondary">
                                            Fixed Rates
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>
                                            IEEE Members:
                                        </span>
                                        <Badge variant="secondary">
                                            Same as Regular
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>
                                            All Users:
                                        </span>
                                        <Badge variant="secondary">
                                            Coupon Discounts
                                            Only
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
