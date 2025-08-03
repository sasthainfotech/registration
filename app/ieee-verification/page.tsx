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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    RadioGroup,
    RadioGroupItem,
} from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    AlertCircle,
    Users,
    Shield,
    Award,
    IndianRupee,
    DollarSign,
    Loader2,
    Mail,
    CreditCard,
    Info,
} from 'lucide-react';
import Link from 'next/link';
import { useIEEEVerification } from '@/hooks/use-ieee-verification';

type VerificationMethod = 'email' | 'membershipId';

export default function IEEEVerificationPage() {
    const [userCategory, setUserCategory] = useState<
        'indian' | 'international'
    >('indian');
    const [pageLoading, setPageLoading] = useState(true);
    const [verificationMethod, setVerificationMethod] =
        useState<VerificationMethod>('email');
    const [email, setEmail] = useState('');
    const [membershipId, setMembershipId] = useState('');

    const {
        isLoading,
        isVerified,
        membershipData,
        error,
        verifyMembership,
        skipVerification,
        resetVerification,
        setVerificationState,
    } = useIEEEVerification({ userCategory });

    // Load user category from localStorage
    useEffect(() => {
        const category = localStorage.getItem(
            'userCategory'
        ) as 'indian' | 'international';
        if (category) {
            setUserCategory(category);

            // Check if already verified
            const existingVerification =
                localStorage.getItem('ieeeVerification');
            if (existingVerification) {
                const verification = JSON.parse(
                    existingVerification
                );
                if (verification.isVerified) {
                    // Load existing verification data but don't redirect
                    // Allow users to update their membership status
                    setVerificationState({
                        isLoading: false,
                        isVerified: true,
                        membershipData:
                            verification.membershipData,
                        error: null,
                        hasAttempted: true,
                    });
                    // Note: hasAttempted is used in the state but not accessed separately
                }
            }

            setPageLoading(false);
        } else {
            // Redirect back to homepage if no category is selected
            window.location.href = '/';
        }
    }, [setVerificationState]);

    const handleVerification = async () => {
        if (verificationMethod === 'email' && email) {
            await verifyMembership(email);
        } else if (
            verificationMethod === 'membershipId' &&
            membershipId
        ) {
            await verifyMembership(undefined, membershipId);
        }
    };

    const handleContinue = () => {
        if (isVerified) {
            window.location.href = '/select-category';
        }
    };

    const handleSkip = () => {
        skipVerification();
        window.location.href = '/select-category';
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
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-6">
                    <Link
                        href="/"
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Category Selection
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
                            <Link href="/" className="ml-4">
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

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Shield className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        IEEE Membership Verification
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        IEEE members enjoy special discounts
                        and benefits. Verify your membership
                        to unlock exclusive pricing.
                    </p>
                </div>

                {!isVerified ? (
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Verification Form */}
                        <Card className="bg-white/90 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-600" />
                                    Verify IEEE Membership
                                </CardTitle>
                                <CardDescription>
                                    Choose your preferred
                                    verification method
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Verification Method Selection */}
                                <div>
                                    <Label className="text-sm font-medium">
                                        Verification Method
                                    </Label>
                                    <RadioGroup
                                        value={
                                            verificationMethod
                                        }
                                        onValueChange={(
                                            value
                                        ) => {
                                            setVerificationMethod(
                                                value as VerificationMethod
                                            );
                                            resetVerification();
                                        }}
                                        className="mt-2 space-y-3"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="email"
                                                id="email"
                                            />
                                            <Label
                                                htmlFor="email"
                                                className="flex items-center gap-2"
                                            >
                                                <Mail className="w-4 h-4" />
                                                Email
                                                Address
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="membershipId"
                                                id="membershipId"
                                            />
                                            <Label
                                                htmlFor="membershipId"
                                                className="flex items-center gap-2"
                                            >
                                                <CreditCard className="w-4 h-4" />
                                                Membership
                                                ID
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <Separator />

                                {/* Input Field */}
                                <div className="space-y-2">
                                    {verificationMethod ===
                                    'email' ? (
                                        <>
                                            <Label htmlFor="email-input">
                                                IEEE Email
                                                Address
                                            </Label>
                                            <Input
                                                id="email-input"
                                                type="email"
                                                placeholder="your.email@ieee.org"
                                                value={
                                                    email
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setEmail(
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                disabled={
                                                    isLoading
                                                }
                                            />
                                            <p className="text-xs text-gray-500">
                                                Enter the
                                                email
                                                address
                                                associated
                                                with your
                                                IEEE
                                                membership
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <Label htmlFor="membership-input">
                                                IEEE
                                                Membership
                                                ID
                                            </Label>
                                            <Input
                                                id="membership-input"
                                                type="text"
                                                placeholder="IEEE123456"
                                                value={
                                                    membershipId
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setMembershipId(
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                disabled={
                                                    isLoading
                                                }
                                            />
                                            <p className="text-xs text-gray-500">
                                                Enter your
                                                IEEE
                                                membership
                                                ID number
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Error Display */}
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                        <div className="flex items-center gap-2 text-red-800">
                                            <AlertCircle className="w-4 h-4" />
                                            <span className="text-sm font-medium">
                                                Verification
                                                Failed
                                            </span>
                                        </div>
                                        <p className="text-sm text-red-600 mt-1">
                                            {error}
                                        </p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <Button
                                        onClick={
                                            handleVerification
                                        }
                                        disabled={
                                            isLoading ||
                                            (verificationMethod ===
                                                'email' &&
                                                !email) ||
                                            (verificationMethod ===
                                                'membershipId' &&
                                                !membershipId)
                                        }
                                        className="w-full"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                <Shield className="w-4 h-4 mr-2" />
                                                Verify
                                                Membership
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={handleSkip}
                                        disabled={isLoading}
                                        className="w-full"
                                    >
                                        Skip Verification &
                                        Continue
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>

                                {/* Demo Credentials */}
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                                    <div className="flex items-center gap-2 text-blue-800 mb-2">
                                        <Info className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                            Demo Credentials
                                        </span>
                                    </div>
                                    <div className="text-xs text-blue-600 space-y-1">
                                        <p>
                                            <strong>
                                                Email:
                                            </strong>{' '}
                                            ieee.member@example.com
                                        </p>
                                        <p>
                                            <strong>
                                                Membership
                                                ID:
                                            </strong>{' '}
                                            IEEE123456
                                        </p>
                                        <p>
                                            <strong>
                                                Student
                                                Email:
                                            </strong>{' '}
                                            student.ieee@example.com
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Benefits Card */}
                        <Card className="bg-white/90 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-green-600" />
                                    IEEE Member Benefits
                                </CardTitle>
                                <CardDescription>
                                    Unlock exclusive perks
                                    with IEEE membership
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="p-1 bg-green-100 rounded-full mt-1">
                                            <CheckCircle className="w-3 h-3 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">
                                                Special
                                                Discounts
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Up to 25%
                                                off on
                                                conference
                                                and tutorial
                                                passes
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-1 bg-green-100 rounded-full mt-1">
                                            <CheckCircle className="w-3 h-3 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">
                                                Priority
                                                Access
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Early
                                                registration
                                                and priority
                                                seating
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-1 bg-green-100 rounded-full mt-1">
                                            <CheckCircle className="w-3 h-3 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">
                                                Exclusive
                                                Content
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Access to
                                                IEEE-only
                                                sessions and
                                                materials
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-1 bg-green-100 rounded-full mt-1">
                                            <CheckCircle className="w-3 h-3 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">
                                                Networking
                                                Events
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                VIP
                                                networking
                                                dinners and
                                                meetups
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="p-3 bg-gray-50 rounded-md">
                                    <h4 className="font-medium text-gray-900 mb-2">
                                        Not an IEEE Member?
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-3">
                                        You can still
                                        register at regular
                                        pricing. Consider
                                        joining IEEE for
                                        future benefits!
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            window.open(
                                                'https://www.ieee.org/membership/',
                                                '_blank'
                                            )
                                        }
                                    >
                                        Learn About IEEE
                                        Membership
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    /* Verification Success */
                    <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 bg-green-100 rounded-full">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl text-green-900">
                                {membershipData?.isMember
                                    ? 'Membership Verified!'
                                    : 'Verification Complete'}
                            </CardTitle>
                            <CardDescription className="text-lg">
                                {membershipData?.isMember
                                    ? 'Your IEEE membership has been successfully verified'
                                    : 'You can continue with regular pricing'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {membershipData?.isMember && (
                                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                                    <h3 className="font-semibold text-green-900 mb-3">
                                        Your Membership
                                        Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        {membershipData.membershipLevel && (
                                            <div>
                                                <span className="text-gray-600">
                                                    Level:
                                                </span>
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-2 capitalize"
                                                >
                                                    {
                                                        membershipData.membershipLevel
                                                    }
                                                </Badge>
                                            </div>
                                        )}
                                        {membershipData.membershipId && (
                                            <div>
                                                <span className="text-gray-600">
                                                    ID:
                                                </span>
                                                <span className="ml-2 font-mono">
                                                    {
                                                        membershipData.membershipId
                                                    }
                                                </span>
                                            </div>
                                        )}
                                        {membershipData.discountEligible && (
                                            <div>
                                                <span className="text-gray-600">
                                                    Discount:
                                                </span>
                                                <Badge
                                                    variant="default"
                                                    className="ml-2 bg-green-600"
                                                >
                                                    {
                                                        membershipData.discountPercentage
                                                    }
                                                    % OFF
                                                </Badge>
                                            </div>
                                        )}
                                        {membershipData.membershipStatus && (
                                            <div>
                                                <span className="text-gray-600">
                                                    Status:
                                                </span>
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-2 capitalize"
                                                >
                                                    {
                                                        membershipData.membershipStatus
                                                    }
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="text-center space-y-4">
                                <Button
                                    onClick={handleContinue}
                                    size="lg"
                                    className="px-12"
                                >
                                    Continue to Ticket
                                    Selection
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>

                                <div className="flex flex-col items-center space-y-2">
                                    <Button
                                        variant="outline"
                                        onClick={
                                            resetVerification
                                        }
                                        size="sm"
                                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                    >
                                        Update Membership
                                        Status
                                    </Button>
                                    <p className="text-xs text-gray-500">
                                        Need to change your
                                        membership details?
                                    </p>
                                </div>

                                <p className="text-sm text-gray-600 mt-4">
                                    {membershipData?.isMember
                                        ? 'Your discount will be automatically applied to the pricing'
                                        : 'You can proceed with regular conference pricing'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
