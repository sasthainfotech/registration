'use client';

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
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import {
    Avatar,
    AvatarFallback,
    AvatarInitials,
} from '@/components/ui/avatar';
import {
    Calendar,
    MapPin,
    Download,
    QrCode,
    Mail,
    Phone,
    User,
    CreditCard,
    Clock,
    CheckCircle,
} from 'lucide-react';

export default function DashboardPage() {
    const user = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210',
        country: 'India',
    };

    const tickets = [
        {
            id: 'TC2024-001234',
            eventName: 'vlsid',
            ticketType: 'Conference + Tutorial',
            status: 'confirmed',
            price: '₹7,500',
            paymentMethod: 'UPI',
            purchaseDate: '2024-01-15',
            eventDate: 'March 15-17, 2024',
            venue: 'Bangalore, India',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Dashboard
                        </h1>
                        <p className="text-gray-600">
                            Manage your events and tickets
                        </p>
                    </div>
                    <Avatar className="h-12 w-12">
                        <AvatarFallback>
                            <AvatarInitials>
                                {user.name}
                            </AvatarInitials>
                        </AvatarFallback>
                    </Avatar>
                </div>

                <Tabs
                    defaultValue="tickets"
                    className="space-y-6"
                >
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="tickets">
                            My Tickets
                        </TabsTrigger>
                        <TabsTrigger value="profile">
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="payments">
                            Payment History
                        </TabsTrigger>
                    </TabsList>

                    {/* Tickets Tab */}
                    <TabsContent
                        value="tickets"
                        className="space-y-6"
                    >
                        <div className="grid gap-6">
                            {tickets.map((ticket) => (
                                <Card key={ticket.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-xl">
                                                    {
                                                        ticket.eventName
                                                    }
                                                </CardTitle>
                                                <CardDescription>
                                                    Order
                                                    ID:{' '}
                                                    {
                                                        ticket.id
                                                    }
                                                </CardDescription>
                                            </div>
                                            <Badge
                                                variant={
                                                    ticket.status ===
                                                    'confirmed'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                                className="flex items-center"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Confirmed
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-semibold mb-2">
                                                        Ticket
                                                        Details
                                                    </h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex items-center">
                                                            <Badge
                                                                variant="outline"
                                                                className="mr-2"
                                                            >
                                                                {
                                                                    ticket.ticketType
                                                                }
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center text-gray-600">
                                                            <Calendar className="w-4 h-4 mr-2" />
                                                            {
                                                                ticket.eventDate
                                                            }
                                                        </div>
                                                        <div className="flex items-center text-gray-600">
                                                            <MapPin className="w-4 h-4 mr-2" />
                                                            {
                                                                ticket.venue
                                                            }
                                                        </div>
                                                        <div className="flex items-center text-gray-600">
                                                            <CreditCard className="w-4 h-4 mr-2" />
                                                            {
                                                                ticket.price
                                                            }{' '}
                                                            via{' '}
                                                            {
                                                                ticket.paymentMethod
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-semibold mb-2">
                                                        Actions
                                                    </h4>
                                                    <div className="flex flex-col sm:flex-row gap-2">
                                                        <Button
                                                            size="sm"
                                                            className="flex items-center"
                                                        >
                                                            <Download className="w-4 h-4 mr-2" />
                                                            Download
                                                            Ticket
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="flex items-center bg-transparent"
                                                        >
                                                            <QrCode className="w-4 h-4 mr-2" />
                                                            Show
                                                            QR
                                                            Code
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="bg-blue-50 p-3 rounded-lg">
                                                    <div className="flex items-center text-blue-800 text-sm">
                                                        <Clock className="w-4 h-4 mr-2" />
                                                        <span className="font-medium">
                                                            Event
                                                            starts
                                                            in
                                                            45
                                                            days
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Profile Tab */}
                    <TabsContent
                        value="profile"
                        className="space-y-6"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Profile Information
                                </CardTitle>
                                <CardDescription>
                                    Manage your account
                                    details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Full Name
                                        </label>
                                        <div className="flex items-center p-2 border rounded-md bg-gray-50">
                                            <User className="w-4 h-4 mr-2 text-gray-500" />
                                            <span>
                                                {user.name}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Country
                                        </label>
                                        <div className="flex items-center p-2 border rounded-md bg-gray-50">
                                            <span>
                                                {
                                                    user.country
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Email
                                        </label>
                                        <div className="flex items-center p-2 border rounded-md bg-gray-50">
                                            <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                            <span>
                                                {user.email}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Phone
                                        </label>
                                        <div className="flex items-center p-2 border rounded-md bg-gray-50">
                                            <Phone className="w-4 h-4 mr-2 text-gray-500" />
                                            <span>
                                                {user.phone}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <Button>
                                        Edit Profile
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Payment History Tab */}
                    <TabsContent
                        value="payments"
                        className="space-y-6"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Payment History
                                </CardTitle>
                                <CardDescription>
                                    View all your past
                                    transactions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {tickets.map(
                                        (ticket) => (
                                            <div
                                                key={
                                                    ticket.id
                                                }
                                                className="flex justify-between items-center p-4 border rounded-lg"
                                            >
                                                <div>
                                                    <div className="font-medium">
                                                        {
                                                            ticket.eventName
                                                        }
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {
                                                            ticket.purchaseDate
                                                        }{' '}
                                                        •{' '}
                                                        {
                                                            ticket.paymentMethod
                                                        }
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold">
                                                        {
                                                            ticket.price
                                                        }
                                                    </div>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        Completed
                                                    </Badge>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
