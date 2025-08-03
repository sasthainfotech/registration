'use client';

import { useState, useCallback } from 'react';
import { CouponValidationResult, getApplicableCoupons } from '@/lib/coupons';

interface UseCouponProps {
  ticketType: string;
  userType: string;
  location: 'india' | 'international';
  baseAmount: number;
  currency: 'INR' | 'USD';
}

interface UseCouponReturn {
  couponCode: string;
  setCouponCode: (code: string) => void;
  couponResult: CouponValidationResult | null;
  isLoading: boolean;
  error: string | null;
  validateCoupon: () => Promise<void>;
  clearCoupon: () => void;
  applicableCoupons: any[];
  appliedDiscount: number;
  finalAmount: number;
}

export const useCoupon = ({
  ticketType,
  userType,
  location,
  baseAmount,
  currency,
}: UseCouponProps): UseCouponReturn => {
  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState<CouponValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get applicable coupons for this user/ticket combination
  const applicableCoupons = getApplicableCoupons(ticketType, userType, location);

  // Calculate applied discount and final amount
  const appliedDiscount = couponResult?.discountAmount || 0;
  const finalAmount = Math.max(0, baseAmount - appliedDiscount);

  const validateCoupon = useCallback(async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/coupon/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode.trim(),
          ticketType,
          userType,
          location,
          baseAmount,
          currency,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCouponResult({
          isValid: true,
          coupon: data.data.coupon,
          discountAmount: data.data.discountAmount,
          discountPercentage: data.data.discountPercentage,
        });
        setError(null);
      } else {
        setCouponResult({
          isValid: false,
          error: data.error,
        });
        setError(data.error);
      }
    } catch (err) {
      console.error('Coupon validation error:', err);
      setError('Failed to validate coupon code. Please try again.');
      setCouponResult({
        isValid: false,
        error: 'Network error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [couponCode, ticketType, userType, location, baseAmount, currency]);

  const clearCoupon = useCallback(() => {
    setCouponCode('');
    setCouponResult(null);
    setError(null);
  }, []);

  return {
    couponCode,
    setCouponCode,
    couponResult,
    isLoading,
    error,
    validateCoupon,
    clearCoupon,
    applicableCoupons,
    appliedDiscount,
    finalAmount,
  };
}; 