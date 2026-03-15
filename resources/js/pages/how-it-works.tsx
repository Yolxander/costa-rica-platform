import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { PublicHeader } from '@/components/public-header';
import { IconCheck, IconArrowRight } from '@tabler/icons-react';

export default function HowItWorks() {
    return (
        <>
            <Head title="How It Works" />
            <div className="min-h-screen bg-background">
                <PublicHeader />

                <main className="pt-24">
                    {/* Hero */}
                    <section className="px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                                How Sora Works
                            </h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Get your direct booking page live in 3 simple steps
                            </p>
                        </div>
                    </section>

                    {/* Steps */}
                    <section className="px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-6xl">
                            <div className="grid gap-8 md:grid-cols-3">
                                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                        1
                                    </div>
                                    <h3 className="text-lg font-semibold">Import your listing</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Copy your Airbnb link and paste it. We auto-import photos, title, description, and amenities.
                                    </p>
                                </div>
                                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                        2
                                    </div>
                                    <h3 className="text-lg font-semibold">Get your direct page</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        We generate a branded booking page with your own URL. Share it anywhere—social, email, WhatsApp.
                                    </p>
                                </div>
                                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                        3
                                    </div>
                                    <h3 className="text-lg font-semibold">Accept direct bookings</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Guests book directly with you. Payments go to your Stripe account. No OTA commissions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl">
                            <h2 className="text-center text-2xl font-bold sm:text-3xl">
                                Everything you need to go direct
                            </h2>
                            <div className="mt-10 grid gap-4 sm:grid-cols-2">
                                {[
                                    'Free to start, no credit card required',
                                    'Sync your Airbnb calendar automatically',
                                    'Accept payments via Stripe',
                                    'Email campaigns to past guests',
                                    'Social media post generator',
                                    'Guest CRM to track relationships',
                                ].map((feature) => (
                                    <div key={feature} className="flex items-center gap-3">
                                        <IconCheck className="size-5 text-green-500" />
                                        <span className="text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-2xl font-bold sm:text-3xl">
                                Ready to own your bookings?
                            </h2>
                            <p className="mt-4 text-muted-foreground">
                                Join hundreds of Costa Rica hosts taking control of their direct bookings.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                                <Link href="/host/register">
                                    <Button size="lg" className="h-[45px] gap-2 rounded-full px-8">
                                        Get Started Free
                                        <IconArrowRight className="size-4" />
                                    </Button>
                                </Link>
                                <Link href="/pricing">
                                    <Button variant="outline" size="lg" className="h-[45px] rounded-full">
                                        View Pricing
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
