// Centralized data management for the event management app

export const APP_CONFIG = {
    // GST Configuration
    GST: {
        INDIAN_GST_RATE: 18, // 18% GST for Indian customers
        INTERNATIONAL_GST_RATE: 0, // No GST for international customers
    },

    // Currency Configuration
    CURRENCIES: {
        INDIAN: 'INR' as const,
        INTERNATIONAL: 'USD' as const,
    },

    // Country Configuration
    COUNTRIES: {
        INDIA: 'IN' as const,
        INTERNATIONAL: 'INTL' as const,
    },

    // Payment Gateway Configuration
    PAYMENT_GATEWAYS: {
        INDIAN: 'razorpay' as const, // Updated to use Razorpay for Indian payments
        INTERNATIONAL: 'razorpay' as const,
    },

    // Event Configuration
    EVENT: {
        id: 'vlsid-2026',
        name: 'vlsid',
        description:
            'Premier event bringing together innovators and industry leaders',
        startDate: '2026-01-03',
        endDate: '2026-01-07',
        venue: 'vlsid Convention Center, Bangalore',
        maxAttendees: 1000,
    },
} as const;

// Ticket Types Configuration - Updated to match new pricing system
export const TICKET_TYPES = {
    'conference-day-1': {
        id: 'conference-day-1',
        name: 'Conference Day 1',
        description:
            'Access to Day 1 conference sessions and networking',
        duration: '1 Day',
        eventDates: 'January 5, 2026',
        features: [
            'Day 1 conference sessions',
            'Networking events',
            'Day 1 meals',
            'Digital materials',
            'Certificate of attendance',
        ],
    },
    'conference-day-2': {
        id: 'conference-day-2',
        name: 'Conference Day 2',
        description:
            'Access to Day 2 conference sessions and networking',
        duration: '1 Day',
        eventDates: 'January 6, 2026',
        features: [
            'Day 2 conference sessions',
            'Networking events',
            'Day 2 meals',
            'Digital materials',
            'Certificate of attendance',
        ],
    },
    'conference-day-3': {
        id: 'conference-day-3',
        name: 'Conference Day 3',
        description:
            'Access to Day 3 conference sessions and networking',
        duration: '1 Day',
        eventDates: 'January 7, 2026',
        features: [
            'Day 3 conference sessions',
            'Networking events',
            'Day 3 meals',
            'Digital materials',
            'Certificate of attendance',
        ],
    },
    'conference-all-days': {
        id: 'conference-all-days',
        name: 'Conference All Days',
        description:
            'Access to all conference sessions, networking events, and meals',
        duration: '3 Days',
        eventDates: 'January 5-7, 2026',
        features: [
            'All conference sessions',
            'Networking events',
            'Conference meals',
            'Digital materials',
            'Certificate of attendance',
        ],
    },
    'tutorials-day-1': {
        id: 'tutorials-day-1',
        name: 'Tutorials Day 1',
        description:
            'Hands-on tutorial sessions with industry experts on Day 1',
        duration: '1 Day',
        eventDates: 'January 3, 2026',
        features: [
            'Day 1 tutorials',
            'Expert mentorship',
            'Practice materials',
            'Certificate of completion',
        ],
    },
    'tutorials-day-1-2': {
        id: 'tutorials-day-1-2',
        name: 'Tutorials Day 1-2',
        description:
            'Hands-on tutorial sessions with industry experts on Day 1-2',
        duration: '2 Days',
        eventDates: 'January 3-4, 2026',
        features: [
            'Day 1-2 tutorials',
            'Expert mentorship',
            'Practice materials',
            'Certificate of completion',
        ],
    },
    'main-conference-tutorials': {
        id: 'main-conference-tutorials',
        name: 'Main Conference + Tutorials',
        description:
            'Complete access to everything - best value package',
        duration: '5 Days',
        eventDates: 'January 3-7, 2026',
        features: [
            'All conference sessions',
            'All tutorial sessions',
            'Networking events',
            'All meals included',
            'Digital & practice materials',
            'Priority seating',
            'Certificates of attendance & completion',
        ],
    },
} as const;

