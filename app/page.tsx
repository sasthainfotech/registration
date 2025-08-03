'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    IndianRupee,
    DollarSign,
    ArrowRight,
} from 'lucide-react';

type UserCategory = 'indian' | 'international';

interface CategoryOption {
    id: UserCategory;
    title: string;
    subtitle: string;
    description: string;
    currency: 'INR' | 'USD';
    icon: React.ComponentType<{ className?: string }>;
    benefits: string[];
    paymentMethods: string[];
    gstInfo?: string;
}

const categoryOptions: CategoryOption[] = [
    {
        id: 'indian',
        title: 'Indian Resident',
        subtitle: 'For residents of India',
        description:
            'Special pricing in Indian Rupees with local payment options',
        currency: 'INR',
        icon: IndianRupee,
        gstInfo: '18% GST included',
        paymentMethods: [
            'UPI',
            'Net Banking',
            'Credit/Debit Cards',
        ],
        benefits: [
            'Pricing in Indian Rupees',
            'UPI & Net Banking available',
            'All major Indian payment methods',
            'GST invoice provided',
            'Local support available',
        ],
    },
    {
        id: 'international',
        title: 'International',
        subtitle: 'For non-residents of India',
        description:
            'International pricing in US Dollars with international payment options',
        currency: 'USD',
        icon: DollarSign,
        paymentMethods: ['Credit/Debit Cards'],
        benefits: [
            'Pricing in US Dollars',
            'No GST charges',
            'International credit cards',
            'Multi-currency support',
            'Global payment processing',
        ],
    },
];

export default function HomePage() {
    const handleCategorySelect = (
        category: UserCategory
    ) => {
        // Store category selection and navigate to IEEE verification
        localStorage.setItem('userCategory', category);
        window.location.href = '/ieee-verification';
    };

    return (
        <>
            <div className="min-h-screen">
                {/* Header */}
                <header className="topbar py-4">
                    <div className="topbar__content max-sm:flex-col flex justify-center items-center gap-4">
                        <div className="topbar__left">
                            <div className="conference-title">
                                <h2 className="text-2xl font-bold text-white text-center sm:text-right">
                                    39{' '}
                                    <sup className="text-white">
                                        th
                                    </sup>
                                    International Conference
                                    <br />
                                    On VLSI Design
                                </h2>
                            </div>
                        </div>

                        <div className="topbar__center flex flex-col justify-center items-center gap-4">
                            <div className="flex sm:hidden lg:flex gap-4 h-16 lg:h-16  ">
                                <Image
                                    src="/logo.png"
                                    alt="VLSID"
                                    width={100}
                                    height={64}
                                    className="h-full w-auto"
                                />
                                <Image
                                    src="/vlsi.png"
                                    alt="VLSID"
                                    width={100}
                                    height={64}
                                    className="h-full w-auto"
                                />
                            </div>
                            <div className="event-info text-white">
                                <span className="event-date">
                                    3rd - 7th January 2026{' '}
                                </span>
                                <span className="separator">
                                    |
                                </span>
                                <span className="event-location">
                                    JW Marriott | Pune,
                                    India
                                </span>
                            </div>
                        </div>

                        <div className="topbar__right">
                            <div className="conference-title">
                                <h2 className="text-2xl font-bold text-white">
                                    25{' '}
                                    <sup className="text-white">
                                        th
                                    </sup>
                                    International Conference
                                    <br />
                                    On Embedded Systems
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="topbar__theme text-white font-bold  py-2">
                        <p className="theme-text text-center">
                            Global Synergy in Silicon: VLSI
                            and Embedded AI for Sustainable
                            Computing and Next-Gen
                            Electrified Mobility
                        </p>
                    </div>
                </header>

                {/* Category Selection - Main Content */}
                <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                Registration
                            </h1>
                        </div>

                        {/* Category Cards */}
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {categoryOptions.map(
                                (option) => {
                                    const IconComponent =
                                        option.icon;

                                    return (
                                        <Card
                                            key={option.id}
                                            className="transition-all duration-200 hover:shadow-xl hover:scale-105 bg-white/90 backdrop-blur-sm"
                                        >
                                            <CardHeader className="pb-4">
                                                <div className="flex items-center space-x-3 mb-3">
                                                    <div
                                                        className={`p-3 rounded-full ${
                                                            option.id ===
                                                            'indian'
                                                                ? 'bg-orange-100 text-orange-600'
                                                                : 'bg-blue-100 text-blue-600'
                                                        }`}
                                                    >
                                                        <IconComponent className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-xl">
                                                            {
                                                                option.title
                                                            }
                                                        </CardTitle>
                                                        <CardDescription className="text-sm">
                                                            {
                                                                option.subtitle
                                                            }
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                                {/* <p className="text-gray-600">
                                            {
                                                option.description
                                            }
                                        </p> */}
                                            </CardHeader>

                                            <CardContent className="space-y-6">
                                                {/* Currency Badge */}
                                                <div className="flex items-center space-x-2">
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-sm"
                                                    >
                                                        Currency:{' '}
                                                        {
                                                            option.currency
                                                        }
                                                    </Badge>
                                                    {option.gstInfo && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-sm"
                                                        >
                                                            {
                                                                option.gstInfo
                                                            }
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Selection Button */}
                                                <Button
                                                    className="w-full cursor-pointer"
                                                    size="lg"
                                                    onClick={() =>
                                                        handleCategorySelect(
                                                            option.id
                                                        )
                                                    }
                                                >
                                                    Select{' '}
                                                    {
                                                        option.title
                                                    }
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold mb-4">
                                vlsid
                            </h3>
                            <p className="text-gray-400 mb-4">
                                The premier event bringing
                                together innovators from
                                around the world.
                            </p>
                            <div className="flex justify-center space-x-6">
                                <span className="text-gray-400">
                                    © 2024 vlsid. All rights
                                    reserved.
                                </span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
