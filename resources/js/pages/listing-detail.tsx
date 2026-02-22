import { Head, Link, router, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import {
    IconMapPin,
    IconStar,
    IconUsers,
    IconBed,
    IconBath,
    IconHome,
    IconBeach,
    IconCamera,
    IconHeart,
    IconShare,
    IconCheck,
    IconClock,
    IconCalendar,
    IconArrowLeft,
    IconWifi,
    IconCar,
    IconSwimming,
    IconCoffee,
    IconPaw,
    IconSmoking,
    IconMusic,
    IconUser,
    IconHeartFilled,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { type ComponentType } from 'react';

interface ListingProperty {
    id: number;
    name: string;
    type: string;
    status: string;
    location: string;
    description: string;
    amenities: string[];
    images: string[];
    house_rules: string[];
    policies: string[];
    base_price: number;
    price_format: string;
    currency: string;
    cleaning_fee: number;
    service_fee: number;
    guests: number;
    bedrooms: number;
    bathrooms: number;
    check_in_time: string;
    check_out_time: string;
    minimum_stay: number;
    rating: number;
    reviews: number;
    host: {
        name: string;
        avatar: string | null;
        id: number;
    };
}

interface ListingDetailProps extends SharedData {
    property: ListingProperty;
    savedListingIds: number[];
}

const amenityIcons: Record<string, ComponentType<{ className?: string }>> = {
    wifi: IconWifi,
    parking: IconCar,
    pool: IconSwimming,
    kitchen: IconCoffee,
    tv: IconMusic,
    mountain_view: IconHome,
    gym: IconHome,
    security: IconHome,
    WiFi: IconWifi,
    Parking: IconCar,
    Pool: IconSwimming,
    Kitchen: IconCoffee,
    'Pet Friendly': IconPaw,
    'No Smoking': IconSmoking,
    Entertainment: IconMusic,
};

function ImageGallery({ images, name }: { images: string[]; name: string }) {
    const mainImage = images[0] || null;
    const sideImages = images.slice(1, 5);

    return (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4 md:grid-rows-2">
            {/* Main image */}
            <div className="relative md:col-span-2 md:row-span-2">
                <div className="aspect-[4/3] overflow-hidden rounded-l-xl bg-muted md:aspect-auto md:h-full">
                    {mainImage ? (
                        <img
                            src={mainImage}
                            alt={name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full min-h-[300px] w-full items-center justify-center">
                            <IconCamera className="size-16 text-muted-foreground" />
                        </div>
                    )}
                </div>
            </div>
            {/* Side images */}
            {sideImages.map((image, index) => (
                <div
                    key={index}
                    className={`hidden md:block ${
                        index === 1 ? 'rounded-tr-xl' : ''
                    } ${index === 3 ? 'rounded-br-xl' : ''} overflow-hidden bg-muted`}
                >
                    <div className="aspect-[4/3] h-full">
                        <img
                            src={image}
                            alt={`${name} ${index + 2}`}
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            ))}
            {/* Fill empty slots for consistent grid */}
            {sideImages.length < 4 &&
                Array.from({ length: 4 - sideImages.length }).map((_, i) => (
                    <div
                        key={`empty-${i}`}
                        className={`hidden bg-muted md:flex md:items-center md:justify-center ${
                            sideImages.length + i === 1 ? 'rounded-tr-xl' : ''
                        } ${sideImages.length + i === 3 ? 'rounded-br-xl' : ''} overflow-hidden`}
                    >
                        <div className="flex aspect-[4/3] h-full w-full items-center justify-center">
                            <IconCamera className="size-8 text-muted-foreground/40" />
                        </div>
                    </div>
                ))}
        </div>
    );
}

export default function ListingDetail() {
    const { auth, property, savedListingIds } = usePage<ListingDetailProps>().props;
    const isSaved = savedListingIds?.includes(property.id) ?? false;

    return (
        <>
            <Head title={`${property.name} - Costa Rica Rental Hub`} />
            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link href="/" className="flex items-center gap-2">
                            <IconBeach className="size-7 text-primary" />
                            <span className="text-lg font-bold tracking-tight">
                                Costa Rica Rental Hub
                            </span>
                        </Link>
                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Link href="/account" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                        {auth.user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden text-sm font-medium text-foreground sm:inline">
                                        {auth.user.name}
                                    </span>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost" size="sm">
                                            Log in
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button size="sm">Sign up</Button>
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {/* Back Link */}
                    <Link
                        href="/"
                        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <IconArrowLeft className="size-4" />
                        Back to listings
                    </Link>

                    {/* Image Gallery */}
                    <ImageGallery images={property.images} name={property.name} />

                    {/* Action Buttons (mobile share/save) */}
                    <div className="mt-4 flex items-center justify-between md:hidden">
                        <Badge variant="secondary">{property.type}</Badge>
                        <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                                <IconShare className="mr-1 size-4" />
                                Share
                            </Button>
                            {auth.user ? (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => router.post(`/listing/${property.id}/save`, {}, { preserveScroll: true })}
                                >
                                    {isSaved ? <IconHeartFilled className="mr-1 size-4 text-red-500" /> : <IconHeart className="mr-1 size-4" />}
                                    {isSaved ? 'Saved' : 'Save'}
                                </Button>
                            ) : (
                                <Link href={`/login?redirect=/listing/${property.id}`}>
                                    <Button size="sm" variant="ghost">
                                        <IconHeart className="mr-1 size-4" />
                                        Save
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Two-column layout */}
                    <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
                        {/* Left Column: Property Info */}
                        <div className="space-y-8">
                            {/* Title & Location */}
                            <div>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h1 className="text-2xl font-bold sm:text-3xl">
                                            {property.name}
                                        </h1>
                                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <IconMapPin className="size-4" />
                                                {property.location}
                                            </span>
                                            {property.rating > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <IconStar className="size-4 fill-current text-foreground" />
                                                    <span className="font-medium text-foreground">
                                                        {property.rating.toFixed(1)}
                                                    </span>
                                                    <span>
                                                        ({property.reviews} review
                                                        {property.reviews !== 1 ? 's' : ''})
                                                    </span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="hidden gap-2 md:flex">
                                        <Button size="sm" variant="outline">
                                            <IconShare className="mr-1 size-4" />
                                            Share
                                        </Button>
                                        {auth.user ? (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => router.post(`/listing/${property.id}/save`, {}, { preserveScroll: true })}
                                            >
                                                {isSaved ? <IconHeartFilled className="mr-1 size-4 text-red-500" /> : <IconHeart className="mr-1 size-4" />}
                                                {isSaved ? 'Saved' : 'Save'}
                                            </Button>
                                        ) : (
                                            <Link href={`/login?redirect=/listing/${property.id}`}>
                                                <Button size="sm" variant="outline">
                                                    <IconHeart className="mr-1 size-4" />
                                                    Save
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {/* Key Stats */}
                                <div className="mt-4 flex flex-wrap items-center gap-4 border-t pt-4">
                                    <Badge variant="secondary" className="text-sm">
                                        {property.type}
                                    </Badge>
                                    <Separator orientation="vertical" className="h-5" />
                                    <div className="flex items-center gap-1.5 text-sm">
                                        <IconUsers className="size-4 text-muted-foreground" />
                                        <span>{property.guests} guests</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm">
                                        <IconBed className="size-4 text-muted-foreground" />
                                        <span>
                                            {property.bedrooms} bedroom
                                            {property.bedrooms !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm">
                                        <IconBath className="size-4 text-muted-foreground" />
                                        <span>
                                            {property.bathrooms} bathroom
                                            {property.bathrooms !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Host Card */}
                            <div className="flex items-center gap-4 rounded-xl border p-4">
                                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <IconUser className="size-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Hosted by</p>
                                    <p className="font-semibold">{property.host.name}</p>
                                </div>
                            </div>

                            {/* Description */}
                            {property.description && (
                                <div>
                                    <h2 className="text-xl font-semibold">About this place</h2>
                                    <p className="mt-3 leading-relaxed text-muted-foreground">
                                        {property.description}
                                    </p>
                                </div>
                            )}

                            <Separator />

                            {/* Amenities */}
                            {property.amenities.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-semibold">What this place offers</h2>
                                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {property.amenities.map((amenity) => {
                                            const Icon = amenityIcons[amenity] || IconCheck;
                                            const displayName = amenity
                                                .replace(/_/g, ' ')
                                                .replace(/\b\w/g, (l) => l.toUpperCase());
                                            return (
                                                <div
                                                    key={amenity}
                                                    className="flex items-center gap-3 text-sm"
                                                >
                                                    <Icon className="size-5 text-muted-foreground" />
                                                    <span>{displayName}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <Separator />

                            {/* Availability Info */}
                            <div>
                                <h2 className="text-xl font-semibold">Things to know</h2>
                                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    <div>
                                        <h3 className="font-medium">Availability</h3>
                                        <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                                            <li className="flex items-center gap-2">
                                                <IconClock className="size-4" />
                                                Check-in: {property.check_in_time}
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <IconClock className="size-4" />
                                                Check-out: {property.check_out_time}
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <IconCalendar className="size-4" />
                                                Min. stay: {property.minimum_stay} night
                                                {property.minimum_stay !== 1 ? 's' : ''}
                                            </li>
                                        </ul>
                                    </div>

                                    {property.house_rules.length > 0 && (
                                        <div>
                                            <h3 className="font-medium">House rules</h3>
                                            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                                                {property.house_rules.map((rule, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <IconCheck className="mt-0.5 size-4 shrink-0 text-green-500" />
                                                        {rule}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {property.policies.length > 0 && (
                                        <div>
                                            <h3 className="font-medium">Policies</h3>
                                            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                                                {property.policies.map((policy, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <IconCheck className="mt-0.5 size-4 shrink-0 text-blue-500" />
                                                        {policy}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Price Card */}
                        <div className="lg:sticky lg:top-24 lg:self-start">
                            <Card>
                                <CardHeader className="pb-4">
                                    <div className="flex items-baseline justify-between">
                                        <CardTitle className="text-2xl">
                                            ${property.base_price.toLocaleString()}
                                            <span className="text-base font-normal text-muted-foreground">
                                                {' '}/ night
                                            </span>
                                        </CardTitle>
                                        {property.rating > 0 && (
                                            <div className="flex items-center gap-1 text-sm">
                                                <IconStar className="size-4 fill-current" />
                                                <span className="font-medium">{property.rating.toFixed(1)}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {(property.cleaning_fee > 0 || property.service_fee > 0) && (
                                        <div className="space-y-2 rounded-lg bg-muted/50 p-3 text-sm">
                                            {property.cleaning_fee > 0 && (
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>Cleaning fee</span>
                                                    <span>${property.cleaning_fee.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {property.service_fee > 0 && (
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>Service fee</span>
                                                    <span>${property.service_fee.toLocaleString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {auth.user ? (
                                        <Link href={`/listing/${property.id}/checkout`} className="block">
                                            <Button className="w-full" size="lg">
                                                Inquire Now
                                            </Button>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link href={`/login?redirect=/listing/${property.id}/checkout`} className="block">
                                                <Button className="w-full" size="lg">
                                                    Log in to inquire
                                                </Button>
                                            </Link>
                                            <p className="text-center text-xs text-muted-foreground">
                                                Don&apos;t have an account?{' '}
                                                <Link
                                                    href={`/register?redirect=/listing/${property.id}/checkout`}
                                                    className="font-medium text-primary underline-offset-4 hover:underline"
                                                >
                                                    Sign up
                                                </Link>
                                            </p>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="mt-16 border-t bg-muted/40">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <IconBeach className="size-5 text-primary" />
                                <span>&copy; {new Date().getFullYear()} Costa Rica Rental Hub</span>
                            </div>
                            <div className="flex gap-6 text-sm text-muted-foreground">
                                <span>Privacy</span>
                                <span>Terms</span>
                                <span>Support</span>
                                <Link
                                    href="/admin/login"
                                    className="transition-colors hover:text-foreground"
                                >
                                    Admin
                                </Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
