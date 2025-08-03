import { NextResponse } from 'next/server';
import { createPaymentSummary } from '@/lib/utils/payment';

export async function GET() {
    try {
        console.log('Testing pricing calculation...');

        // Test with different ticket types and countries
        const testCases = [
            {
                ticketType: 'main-conference-tutorials',
                country: 'IN',
            },
            {
                ticketType: 'main-conference-tutorials',
                country: 'INTL',
            },
            {
                ticketType: 'conference-day-1',
                country: 'IN',
            },
            {
                ticketType: 'conference-day-1',
                country: 'INTL',
            },
        ];

        const results = [];

        for (const testCase of testCases) {
            try {
                const summary = createPaymentSummary(
                    testCase.ticketType as
                        | 'main-conference-tutorials'
                        | 'conference-day-1'
                        | 'tutorials-day-1'
                        | 'tutorials-day-1-2',
                    testCase.country
                );

                results.push({
                    ...testCase,
                    success: true,
                    pricing: summary.pricing,
                    totalPrice: summary.pricing?.totalPrice,
                });
            } catch (error) {
                results.push({
                    ...testCase,
                    success: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                });
            }
        }

        console.log('Pricing test results:', results);

        return NextResponse.json({
            success: true,
            message: 'Pricing calculation test completed',
            results,
        });
    } catch (error) {
        console.error('Pricing test failed:', error);
        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
