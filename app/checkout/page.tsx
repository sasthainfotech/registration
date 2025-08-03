'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Alert,
    AlertDescription,
} from '@/components/ui/alert';
import {
    ArrowLeft,
    Shield,
    Check,
    AlertTriangle,
    Loader2,
    IndianRupee,
    DollarSign,
    User,
    UserPlus,
    Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePayment } from '@/hooks/use-payment';
import { useCoupon } from '@/hooks/use-coupon';
import { useAuth } from '@/hooks/use-auth';
import { TicketType } from '@/lib/config/app-data';

import { RazorpayResponse } from '@/lib/types';

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

export default function CheckoutPage() {
    const {
        user,
        isAuthenticated,
        login,
        register,
        logout,
        isLoading: authLoading,
    } = useAuth();

    const [ticketType, setTicketType] =
        useState<TicketType>('main-conference-tutorials');
    const [userCategory, setUserCategory] = useState<
        'indian' | 'international'
    >('international');
    const [country, setCountry] = useState<'IN' | 'INTL'>(
        'INTL'
    );
    const [pageLoading, setPageLoading] = useState(true);
    const [ieeeMembershipData, setIeeeMembershipData] =
        useState<IEEEMembershipData | null>(null);

    // User authentication state
    const [showAuthForm, setShowAuthForm] = useState(false);
    const [authMode, setAuthMode] = useState<
        'login' | 'register'
    >('login');
    const [authData, setAuthData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [authFormLoading, setAuthFormLoading] =
        useState(false);
    const [authError, setAuthError] = useState<
        string | null
    >(null);
    const [authSuccess, setAuthSuccess] = useState<
        string | null
    >(null);

    // Initialize payment hook
    const { isLoading, paymentSummary } = usePayment({
        ticketType,
        userCategory,
        country,
        ieeeMembershipData,
        userData: user
            ? {
                  name: `${user.firstName} ${user.lastName}`,
                  email: user.email,
                  contact: user.phone,
              }
            : undefined,
    });

    // Initialize coupon hook
    const {
        couponCode,
        setCouponCode,
        couponResult,
        isLoading: couponLoading,
        error: couponError,
        validateCoupon,
        clearCoupon,
        applicableCoupons,
    } = useCoupon({
        ticketType,
        userType: 'regular',
        location:
            userCategory === 'indian'
                ? 'india'
                : 'international',
        baseAmount:
            paymentSummary?.pricing?.totalPrice || 0,
        currency:
            paymentSummary?.pricing?.currency || 'USD',
    });

    // Calculate final price with coupon discount
    const finalPrice =
        couponResult?.isValid && couponResult.discountAmount
            ? Math.max(
                  0,
                  (paymentSummary?.pricing?.totalPrice ||
                      0) - couponResult.discountAmount
              )
            : paymentSummary?.pricing?.totalPrice || 0;

    // Format final price
    const formatPrice = (
        amount: number,
        currency: string
    ) => {
        const symbol = currency === 'INR' ? '₹' : '$';
        return `${symbol}${amount.toLocaleString()}`;
    };

    const finalPriceFormatted = formatPrice(
        finalPrice,
        paymentSummary?.pricing?.currency || 'USD'
    );

    // Initialize page data
    useEffect(() => {
        const initializePage = () => {
            const urlParams = new URLSearchParams(
                window.location.search
            );
            const urlTicket = urlParams.get(
                'ticket'
            ) as TicketType;
            const storedTicket = localStorage.getItem(
                'ticketType'
            ) as TicketType;
            const ticket =
                urlTicket ||
                storedTicket ||
                'main-conference-tutorials';
            setTicketType(ticket);

            const category = localStorage.getItem(
                'userCategory'
            ) as 'indian' | 'international';
            if (category) {
                setUserCategory(category);
                const countryCode =
                    category === 'indian' ? 'IN' : 'INTL';
                setCountry(countryCode);

                const ieeeVerification =
                    localStorage.getItem(
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
                    window.location.href =
                        '/ieee-verification';
                    return;
                }

                setPageLoading(false);
            } else {
                window.location.href = '/';
            }
        };

        initializePage();
    }, []);

    // Handle authentication
    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthFormLoading(true);
        setAuthError(null);
        setAuthSuccess(null);

        try {
            if (authMode === 'login') {
                const result = await login(
                    authData.email,
                    authData.password
                );

                if (result.success) {
                    setAuthSuccess('Login successful!');
                    setTimeout(() => {
                        setShowAuthForm(false);
                        setAuthSuccess(null);
                    }, 1500);
                } else {
                    setAuthError(
                        result.error || 'Login failed'
                    );
                }
            } else {
                if (
                    authData.password !==
                    authData.confirmPassword
                ) {
                    setAuthError('Passwords do not match');
                    return;
                }

                if (authData.password.length < 6) {
                    setAuthError(
                        'Password must be at least 6 characters long'
                    );
                    return;
                }

                if (!authData.phone.trim()) {
                    setAuthError(
                        'Phone number is required'
                    );
                    return;
                }

                const result = await register({
                    firstName: authData.firstName,
                    lastName: authData.lastName,
                    email: authData.email,
                    phone: authData.phone,
                    country:
                        country === 'IN'
                            ? 'India'
                            : 'International',
                    password: authData.password,
                });

                if (result.success) {
                    setAuthSuccess(
                        'Account created successfully! You are now logged in.'
                    );
                    setTimeout(() => {
                        setShowAuthForm(false);
                        setAuthSuccess(null);
                    }, 2000);
                } else {
                    setAuthError(
                        result.error ||
                            'Registration failed'
                    );
                }
            }
        } catch (error: unknown) {
            console.error('Authentication failed:', error);
            setAuthError(
                'An unexpected error occurred. Please try again.'
            );
        } finally {
            setAuthFormLoading(false);
        }
    };

    // Create payment function
    const processPayment = async () => {
        try {
            if (typeof window.Razorpay === 'undefined') {
                console.error('Razorpay SDK not loaded.');
                alert(
                    'Razorpay SDK not loaded. Please try again.'
                );
                return;
            }

            const userData = user
                ? {
                      name: `${user.firstName} ${user.lastName}`,
                      email: user.email,
                      contact: user.phone,
                  }
                : {
                      name: 'Test User',
                      email: 'testuser@example.com',
                      contact: '9999999999',
                  };

            const amount = 1;
            const currency =
                userCategory === 'indian' ? 'INR' : 'USD';

            console.log(
                'Using discounted amount for Razorpay:',
                {
                    originalPrice:
                        paymentSummary?.pricing?.totalPrice,
                    discountedPrice: amount,
                    discountApplied:
                        couponResult?.isValid &&
                        couponResult.discountAmount,
                    discountAmount:
                        couponResult?.discountAmount,
                }
            );

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
                        userEmail: userData.email,
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

            if (!orderData.id) {
                throw new Error(
                    'Failed to create Razorpay order - no order ID returned'
                );
            }

            const options = {
                key: 'rzp_live_qzEA66nHs1SIL1',
                amount: amount * 100,
                currency,
                name: 'VLSID Conference',
                description: `${ticketType} - ${userCategory} pricing (Discounted)`,
                order_id: orderData.id,
                handler: function (
                    response: RazorpayResponse
                ) {
                    console.log(
                        'Payment successful',
                        response
                    );
                    window.location.href =
                        '/payment-success';
                },
                prefill: {
                    name: userData.name,
                    email: userData.email,
                    contact: userData.contact,
                },
                theme: {
                    color: '#3399cc',
                },
                modal: {
                    ondismiss: function () {
                        // Handle modal dismissal if needed
                    },
                },
            };

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
        }
    };

    // Handle payment button click
    const handlePaymentClick = async () => {
        if (!isAuthenticated) {
            setShowAuthForm(true);
            return;
        }

        await processPayment();
    };

    // Determine button state
    const getButtonState = () => {
        if (isLoading) {
            return {
                disabled: true,
                text: 'Processing Payment...',
                icon: (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ),
            };
        }

        if (!isAuthenticated) {
            return {
                disabled: false,
                text: 'Login to Continue',
                icon: <User className="w-4 h-4 mr-2" />,
            };
        }

        return {
            disabled: false,
            text: `Pay ${finalPriceFormatted}`,
            icon: null,
        };
    };

    // Loading state
    if (pageLoading || !paymentSummary || authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">
                        Loading checkout...
                    </p>
                </div>
            </div>
        );
    }

    const { ticket, pricing, formatted } = paymentSummary;
    const buttonState = getButtonState();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="max-w-4xl mx-auto px-4">
                {/* Navigation */}
                <div className="mb-6">
                    <Link
                        href="/select-category"
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Ticket Selection
                    </Link>
                </div>

                {/* Category Display */}
                <div className="flex justify-center mb-8">
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
                </div>

                {/* IEEE Membership Status */}
                {ieeeMembershipData && (
                    <div className="flex justify-center mb-8">
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
                    </div>
                )}

                {/* User Authentication Status */}
                {isAuthenticated && (
                    <div className="flex justify-center mb-8">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-green-800">
                                    <Check className="w-5 h-5" />
                                    <span className="font-medium">
                                        Logged in as{' '}
                                        {user
                                            ? `${user.firstName} ${user.lastName}`
                                            : 'User'}{' '}
                                        ({user?.email})
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={logout}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                >
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="max-w-2xl mx-auto">
                    {/* Order Summary */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>
                                Order Summary
                            </CardTitle>
                            <CardDescription>
                                Review your ticket selection
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Ticket Details */}
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">
                                        {ticket.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {ticket.description}
                                    </p>
                                    <div className="flex flex-col gap-2 mt-2">
                                        <Badge variant="secondary">
                                            {
                                                ticket.duration
                                            }
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            📅{' '}
                                            {
                                                ticket.eventDates
                                            }
                                        </Badge>
                                    </div>
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-2xl font-bold">
                                        {couponResult?.isValid &&
                                        couponResult.discountAmount ? (
                                            <div className="flex flex-col items-end">
                                                <span className="line-through text-gray-500 text-lg">
                                                    {
                                                        formatted.formatted
                                                    }
                                                </span>
                                                <span className="text-green-600">
                                                    {
                                                        finalPriceFormatted
                                                    }
                                                </span>
                                            </div>
                                        ) : (
                                            formatted.formatted
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Coupon Code Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Label
                                        htmlFor="coupon-code"
                                        className="text-sm font-medium"
                                    >
                                        Have a coupon code?
                                    </Label>
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        id="coupon-code"
                                        type="text"
                                        placeholder="Enter coupon code"
                                        value={couponCode}
                                        onChange={(e) =>
                                            setCouponCode(
                                                e.target.value.toUpperCase()
                                            )
                                        }
                                        className="flex-1"
                                        disabled={
                                            couponLoading
                                        }
                                    />
                                    <Button
                                        onClick={
                                            validateCoupon
                                        }
                                        disabled={
                                            !couponCode.trim() ||
                                            couponLoading
                                        }
                                        size="sm"
                                        variant="outline"
                                        className={
                                            couponLoading
                                                ? 'animate-pulse'
                                                : ''
                                        }
                                    >
                                        {couponLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                                Applying...
                                            </>
                                        ) : (
                                            'Apply'
                                        )}
                                    </Button>
                                </div>

                                {/* Coupon Error */}
                                {couponError && (
                                    <Alert
                                        variant="destructive"
                                        className="py-2"
                                    >
                                        <AlertTriangle className="w-4 h-4" />
                                        <AlertDescription className="text-xs">
                                            {couponError}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Applied Coupon */}
                                {couponResult?.isValid &&
                                    couponResult.coupon && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Check className="w-4 h-4 text-green-600" />
                                                    <span className="text-sm font-medium text-green-800">
                                                        {
                                                            couponResult
                                                                .coupon
                                                                .code
                                                        }{' '}
                                                        Applied
                                                    </span>
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {couponResult
                                                            .coupon
                                                            .discountType ===
                                                        'percentage'
                                                            ? `${couponResult.coupon.discountValue}% OFF`
                                                            : `${
                                                                  paymentSummary
                                                                      ?.pricing
                                                                      ?.currency ===
                                                                  'INR'
                                                                      ? '₹'
                                                                      : '$'
                                                              }${
                                                                  couponResult
                                                                      .coupon
                                                                      .discountValue
                                                              } OFF`}
                                                    </Badge>
                                                </div>
                                                <Button
                                                    onClick={
                                                        clearCoupon
                                                    }
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                            <p className="text-xs text-green-600 mt-1">
                                                {
                                                    couponResult
                                                        .coupon
                                                        .description
                                                }
                                            </p>

                                            {/* Real-time price update indicator */}
                                            <div className="mt-2 p-2 bg-white rounded border border-green-300">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-600">
                                                        Original
                                                        Price:
                                                    </span>
                                                    <span className="line-through text-gray-500">
                                                        {
                                                            formatted.formatted
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm font-medium">
                                                    <span className="text-green-700">
                                                        Final
                                                        Price:
                                                    </span>
                                                    <span className="text-green-600">
                                                        {
                                                            finalPriceFormatted
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs text-green-600">
                                                    <span>
                                                        You
                                                        Save:
                                                    </span>
                                                    <span>
                                                        {formatPrice(
                                                            couponResult.discountAmount ||
                                                                0,
                                                            paymentSummary
                                                                ?.pricing
                                                                ?.currency ||
                                                                'USD'
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                {/* Available Coupons Hint */}
                                {applicableCoupons.length >
                                    0 &&
                                    !couponResult?.isValid && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                            <p className="text-xs text-blue-800">
                                                💡 Available
                                                coupons:{' '}
                                                {applicableCoupons
                                                    .map(
                                                        (
                                                            c
                                                        ) =>
                                                            c.code
                                                    )
                                                    .join(
                                                        ', '
                                                    )}
                                            </p>
                                        </div>
                                    )}
                            </div>

                            <Separator />

                            {/* Price Breakdown */}
                            <div className="space-y-3">
                                {/* Show original price if IEEE discount is applied */}
                                {pricing.ieeeDiscount &&
                                    pricing.ieeeDiscount >
                                        0 && (
                                        <div className="flex justify-between text-sm">
                                            <span>
                                                Original
                                                Price
                                            </span>
                                            <span className="line-through text-gray-500">
                                                {
                                                    formatted.symbol
                                                }
                                                {pricing.originalBasePrice?.toLocaleString()}
                                            </span>
                                        </div>
                                    )}

                                <div className="flex justify-between text-sm">
                                    <span>
                                        {pricing.ieeeDiscount &&
                                        pricing.ieeeDiscount >
                                            0
                                            ? 'Discounted Price'
                                            : 'Base Price'}
                                    </span>
                                    <span className="font-medium">
                                        {formatted.symbol}
                                        {pricing.basePrice.toLocaleString()}
                                    </span>
                                </div>

                                {/* Show IEEE discount if applied */}
                                {pricing.ieeeDiscount &&
                                    pricing.ieeeDiscount >
                                        0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>
                                                IEEE Member
                                                Discount (
                                                {
                                                    pricing.ieeeDiscount
                                                }
                                                %)
                                            </span>
                                            <span className="font-medium">
                                                -
                                                {
                                                    formatted.symbol
                                                }
                                                {(
                                                    (pricing.originalBasePrice ||
                                                        0) -
                                                    pricing.basePrice
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                    )}

                                {/* Show GST for Indian customers */}
                                {pricing.gstAmount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span>
                                            GST (
                                            {
                                                pricing.gstRate
                                            }
                                            %)
                                        </span>
                                        <span className="font-medium">
                                            {
                                                formatted.symbol
                                            }
                                            {pricing.gstAmount.toLocaleString()}
                                        </span>
                                    </div>
                                )}

                                {/* Show Coupon Discount */}
                                {couponResult?.isValid &&
                                    couponResult.discountAmount &&
                                    couponResult.discountAmount >
                                        0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>
                                                Coupon
                                                Discount (
                                                {
                                                    couponResult
                                                        .coupon
                                                        ?.code
                                                }
                                                )
                                            </span>
                                            <span className="font-medium">
                                                -
                                                {
                                                    formatted.symbol
                                                }
                                                {couponResult.discountAmount.toLocaleString()}
                                            </span>
                                        </div>
                                    )}

                                <div className="flex justify-between text-sm">
                                    <span>
                                        Processing Fee
                                    </span>
                                    <span className="font-medium text-green-600">
                                        Included
                                    </span>
                                </div>

                                <Separator />

                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>
                                        {couponResult?.isValid &&
                                        couponResult.discountAmount ? (
                                            <div className="flex flex-col items-end">
                                                <span className="line-through text-gray-500 text-base">
                                                    {
                                                        formatted.formatted
                                                    }
                                                </span>
                                                <span className="text-green-600">
                                                    {
                                                        finalPriceFormatted
                                                    }
                                                </span>
                                            </div>
                                        ) : (
                                            formatted.formatted
                                        )}
                                    </span>
                                </div>

                                {/* IEEE savings summary */}
                                {pricing.ieeeDiscount &&
                                    pricing.ieeeDiscount >
                                        0 && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                                            <div className="flex items-center text-green-800">
                                                <Shield className="w-4 h-4 mr-2" />
                                                <span className="text-sm font-medium">
                                                    You
                                                    saved{' '}
                                                    {
                                                        formatted.symbol
                                                    }
                                                    {(
                                                        (pricing.originalBasePrice ||
                                                            0) -
                                                        pricing.basePrice
                                                    ).toLocaleString()}{' '}
                                                    with
                                                    your
                                                    IEEE
                                                    membership!
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                {/* Coupon savings summary */}
                                {couponResult?.isValid &&
                                    couponResult.discountAmount &&
                                    couponResult.discountAmount >
                                        0 && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                                            <div className="flex items-center text-blue-800">
                                                <Check className="w-4 h-4 mr-2" />
                                                <span className="text-sm font-medium">
                                                    You
                                                    saved{' '}
                                                    {
                                                        formatted.symbol
                                                    }
                                                    {couponResult.discountAmount.toLocaleString()}{' '}
                                                    with
                                                    coupon
                                                    code{' '}
                                                    {
                                                        couponResult
                                                            .coupon
                                                            ?.code
                                                    }
                                                    !
                                                </span>
                                            </div>
                                        </div>
                                    )}
                            </div>

                            {/* GST Notice for Indian customers */}
                            {pricing.gstAmount > 0 && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <p className="text-green-800 text-sm">
                                        <strong>
                                            GST Included:
                                        </strong>{' '}
                                        This price includes
                                        18% GST as per
                                        Indian tax
                                        regulations.
                                    </p>
                                </div>
                            )}

                            {/* Security Notice */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center text-blue-800 mb-2">
                                    <Shield className="w-5 h-5 mr-2" />
                                    <span className="font-medium">
                                        Secure Payment
                                    </span>
                                </div>
                                <p className="text-blue-700 text-sm">
                                    Your payment information
                                    is encrypted and secure.
                                    Powered by Razorpay with{' '}
                                    {userCategory ===
                                    'indian'
                                        ? 'INR'
                                        : 'USD'}{' '}
                                    support.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Authentication Form */}
                    {showAuthForm && !isAuthenticated && (
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    {authMode ===
                                    'login' ? (
                                        <>
                                            <User className="w-5 h-5 mr-2" />
                                            Login to
                                            Continue
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-5 h-5 mr-2" />
                                            Create Account
                                        </>
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {authMode === 'login'
                                        ? 'Sign in to complete your registration'
                                        : 'Create an account to register for the conference'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {authError && (
                                    <Alert
                                        variant="destructive"
                                        className="mb-4"
                                    >
                                        <AlertTriangle className="w-4 h-4" />
                                        <AlertDescription>
                                            {authError}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Auth Success Display */}
                                {authSuccess && (
                                    <Alert
                                        variant="default"
                                        className="mb-4 border-green-200 bg-green-50 text-green-800"
                                    >
                                        <Check className="w-4 h-4" />
                                        <AlertDescription>
                                            {authSuccess}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <form
                                    onSubmit={
                                        handleAuthSubmit
                                    }
                                    className="space-y-4"
                                >
                                    {authMode ===
                                        'register' && (
                                        <>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <Label htmlFor="firstName">
                                                        First
                                                        Name
                                                    </Label>
                                                    <Input
                                                        id="firstName"
                                                        type="text"
                                                        value={
                                                            authData.firstName
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            setAuthData(
                                                                (
                                                                    prev
                                                                ) => ({
                                                                    ...prev,
                                                                    firstName:
                                                                        e
                                                                            .target
                                                                            .value,
                                                                })
                                                            )
                                                        }
                                                        placeholder="First name"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="lastName">
                                                        Last
                                                        Name
                                                    </Label>
                                                    <Input
                                                        id="lastName"
                                                        type="text"
                                                        value={
                                                            authData.lastName
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            setAuthData(
                                                                (
                                                                    prev
                                                                ) => ({
                                                                    ...prev,
                                                                    lastName:
                                                                        e
                                                                            .target
                                                                            .value,
                                                                })
                                                            )
                                                        }
                                                        placeholder="Last name"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor="phone">
                                                    Phone
                                                    Number
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={
                                                        authData.phone
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        setAuthData(
                                                            (
                                                                prev
                                                            ) => ({
                                                                ...prev,
                                                                phone: e
                                                                    .target
                                                                    .value,
                                                            })
                                                        )
                                                    }
                                                    placeholder="Enter your phone number"
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <Label htmlFor="email">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={
                                                authData.email
                                            }
                                            onChange={(e) =>
                                                setAuthData(
                                                    (
                                                        prev
                                                    ) => ({
                                                        ...prev,
                                                        email: e
                                                            .target
                                                            .value,
                                                    })
                                                )
                                            }
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={
                                                authData.password
                                            }
                                            onChange={(e) =>
                                                setAuthData(
                                                    (
                                                        prev
                                                    ) => ({
                                                        ...prev,
                                                        password:
                                                            e
                                                                .target
                                                                .value,
                                                    })
                                                )
                                            }
                                            placeholder="Enter your password"
                                            required
                                        />
                                    </div>

                                    {authMode ===
                                        'register' && (
                                        <div>
                                            <Label htmlFor="confirmPassword">
                                                Confirm
                                                Password
                                            </Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                value={
                                                    authData.confirmPassword
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setAuthData(
                                                        (
                                                            prev
                                                        ) => ({
                                                            ...prev,
                                                            confirmPassword:
                                                                e
                                                                    .target
                                                                    .value,
                                                        })
                                                    )
                                                }
                                                placeholder="Confirm your password"
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <Button
                                            type="submit"
                                            className="flex-1"
                                            disabled={
                                                authFormLoading
                                            }
                                        >
                                            {authFormLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                    {authMode ===
                                                    'login'
                                                        ? 'Signing In...'
                                                        : 'Creating Account...'}
                                                </>
                                            ) : authMode ===
                                              'login' ? (
                                                'Sign In'
                                            ) : (
                                                'Create Account'
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setShowAuthForm(
                                                    false
                                                );
                                                setAuthError(
                                                    null
                                                );
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>

                                <div className="mt-4 text-center">
                                    <Button
                                        variant="link"
                                        onClick={() => {
                                            setAuthMode(
                                                authMode ===
                                                    'login'
                                                    ? 'register'
                                                    : 'login'
                                            );
                                            setAuthError(
                                                null
                                            );
                                        }}
                                        className="text-sm"
                                    >
                                        {authMode ===
                                        'login'
                                            ? "Don't have an account? Sign up"
                                            : 'Already have an account? Sign in'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pay Now Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">
                                Complete Your Purchase
                            </CardTitle>
                            <CardDescription className="text-center">
                                Secure payment powered by
                                Razorpay
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Button
                                onClick={handlePaymentClick}
                                disabled={
                                    buttonState.disabled
                                }
                                className="w-full"
                                size="lg"
                                variant="default"
                            >
                                {buttonState.icon}
                                {buttonState.text}
                            </Button>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center text-blue-800 mb-2">
                                    <Shield className="w-5 h-5 mr-2" />
                                    <span className="font-medium">
                                        Secure Payment
                                    </span>
                                </div>
                                <p className="text-blue-700 text-sm">
                                    Your payment information
                                    is encrypted and secure.
                                    Powered by Razorpay with{' '}
                                    {userCategory ===
                                    'indian'
                                        ? 'INR'
                                        : 'USD'}{' '}
                                    support.
                                </p>
                            </div>

                            <p className="text-xs text-gray-600 text-center">
                                By proceeding, you agree to
                                our{' '}
                                <Link
                                    href="/terms"
                                    className="text-blue-600 hover:underline"
                                >
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link
                                    href="/privacy"
                                    className="text-blue-600 hover:underline"
                                >
                                    Privacy Policy
                                </Link>
                                .
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
