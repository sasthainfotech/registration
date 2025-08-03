# Pricing System Documentation

## Overview

The pricing system is a centralized, type-safe solution for calculating event ticket prices based on user profiles. All pricing logic, discount rules, and base prices are stored in a single file (`lib/pricing.ts`) for easy maintenance and updates.

## Features

- ✅ **Centralized Configuration**: All pricing values in one place
- ✅ **Type Safety**: Full TypeScript support with strict typing
- ✅ **Flexible Discount System**: Multiple discount types that stack
- ✅ **Location-Based Pricing**: Different currencies and tax rules
- ✅ **IEEE Membership Integration**: Special discounts for IEEE members
- ✅ **User Type Support**: Student, Author, and Regular user discounts
- ✅ **Experience Level Discounts**: Beginner, Intermediate, Expert levels
- ✅ **Easy to Update**: Simple configuration objects for price changes

## Quick Start

### 1. Import the Pricing Functions

```typescript
import {
  calculatePricing,
  getAllPricing,
  formatPrice,
  type UserProfile,
  type TicketType,
} from '@/lib/pricing';
```

### 2. Create a User Profile

```typescript
const userProfile: UserProfile = {
  location: 'india', // 'india' | 'international'
  isIEEEMember: true,
  userType: 'student', // 'student' | 'author' | 'regular'
  experienceLevel: 'beginner', // 'beginner' | 'intermediate' | 'expert' (optional)
};
```

### 3. Calculate Pricing

```typescript
// For a single ticket type
const pricing = calculatePricing('conference', userProfile);

// For all ticket types
const allPricing = getAllPricing(userProfile);

// Format for display
const formattedPrice = formatPrice(pricing.finalPrice, pricing.currency);
```

## Pricing Structure

### Base Prices

```typescript
const BASE_PRICING = {
  conference: {
    india: 5000,      // ₹5,000
    international: 60, // $60
  },
  'tutorial-day-1': {
    india: 3000,      // ₹3,000
    international: 40, // $40
  },
  'tutorial-day-1-2': {
    india: 3000,      // ₹3,000
    international: 40, // $40
  },
  both: {
    india: 7500,      // ₹7,500
    international: 90, // $90
  },
};
```

### Discount Rules

#### IEEE Membership Discounts
- **Student Member**: 25%
- **Professional Member**: 20%
- **Senior Member**: 15%
- **Fellow Member**: 10%

#### User Type Discounts
- **Student (Non-IEEE)**: 15%
- **Author**: 10%
- **Regular**: 0%

#### Experience Level Discounts
- **Beginner**: 5%
- **Intermediate**: 0%
- **Expert**: 0%

#### Location-Based Rules
- **India**: 18% GST applied after discounts
- **International**: No additional taxes

## API Reference

### `calculatePricing(ticketType, userProfile)`

Calculates the final price for a specific ticket type based on user profile.

**Parameters:**
- `ticketType`: `'conference' | 'tutorial-day-1' | 'tutorial-day-1-2' | 'both'`
- `userProfile`: UserProfile object

**Returns:** `PricingResult` object

```typescript
interface PricingResult {
  originalPrice: number;      // Base price before discounts
  discountedPrice: number;    // Price after discounts, before tax
  currency: 'INR' | 'USD';    // Currency based on location
  discountPercentage: number; // Total discount percentage
  appliedDiscounts: string[]; // List of applied discounts
  finalPrice: number;         // Final price including tax
}
```

### `getAllPricing(userProfile)`

Calculates pricing for all ticket types.

**Parameters:**
- `userProfile`: UserProfile object

**Returns:** Record of all ticket types with their pricing

### `formatPrice(price, currency)`

Formats a price for display.

**Parameters:**
- `price`: number
- `currency`: `'INR' | 'USD'`

**Returns:** Formatted string (e.g., "₹5,000" or "$60")

## Sample Users

The system includes pre-defined sample users for testing:

```typescript
import { SAMPLE_USERS } from '@/lib/pricing';

// Available sample users:
// - indianStudent: Indian IEEE student member
// - internationalAuthor: International non-IEEE author
// - indianProfessional: Indian IEEE professional member
// - internationalStudent: International non-IEEE student
```

## Usage Examples

### Example 1: Basic Pricing Calculation

```typescript
import { calculatePricing, SAMPLE_USERS } from '@/lib/pricing';

const user = SAMPLE_USERS.indianStudent;
const pricing = calculatePricing('conference', user.profile);

console.log(`Base Price: ₹${pricing.originalPrice}`);
console.log(`Final Price: ₹${pricing.finalPrice}`);
console.log(`Discounts: ${pricing.appliedDiscounts.join(', ')}`);
```

### Example 2: Display All Ticket Prices

```typescript
import { getAllPricing, formatPrice } from '@/lib/pricing';

const allPricing = getAllPricing(userProfile);

Object.entries(allPricing).forEach(([ticketType, pricing]) => {
  console.log(`${ticketType}: ${formatPrice(pricing.finalPrice, pricing.currency)}`);
});
```

### Example 3: Custom User Profile

```typescript
const customUser: UserProfile = {
  location: 'international',
  isIEEEMember: true,
  userType: 'author',
  experienceLevel: 'beginner',
};

const pricing = calculatePricing('both', customUser);
// This user gets: IEEE discount (25%) + Author discount (10%) + Beginner discount (5%)
```

## Integration with Existing App

### Update Select Category Page

Replace the existing pricing logic in `app/select-category/page.tsx`:

```typescript
import { calculatePricing, formatPrice } from '@/lib/pricing';

// Create user profile from existing data
const userProfile: UserProfile = {
  location: userCategory === 'indian' ? 'india' : 'international',
  isIEEEMember: ieeeMembershipData?.isMember || false,
  userType: 'regular', // You can add user type selection
  experienceLevel: 'intermediate', // You can add experience level selection
};

// Calculate pricing
const pricing = calculatePricing(selectedTicket, userProfile);

// Display formatted price
const displayPrice = formatPrice(pricing.finalPrice, pricing.currency);
```

### Update Checkout Page

Use the same approach in `app/checkout/page.tsx` to ensure consistent pricing.

## Testing

### Run the Demo

```bash
npx tsx lib/pricing.test.ts
```

### Visit the Demo Page

Navigate to `/pricing-demo` in your app to see an interactive demonstration.

## Updating Prices

To update prices, simply modify the `BASE_PRICING` object in `lib/pricing.ts`:

```typescript
const BASE_PRICING = {
  conference: {
    india: 6000,      // Updated from 5000
    international: 75, // Updated from 60
  },
  // ... other ticket types
};
```

## Updating Discount Rules

To modify discount percentages, update the `DISCOUNT_RULES` object:

```typescript
const DISCOUNT_RULES = {
  ieee: {
    student: 30, // Updated from 25
    professional: 25, // Updated from 20
    // ... other levels
  },
  // ... other discount types
};
```

## Benefits

1. **Maintainability**: All pricing logic in one place
2. **Consistency**: Same pricing rules across all pages
3. **Flexibility**: Easy to add new discount types or user categories
4. **Type Safety**: Prevents pricing calculation errors
5. **Testing**: Built-in sample users and test functions
6. **Documentation**: Clear examples and comprehensive documentation

## Future Enhancements

- Add support for coupon codes
- Implement early bird pricing
- Add bulk purchase discounts
- Support for different tax rates by region
- Integration with payment gateways 