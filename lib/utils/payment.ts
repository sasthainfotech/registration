import {
    formatCurrency,
    TICKET_TYPES,
    getPaymentGateway as getBasePaymentGateway,
    getCurrency as getBaseCurrency,
} from '@/lib/config/app-data';
import {
    calculatePricing,
    TicketType,
    UserProfile,
} from '@/lib/pricing';
import type { PricingDetails } from '@/lib/types';

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

export const getPaymentGatewayForCountry = (
    country: string
) => {
    const isIndian = country === 'IN';
    return getBasePaymentGateway(isIndian);
};

export const getCurrencyForCountry = (country: string) => {
    const isIndian = country === 'IN';
    return getBaseCurrency(isIndian);
};

export const calculateTicketPricing = (
    ticketType: TicketType,
    country: string
): PricingDetails => {
    const isIndian = country === 'IN';

    // Create user profile for the new pricing system
    const userProfile: UserProfile = {
        location: isIndian ? 'india' : 'international',
        userType: 'regular', // Default to regular, can be enhanced later
    };

    // Use the new centralized pricing system
    const pricingResult = calculatePricing(
        ticketType,
        userProfile
    );

    return {
        basePrice: pricingResult.originalPrice,
        gstRate: isIndian ? 18 : 0, // GST rate from pricing system
        gstAmount:
            pricingResult.finalPrice -
            pricingResult.originalPrice,
        totalPrice: pricingResult.finalPrice,
        currency: pricingResult.currency,
        isIndian,
        ieeeDiscount: 0, // IEEE discount is now built into the pricing
        originalBasePrice: pricingResult.originalPrice,
    };
};

export const formatPrice = (
    amount: number,
    country: string
) => {
    const isIndian = country === 'IN';
    return formatCurrency(amount, isIndian);
};

export const getTicketDetails = (
    ticketType: TicketType
) => {
    return TICKET_TYPES[ticketType];
};

export const getAllTicketTypes = () => {
    return Object.values(TICKET_TYPES);
};

// Legacy functions for backward compatibility
export const getPaymentGateway = (country: string) => {
    return getPaymentGatewayForCountry(country);
};

export const getCurrency = (country: string) => {
    return getCurrencyForCountry(country);
};

export const getTicketPrice = (
    ticketType: string,
    country: string
) => {
    const pricing = calculateTicketPricing(
        ticketType as TicketType,
        country
    );
    return pricing.basePrice;
};

// New utility functions for payment processing
export const createPaymentSummary = (
    ticketType: TicketType,
    country: string,
    ieeeMembershipData?: IEEEMembershipData | null
) => {
    const pricing = calculateTicketPricing(
        ticketType,
        country
    );
    const ticketDetails = getTicketDetails(ticketType);
    const formattedPrice = formatPrice(
        pricing.totalPrice,
        country
    );

    return {
        ticket: ticketDetails,
        pricing,
        formatted: formattedPrice,
        paymentGateway:
            getPaymentGatewayForCountry(country),
        ieeeMembershipData,
    };
};

export const validatePaymentAmount = (
    expectedAmount: number,
    receivedAmount: number,
    currency: string
): boolean => {
    // Allow for small rounding differences (1 paisa/cent)
    const tolerance = currency === 'INR' ? 1 : 0.01;
    return (
        Math.abs(expectedAmount - receivedAmount) <=
        tolerance
    );
};
