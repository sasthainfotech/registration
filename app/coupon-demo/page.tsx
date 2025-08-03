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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Alert,
    AlertDescription,
} from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { SAMPLE_COUPONS } from '@/lib/coupons';
import {
    Check,
    AlertTriangle,
    Loader2,
    Tag,
    Users,
    MapPin,
    Calendar,
} from 'lucide-react';

export default function CouponDemoPage() {
    const [couponCode, setCouponCode] = useState('');
    const [validationResult, setValidationResult] =
        useState<{
            isValid: boolean;
            discountAmount?: number;
            discountPercentage?: number;
            message?: string;
            code?: string;
            coupon?: {
                code: string;
                description: string;
            };
            finalAmount?: number;
        } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Demo parameters
    const [ticketType, setTicketType] = useState(
        'main-conference'
    );
    const [userType, setUserType] = useState('regular');
    const [location, setLocation] = useState<
        'india' | 'international'
    >('india');
    const [baseAmount, setBaseAmount] = useState(12000);
    const [currency, setCurrency] = useState<'INR' | 'USD'>(
        'INR'
    );

    const handleValidateCoupon = async () => {
        if (!couponCode.trim()) {
            setError('Please enter a coupon code');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                '/api/coupon/validate',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        code: couponCode.trim(),
                        ticketType,
                        userType,
                        location,
                        baseAmount,
                        currency,
                    }),
                }
            );

            const data = await response.json();

            if (data.success) {
                setValidationResult(data.data);
                setError(null);
            } else {
                setValidationResult(null);
                setError(data.error);
            }
        } catch (err) {
            console.error('Coupon validation error:', err);
            setError(
                'Failed to validate coupon code. Please try again.'
            );
            setValidationResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    const clearCoupon = () => {
        setCouponCode('');
        setValidationResult(null);
        setError(null);
    };

    const formatPrice = (
        amount: number,
        curr: 'INR' | 'USD'
    ) => {
        const symbol = curr === 'INR' ? '₹' : '$';
        return `${symbol}${amount.toLocaleString()}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Coupon Code System Demo
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Test the coupon code validation
                        system with different parameters.
                        See how discounts are calculated
                        based on user type, location, and
                        ticket selection.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Demo Parameters */}
                    <Card className="bg-white/90 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Tag className="w-5 h-5 text-blue-600" />
                                Demo Parameters
                            </CardTitle>
                            <CardDescription>
                                Configure the test
                                parameters to see how
                                coupons work
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Ticket Type */}
                            <div>
                                <Label className="text-sm font-medium">
                                    Ticket Type
                                </Label>
                                <select
                                    value={ticketType}
                                    onChange={(e) =>
                                        setTicketType(
                                            e.target.value
                                        )
                                    }
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="conference-day-1">
                                        Conference Day 1
                                    </option>
                                    <option value="conference-day-2">
                                        Conference Day 2
                                    </option>
                                    <option value="conference-day-3">
                                        Conference Day 3
                                    </option>
                                    <option value="conference-all-days">
                                        Conference All Days
                                    </option>
                                    <option value="tutorials-day-1">
                                        Tutorials Day 1
                                    </option>
                                    <option value="tutorials-day-1-2">
                                        Tutorials Day 1-2
                                    </option>
                                    <option value="main-conference-tutorials">
                                        Main Conference +
                                        Tutorials
                                    </option>
                                </select>
                            </div>

                            {/* User Type */}
                            <div>
                                <Label className="text-sm font-medium">
                                    User Type
                                </Label>
                                <select
                                    value={userType}
                                    onChange={(e) =>
                                        setUserType(
                                            e.target.value
                                        )
                                    }
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="regular">
                                        Regular
                                    </option>
                                    <option value="student">
                                        Student
                                    </option>
                                    <option value="author">
                                        Author
                                    </option>
                                </select>
                            </div>

                            {/* Location */}
                            <div>
                                <Label className="text-sm font-medium">
                                    Location
                                </Label>
                                <select
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(
                                            e.target
                                                .value as
                                                | 'india'
                                                | 'international'
                                        )
                                    }
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="india">
                                        India
                                    </option>
                                    <option value="international">
                                        International
                                    </option>
                                </select>
                            </div>

                            {/* Base Amount */}
                            <div>
                                <Label className="text-sm font-medium">
                                    Base Amount
                                </Label>
                                <Input
                                    type="number"
                                    value={baseAmount}
                                    onChange={(e) =>
                                        setBaseAmount(
                                            Number(
                                                e.target
                                                    .value
                                            )
                                        )
                                    }
                                    className="mt-1"
                                />
                            </div>

                            {/* Currency */}
                            <div>
                                <Label className="text-sm font-medium">
                                    Currency
                                </Label>
                                <select
                                    value={currency}
                                    onChange={(e) =>
                                        setCurrency(
                                            e.target
                                                .value as
                                                | 'INR'
                                                | 'USD'
                                        )
                                    }
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="INR">
                                        INR (₹)
                                    </option>
                                    <option value="USD">
                                        USD ($)
                                    </option>
                                </select>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    <strong>
                                        Current Setup:
                                    </strong>{' '}
                                    {ticketType} ticket for{' '}
                                    {userType} user from{' '}
                                    {location}
                                    with base amount of{' '}
                                    {formatPrice(
                                        baseAmount,
                                        currency
                                    )}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Coupon Testing */}
                    <Card className="bg-white/90 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-green-600" />
                                Test Coupon Code
                            </CardTitle>
                            <CardDescription>
                                Enter a coupon code to test
                                validation
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Coupon Input */}
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Enter coupon code"
                                    value={couponCode}
                                    onChange={(e) =>
                                        setCouponCode(
                                            e.target.value.toUpperCase()
                                        )
                                    }
                                    className="flex-1"
                                    disabled={isLoading}
                                />
                                <Button
                                    onClick={
                                        handleValidateCoupon
                                    }
                                    disabled={
                                        !couponCode.trim() ||
                                        isLoading
                                    }
                                    size="sm"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        'Test'
                                    )}
                                </Button>
                            </div>

                            {/* Error Display */}
                            {error && (
                                <Alert variant="destructive">
                                    <AlertTriangle className="w-4 h-4" />
                                    <AlertDescription>
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Success Result */}
                            {validationResult && (
                                <div className="space-y-4">
                                    <Alert className="border-green-200 bg-green-50">
                                        <Check className="w-4 h-4 text-green-600" />
                                        <AlertDescription className="text-green-800">
                                            Coupon validated
                                            successfully!
                                        </AlertDescription>
                                    </Alert>

                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-green-900 mb-2">
                                            {validationResult
                                                .coupon
                                                ?.code ||
                                                validationResult.code}{' '}
                                            -{' '}
                                            {validationResult
                                                .coupon
                                                ?.description ||
                                                'Discount Applied'}
                                        </h4>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span>
                                                    Original
                                                    Amount:
                                                </span>
                                                <span className="font-medium">
                                                    {formatPrice(
                                                        baseAmount,
                                                        currency
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-green-600">
                                                <span>
                                                    Discount:
                                                </span>
                                                <span className="font-medium">
                                                    -
                                                    {formatPrice(
                                                        validationResult.discountAmount ||
                                                            0,
                                                        currency
                                                    )}
                                                </span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between font-semibold">
                                                <span>
                                                    Final
                                                    Amount:
                                                </span>
                                                <span className="text-green-600">
                                                    {formatPrice(
                                                        validationResult.finalAmount ||
                                                            baseAmount,
                                                        currency
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-green-200">
                                            <Button
                                                onClick={
                                                    clearCoupon
                                                }
                                                size="sm"
                                                variant="outline"
                                                className="text-red-600 border-red-300 hover:bg-red-50"
                                            >
                                                Clear Coupon
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Available Coupons */}
                <Card className="mt-8 bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Tag className="w-5 h-5 text-purple-600" />
                            Available Coupon Codes
                        </CardTitle>
                        <CardDescription>
                            Sample coupon codes you can test
                            with
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {SAMPLE_COUPONS.map(
                                (coupon) => (
                                    <div
                                        key={coupon.code}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-semibold text-gray-900">
                                                {
                                                    coupon.code
                                                }
                                            </h4>
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {coupon.discountType ===
                                                'percentage'
                                                    ? `${coupon.discountValue}% OFF`
                                                    : `${
                                                          coupon.applicableLocations?.includes(
                                                              'india'
                                                          )
                                                              ? '₹'
                                                              : '$'
                                                      }${
                                                          coupon.discountValue
                                                      } OFF`}
                                            </Badge>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-3">
                                            {
                                                coupon.description
                                            }
                                        </p>

                                        <div className="space-y-1 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                <span>
                                                    Users:{' '}
                                                    {coupon.applicableUserTypes?.join(
                                                        ', '
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                <span>
                                                    Location:{' '}
                                                    {coupon.applicableLocations?.join(
                                                        ', '
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>
                                                    Valid:{' '}
                                                    {new Date(
                                                        coupon.validFrom
                                                    ).toLocaleDateString()}{' '}
                                                    -{' '}
                                                    {new Date(
                                                        coupon.validUntil
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {coupon.minimumAmount && (
                                                <div className="text-orange-600">
                                                    Min:{' '}
                                                    {coupon.applicableLocations?.includes(
                                                        'india'
                                                    )
                                                        ? '₹'
                                                        : '$'}
                                                    {
                                                        coupon.minimumAmount
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Test Buttons */}
                <Card className="mt-8 bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>
                            Quick Test Examples
                        </CardTitle>
                        <CardDescription>
                            Click to test specific coupon
                            scenarios
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setTicketType(
                                        'main-conference'
                                    );
                                    setUserType('regular');
                                    setLocation('india');
                                    setBaseAmount(12000);
                                    setCurrency('INR');
                                    setCouponCode(
                                        'EARLYBIRD2024'
                                    );
                                }}
                            >
                                Test EARLYBIRD2024 (India)
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setTicketType(
                                        'main-conference'
                                    );
                                    setUserType('student');
                                    setLocation(
                                        'international'
                                    );
                                    setBaseAmount(210);
                                    setCurrency('USD');
                                    setCouponCode(
                                        'STUDENT50'
                                    );
                                }}
                            >
                                Test STUDENT50
                                (International)
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setTicketType(
                                        'main-conference-tutorials'
                                    );
                                    setUserType('regular');
                                    setLocation('india');
                                    setBaseAmount(14400);
                                    setCurrency('INR');
                                    setCouponCode(
                                        'SAVE500'
                                    );
                                }}
                            >
                                Test SAVE500 (India)
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setTicketType(
                                        'main-conference'
                                    );
                                    setUserType('regular');
                                    setLocation(
                                        'international'
                                    );
                                    setBaseAmount(390);
                                    setCurrency('USD');
                                    setCouponCode(
                                        'SAVE10USD'
                                    );
                                }}
                            >
                                Test SAVE10USD
                                (International)
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
