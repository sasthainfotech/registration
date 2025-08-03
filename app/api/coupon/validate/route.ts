import { NextRequest, NextResponse } from 'next/server';
import { validateCouponCode } from '@/lib/coupons';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      code, 
      ticketType, 
      userType, 
      location, 
      baseAmount, 
      currency 
    } = body;

    // Validate required fields
    if (!code || !ticketType || !userType || !location || !baseAmount || !currency) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields' 
        },
        { status: 400 }
      );
    }

    // Validate coupon code
    const result = validateCouponCode(
      code,
      ticketType,
      userType,
      location,
      baseAmount,
      currency
    );

    if (result.isValid) {
      return NextResponse.json({
        success: true,
        data: {
          coupon: result.coupon,
          discountAmount: result.discountAmount,
          discountPercentage: result.discountPercentage,
          finalAmount: baseAmount - (result.discountAmount || 0),
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
} 