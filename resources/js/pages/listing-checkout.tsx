import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import {
    IconBeach,
    IconMapPin,
    IconStar,
    IconUsers,
    IconBed,
    IconBath,
    IconArrowLeft,
    IconUser,
    IconMail,
    IconPhone,
    IconSend,
    IconCircleCheck,
    IconHome,
    IconLogin,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import InputError from '@/components/input-error';
import { type FormEvent, useState } from 'react';
import { toast } from 'sonner';

interface CheckoutProperty {
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

interface CheckoutProps extends SharedData {
    property: CheckoutProperty;
}

export default function ListingCheckout() {
    const { auth, property } = usePage<CheckoutProps>().props;
    const flash = (usePage().props as Record<string, unknown>).flash as
        | { success?: string }
        | undefined;

    const [submitted, setSubmitted] = useState(false);

    const form = useForm({
        traveler_name: auth.user?.name ?? '',
        traveler_email: auth.user?.email ?? '',
        traveler_phone: '',
        check_in: '',
        check_out: '',
        guests: 1,
        message: '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        form.post(`/listing/${property.id}/inquire`, {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitted(true);
                toast.success('Inquiry sent successfully!');
                form.reset();
            },
        });
    }

    const totalFees = property.cleaning_fee + property.service_fee;

    return (
        <>
            <Head title={`Inquire - ${property.name}`} />
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
                            <Link
                                href={`/listing/${property.id}`}
                                className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <IconArrowLeft className="size-4" />
                                Back to listing
                            </Link>
                        </nav>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {submitted || flash?.success ? (
                        <div className="mx-auto max-w-lg py-16 text-center">
                            <IconCircleCheck className="mx-auto size-16 text-green-500" />
                            <h1 className="mt-6 text-2xl font-bold">Inquiry Sent!</h1>
                            <p className="mt-2 text-muted-foreground">
                                {flash?.success || 'Your inquiry has been sent to the host. They will get back to you soon.'}
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                                <Link href={`/listing/${property.id}`}>
                                    <Button variant="outline">Back to listing</Button>
                                </Link>
                                <Link href="/">
                                    <Button>Browse more listings</Button>
                                </Link>
                            </div>
                        </div>
                    ) : !auth.user ? (
                        <div className="mx-auto max-w-lg py-16 text-center">
                            <IconLogin className="mx-auto size-12 text-muted-foreground/40" />
                            <h1 className="mt-4 text-2xl font-bold">Log in to continue</h1>
                            <p className="mt-2 text-muted-foreground">
                                You need to be logged in to send an inquiry to the host.
                            </p>
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                                <Link href={`/login?redirect=/listing/${property.id}/checkout`}>
                                    <Button size="lg">Log in</Button>
                                </Link>
                                <Link href={`/register?redirect=/listing/${property.id}/checkout`}>
                                    <Button variant="outline" size="lg">Sign up</Button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold sm:text-3xl">Confirm your inquiry</h1>
                            <p className="mt-1 text-muted-foreground">
                                Review the details and send your inquiry to the host.
                            </p>

                            <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
                                {/* Left: Inquiry Form */}
                                <div>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <h2 className="text-lg font-semibold">Your trip</h2>
                                            <div className="mt-4 grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="check_in">Check-in</Label>
                                                    <Input
                                                        id="check_in"
                                                        type="date"
                                                        value={form.data.check_in}
                                                        onChange={(e) => form.setData('check_in', e.target.value)}
                                                        min={new Date().toISOString().split('T')[0]}
                                                    />
                                                    <InputError message={form.errors.check_in} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="check_out">Check-out</Label>
                                                    <Input
                                                        id="check_out"
                                                        type="date"
                                                        value={form.data.check_out}
                                                        onChange={(e) => form.setData('check_out', e.target.value)}
                                                        min={form.data.check_in || new Date().toISOString().split('T')[0]}
                                                    />
                                                    <InputError message={form.errors.check_out} />
                                                </div>
                                            </div>
                                            <div className="mt-4 max-w-[calc(50%-0.5rem)] space-y-2">
                                                <Label htmlFor="guests">Guests</Label>
                                                <Input
                                                    id="guests"
                                                    type="number"
                                                    min={1}
                                                    max={property.guests}
                                                    value={form.data.guests}
                                                    onChange={(e) => form.setData('guests', parseInt(e.target.value) || 1)}
                                                />
                                                <InputError message={form.errors.guests} />
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h2 className="text-lg font-semibold">Your details</h2>
                                            <div className="mt-4 space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="traveler_name">Full name</Label>
                                                    <div className="relative">
                                                        <IconUser className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                                        <Input
                                                            id="traveler_name"
                                                            placeholder="Full name"
                                                            value={form.data.traveler_name}
                                                            onChange={(e) => form.setData('traveler_name', e.target.value)}
                                                            className="pl-9"
                                                        />
                                                    </div>
                                                    <InputError message={form.errors.traveler_name} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="traveler_email">Email</Label>
                                                    <div className="relative">
                                                        <IconMail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                                        <Input
                                                            id="traveler_email"
                                                            type="email"
                                                            placeholder="your@email.com"
                                                            value={form.data.traveler_email}
                                                            onChange={(e) => form.setData('traveler_email', e.target.value)}
                                                            className="pl-9"
                                                        />
                                                    </div>
                                                    <InputError message={form.errors.traveler_email} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="traveler_phone">Phone (optional)</Label>
                                                    <div className="relative">
                                                        <IconPhone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                                        <Input
                                                            id="traveler_phone"
                                                            placeholder="+1 (555) 000-0000"
                                                            value={form.data.traveler_phone}
                                                            onChange={(e) => form.setData('traveler_phone', e.target.value)}
                                                            className="pl-9"
                                                        />
                                                    </div>
                                                    <InputError message={form.errors.traveler_phone} />
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h2 className="text-lg font-semibold">Message to host</h2>
                                            <div className="mt-4 space-y-2">
                                                <Textarea
                                                    id="message"
                                                    placeholder="Tell the host about your trip, who's coming, and what you're looking forward to..."
                                                    rows={5}
                                                    value={form.data.message}
                                                    onChange={(e) => form.setData('message', e.target.value)}
                                                />
                                                <InputError message={form.errors.message} />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            size="lg"
                                            disabled={form.processing}
                                        >
                                            {form.processing ? (
                                                'Sending...'
                                            ) : (
                                                <>
                                                    <IconSend className="mr-2 size-4" />
                                                    Send Inquiry
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </div>

                                {/* Right: Property Summary */}
                                <div className="lg:sticky lg:top-24 lg:self-start">
                                    <Card>
                                        <CardContent className="p-0">
                                            {/* Property image */}
                                            <div className="aspect-[16/10] overflow-hidden rounded-t-xl bg-muted">
                                                {property.images?.[0] ? (
                                                    <img
                                                        src={property.images[0]}
                                                        alt={property.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <IconHome className="size-12 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-4 p-5">
                                                {/* Name & location */}
                                                <div>
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h3 className="font-semibold leading-tight">{property.name}</h3>
                                                        {property.rating > 0 && (
                                                            <div className="flex shrink-0 items-center gap-1 text-sm">
                                                                <IconStar className="size-4 fill-current" />
                                                                <span className="font-medium">{property.rating.toFixed(1)}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                                                        <IconMapPin className="size-3.5" />
                                                        {property.location}
                                                    </p>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <Badge variant="secondary" className="text-xs">{property.type}</Badge>
                                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <IconUsers className="size-3" /> {property.guests}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <IconBed className="size-3" /> {property.bedrooms}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <IconBath className="size-3" /> {property.bathrooms}
                                                        </span>
                                                    </div>
                                                </div>

                                                <Separator />

                                                {/* Host */}
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                        <IconUser className="size-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Hosted by</p>
                                                        <p className="text-sm font-medium">{property.host.name}</p>
                                                    </div>
                                                </div>

                                                <Separator />

                                                {/* Price breakdown */}
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Nightly rate</span>
                                                        <span className="font-medium">${property.base_price.toLocaleString()}</span>
                                                    </div>
                                                    {property.cleaning_fee > 0 && (
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Cleaning fee</span>
                                                            <span>${property.cleaning_fee.toLocaleString()}</span>
                                                        </div>
                                                    )}
                                                    {property.service_fee > 0 && (
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Service fee</span>
                                                            <span>${property.service_fee.toLocaleString()}</span>
                                                        </div>
                                                    )}
                                                    {totalFees > 0 && (
                                                        <>
                                                            <Separator />
                                                            <div className="flex justify-between font-semibold">
                                                                <span>Additional fees</span>
                                                                <span>${totalFees.toLocaleString()}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </>
                    )}
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
