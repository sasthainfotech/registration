'use client';

import { useState, useCallback } from 'react';

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

interface IEEEVerificationState {
    isLoading: boolean;
    isVerified: boolean;
    membershipData: IEEEMembershipData | null;
    error: string | null;
    hasAttempted: boolean;
}

interface IEEEVerificationProps {
    userCategory: 'indian' | 'international';
}

interface IEEEVerificationReturn
    extends IEEEVerificationState {
    verifyMembership: (
        email?: string,
        membershipId?: string
    ) => Promise<void>;
    skipVerification: () => void;
    resetVerification: () => void;
    setVerificationState: (
        state: Partial<IEEEVerificationState>
    ) => void;
}

export const useIEEEVerification = ({
    userCategory,
}: IEEEVerificationProps): IEEEVerificationReturn => {
    const [state, setState] =
        useState<IEEEVerificationState>({
            isLoading: false,
            isVerified: false,
            membershipData: null,
            error: null,
            hasAttempted: false,
        });

    const verifyMembership = useCallback(
        async (email?: string, membershipId?: string) => {
            if (!email && !membershipId) {
                setState((prev) => ({
                    ...prev,
                    error: 'Please provide either email or membership ID',
                }));
                return;
            }

            setState((prev) => ({
                ...prev,
                isLoading: true,
                error: null,
            }));

            try {
                console.log(
                    'Starting IEEE verification...',
                    {
                        email: email
                            ? '***@***'
                            : 'Not provided',
                        membershipId: membershipId
                            ? '***'
                            : 'Not provided',
                        userCategory,
                    }
                );

                const response = await fetch(
                    '/api/ieee-verification',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type':
                                'application/json',
                        },
                        body: JSON.stringify({
                            email,
                            membershipId,
                            userCategory,
                        }),
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                            'Failed to verify IEEE membership'
                    );
                }

                if (!data.success) {
                    throw new Error(
                        data.error || 'Verification failed'
                    );
                }

                console.log(
                    'IEEE verification successful:',
                    {
                        isMember: data.data?.isMember,
                        membershipLevel:
                            data.data?.membershipLevel,
                        discountEligible:
                            data.data?.discountEligible,
                    }
                );

                // Store verification result in localStorage for persistence
                localStorage.setItem(
                    'ieeeVerification',
                    JSON.stringify({
                        isVerified: true,
                        membershipData: data.data,
                        verifiedAt:
                            new Date().toISOString(),
                    })
                );

                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    isVerified: true,
                    membershipData: data.data,
                    hasAttempted: true,
                    error: null,
                }));
            } catch (error) {
                console.error(
                    'IEEE verification error:',
                    error
                );

                let errorMessage =
                    'Failed to verify IEEE membership. Please try again.';
                if (error instanceof Error) {
                    errorMessage = error.message;
                }

                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: errorMessage,
                    hasAttempted: true,
                }));
            }
        },
        [userCategory]
    );

    const skipVerification = useCallback(() => {
        console.log('User skipped IEEE verification');

        // Store that user skipped verification
        localStorage.setItem(
            'ieeeVerification',
            JSON.stringify({
                isVerified: true,
                membershipData: {
                    isMember: false,
                    discountEligible: false,
                },
                skipped: true,
                verifiedAt: new Date().toISOString(),
            })
        );

        setState((prev) => ({
            ...prev,
            isVerified: true,
            membershipData: {
                isMember: false,
                discountEligible: false,
            },
            hasAttempted: true,
            error: null,
        }));
    }, []);

    const resetVerification = useCallback(() => {
        console.log('Resetting IEEE verification state');

        // Clear stored verification
        localStorage.removeItem('ieeeVerification');

        setState({
            isLoading: false,
            isVerified: false,
            membershipData: null,
            error: null,
            hasAttempted: false,
        });
    }, []);

    const setVerificationState = useCallback(
        (newState: Partial<IEEEVerificationState>) => {
            setState((prev) => ({
                ...prev,
                ...newState,
            }));
        },
        []
    );

    return {
        ...state,
        verifyMembership,
        skipVerification,
        resetVerification,
        setVerificationState,
    };
};
