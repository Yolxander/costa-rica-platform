import * as React from "react"
import {
    IconMapPin,
    IconStar,
    IconUsers,
    IconBed,
    IconBath,
    IconCalendar,
    IconMessage,
    IconEye,
    IconEdit,
    IconSettings,
    IconCamera,
    IconShare,
    IconHeart,
    IconTrendingUp,
    IconTrendingDown,
    IconCheck,
    IconX,
    IconClock,
    IconCurrencyDollar,
    IconHome,
    IconWifi,
    IconCar,
    IconSwimming,
    IconCoffee,
    IconPaw,
    IconSmoking,
    IconMusic,
    IconUser,
    IconPhone
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

interface PropertyDetailsContentProps {
    property: {
        id: number
        name: string
        type: string
        status: string
        location: string
        description: string
        amenities: string[]
        images: string[]
        house_rules: string[]
        policies: string[]
        pricing: {
            base_price: number
            price_format: string
            currency: string
            cleaning_fee: number
            service_fee: number
        }
        capacity: {
            guests: number
            bedrooms: number
            bathrooms: number
        }
        availability: {
            check_in: string
            check_out: string
            minimum_stay: number
        }
        performance: {
            views_7d: number
            views_30d: number
            inquiries: number
            bookings: number
            rating: number
            reviews: number
        }
        recent_inquiries: Array<{
            id: number
            guest_name: string
            guest_email: string
            check_in: string
            check_out: string
            guests: number
            message: string
            status: 'pending' | 'responded' | 'confirmed' | 'declined'
            created_at: string
        }>
        upcoming_bookings: Array<{
            id: number
            guest_name: string
            check_in: string
            check_out: string
            guests: number
            total_amount: number
            status: 'confirmed' | 'pending' | 'cancelled'
        }>
    }
}

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    'wifi': IconWifi,
    'parking': IconCar,
    'pool': IconSwimming,
    'kitchen': IconCoffee,
    'tv': IconMusic,
    'mountain_view': IconHome,
    'gym': IconHome,
    'security': IconHome,
    // Legacy support for old amenity names
    'WiFi': IconWifi,
    'Parking': IconCar,
    'Pool': IconSwimming,
    'Kitchen': IconCoffee,
    'Pet Friendly': IconPaw,
    'No Smoking': IconSmoking,
    'Entertainment': IconMusic,
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Active':
            return 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
        case 'Maintenance':
            return 'text-orange-700 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20'
        case 'Seasonal':
            return 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
        default:
            return 'text-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20'
    }
}

const getInquiryStatusColor = (status: string) => {
    switch (status) {
        case 'pending':
            return 'text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20'
        case 'responded':
            return 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
        case 'confirmed':
            return 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
        case 'declined':
            return 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
        default:
            return 'text-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20'
    }
}

export function PropertyDetailsContent({ property }: PropertyDetailsContentProps) {
    const [selectedImage, setSelectedImage] = React.useState(0)
    const mainImage = property.images && property.images.length > 0 ? property.images[0] : null
    const thumbnails = property.images && property.images.length > 1 ? property.images.slice(1, 6) : []

    return (
        <div className="w-full space-y-8 px-4 lg:px-6">
            {/* Hero Section - Images */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Image */}
                <div className="lg:col-span-2">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                        {mainImage ? (
                            <img
                                src={mainImage}
                                alt={property.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <IconCamera className="size-16 text-muted-foreground" />
                            </div>
                        )}
                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 flex gap-2">
                            <Button size="sm" variant="secondary" className="rounded-full">
                                <IconHeart className="size-4" />
                            </Button>
                            <Button size="sm" variant="secondary" className="rounded-full">
                                <IconShare className="size-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Thumbnail Grid */}
                <div className="grid grid-cols-2 gap-2">
                    {thumbnails.map((image, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity">
                            <img
                                src={image}
                                alt={`${property.name} ${index + 2}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                    {property.images && property.images.length > 6 && (
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">+{property.images.length - 6}</div>
                                <div className="text-xs text-white">Show All</div>
                            </div>
                        </div>
                    )}
                    {(!property.images || property.images.length === 0) && (
                        <div className="col-span-2 aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                            <IconCamera className="size-8 text-muted-foreground" />
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
                    {/* Property Header */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl font-bold">{property.name}</h1>
                            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                                <IconMapPin className="size-4" />
                                <span>{property.location}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-black dark:text-white">
                                {property.pricing.price_format || 'Price not set'}
                            </div>
                        </div>
                    </div>

                    {/* Key Stats */}
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <IconBed className="size-5 text-muted-foreground" />
                            <span className="font-medium">{property.capacity.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <IconBath className="size-5 text-muted-foreground" />
                            <span className="font-medium">{property.capacity.bathrooms} Baths</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <IconHome className="size-5 text-muted-foreground" />
                            <span className="font-medium">{property.type}</span>
                        </div>
                        <Badge className={getStatusColor(property.status)}>
                            {property.status}
                        </Badge>
                    </div>

                    {/* Property Description and Management Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Property Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-1">
                            <Card className="sticky top-4">
                                <CardHeader>
                                    <CardTitle>Property Management</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Button className="w-full">
                                            <IconEdit className="size-4 mr-2" />
                                            Edit Property
                                        </Button>
                                        <Button variant="outline" className="w-full">
                                            <IconSettings className="size-4 mr-2" />
                                            Property Settings
                                        </Button>
                                        <Button variant="outline" className="w-full">
                                            <IconShare className="size-4 mr-2" />
                                            Share Property
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Facts & Features and Property Management Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 ">
                        <div className="lg:col-span-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Facts & Features</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <p className="text-muted-foreground">
                                        The essence of modern living meets timeless design in this meticulously crafted property.
                                        Every detail has been carefully considered to create a seamless blend of comfort, convenience, and luxury.
                                    </p>

                                    {/* Amenities */}
                                    <div>
                                        <h4 className="font-medium mb-3">Amenities</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {property.amenities && property.amenities.length > 0 ? (
                                                property.amenities.map((amenity) => {
                                                    const IconComponent = amenityIcons[amenity] || IconHome
                                                    const displayName = amenity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                                                    return (
                                                        <div key={amenity} className="flex items-center gap-2">
                                                            <IconCheck className="size-4 text-green-500" />
                                                            <span className="text-sm">{displayName}</span>
                                                        </div>
                                                    )
                                                })
                                            ) : (
                                                <p className="text-sm text-muted-foreground">No amenities specified</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* House Rules */}
                                    {property.house_rules && property.house_rules.length > 0 && (
                                        <div>
                                            <h4 className="font-medium mb-3">House Rules</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {property.house_rules.map((rule, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <IconCheck className="size-4 text-green-500" />
                                                        <span className="text-sm">{rule}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Policies */}
                                    {property.policies && property.policies.length > 0 && (
                                        <div>
                                            <h4 className="font-medium mb-3">Policies</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {property.policies.map((policy, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <IconCheck className="size-4 text-green-500" />
                                                        <span className="text-sm">{policy}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-1">
                            {/* Empty space to align with Property Management card above */}
                        </div>
                    </div>
            </div>
        </div>
    )
}
