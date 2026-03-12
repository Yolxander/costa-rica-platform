import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    IconMapPin,
    IconUsers,
    IconBed,
    IconBath,
    IconHome,
    IconWifi,
    IconCar,
    IconSwimming,
    IconCoffee,
    IconBrandAirbnb,
    IconBrandBooking,
    IconBrandWhatsapp,
    IconExternalLink,
    IconChevronRight,
} from '@tabler/icons-react';

interface ButtonConfig {
    visible: boolean;
    url: string | null;
}

interface Property {
    id: number;
    slug: string;
    name: string;
    location: string;
    type: string;
    images: string[];
    guests: number;
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
    base_price: number;
    price_format: string | null;
    currency: string;
    custom_message: string | null;
    accent_color: string;
    host: {
        name: string;
        avatar: string | null;
    };
    buttons: {
        book_direct: ButtonConfig;
        airbnb: ButtonConfig;
        bookingcom: ButtonConfig;
        vrbo: ButtonConfig;
        whatsapp: ButtonConfig;
        website: ButtonConfig;
    };
}

interface DiscoveryPageProps {
    property: Property;
}

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    wifi: IconWifi,
    parking: IconCar,
    pool: IconSwimming,
    kitchen: IconCoffee,
    WiFi: IconWifi,
    Parking: IconCar,
    Pool: IconSwimming,
    Kitchen: IconCoffee,
};

