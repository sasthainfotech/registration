// Test file to demonstrate the pricing system
// This file can be run with: npx tsx lib/pricing.test.ts

import {
    calculatePricing,
    getAllPricing,
    SAMPLE_USERS,
    demonstratePricing,
    formatPrice,
    type UserProfile,
} from './pricing';

// Test function to demonstrate pricing calculations
function testPricingSystem() {
    console.log('🧪 TESTING PRICING SYSTEM\n');
    console.log('='.repeat(50));

    // Test 1: Indian IEEE Student
    console.log('\n📋 Test 1: Indian IEEE Student');
    const indianStudent =
        SAMPLE_USERS.indianStudent.profile;
    const conferencePricing = calculatePricing(
        'conference-all-days',
        indianStudent
    );

    console.log('User Profile:', indianStudent);
    console.log('Conference Ticket Pricing:');
    console.log(
        `  Base Price: ${formatPrice(
            conferencePricing.originalPrice,
            conferencePricing.currency
        )}`
    );
    console.log(
        `  Discounts: ${conferencePricing.appliedDiscounts.join(
            ', '
        )}`
    );
    console.log(
        `  Final Price: ${formatPrice(
            conferencePricing.finalPrice,
            conferencePricing.currency
        )}`
    );

    // Test 2: International Author
    console.log('\n📋 Test 2: International Author');
    const internationalAuthor =
        SAMPLE_USERS.internationalAuthor.profile;
    const bothPricing = calculatePricing(
        'main-conference-tutorials',
        internationalAuthor
    );

    console.log('User Profile:', internationalAuthor);
    console.log('Conference + Tutorial Ticket Pricing:');
    console.log(
        `  Base Price: ${formatPrice(
            bothPricing.originalPrice,
            bothPricing.currency
        )}`
    );
    console.log(
        `  Discounts: ${bothPricing.appliedDiscounts.join(
            ', '
        )}`
    );
    console.log(
        `  Final Price: ${formatPrice(
            bothPricing.finalPrice,
            bothPricing.currency
        )}`
    );

    // Test 3: All pricing for Indian Professional
    console.log(
        '\n📋 Test 3: All Ticket Types for Indian Professional'
    );
    const indianProfessional =
        SAMPLE_USERS.indianRegular.profile;
    const allPricing = getAllPricing(indianProfessional);

    console.log('User Profile:', indianProfessional);
    Object.entries(allPricing).forEach(
        ([ticketType, pricing]) => {
            console.log(`\n${ticketType.toUpperCase()}:`);
            console.log(
                `  Base: ${formatPrice(
                    pricing.originalPrice,
                    pricing.currency
                )}`
            );
            console.log(
                `  Applied Discounts: ${pricing.appliedDiscounts.join(
                    ', '
                )}`
            );
            console.log(
                `  Final: ${formatPrice(
                    pricing.finalPrice,
                    pricing.currency
                )}`
            );
        }
    );

    // Test 4: Custom user profile
    console.log('\n📋 Test 4: Custom User Profile');
    const customUser: UserProfile = {
        location: 'international',
        userType: 'author',
    };

    const customPricing = calculatePricing(
        'tutorials-day-1',
        customUser
    );
    console.log('Custom Profile:', customUser);
    console.log('Tutorials Day 1 Pricing:');
    console.log(
        `  Base Price: ${formatPrice(
            customPricing.originalPrice,
            customPricing.currency
        )}`
    );
    console.log(
        `  Applied Discounts: ${customPricing.appliedDiscounts.join(
            ', '
        )}`
    );
    console.log(
        `  Final Price: ${formatPrice(
            customPricing.finalPrice,
            customPricing.currency
        )}`
    );

    console.log('\n' + '='.repeat(50));
    console.log('✅ All tests completed successfully!');
}

// Run the demonstration
if (require.main === module) {
    console.log(
        '🚀 Starting Pricing System Demonstration\n'
    );

    // Run the built-in demonstration
    demonstratePricing();

    // Run our custom tests
    testPricingSystem();

    console.log(
        '\n🎉 Pricing system demonstration completed!'
    );
    console.log('\nTo use this in your app:');
    console.log(
        '1. Import the pricing functions from "@/lib/pricing"'
    );
    console.log(
        '2. Create a UserProfile object with user details'
    );
    console.log(
        '3. Call calculatePricing(ticketType, userProfile)'
    );
    console.log('4. Use the returned PricingResult object');
}

export { testPricingSystem };
