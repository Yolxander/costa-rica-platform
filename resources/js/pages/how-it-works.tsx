import { Head, Link } from '@inertiajs/react';
import { IconArrowRight, IconCheck } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { PublicHeader } from '@/components/public-header';

const steps = [
    {
        title: 'List your property',
        tag: 'Setup',
        checklist: ['Property photos', 'Description & amenities', 'Pricing & availability', 'Booking page goes live'],
        example: 'brisa.com/villa-pacifico',
    },
    {
        title: 'Share your link',
        tag: 'Promote',
        checklist: ['Instagram & Facebook', 'WhatsApp & email', 'Your website', 'No OTA fees'],
        example: null,
    },
    {
        title: 'Guests inquire or book',
        tag: 'Connect',
        checklist: ['Check availability', 'Send inquiries', 'Book instantly', 'Direct host–guest messaging'],
        example: null,
    },
    {
        title: 'Accept and manage',
        tag: 'Manage',
        checklist: ['Approve bookings', 'Set availability', 'Manage reservations', 'Automated responses'],
        example: null,
    },
    {
        title: 'Get paid',
        tag: 'Earn',
        checklist: ['Stripe or bank transfer', 'Payments go to you', 'Keep most of your revenue', '$194 vs $160–170 on OTAs'],
        example: null,
    },
];


export default function HowItWorks() {
    return (
        <>
            <Head title="How It Works - Brisa" />
            <div className="min-h-screen bg-background">
                <PublicHeader />

                <main>
                    {/* Hero */}
                    <section className="px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">How direct bookings work</h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                List your property, receive inquiries, and accept bookings—without high OTA commissions.
                            </p>
                            <Link href="/host/register" className="mt-8 inline-block">
                                <Button size="lg" className="h-12 gap-2 rounded-xl px-8">
                                    List your property
                                    <IconArrowRight className="size-4" />
                                </Button>
                            </Link>
                        </div>
                    </section>

                    {/* 5-Step Process - Timeline layout */}
                    <section className="border-t px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl">
                            <h2 className="sr-only">The process</h2>
                            <div className="relative">
                                {/* Central vertical line - hidden on mobile */}
                                <div
                                    className="absolute left-1/2 top-6 bottom-6 hidden w-0.5 -translate-x-px bg-border md:block"
                                    aria-hidden
                                />
                                <div className="space-y-6 md:space-y-0">
                                    {steps.map((step, i) => {
                                        const isLeft = i % 2 === 0;
                                        const cardContent = (
                                            <div
                                                className={`w-full max-w-sm rounded-2xl border bg-card p-5 shadow-sm md:max-w-xs ${
                                                    isLeft ? 'md:ml-auto md:text-right' : ''
                                                }`}
                                            >
                                                <div
                                                    className={`flex flex-wrap items-center gap-2 ${isLeft ? 'md:justify-end' : ''}`}
                                                >
                                                    <h3 className="text-lg font-semibold">{step.title}</h3>
                                                    <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                        {step.tag}
                                                    </span>
                                                </div>
                                                <ul
                                                    className={`mt-3 space-y-1.5 ${isLeft ? 'md:flex md:flex-col md:items-end' : ''}`}
                                                >
                                                    {step.checklist.map((item) => (
                                                        <li
                                                            key={item}
                                                            className={`flex items-center gap-2 text-sm text-muted-foreground ${
                                                                isLeft ? 'md:flex-row-reverse' : ''
                                                            }`}
                                                        >
                                                            <IconCheck className="size-4 shrink-0 text-green-500" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                {step.example && (
                                                    <p className="mt-3 text-sm text-primary">
                                                        Example: <span className="font-mono">{step.example}</span>
                                                    </p>
                                                )}
                                            </div>
                                        );
                                        return (
                                            <div
                                                key={i}
                                                className="relative flex flex-col items-center gap-4 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6 md:py-6"
                                            >
                                                {/* Left: card when isLeft, empty when !isLeft */}
                                                <div className="w-full md:flex md:justify-end">
                                                    {isLeft ? cardContent : null}
                                                </div>
                                                {/* Center: timeline node */}
                                                <div className="flex shrink-0">
                                                    <div className="relative z-10 flex size-12 items-center justify-center rounded-full border bg-background text-base font-bold text-foreground shadow-sm">
                                                        {i + 1}
                                                    </div>
                                                </div>
                                                {/* Right: card when !isLeft, empty when isLeft */}
                                                <div className="w-full md:flex md:justify-start">
                                                    {!isLeft ? cardContent : null}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>


                    {/* Website add-on link */}
                    <section className="border-t px-4 py-8 sm:px-6 lg:px-8">
                        <p className="text-center text-sm text-muted-foreground">
                            Want a custom website for your property?{' '}
                            <Link href="/pricing#website" className="font-medium text-primary hover:underline">
                                See our add-ons on the Pricing page
                            </Link>
                        </p>
                    </section>

                    {/* Final CTA */}
                    <section className="border-t bg-muted/20 px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-2xl font-bold sm:text-3xl">Start receiving direct bookings today</h2>
                            <p className="mt-2 text-muted-foreground">
                                Secure payments · Verified listings · No credit card to start
                            </p>
                            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Link href="/host/register">
                                    <Button size="lg" className="h-12 gap-2 rounded-xl px-8">
                                        List your property
                                        <IconArrowRight className="size-4" />
                                    </Button>
                                </Link>
                                <Link href="/host/register">
                                    <Button variant="outline" size="lg" className="h-12 rounded-xl px-8">
                                        Create free listing
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
