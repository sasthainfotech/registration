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
    Globe,
    ArrowRight,
    Star,
    Award,
    Bookmark,
    Shield,
    Calendar,
} from 'lucide-react';
import Link from 'next/link';

type TicketType =
    | 'conference-day-1'
    | 'conference-day-2'
    | 'conference-day-3'
    | 'conference-all-days'
    | 'tutorials-day-1'
    | 'tutorials-day-1-2'
    | 'main-conference-tutorials';

interface TicketOption {
    id: TicketType;
    name: string;
    description: string;
    detailedDescription: string;
    features?: string[];
    priceINR: number;
    priceUSD: number;
    duration: string;
    eventDates: string;
    popular?: boolean;
    icon: React.ComponentType<{ className?: string }>;
    highlights?: string[];
}

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

const ticketOptions: TicketOption[] = [
    {
        id: 'tutorials-day-1',
        name: 'Tutorials for single day (Day 1 or Day 2)',
        description:
            'Hands-on tutorial sessions with practical learning',
        detailedDescription:
            'Ideal for developers and engineers looking to gain practical skills through hands-on workshops and tutorials.',

        priceINR: 3000,
        priceUSD: 84,
        duration: 'Day 1 or Day 2',
        eventDates: 'January 3, 2026',
        icon: Award,
    },
    {
        id: 'tutorials-day-1-2',
        name: 'Tutorials for two days (Day 1 & 2) (Recommended)',
        description:
            'Hands-on tutorial sessions with practical learning',
        detailedDescription:
            'Ideal for developers and engineers looking to gain practical skills through hands-on workshops and tutorials.',
        features: [
            'Day 1 & 2 of hands-on tutorials',
            'Small group interactive sessions',
            'Practical coding and design exercises',
            'One-on-one mentorship opportunities',
            'Tutorial materials and code samples',
            'Practice datasets and tools',
            'Certificate of completion',
        ],
        priceINR: 4200,
        priceUSD: 102,
        duration: 'Day 1 & Day 2',
        eventDates: 'January 3-4, 2026',
        icon: Award,
    },
    {
        id: 'conference-day-1',
        name: 'Conference Day 1',
        description:
            'Access to Day 1 conference sessions and networking',
        detailedDescription:
            'Attend Day 1 of the conference with access to all sessions, networking events, and meals for that day. Ideal for those who can only attend the first day.',
        priceINR: 6000,
        priceUSD: 75,
        duration: '1 Day',
        eventDates: 'January 5, 2026',
        icon: Calendar,
    },
    {
        id: 'conference-day-2',
        name: 'Conference Day 2',
        description:
            'Access to Day 2 conference sessions and networking',
        detailedDescription:
            'Attend Day 2 of the conference with access to all sessions, networking events, and meals for that day. Perfect for those interested in Day 2 specific content.',
        priceINR: 9000,
        priceUSD: 110,
        duration: '1 Day',
        eventDates: 'January 6, 2026',
        icon: Calendar,
    },
    {
        id: 'conference-day-3',
        name: 'Conference Day 3',
        description:
            'Access to Day 3 conference sessions and networking',
        detailedDescription:
            'Attend Day 3 of the conference with access to all sessions, networking events, and meals for that day. Great for those who want to attend the final day.',
        priceINR: 6000,
        priceUSD: 75,
        duration: '1 Day',
        eventDates: 'January 7, 2026',
        icon: Calendar,
    },
    {
        id: 'conference-all-days',
        name: 'Conference All Days',
        description:
            'Access to all conference sessions and networking events',
        detailedDescription:
            'Perfect for professionals wanting to stay updated with the latest industry trends and network with experts.',
        priceINR: 12000,
        priceUSD: 390,
        duration: '3 Days',
        eventDates: 'January 5-7, 2026',
        icon: Globe,
    },

    {
        id: 'main-conference-tutorials',
        name: 'Main Conference + Tutorials',
        description:
            'Complete access to everything - the ultimate learning experience',
        detailedDescription:
            'The best value option combining both conference insights and practical tutorials for the complete learning experience.',
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
        priceINR: 14400,
        priceUSD: 480,
        duration: '5 Days',
        eventDates: 'January 3-7, 2026',
        popular: true,
        icon: Star,
    },
];

