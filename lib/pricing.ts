// Pricing configuration and logic for the event management app
// All pricing values and rules are centralized in this file

export type UserLocation = 'india' | 'international';
export type UserType = 'student' | 'author' | 'regular';
export type IEEEStatus = 'member' | 'non-member';

// Ticket types organized by logical grouping
export type TicketType =
    | 'conference-day-1'
    | 'conference-day-2'
    | 'conference-day-3'
    | 'conference-all-days'
    | 'tutorials-day-1'
    | 'tutorials-day-1-2'
    | 'main-conference-tutorials';

// New types for corporate/university packages
export type PackageType =
    | 'corporate-5'
    | 'corporate-12'
    | 'university-8'
    | 'university-15';

export interface UserProfile {
    location: UserLocation;
    userType: UserType;
    // IEEE membership is no longer used for automatic pricing discounts
    // Discounts are now only applied through coupon codes
}

export interface PricingResult {
    originalPrice: number;
    // The concept of a separate discountedPrice is removed as prices are fixed
    currency: 'INR' | 'USD';
    // Discount percentage is no longer calculated, as prices are fixed
    appliedDiscounts: string[];
    finalPrice: number;
    eventDates?: {
        startDate: string;
        endDate: string;
        formattedDates: string;
    };
}

// Event date configuration
const EVENT_DATES = {
    'conference-day-1': {
        startDate: '2026-01-05',
        endDate: '2026-01-05',
        formattedDates: 'January 5, 2026',
    },
    'conference-day-2': {
        startDate: '2026-01-06',
        endDate: '2026-01-06',
        formattedDates: 'January 6, 2026',
    },
    'conference-day-3': {
        startDate: '2026-01-07',
        endDate: '2026-01-07',
        formattedDates: 'January 7, 2026',
    },
    'conference-all-days': {
        startDate: '2026-01-05',
        endDate: '2026-01-07',
        formattedDates: 'January 5-7, 2026',
    },
    'tutorials-day-1': {
        startDate: '2026-01-03',
        endDate: '2026-01-03',
        formattedDates: 'January 3, 2026',
    },
    'tutorials-day-1-2': {
        startDate: '2026-01-03',
        endDate: '2026-01-04',
        formattedDates: 'January 3-4, 2026',
    },
    'main-conference-tutorials': {
        startDate: '2026-01-03',
        endDate: '2026-01-07',
        formattedDates: 'January 3-7, 2026',
    },
} as const;

// Base pricing configuration - No automatic IEEE discounts, only coupon-based discounts
const PRICING_FROM_IMAGE = {
    'conference-day-1': {
        india: {
            student: 6000,
            regular: 6000,
            author: 6000,
        },
        international: {
            student: 75,
            regular: 75,
            author: 75,
        },
    },
    'conference-day-2': {
        india: {
            student: 9000,
            regular: 9000,
            author: 9000,
        },
        international: {
            student: 110,
            regular: 110,
            author: 110,
        },
    },
    'conference-day-3': {
        india: {
            student: 6000,
            regular: 6000,
            author: 6000,
        },
        international: {
            student: 75,
            regular: 75,
            author: 75,
        },
    },
    'conference-all-days': {
        india: {
            student: 12000,
            regular: 12000,
            author: 12000,
        },
        international: {
            student: 390,
            regular: 390,
            author: 390,
        },
    },
    'tutorials-day-1': {
        india: {
            student: 3000,
            regular: 3000,
            author: 3000,
        },
        international: {
            student: 84,
            regular: 84,
            author: 84,
        },
    },
    'tutorials-day-1-2': {
        india: {
            student: 4200,
            regular: 4200,
            author: 4200,
        },
        international: {
            student: 102,
            regular: 102,
            author: 102,
        },
    },
    'main-conference-tutorials': {
        india: {
            student: 14400,
            regular: 14400,
            author: 14400,
        },
        international: {
            student: 480,
            regular: 480,
            author: 480,
        },
    },
} as const;

// Package pricing configuration, also from the image
const PACKAGE_PRICING = {
    'corporate-5': 60000,
    'corporate-12': 120000,
    'university-8': 62000,
    'university-15': 120000,
} as const;

// GST is a fixed 18% for Indian participants, based on the final price
const GST_RATE = 18;

/**
 * Calculates the final price for a ticket based on user profile, using prices from the image.
 * This function no longer calculates discounts, but directly fetches the final price.
 * @param ticketType - The type of ticket being purchased
 * @param userProfile - User's profile including location, membership, and type
 * @returns PricingResult with all pricing details
 */
export function calculatePricing(
    ticketType: TicketType,
    userProfile: UserProfile
): PricingResult {
    const { location, userType } = userProfile;

    // Get the base price directly from the pricing structure (no IEEE discounts)
    const basePrice =
        PRICING_FROM_IMAGE[ticketType][location][userType];
    const currency = location === 'india' ? 'INR' : 'USD';

    let finalPrice = basePrice;
    const appliedDiscounts: string[] = []; // No automatic discounts, only coupon-based

    // Apply GST for Indian residents as a separate step
    if (location === 'india') {
        const gstAmount = Math.round(
            basePrice * (GST_RATE / 100)
        );
        finalPrice += gstAmount;
        appliedDiscounts.push(
            `GST (${GST_RATE}%): +${gstAmount} ${currency}`
        );
    }

    return {
        originalPrice: basePrice,
        currency,
        appliedDiscounts,
        finalPrice,
        eventDates: EVENT_DATES[ticketType],
    };
}

/**
 * Calculates the final price for a corporate or university package.
 * @param packageType - The type of package being purchased
 * @returns PricingResult with all pricing details
 */
