// Core types for the event management application

// Razorpay types
export interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

export interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill: {
        name: string;
        email: string;
        contact: string;
    };
    theme: {
        color: string;
    };
    modal?: {
        ondismiss: () => void;
    };
}

export interface RazorpayInstance {
    on: (
        event: string,
        handler: (response: {
            error: { description: string };
        }) => void
    ) => void;
    open: () => void;
}

declare global {
    interface Window {
        Razorpay: new (
            options: RazorpayOptions
        ) => RazorpayInstance;
    }
}

export interface User {
    id: string;
    email: string;
    name: string;
    category: 'indian' | 'international';
    country: 'IN' | 'INTL';
    createdAt: string;
    updatedAt: string;
}

export interface Event {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    venue: string;
    maxAttendees: number;
    availableSeats: number;
    status:
        | 'upcoming'
        | 'ongoing'
        | 'completed'
        | 'cancelled';
    createdAt: string;
    updatedAt: string;
}

export interface Ticket {
    id: string;
    userId: string;
    eventId: string;
    type: 'conference' | 'tutorial' | 'both';
    status: 'pending' | 'confirmed' | 'cancelled' | 'used';
    paymentStatus:
        | 'pending'
        | 'completed'
        | 'failed'
        | 'refunded';
    paymentIntentId: string;
    confirmationNumber: string;
    basePrice: number;
    gstAmount: number;
    gstRate: number;
    totalPrice: number;
    currency: 'INR' | 'USD';
    userCategory: 'indian' | 'international';
    purchaseDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface Payment {
    id: string;
    ticketId: string;
    userId: string;
    userEmail: string;
    amount: number;
    currency: 'INR' | 'USD';
    status:
        | 'pending'
        | 'processing'
        | 'completed'
        | 'failed'
        | 'cancelled'
        | 'refunded';
    paymentGateway: 'stripe';
    paymentIntentId: string;
    clientSecret?: string;
    metadata: {
        ticketType: string;
        userCategory: string;
        eventName: string;
        confirmationNumber: string;
        [key: string]: string | number | boolean;
    };
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
}

// Pricing calculation type
export interface PricingDetails {
    basePrice: number;
    gstRate: number;
    gstAmount: number;
    totalPrice: number;
    currency: string;
    isIndian: boolean;
    ieeeDiscount?: number;
    originalBasePrice?: number;
}

// Stripe-specific types for dual currency support
export interface StripePaymentIntent {
    id: string;
    amount: number;
    currency: 'inr' | 'usd';
    status:
        | 'requires_payment_method'
        | 'requires_confirmation'
        | 'requires_action'
        | 'processing'
        | 'requires_capture'
        | 'canceled'
        | 'succeeded';
    client_secret: string;
    metadata: {
        ticketType: string;
        userId: string;
        userEmail: string;
        userCategory: string;
        [key: string]: string;
    };
    created: number;
}

export interface PaymentSummary {
    ticket: {
        id: string;
        name: string;
        description: string;
        duration: string;
        features: string[];
    };
    pricing: {
        basePrice: number;
        gstAmount: number;
        gstRate: number;
        totalPrice: number;
        currency: 'INR' | 'USD';
    };
    formatted: {
        symbol: string;
        currency: 'INR' | 'USD';
        formatted: string;
    };
    userCategory: 'indian' | 'international';
    paymentGateway: 'stripe';
}

// API Response types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    details?: string;
    message?: string;
}

export interface TicketCreationResponse
    extends ApiResponse {
    data?: {
        ticketId: string;
        confirmationNumber: string;
        paymentIntentId: string;
        clientSecret: string;
        amount: number;
        currency: string;
    };
}

export interface PaymentVerificationResponse
    extends ApiResponse {
    data?: {
        verified: boolean;
        ticketId: string;
        confirmationNumber: string;
        paymentIntentId: string;
        status: string;
    };
}

// Form validation types
export interface ContactForm {
    name: string;
    email: string;
    message: string;
}

export interface RegistrationForm {
    name: string;
    email: string;
    ticketType: 'conference' | 'tutorial' | 'both';
    userCategory: 'indian' | 'international';
    agreeToTerms: boolean;
}

// Error handling types
export interface AppError {
    code: string;
    message: string;
    details?: string;
    timestamp: string;
    userId?: string;
    context?: Record<string, string | number | boolean>;
}

export interface ValidationError {
    field: string;
    message: string;
    code: string;
}

// Analytics and reporting types
export interface AnalyticsEvent {
    eventType:
        | 'page_view'
        | 'ticket_purchase'
        | 'payment_success'
        | 'payment_failure'
        | 'user_registration';
    userId?: string;
    sessionId: string;
    properties: Record<string, string | number | boolean>;
    timestamp: string;
}

export interface SalesReport {
    period: string;
    totalRevenue: {
        INR: number;
        USD: number;
    };
    ticketsSold: {
        conference: number;
        tutorial: number;
        both: number;
    };
    userCategories: {
        indian: number;
        international: number;
    };
    paymentMethods: {
        stripe_card: number;
        stripe_upi: number;
        stripe_netbanking: number;
    };
}

// Configuration types
export interface AppConfig {
    event: {
        id: string;
        name: string;
        startDate: string;
        endDate: string;
        venue: string;
    };
    payments: {
        stripe: {
            publicKey: string;
            webhookSecret: string;
        };
    };
    currencies: {
        indian: 'INR';
        international: 'USD';
    };
    gst: {
        indian: number;
        international: number;
    };
}