// Payment Method Configuration
export const PAYMENT_METHODS = {
    RAZORPAY: {
        card: {
            id: 'razorpay-card',
            name: 'Credit/Debit Card',
            description:
                'Visa, Mastercard, American Express',
            icon: 'credit-card',
            fees: 2.9, // 2.9% + processing fee
        },
        // Add support for Indian payment methods via Razorpay
        upi: {
            id: 'razorpay-upi',
            name: 'UPI',
            description:
                'Pay using UPI (Indian customers only)',
            icon: 'smartphone',
            fees: 2.0, // Lower fees for UPI
        },
        netbanking: {
            id: 'razorpay-netbanking',
            name: 'Net Banking',
            description: 'All major Indian banks',
            icon: 'building',
            fees: 2.0,
        },
        wallet: {
            id: 'razorpay-wallet',
            name: 'Digital Wallets',
            description: 'Paytm, PhonePe, Google Pay',
            icon: 'wallet',
            fees: 2.0,
        },
    },
} as const;

// Helper functions for data management
// Note: Pricing is now handled by the centralized pricing system in lib/pricing.ts
// This function is kept for backward compatibility but should be replaced with calculatePricing
export const getTicketPrice = (
    _ticketType: keyof typeof TICKET_TYPES,
    _isIndian: boolean
) => {
    // This is a fallback function - actual pricing should use lib/pricing.ts
    console.warn(
        'getTicketPrice is deprecated. Use calculatePricing from lib/pricing.ts instead.'
    );
    return 0; // Return 0 as pricing is now handled centrally
};

export const getCurrency = (isIndian: boolean) => {
    return isIndian
        ? APP_CONFIG.CURRENCIES.INDIAN
        : APP_CONFIG.CURRENCIES.INTERNATIONAL;
};

export const getPaymentGateway = (isIndian: boolean) => {
    return isIndian
        ? APP_CONFIG.PAYMENT_GATEWAYS.INDIAN
        : APP_CONFIG.PAYMENT_GATEWAYS.INTERNATIONAL;
};

export const calculateGST = (
    amount: number,
    isIndian: boolean
) => {
    const gstRate = isIndian
        ? APP_CONFIG.GST.INDIAN_GST_RATE
        : APP_CONFIG.GST.INTERNATIONAL_GST_RATE;
    return {
        gstRate,
        gstAmount: Math.round((amount * gstRate) / 100),
        totalWithGST: Math.round(
            amount + (amount * gstRate) / 100
        ),
    };
};

export const formatCurrency = (
    amount: number,
    isIndian: boolean
) => {
    const currency = getCurrency(isIndian);
    const symbol = isIndian ? '₹' : '$';

    return {
        symbol,
        currency,
        formatted: `${symbol}${amount.toLocaleString()}`,
        amount,
    };
};

// Get available payment methods based on user category
export const getPaymentMethods = (
    userCategory: 'indian' | 'international'
) => {
    if (userCategory === 'indian') {
        // Return all Razorpay payment methods for Indian users
        return PAYMENT_METHODS.RAZORPAY;
    } else {
        // Return only card payments for international users
        return {
            card: PAYMENT_METHODS.RAZORPAY.card,
        };
    }
};

// Types for better type safety
export type TicketType = keyof typeof TICKET_TYPES;
export type PaymentMethod =
    keyof typeof PAYMENT_METHODS.RAZORPAY;
export type Currency =
    | typeof APP_CONFIG.CURRENCIES.INDIAN
    | typeof APP_CONFIG.CURRENCIES.INTERNATIONAL;
export type PaymentGateway =
    | typeof APP_CONFIG.PAYMENT_GATEWAYS.INDIAN
    | typeof APP_CONFIG.PAYMENT_GATEWAYS.INTERNATIONAL;