export default function DiscoveryPage({ property }: DiscoveryPageProps) {
    const accentColor = property.accent_color || '#10b981';

    const getAmenityIcon = (amenity: string) => {
        const normalized = amenity.toLowerCase().replace(/[_\s]/g, '');
        for (const [key, Icon] of Object.entries(amenityIcons)) {
            if (normalized.includes(key.toLowerCase())) {
                return Icon;
            }
        }
        return null;
    };

    return (
        <>
            <Head title={`${property.name} - Book Your Stay`} />
            <div className="min-h-screen bg-gray-950">
                {/* Hero Image */}
                <div className="relative h-[45vh] w-full overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                        <img
                            src={property.images[0]}
                            alt={property.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-gray-900">
                            <IconHome className="h-20 w-20 text-gray-700" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-gray-950" />
                </div>

                {/* Content Container */}
                <div className="relative -mt-16 px-4 pb-8">
                    <div className="mx-auto max-w-md">
                        {/* Property Info Card */}
                        <div className="mb-6 rounded-2xl bg-gray-900/80 p-6 backdrop-blur-sm">
                            <h1 className="mb-2 text-2xl font-bold text-white">{property.name}</h1>
                            <div className="mb-3 flex items-center gap-2 text-gray-400">
                                <IconMapPin className="h-4 w-4" />
                                <span className="text-sm">{property.location}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                    <IconUsers className="h-4 w-4" />
                                    Sleeps {property.guests}
                                </span>
                                <span className="flex items-center gap-1">
                                    <IconBed className="h-4 w-4" />
                                    {property.bedrooms} bedrooms
                                </span>
                                <span className="flex items-center gap-1">
                                    <IconBath className="h-4 w-4" />
                                    {property.bathrooms} bathrooms
                                </span>
                            </div>
                        </div>

                        {/* Custom Message */}
                        {property.custom_message && (
                            <div className="mb-6 rounded-xl bg-gray-900/50 p-4">
                                <p className="text-center text-sm italic text-gray-300">
                                    &ldquo;{property.custom_message}&rdquo;
                                </p>
                            </div>
                        )}

                        {/* Booking Buttons */}
                        <div className="space-y-3">
                            {/* Book Direct - Primary CTA */}
                            {property.buttons.book_direct.visible && (
                                <Link href={property.buttons.book_direct.url || `/${property.slug}`}>
                                    <Button
                                        className="h-14 w-full text-base font-semibold"
                                        style={{
                                            backgroundColor: accentColor,
                                        }}
                                    >
                                        <IconHome className="mr-2 h-5 w-5" />
                                        Book Direct (Best Price)
                                    </Button>
                                </Link>
                            )}

                            {/* Check Availability */}
                            <Link href={`/${property.slug}`}>
                                <Button
                                    variant="outline"
                                    className="h-12 w-full border-gray-700 bg-gray-900 text-white hover:bg-gray-800"
                                >
                                    Check Availability
                                    <IconChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>

                            {/* External Platforms */}
                            {property.buttons.airbnb.visible && property.buttons.airbnb.url && (
                                <a
                                    href={property.buttons.airbnb.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <Button
                                        variant="outline"
                                        className="h-12 w-full border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                                    >
                                        <IconBrandAirbnb className="mr-2 h-5 w-5" />
                                        Book on Airbnb
                                        <IconExternalLink className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </a>
                            )}

                            {property.buttons.bookingcom.visible && property.buttons.bookingcom.url && (
                                <a
                                    href={property.buttons.bookingcom.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <Button
                                        variant="outline"
                                        className="h-12 w-full border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                                    >
                                        <IconBrandBooking className="mr-2 h-5 w-5" />
                                        Book on Booking.com
                                        <IconExternalLink className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </a>
                            )}

                            {property.buttons.vrbo.visible && property.buttons.vrbo.url && (
                                <a
                                    href={property.buttons.vrbo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <Button
                                        variant="outline"
                                        className="h-12 w-full border-blue-400/30 bg-blue-400/10 text-blue-300 hover:bg-blue-400/20"
                                    >
                                        Book on VRBO
                                        <IconExternalLink className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </a>
                            )}

                            {property.buttons.website.visible && property.buttons.website.url && (
                                <a
                                    href={property.buttons.website.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <Button
                                        variant="outline"
                                        className="h-12 w-full border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700"
                                    >
                                        Visit Our Website
                                        <IconExternalLink className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </a>
                            )}
                        </div>

                        {/* Amenities Preview */}
                        {property.amenities && property.amenities.length > 0 && (
                            <div className="mt-8">
                                <h3 className="mb-4 text-center text-sm font-medium text-gray-400">
                                    Property Highlights
                                </h3>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {property.amenities.slice(0, 6).map((amenity, index) => {
                                        const Icon = getAmenityIcon(amenity);
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center gap-1.5 rounded-full bg-gray-900 px-3 py-1.5 text-xs text-gray-400"
                                            >
                                                {Icon && <Icon className="h-3.5 w-3.5" />}
                                                <span>{amenity}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Photo Gallery Preview */}
                        {property.images && property.images.length > 1 && (
                            <div className="mt-8">
                                <h3 className="mb-4 text-center text-sm font-medium text-gray-400">
                                    Photo Gallery
                                </h3>
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {property.images.slice(1, 6).map((image, index) => (
                                        <div
                                            key={index}
                                            className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg"
                                        >
                                            <img
                                                src={image}
                                                alt={`${property.name} ${index + 2}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contact Options */}
                        {(property.buttons.whatsapp.visible || property.buttons.website.visible) && (
                            <div className="mt-8 border-t border-gray-800 pt-6">
                                <h3 className="mb-4 text-center text-sm font-medium text-gray-400">
                                    Contact Host
                                </h3>
                                <div className="flex justify-center gap-3">
                                    {property.buttons.whatsapp.visible && property.buttons.whatsapp.url && (
                                        <a
                                            href={property.buttons.whatsapp.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button
                                                variant="outline"
                                                className="h-12 border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                            >
                                                <IconBrandWhatsapp className="mr-2 h-5 w-5" />
                                                WhatsApp
                                            </Button>
                                        </a>
                                    )}
                                    <Link href={`/${property.slug}`}>
                                        <Button
                                            variant="outline"
                                            className="h-12 border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700"
                                        >
                                            View Full Listing
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Price Info */}
                        {property.base_price > 0 && (
                            <div className="mt-8 text-center">
                                <p className="text-xs text-gray-500">
                                    Starting from{' '}
                                    <span className="font-semibold text-gray-300">
                                        {property.price_format || `$${property.base_price}/night`}
                                    </span>
                                </p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="mt-12 border-t border-gray-800 pt-6 text-center">
                            <div className="mb-3 flex items-center justify-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                                    <span className="text-sm font-bold text-emerald-400">S</span>
                                </div>
                                <span className="text-sm font-medium text-gray-400">Powered by Sora</span>
                            </div>
                            <p className="text-xs text-gray-600">
                                Book directly with {property.host.name} for the best experience
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
