import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    IconSearch,
    IconMapPin,
    IconStar,
    IconBed,
    IconBath,
    IconUsers,
    IconHome,
    IconBuilding,
    IconBeach,
    IconMountain,
    IconTrees,
    IconHeart,
    IconHeartFilled,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface Property {
    id: number;
    name: string;
    type: string;
    location: string;
    image: string | null;
    base_price: number;
    price_format: string;
    currency: string;
    guests: number;
    bedrooms: number;
    bathrooms: number;
    rating: number;
    reviews: number;
    amenities: string[];
    host_name: string;
}

interface WelcomeProps extends SharedData {
    properties: Property[];
    types: string[];
    filters: {
        search: string;
        type: string;
        guests: string;
    };
    savedListingIds: number[];
}

const typeIcons: Record<string, typeof IconHome> = {
    'Vacation Rental': IconBeach,
    'Short Term Rental': IconBuilding,
    'Cabin': IconTrees,
    'Mountain': IconMountain,
};

function PropertyCard({ property, isAuthenticated, isSaved }: { property: Property; isAuthenticated: boolean; isSaved: boolean }) {
    return (
        <Link
            href={`/listing/${property.id}`}
            className="group block"
        >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                {property.image ? (
                    <img
                        src={property.image}
                        alt={property.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                        <IconHome className="size-12 text-muted-foreground" />
                    </div>
                )}
                <button
                    className="absolute top-3 right-3 rounded-full bg-white/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-white dark:bg-black/50 dark:hover:bg-black/70"
                    onClick={(e) => {
                        e.preventDefault();
                        if (!isAuthenticated) {
                            router.visit('/login?redirect=/');
                        } else {
                            router.post(`/listing/${property.id}/save`, {}, { preserveScroll: true });
                        }
                    }}
                >
                    {isSaved ? (
                        <IconHeartFilled className="size-5 text-red-500" />
                    ) : (
                        <IconHeart className="size-5 text-foreground/70" />
                    )}
                </button>
            </div>
            <div className="mt-3 space-y-1">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight text-foreground">
                        {property.name}
                    </h3>
                    {property.rating > 0 && (
                        <div className="flex shrink-0 items-center gap-1 text-sm">
                            <IconStar className="size-4 fill-current text-foreground" />
                            <span className="font-medium">{property.rating.toFixed(1)}</span>
                            <span className="text-muted-foreground">({property.reviews})</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <IconMapPin className="size-3.5" />
                    <span>{property.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <IconUsers className="size-3.5" />
                        {property.guests}
                    </span>
                    <span className="flex items-center gap-1">
                        <IconBed className="size-3.5" />
                        {property.bedrooms}
                    </span>
                    <span className="flex items-center gap-1">
                        <IconBath className="size-3.5" />
                        {property.bathrooms}
                    </span>
                </div>
                <p className="pt-1 text-sm">
                    <span className="font-semibold text-foreground">
                        ${property.base_price.toLocaleString()}
                    </span>{' '}
                    <span className="text-muted-foreground">/ night</span>
                </p>
            </div>
        </Link>
    );
}

export default function Welcome() {
    const { auth, properties, types, filters, savedListingIds } = usePage<WelcomeProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [activeType, setActiveType] = useState(filters.type || '');
    const [guests, setGuests] = useState(filters.guests || '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get(
            '/',
            { search, type: activeType, guests },
            { preserveState: true, preserveScroll: true },
        );
    }

    function handleTypeFilter(type: string) {
        const newType = activeType === type ? '' : type;
        setActiveType(newType);
        router.get(
            '/',
            { search, type: newType, guests },
            { preserveState: true, preserveScroll: true },
        );
    }

    return (
        <>
            <Head title="Costa Rica Rental Hub - Find Your Perfect Stay" />
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

                {/* Hero Section */}
                <section className="border-b bg-gradient-to-b from-primary/5 to-background pb-8 pt-12 sm:pt-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                                Find your perfect stay in{' '}
                                <span className="text-primary">Costa Rica</span>
                            </h1>
                            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                                Discover vacation rentals, beach houses, and mountain retreats from local hosts.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <form
                            onSubmit={handleSearch}
                            className="mx-auto mt-8 max-w-3xl"
                        >
                            <div className="flex flex-col gap-3 rounded-2xl border bg-card p-3 shadow-lg sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:p-2">
                                <div className="relative flex-1">
                                    <IconMapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Search by location or property name..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
                                    />
                                </div>
                                <div className="hidden h-8 w-px bg-border sm:block" />
                                <div className="relative w-full sm:w-28">
                                    <IconUsers className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        placeholder="Guests"
                                        min="1"
                                        value={guests}
                                        onChange={(e) => setGuests(e.target.value)}
                                        className="border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full rounded-full sm:w-auto"
                                >
                                    <IconSearch className="mr-2 size-4" />
                                    Search
                                </Button>
                            </div>
                        </form>
                    </div>
                </section>

                {/* Category Filter Bar */}
                {types.length > 0 && (
                    <div className="border-b">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
                                {types.map((type) => {
                                    const Icon = typeIcons[type] || IconHome;
                                    const isActive = activeType === type;
                                    return (
                                        <button
                                            key={type}
                                            onClick={() => handleTypeFilter(type)}
                                            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                                                isActive
                                                    ? 'border-primary bg-primary text-primary-foreground'
                                                    : 'border-border bg-card text-foreground hover:bg-accent'
                                            }`}
                                        >
                                            <Icon className="size-4" />
                                            {type}
                                        </button>
                                    );
                                })}
                                {activeType && (
                                    <button
                                        onClick={() => handleTypeFilter(activeType)}
                                        className="shrink-0 rounded-full border border-dashed px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent"
                                    >
                                        Clear filter
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Property Grid */}
                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    {properties.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {properties.map((property) => (
                                <PropertyCard key={property.id} property={property} isAuthenticated={!!auth.user} isSaved={savedListingIds?.includes(property.id) ?? false} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <IconSearch className="mx-auto size-12 text-muted-foreground/50" />
                            <h3 className="mt-4 text-lg font-semibold">No properties found</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Try adjusting your search or filters to find what you&apos;re looking for.
                            </p>
                            {(search || activeType || guests) && (
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => {
                                        setSearch('');
                                        setActiveType('');
                                        setGuests('');
                                        router.get('/');
                                    }}
                                >
                                    Clear all filters
                                </Button>
                            )}
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="border-t bg-muted/40">
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
