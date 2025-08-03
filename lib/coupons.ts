// Coupon code system for the event management app

export interface CouponCode {
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minimumAmount?: number;
    maximumDiscount?: number;
    validFrom: string;
    validUntil: string;
    usageLimit?: number;
    usedCount: number;
    applicableTicketTypes?: string[];
    applicableUserTypes?: string[];
    applicableLocations?: ('india' | 'international')[];
    isActive: boolean;
}

export interface CouponValidationResult {
    isValid: boolean;
    error?: string;
    coupon?: CouponCode;
    discountAmount?: number;
    discountPercentage?: number;
}

// Sample coupon codes for demonstration
export const SAMPLE_COUPONS: CouponCode[] = [
    {
        code: 'EARLYBIRD2024',
        description: 'Early Bird Discount - 15% off',
        discountType: 'percentage',
        discountValue: 15,
        minimumAmount: 1000,
        maximumDiscount: 2000,
        validFrom: '2024-01-01',
        validUntil: '2026-12-31',
        usageLimit: 100,
        usedCount: 45,
        applicableTicketTypes: [
            'conference-day-1',
            'conference-day-2',
            'conference-day-3',
            'conference-all-days',
            'main-conference-tutorials',
        ],
        applicableUserTypes: ['student', 'regular'],
        applicableLocations: ['india', 'international'],
        isActive: true,
    },
    {
        code: 'STUDENT50',
        description: 'Student Special - 50% off',
        discountType: 'percentage',
        discountValue: 50,
        minimumAmount: 500,
        maximumDiscount: 5000,
        validFrom: '2024-01-01',
        validUntil: '2026-12-31',
        usageLimit: 200,
        usedCount: 120,
        applicableTicketTypes: [
            'main-conference',
            'tutorials-day-1',
            'tutorials-day-1-2',
            'main-conference-tutorials',
        ],
        applicableUserTypes: ['student'],
        applicableLocations: ['india', 'international'],
        isActive: true,
    },
    {
        code: 'SAVE500',
        description: 'Fixed Discount - ₹500 off',
        discountType: 'fixed',
        discountValue: 500,
        minimumAmount: 2000,
        validFrom: '2024-01-01',
        validUntil: '2026-12-31',
        usageLimit: 50,
        usedCount: 20,
        applicableTicketTypes: [
            'main-conference-tutorials',
        ],
        applicableUserTypes: ['regular', 'author'],
        applicableLocations: ['india'],
        isActive: true,
    },
    {
        code: 'SAVE10USD',
        description: 'Fixed Discount - $10 off',
        discountType: 'fixed',
        discountValue: 10,
        minimumAmount: 50,
        validFrom: '2024-01-01',
        validUntil: '2026-12-31',
        usageLimit: 100,
        usedCount: 30,
        applicableTicketTypes: [
            'conference-day-1',
            'conference-day-2',
            'conference-day-3',
            'conference-all-days',
            'main-conference-tutorials',
        ],
        applicableUserTypes: ['regular', 'author'],
        applicableLocations: ['international'],
        isActive: true,
    },
    {
        code: 'AUTHOR25',
        description: 'Author Discount - 25% off',
        discountType: 'percentage',
        discountValue: 25,
        minimumAmount: 1000,
        maximumDiscount: 3000,
        validFrom: '2024-01-01',
        validUntil: '2026-12-31',
        usageLimit: 75,
        usedCount: 25,
        applicableTicketTypes: [
            'conference-day-1',
            'conference-day-2',
            'conference-day-3',
            'conference-all-days',
            'main-conference-tutorials',
        ],
        applicableUserTypes: ['author'],
        applicableLocations: ['india', 'international'],
        isActive: true,
    },
];

/**
 * Validate a coupon code
 */
