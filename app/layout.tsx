import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { AuthProvider } from '@/hooks/use-auth';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: {
        default: 'Event Management App',
        template: '%s | Event Management App',
    },
    description:
        'Modern event management application built with Next.js 15',
    keywords: [
        'events',
        'management',
        'booking',
        'tickets',
    ],
    authors: [{ name: 'Event Management Team' }],
    creator: 'Event Management Team',
    publisher: 'Event Management App',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_APP_URL ||
            'http://localhost:3000'
    ),
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: '/',
        title: 'Event Management App',
        description:
            'Modern event management application built with Next.js 15',
        siteName: 'Event Management App',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Event Management App',
        description:
            'Modern event management application built with Next.js 15',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: [
        {
            media: '(prefers-color-scheme: light)',
            color: 'white',
        },
        {
            media: '(prefers-color-scheme: dark)',
            color: 'black',
        },
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={inter.variable}
            // suppressHydrationWarning
        >
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <body
                className={`${inter.className} antialiased`}
            >
                <AuthProvider>
                    <div id="root">{children}</div>
                </AuthProvider>
            </body>
        </html>
    );
}