export function calculatePackagePricing(
    packageType: PackageType
): PricingResult {
    const basePrice = PACKAGE_PRICING[packageType];
    const currency = 'INR'; // All packages are in INR based on the image

    let finalPrice = basePrice;
    const appliedDiscounts: string[] = []; // No discounts on packages

    // Apply GST for all packages as they are for "India"
    const gstAmount = Math.round(
        basePrice * (GST_RATE / 100)
    );
    finalPrice += gstAmount;
    appliedDiscounts.push(
        `GST (${GST_RATE}%): +${gstAmount} ${currency}`
    );

    return {
        originalPrice: basePrice,
        currency,
        appliedDiscounts,
        finalPrice,
        eventDates: {
            startDate: '2026-01-03',
            endDate: '2026-01-07',
            formattedDates: 'January 3-7, 2026',
        },
    };
}

/**
 * Get all available ticket types
 */
export function getAvailableTicketTypes(): TicketType[] {
    return Object.keys(PRICING_FROM_IMAGE) as TicketType[];
}

/**
 * Get pricing for all ticket types for a given user profile
 */
export function getAllPricing(
    userProfile: UserProfile
): Record<TicketType, PricingResult> {
    const ticketTypes = getAvailableTicketTypes();
    const pricing: Record<TicketType, PricingResult> =
        {} as Record<TicketType, PricingResult>;

    ticketTypes.forEach((ticketType) => {
        pricing[ticketType] = calculatePricing(
            ticketType,
            userProfile
        );
    });

    return pricing;
}

/**
 * Get event dates for a ticket type
 */
export function getEventDates(ticketType: TicketType) {
    return EVENT_DATES[ticketType];
}

/**
 * Format price for display
 */
export function formatPrice(
    price: number,
    currency: 'INR' | 'USD'
): string {
    if (currency === 'INR') {
        return `₹${price.toLocaleString('en-IN')}`;
    } else {
        return `$${price}`;
    }
}

/**
 * Get pricing summary for display
 */
export function getPricingSummary(
    ticketType: TicketType,
    userProfile: UserProfile
): string {
    const pricing = calculatePricing(
        ticketType,
        userProfile
    );
    const {
        originalPrice,
        finalPrice,
        currency,
        appliedDiscounts,
    } = pricing;

    let summary = `Base Price: ${formatPrice(
        originalPrice,
        currency
    )}\n`;

    if (appliedDiscounts.length > 0) {
        summary += `Applied Charges:\n`;
        appliedDiscounts.forEach((charge) => {
            summary += `  • ${charge}\n`;
        });
    }

    summary += `Final Price: ${formatPrice(
        finalPrice,
        currency
    )}`;

    return summary;
}

// Sample user profiles for demonstration
export const SAMPLE_USERS = {
    indianStudent: {
        name: 'Priya Sharma (Indian Student)',
        profile: {
            location: 'india' as const,
            userType: 'student' as const,
        },
    },
    indianRegular: {
        name: 'Rahul Kumar (Indian Regular)',
        profile: {
            location: 'india' as const,
            userType: 'regular' as const,
        },
    },
    internationalAuthor: {
        name: 'Dr. John Smith (International Author)',
        profile: {
            location: 'international' as const,
            userType: 'author' as const,
        },
    },
    internationalStudent: {
        name: 'Maria Sanchez (International Student)',
        profile: {
            location: 'international' as const,
            userType: 'student' as const,
        },
    },
} as const;

/**
 * Demonstrate pricing for sample users and packages
 */
export function demonstratePricing(): void {
    console.log(
        '=== REGISTRATION PRICING DEMONSTRATION ===\n'
    );

    Object.entries(SAMPLE_USERS).forEach(
        ([_userKey, user]) => {
            console.log(`\n--- ${user.name} ---`);
            console.log(
                `Profile: ${JSON.stringify(
                    user.profile,
                    null,
                    2
                )}`
            );

            const allPricing = getAllPricing(user.profile);

            Object.entries(allPricing).forEach(
                ([ticketType, pricing]) => {
                    console.log(
                        `\n${ticketType
                            .toUpperCase()
                            .replace(/-/g, ' ')} TICKET:`
                    );
                    console.log(
                        `  Base Price: ${formatPrice(
                            pricing.originalPrice,
                            pricing.currency
                        )}`
                    );
                    console.log(
                        `  Final Price: ${formatPrice(
                            pricing.finalPrice,
                            pricing.currency
                        )}`
                    );
                    if (
                        pricing.appliedDiscounts.length > 0
                    ) {
                        console.log(
                            `  Applied Charges: ${pricing.appliedDiscounts.join(
                                ', '
                            )}`
                        );
                    }
                }
            );
        }
    );

    console.log(
        '\n\n=== PACKAGE PRICING DEMONSTRATION ==='
    );
    const packages: PackageType[] = [
        'corporate-5',
        'corporate-12',
        'university-8',
        'university-15',
    ];
    packages.forEach((packageType) => {
        const pricing =
            calculatePackagePricing(packageType);
        console.log(
            `\n--- ${packageType
                .toUpperCase()
                .replace(/-/g, ' ')} ---`
        );
        console.log(
            `  Base Price: ${formatPrice(
                pricing.originalPrice,
                pricing.currency
            )}`
        );
        console.log(
            `  Final Price: ${formatPrice(
                pricing.finalPrice,
                pricing.currency
            )}`
        );
        console.log(
            `  Applied Charges: ${pricing.appliedDiscounts.join(
                ', '
            )}`
        );
    });
}

// Export pricing configurations for external use
export { PRICING_FROM_IMAGE, PACKAGE_PRICING };