export default function SelectCategoryPage() {
    const [selectedTicket, setSelectedTicket] =
        useState<TicketType>('main-conference-tutorials');
    const [userCategory, setUserCategory] = useState<
        'indian' | 'international'
    >('indian');
    const [isLoading, setIsLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [ieeeMembershipData, setIeeeMembershipData] =
        useState<IEEEMembershipData | null>(null);

    // Load user category and IEEE verification from localStorage
    useEffect(() => {
        const category = localStorage.getItem(
            'userCategory'
        ) as 'indian' | 'international';

        if (category) {
            setUserCategory(category);

            // Load IEEE verification data
            const ieeeVerification = localStorage.getItem(
                'ieeeVerification'
            );
            if (ieeeVerification) {
                const verification = JSON.parse(
                    ieeeVerification
                );
                if (
                    verification.isVerified &&
                    verification.membershipData
                ) {
                    setIeeeMembershipData(
                        verification.membershipData
                    );
                }
            } else {
                // No IEEE verification found, redirect to verification page
                window.location.href = '/ieee-verification';
                return;
            }

            setPageLoading(false);
        } else {
            // Redirect back to homepage if no category is selected
            window.location.href = '/';
        }
    }, []);

    // Add effect to refresh IEEE data when returning from verification page
    useEffect(() => {
        const handleStorageChange = () => {
            const ieeeVerification = localStorage.getItem(
                'ieeeVerification'
            );
            if (ieeeVerification) {
                const verification = JSON.parse(
                    ieeeVerification
                );
                if (
                    verification.isVerified &&
                    verification.membershipData
                ) {
                    setIeeeMembershipData(
                        verification.membershipData
                    );
                }
            }
        };

        // Listen for storage changes (when user updates membership from another tab/window)
        window.addEventListener(
            'storage',
            handleStorageChange
        );

        // Also check on focus (when user returns to this tab)
        window.addEventListener(
            'focus',
            handleStorageChange
        );

        return () => {
            window.removeEventListener(
                'storage',
                handleStorageChange
            );
            window.removeEventListener(
                'focus',
                handleStorageChange
            );
        };
    }, []);

    const handleContinue = async () => {
        if (!selectedTicket) return;

        setIsLoading(true);

        try {
            // Store ticket selection in localStorage for persistence
            localStorage.setItem(
                'ticketType',
                selectedTicket
            );

            // Navigate to checkout page
            window.location.href = `/checkout?ticket=${selectedTicket}`;
        } catch (error) {
            console.error(
                'Error saving ticket selection:',
                error
            );
            alert(
                'Failed to save selection. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const formatPrice = (
        priceINR: number,
        priceUSD: number
    ) => {
        const discount =
            ieeeMembershipData?.discountEligible
                ? ieeeMembershipData.discountPercentage || 0
                : 0;
        const discountedINR =
            discount > 0
                ? Math.round(
                      priceINR * (1 - discount / 100)
                  )
                : priceINR;
        const discountedUSD =
            discount > 0
                ? Math.round(
                      priceUSD * (1 - discount / 100)
                  )
                : priceUSD;

        if (userCategory === 'indian') {
            return (
                <div className="flex flex-col items-center">
                    <div className="flex items-center">
                        <IndianRupee className="w-5 h-5 mr-1" />
                        <span className="text-3xl font-bold">
                            {discountedINR.toLocaleString()}
                        </span>
                    </div>
                    {discount > 0 && (
                        <div className="flex items-center text-sm text-gray-500">
                            <span className="line-through mr-2">
                                ₹{priceINR.toLocaleString()}
                            </span>
                            <Badge
                                variant="default"
                                className="bg-green-600 text-xs"
                            >
                                {discount}% OFF
                            </Badge>
                        </div>
                    )}
                </div>
            );
        } else {
            return (
                <div className="flex flex-col items-center">
                    <div className="flex items-center">
                        <DollarSign className="w-5 h-5 mr-1" />
                        <span className="text-3xl font-bold">
                            {discountedUSD}
                        </span>
                    </div>
                    {discount > 0 && (
                        <div className="flex items-center text-sm text-gray-500">
                            <span className="line-through mr-2">
                                ${priceUSD}
                            </span>
                            <Badge
                                variant="default"
                                className="bg-green-600 text-xs"
                            >
                                {discount}% OFF
                            </Badge>
                        </div>
                    )}
                </div>
            );
        }
    };

    // Show loading state while checking category
    if (pageLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-6">
                    <Link
                        href="/ieee-verification"
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to IEEE Verification
                    </Link>
                </div>

                {/* Category Display & IEEE Status */}
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                        <div className="flex items-center justify-center gap-2">
                            {userCategory === 'indian' ? (
                                <>
                                    <IndianRupee className="w-5 h-5 text-orange-600" />
                                    <span className="font-medium">
                                        Indian Resident
                                    </span>
                                    <Badge variant="secondary">
                                        INR Pricing
                                    </Badge>
                                </>
                            ) : (
                                <>
                                    <DollarSign className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium">
                                        International
                                    </span>
                                    <Badge variant="secondary">
                                        USD Pricing
                                    </Badge>
                                </>
                            )}
                            <Link
                                href="/ieee-verification"
                                className="ml-4"
                            >
                                <Button
                                    variant="outline"
                                    size="sm"
                                >
                                    Change
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* IEEE Membership Status */}
                    {ieeeMembershipData && (
                        <div className="bg-white rounded-lg p-4 shadow-sm border">
                            <div className="flex items-center justify-center gap-2">
                                {ieeeMembershipData.isMember ? (
                                    <>
                                        <Shield className="w-5 h-5 text-green-600" />
                                        <span className="font-medium text-green-900">
                                            IEEE Member
                                        </span>
                                        {ieeeMembershipData.membershipLevel && (
                                            <Badge
                                                variant="default"
                                                className="bg-green-600 capitalize"
                                            >
                                                {
                                                    ieeeMembershipData.membershipLevel
                                                }
                                            </Badge>
                                        )}
                                        {ieeeMembershipData.discountEligible && (
                                            <Badge
                                                variant="default"
                                                className="bg-blue-600"
                                            >
                                                {
                                                    ieeeMembershipData.discountPercentage
                                                }
                                                % Discount
                                                Applied
                                            </Badge>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Users className="w-5 h-5 text-gray-600" />
                                        <span className="font-medium text-gray-700">
                                            Regular Pricing
                                        </span>
                                        <Badge variant="secondary">
                                            No IEEE
                                            Membership
                                        </Badge>
                                    </>
                                )}
                                <Link
                                    href="/ieee-verification"
                                    className="ml-4"
                                >
                                    <Button
                                        variant="outline"
                                        size="sm"
                                    >
                                        {ieeeMembershipData.isMember
                                            ? 'Update'
                                            : 'Verify IEEE'}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Choose Your Experience
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Select the perfect ticket for your
                        learning journey. Each option is
                        designed to provide maximum value
                        and learning opportunities.
                    </p>
                </div>

                {/* Ticket Selection */}
                <div className="mb-12">
                    <RadioGroup
                        value={selectedTicket}
                        onValueChange={(value) =>
                            setSelectedTicket(
                                value as TicketType
                            )
                        }
                        className="grid lg:grid-cols-2 gap-6"
                    >
                        {ticketOptions.map((option) => {
                            const IconComponent =
                                option.icon;
                            const isSelected =
                                selectedTicket ===
                                option.id;

                            return (
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
                                            className={`relative overflow-hidden transition-all hover:shadow-xl ${
                                                isSelected
                                                    ? 'ring-2 ring-blue-500 shadow-lg scale-105'
                                                    : 'hover:shadow-lg'
                                            } ${
                                                option.popular
                                                    ? 'border-2 border-blue-500'
                                                    : ''
                                            }`}
                                        >
                                            {option.popular && (
                                                <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm font-medium z-10">
                                                    Best
                                                    Value
                                                </div>
                                            )}

                                            <CardHeader className="text-center pb-4">
                                                <div className="flex justify-center mb-4">
                                                    <div
                                                        className={`p-3 rounded-full ${
                                                            option.id ===
                                                            'conference-day-1'
                                                                ? 'bg-blue-100 text-blue-600'
                                                                : option.id ===
                                                                  'conference-day-2'
                                                                ? 'bg-indigo-100 text-indigo-600'
                                                                : option.id ===
                                                                  'conference-day-3'
                                                                ? 'bg-purple-100 text-purple-600'
                                                                : option.id ===
                                                                  'conference-all-days'
                                                                ? 'bg-cyan-100 text-cyan-600'
                                                                : option.id ===
                                                                  'tutorials-day-1'
                                                                ? 'bg-green-100 text-green-600'
                                                                : option.id ===
                                                                  'tutorials-day-1-2'
                                                                ? 'bg-red-100 text-red-600'
                                                                : 'bg-orange-100 text-orange-600'
                                                        }`}
                                                    >
                                                        <IconComponent className="w-8 h-8" />
                                                    </div>
                                                </div>
                                                <CardTitle className="text-xl mb-2">
                                                    {
                                                        option.name
                                                    }
                                                </CardTitle>
                                                <CardDescription className="text-sm mb-4">
                                                    {
                                                        option.description
                                                    }
                                                </CardDescription>
                                                <div className="mb-4">
                                                    {formatPrice(
                                                        option.priceINR,
                                                        option.priceUSD
                                                    )}
                                                </div>
                                                <Badge
                                                    variant="secondary"
                                                    className="mb-2 w-max mx-auto"
                                                >
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    {
                                                        option.duration
                                                    }
                                                </Badge>
                                                <Badge
                                                    variant="outline"
                                                    className="mb-4 w-max mx-auto text-xs"
                                                >
                                                    📅{' '}
                                                    {
                                                        option.eventDates
                                                    }
                                                </Badge>
                                            </CardHeader>

                                            {isSelected && (
                                                <div className="absolute top-4 left-4 bg-blue-500 text-white rounded-full p-1 z-10">
                                                    <Check className="w-4 h-4" />
                                                </div>
                                            )}
                                        </Card>
                                    </Label>
                                </div>
                            );
                        })}
                    </RadioGroup>
                </div>

                {/* Selection Summary */}
                <Card className="mb-8 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>
                            Your Selection Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-lg">
                                    {
                                        ticketOptions.find(
                                            (option) =>
                                                option.id ===
                                                selectedTicket
                                        )?.name
                                    }
                                </h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    {
                                        ticketOptions.find(
                                            (option) =>
                                                option.id ===
                                                selectedTicket
                                        )?.description
                                    }
                                </p>
                                <Badge
                                    variant="secondary"
                                    className="mt-2"
                                >
                                    {
                                        ticketOptions.find(
                                            (option) =>
                                                option.id ===
                                                selectedTicket
                                        )?.duration
                                    }
                                </Badge>
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
                                <p className="text-sm text-gray-600 mt-1">
                                    {userCategory ===
                                    'indian'
                                        ? 'INR (incl. GST)'
                                        : 'USD (no tax)'}
                                    {ieeeMembershipData?.discountEligible && (
                                        <span className="text-green-600 font-medium">
                                            {
                                                ' • IEEE Discount Applied'
                                            }
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Continue Button */}
                <div className="text-center">
                    <Button
                        onClick={handleContinue}
                        disabled={
                            !selectedTicket || isLoading
                        }
                        size="lg"
                        className="px-12 py-3 text-lg"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Proceed to Payment
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>
                    <p className="text-sm text-gray-600 mt-4">
                        Next: You&apos;ll be asked to create
                        an account or login to complete your
                        registration
                    </p>
                </div>

                {/* Additional Information */}
                <div className="mt-12 max-w-3xl mx-auto">
                    <Card className="bg-white/70 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-gray-900 mb-4 text-center">
                                Why Choose VLSID Conference?
                            </h3>
                            <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
                                <div className="text-center">
                                    <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                    <h4 className="font-medium text-gray-900 mb-1">
                                        Expert Network
                                    </h4>
                                    <p>
                                        Connect with 1000+
                                        industry leaders and
                                        researchers
                                    </p>
                                </div>
                                <div className="text-center">
                                    <Award className="w-8 h-8 mx-auto mb-2 text-green-600" />
                                    <h4 className="font-medium text-gray-900 mb-1">
                                        Cutting-edge Content
                                    </h4>
                                    <p>
                                        Latest research and
                                        industry trends in
                                        VLSI design
                                    </p>
                                </div>
                                <div className="text-center">
                                    <Bookmark className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                                    <h4 className="font-medium text-gray-900 mb-1">
                                        Career Growth
                                    </h4>
                                    <p>
                                        Practical skills and
                                        networking for
                                        career advancement
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