export function validateCouponCode(
    code: string,
    ticketType: string,
    userType: string,
    location: 'india' | 'international',
    baseAmount: number,
    currency: 'INR' | 'USD'
): CouponValidationResult {
    // Find the coupon
    const coupon = SAMPLE_COUPONS.find(
        (c) =>
            c.code.toUpperCase() === code.toUpperCase() &&
            c.isActive
    );

    if (!coupon) {
        return {
            isValid: false,
            error: 'Invalid coupon code',
        };
    }

    // Check if coupon is expired
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (now < validFrom) {
        return {
            isValid: false,
            error: 'Coupon is not yet valid',
        };
    }

    if (now > validUntil) {
        return {
            isValid: false,
            error: 'Coupon has expired',
        };
    }

    // Check usage limit
    if (
        coupon.usageLimit &&
        coupon.usedCount >= coupon.usageLimit
    ) {
        return {
            isValid: false,
            error: 'Coupon usage limit reached',
        };
    }

    // Check minimum amount
    if (
        coupon.minimumAmount &&
        baseAmount < coupon.minimumAmount
    ) {
        return {
            isValid: false,
            error: `Minimum purchase amount of ${
                currency === 'INR' ? '₹' : '$'
            }${coupon.minimumAmount} required`,
        };
    }

    // Check applicable ticket types
    if (
        coupon.applicableTicketTypes &&
        !coupon.applicableTicketTypes.includes(ticketType)
    ) {
        return {
            isValid: false,
            error: 'Coupon not applicable for this ticket type',
        };
    }

    // Check applicable user types
    if (
        coupon.applicableUserTypes &&
        !coupon.applicableUserTypes.includes(userType)
    ) {
        return {
            isValid: false,
            error: 'Coupon not applicable for your user type',
        };
    }

    // Check applicable locations
    if (
        coupon.applicableLocations &&
        !coupon.applicableLocations.includes(location)
    ) {
        return {
            isValid: false,
            error: 'Coupon not applicable for your location',
        };
    }

    // Calculate discount amount
    let discountAmount = 0;
    let discountPercentage = 0;

    if (coupon.discountType === 'percentage') {
        discountPercentage = coupon.discountValue;
        discountAmount = Math.round(
            (baseAmount * coupon.discountValue) / 100
        );

        // Apply maximum discount limit
        if (
            coupon.maximumDiscount &&
            discountAmount > coupon.maximumDiscount
        ) {
            discountAmount = coupon.maximumDiscount;
            discountPercentage = Math.round(
                (discountAmount / baseAmount) * 100
            );
        }
    } else {
        discountAmount = coupon.discountValue;
        discountPercentage = Math.round(
            (discountAmount / baseAmount) * 100
        );
    }

    return {
        isValid: true,
        coupon,
        discountAmount,
        discountPercentage,
    };
}

/**
 * Apply coupon discount to pricing
 */
export function applyCouponDiscount(
    baseAmount: number,
    couponResult: CouponValidationResult
): number {
    if (
        !couponResult.isValid ||
        !couponResult.discountAmount
    ) {
        return baseAmount;
    }

    return Math.max(
        0,
        baseAmount - couponResult.discountAmount
    );
}

/**
 * Get formatted discount display
 */
export function getDiscountDisplay(
    couponResult: CouponValidationResult,
    currency: 'INR' | 'USD'
): string {
    if (!couponResult.isValid || !couponResult.coupon) {
        return '';
    }

    const symbol = currency === 'INR' ? '₹' : '$';

    if (couponResult.coupon.discountType === 'percentage') {
        return `${couponResult.coupon.discountValue}% OFF`;
    } else {
        return `${symbol}${couponResult.coupon.discountValue} OFF`;
    }
}

/**
 * Get coupon savings display
 */
export function getSavingsDisplay(
    couponResult: CouponValidationResult,
    currency: 'INR' | 'USD'
): string {
    if (
        !couponResult.isValid ||
        !couponResult.discountAmount
    ) {
        return '';
    }

    const symbol = currency === 'INR' ? '₹' : '$';
    return `${symbol}${couponResult.discountAmount.toLocaleString()}`;
}

/**
 * Get available coupon codes for display
 */
export function getAvailableCoupons(): CouponCode[] {
    return SAMPLE_COUPONS.filter(
        (coupon) => coupon.isActive
    );
}

/**
 * Get coupon codes applicable for specific criteria
 */
export function getApplicableCoupons(
    ticketType: string,
    userType: string,
    location: 'india' | 'international'
): CouponCode[] {
    return SAMPLE_COUPONS.filter((coupon) => {
        if (!coupon.isActive) return false;

        // Check if coupon is expired
        const now = new Date();
        const validFrom = new Date(coupon.validFrom);
        const validUntil = new Date(coupon.validUntil);

        if (now < validFrom || now > validUntil)
            return false;

        // Check usage limit
        if (
            coupon.usageLimit &&
            coupon.usedCount >= coupon.usageLimit
        )
            return false;

        // Check applicable ticket types
        if (
            coupon.applicableTicketTypes &&
            !coupon.applicableTicketTypes.includes(
                ticketType
            )
        )
            return false;

        // Check applicable user types
        if (
            coupon.applicableUserTypes &&
            !coupon.applicableUserTypes.includes(userType)
        )
            return false;

        // Check applicable locations
        if (
            coupon.applicableLocations &&
            !coupon.applicableLocations.includes(location)
        )
            return false;

        return true;
    });
}
