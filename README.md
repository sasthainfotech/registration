# Event Management App

A modern event management application built with Next.js 15, featuring integrated payment processing with Stripe for both Indian and international customers, with automatic GST calculation and dual currency support.

## 🌟 Features

-   💳 **Unified Payment Gateway**: Stripe for both Indian (INR) and International (USD) payments
-   🌍 **Dual Currency Support**: INR for Indian residents, USD for international attendees
-   📱 **Multiple Payment Methods**: UPI, Net Banking, and Cards for Indian users; Cards for international users
-   🧾 **Automatic GST Calculation**: 18% GST for Indian customers, no GST for international
-   📱 **Responsive Design**: Mobile-first approach with modern UI/UX
-   🎟️ **Ticket Management**: Conference, Tutorial, and Combined passes
-   🔒 **Secure Payments**: End-to-end encryption with Stripe
-   📊 **Real-time Analytics**: Payment tracking and user analytics
-   📧 **Automated Notifications**: Email confirmations and SMS alerts
-   🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## 🛠️ Tech Stack

-   **Frontend**: Next.js 15, React 19, TypeScript
-   **Styling**: Tailwind CSS, shadcn/ui
-   **Payment Gateway**: Stripe (for both INR and USD)
-   **Database**: MySQL/PostgreSQL (schema provided)
-   **Deployment**: Vercel-ready

## 🚀 Quick Start

### Prerequisites

-   Node.js 18+
-   npm or yarn or pnpm
-   Stripe account (for payments)

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd event-management-app
    ```

2. **Install dependencies**

    ```bash
    npm install --legacy-peer-deps
    # or
    pnpm install --legacy-peer-deps
    ```

3. **Set up environment variables**

    ```bash
    cp .env.example .env.local
    ```

4. **Configure your environment**

    ```env
    # Stripe Configuration (for both Indian and International payments)
    STRIPE_SECRET_KEY=your_stripe_secret_key
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
    STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

    # Database Configuration
    DATABASE_URL=your_database_connection_string

    # App Configuration
    NEXT_PUBLIC_BASE_URL=http://localhost:3000
    ```

5. **Set up the database**

    ```bash
    # Run the database schema
    mysql -u your_username -p your_database < scripts/database-schema.sql

    # Optional: Add sample data
    mysql -u your_username -p your_database < scripts/seed-data.sql
    ```

6. **Start the development server**

    ```bash
    npm run dev
    ```

    Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 💳 Payment Integration

### Stripe Setup (All Payments)

1. **Create Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **Get API Keys**: Navigate to Developers > API keys
3. **Configure Webhooks**: Set up webhooks for payment confirmations
4. **Environment Variables**: Add your Stripe keys to `.env.local`

#### Test Payment Methods

**Indian Payments (INR):**

-   UPI: Use test UPI ID `success@stripe`
-   Cards: Use test card `4000003560000008` (India)
-   Net Banking: Available through Stripe test mode

**International Payments (USD):**

-   Cards: Use test card `4242424242424242`
-   Amount: Will be processed in USD

#### Currency Configuration

The app automatically determines currency based on user category:

-   **Indian Residents**: All prices in INR with 18% GST included
-   **International Users**: All prices in USD with no GST

## 📁 Project Structure

```
event-management-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── stripe/        # Stripe payment endpoints
│   │   ├── verify-payment/# Payment verification
│   │   └── ticket/        # Ticket management
│   ├── checkout/          # Checkout page
│   ├── dashboard/         # Admin dashboard
│   ├── events/           # Event listing
│   └── select-category/  # User category selection
├── components/            # Reusable UI components
├── lib/                  # Utility functions and config
│   ├── config/          # App configuration
│   └── utils/           # Helper functions
├── hooks/               # Custom React hooks
├── scripts/             # Database scripts
└── styles/              # Global styles
```

## 🔧 Configuration

### Environment Variables

| Variable                             | Required | Description                |
| ------------------------------------ | -------- | -------------------------- |
| `STRIPE_SECRET_KEY`                  | Yes      | Stripe API Secret Key      |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes      | Stripe Publishable Key     |
| `STRIPE_WEBHOOK_SECRET`              | Yes      | Stripe Webhook Secret      |
| `DATABASE_URL`                       | Yes      | Database connection string |
| `NEXT_PUBLIC_BASE_URL`               | No       | Base URL for the app       |

### Payment Configuration

The payment system supports:

**Indian Users (INR):**

-   UPI payments
-   Net Banking
-   Credit/Debit Cards
-   Automatic GST calculation (18%)

**International Users (USD):**

-   Credit/Debit Cards
-   No GST charges
-   Multi-currency support

## 🧪 Testing

**Stripe Test Mode:**

1. **Indian Payments:**

    - UPI: `success@stripe`
    - Card: `4000003560000008`
    - Amount: Test with various amounts

2. **International Payments:**
    - Card: `4242424242424242`
    - CVV: Any 3 digits
    - Date: Any future date

## 📊 API Documentation

### Payment Endpoints

-   `POST /api/stripe` - Create Stripe payment intent
-   `GET /api/stripe?paymentIntentId=<id>` - Get payment intent details
-   `POST /api/verify-payment` - Verify payment completion
-   `GET /api/verify-payment?paymentIntentId=<id>` - Get verification status

### Ticket Endpoints

-   `POST /api/ticket` - Create ticket and payment intent
-   `GET /api/ticket?ticketId=<id>` - Get ticket details

### Example Usage

```javascript
// Create payment intent
const response = await fetch('/api/stripe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        ticketType: 'both',
        userCategory: 'indian',
        country: 'IN',
        paymentMethod: 'stripe-upi',
        userId: 'user_123',
        userEmail: 'user@example.com',
    }),
});

const { paymentIntentId, clientSecret } =
    await response.json();
```

## 🔒 Security

-   **PCI DSS Compliance**: All payment processing through Stripe
-   **Data Encryption**: Sensitive data encrypted at rest and in transit
-   **Secure Authentication**: JWT-based session management
-   **Input Validation**: Comprehensive validation on all inputs
-   **Rate Limiting**: API rate limiting to prevent abuse

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**:

    ```bash
    npx vercel
    ```

2. **Set Environment Variables**: Add all required env vars in Vercel dashboard

3. **Deploy**: Push to main branch or use Vercel CLI

### Environment Setup

-   Set up production Stripe keys
-   Configure production database
-   Set up webhook endpoints
-   Configure domain settings

## 📈 Analytics & Monitoring

The app includes built-in analytics for:

-   Payment success/failure rates
-   User category distribution
-   Revenue tracking by currency
-   Payment method usage statistics
-   Conversion funnel analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

1. Check the [FAQ](docs/FAQ.md)
2. Review Stripe documentation
3. Submit an issue on GitHub
4. Contact support team

## 🎯 Roadmap

-   [ ] Mobile app development
-   [ ] Advanced analytics dashboard
-   [ ] Multi-language support
-   [ ] Bulk ticket purchasing
-   [ ] Integration with calendar apps
-   [ ] QR code ticket validation
-   [ ] Automated refund processing

---

Built with ❤️ using Next.js and Stripe
