import { Head, Link } from '@inertiajs/react';
import {
    IconCheck,
    IconArrowRight,
    IconLink,
    IconShare,
    IconHome,
    IconCurrencyDollar,
    IconTrendingDown,
    IconTrendingUp,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { PublicHeader } from '@/components/public-header';
import { PlanComparison } from '@/components/plan-comparison';
import { useState, useRef, useEffect } from 'react';

const starterFeatures = [
    '1 property listing',
    'Booking calendar',
    'Guest inquiries',
    'Direct payments (coming soon)',
    'Email notifications',
    'Basic analytics',
];

const proHostFeatures = [
    'Up to 10 properties',
    'Direct bookings',
    'Automated emails',
    'Guest messaging',
    'Booking management dashboard',
    'Channel sync (coming soon)',
    'Performance analytics',
];

const professionalFeatures = [
    'Unlimited properties',
    'Team members (coming soon)',
    'Multi-calendar',
    'Guest CRM',
    'Automated promotions',
    'Website integration (coming soon)',
    'Advanced analytics',
];


const pricingFaq = [
    {
        q: 'Do guests pay fees?',
        a: 'No. Guests book directly with you. They pay the nightly rate you set—no extra platform fees for them.',
    },
    {
        q: 'How do payments work?',
        a: 'Payments go directly to your Stripe account. We\'ll handle the integration so you receive funds within 2 business days.',
    },
    {
        q: 'Can I connect Airbnb?',
        a: 'Yes. Calendar sync is available so your direct booking page stays in sync with your OTA calendars.',
    },
    {
        q: 'Can I use my own website?',
        a: 'Yes. Custom domain (e.g. bookdirect.yourproperty.com) is included on Pro plans. Or get a full website from Sempre Studios.',
    },
    {
        q: 'Can property managers use the platform?',
        a: 'Yes. The Professional plan includes unlimited listings and is designed for property managers.',
    },
];

function PricingTiersSection({
    starterFeatures,
    proHostFeatures,
    professionalFeatures,
}: {
    starterFeatures: string[];
    proHostFeatures: string[];
    professionalFeatures: string[];
}) {
    const [inView, setInView] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ob = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
        const el = sectionRef.current;
        if (el) ob.observe(el);
        return () => ob.disconnect();
    }, []);

    const cardBaseClass =
        'flex flex-col rounded-2xl transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl';

    const getCardAnimation = (index: number) => ({
        opacity: inView ? 1 : 0,
        transform: inView
            ? `translateY(0) scale(${index === 1 ? 1.03 : 1})`
            : 'translateY(30px) scale(0.97)',
        transition: `all 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${index * 120}ms`,
    });

    return (
        <section ref={sectionRef} className="relative border-t px-4 py-16 sm:px-6 lg:px-8">
            {/* Subtle glow behind middle plan */}
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[400px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-primary/5 blur-3xl"
                aria-hidden="true"
            />
            <div className="relative mx-auto max-w-6xl">
                <h2
                    className="text-center text-2xl font-bold sm:text-3xl"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                >
                    Simple pricing tiers
                </h2>
                <p
                    className="mt-2 text-center text-muted-foreground"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1) 80ms',
                    }}
                >
                    Hosts hate complicated pricing. We keep it simple.
                </p>
                <div className="mt-10 grid gap-6 lg:grid-cols-3">
                    {/* Starter */}
                    <Card className={`${cardBaseClass} border-0 shadow-lg`} style={getCardAnimation(0)}>
                        <CardHeader className="pb-4">
                            <CardTitle>Starter</CardTitle>
                            <CardDescription>Best for new hosts</CardDescription>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-bold">$0</span>
                                <span className="text-muted-foreground">/month</span>
                            </div>
                            <p className="mt-2 text-sm font-medium text-primary">5% per booking</p>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col pt-0">
                            <ul className="flex-1 space-y-2.5">
                                {starterFeatures.map((f) => (
                                    <li key={f} className="flex items-start gap-2 text-sm">
                                        <IconCheck className="mt-0.5 size-4 shrink-0 text-green-500" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/host/register" className="mt-6 block">
                                <Button
                                    variant="outline"
                                    className="h-11 w-full rounded-xl transition-all duration-200 hover:scale-[1.04] group"
                                >
                                    Start Free
                                    <IconArrowRight className="ml-1 size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Pro Host - Highlighted */}
                    <Card
                        className={`${cardBaseClass} relative border-2 border-primary shadow-xl`}
                        style={getCardAnimation(1)}
                    >
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                            Most Popular
                        </div>
                        <CardHeader className="pt-7 pb-4">
                            <CardTitle>Pro Host</CardTitle>
                            <CardDescription>Best for serious hosts</CardDescription>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-bold">$24</span>
                                <span className="text-muted-foreground">/month</span>
                            </div>
                            <p className="mt-2 text-sm font-medium text-primary">2–3% per booking</p>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col pt-0">
                            <ul className="flex-1 space-y-2.5">
                                {proHostFeatures.map((f) => (
                                    <li key={f} className="flex items-start gap-2 text-sm">
                                        <IconCheck className="mt-0.5 size-4 shrink-0 text-green-500" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/host/register" className="mt-6 block">
                                <Button className="h-11 w-full rounded-xl transition-all duration-200 hover:scale-[1.04] group">
                                    Upgrade
                                    <IconArrowRight className="ml-1 size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Professional */}
                    <Card className={`${cardBaseClass} border-0 shadow-lg`} style={getCardAnimation(2)}>
                        <CardHeader className="pb-4">
                            <CardTitle>Professional</CardTitle>
                            <CardDescription>Best for property managers</CardDescription>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-bold">$64</span>
                                <span className="text-muted-foreground">/month</span>
                            </div>
                            <p className="mt-2 text-sm font-medium text-primary">0–1% per booking</p>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col pt-0">
                            <ul className="flex-1 space-y-2.5">
                                {professionalFeatures.map((f) => (
                                    <li key={f} className="flex items-start gap-2 text-sm">
                                        <IconCheck className="mt-0.5 size-4 shrink-0 text-green-500" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/host/register" className="mt-6 block">
                                <Button
                                    variant="outline"
                                    className="h-11 w-full rounded-xl transition-all duration-200 hover:scale-[1.04] group"
                                >
                                    Start Trial
                                    <IconArrowRight className="ml-1 size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}

function RevenueExampleSection() {
    const [inView, setInView] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ob = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
        const el = sectionRef.current;
        if (el) ob.observe(el);
        return () => ob.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="border-t bg-muted/20 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <h2
                    className="text-center text-2xl font-bold sm:text-3xl"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                >
                    See how much hosts keep
                </h2>
                <p
                    className="mt-2 text-center text-muted-foreground"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1) 60ms',
                    }}
                >
                    Example: $180 booking
                </p>
                <div className="mt-10 grid gap-6 md:grid-cols-2">
                    {/* OTA Card - slides from left */}
                    <Card
                        className="overflow-hidden rounded-2xl border border-destructive/20 bg-background shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                        style={{
                            opacity: inView ? 1 : 0,
                            transform: inView ? 'translateX(0)' : 'translateX(-20px)',
                            transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1) 100ms',
                        }}
                    >
                        <CardHeader className="pb-3">
                            <span className="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Marketplace bookings
                            </span>
                            <CardTitle className="flex items-center gap-2 text-base text-destructive">
                                <IconTrendingDown className="size-5" />
                                With OTA (15% fee)
                            </CardTitle>
                            <CardDescription>
                                Fees you pay to platforms like Airbnb
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-0">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Guest pays</span>
                                <span className="font-medium">$180</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Platform fee (15%)</span>
                                <span className="font-medium text-destructive">−$27</span>
                            </div>
                            <div className="border-t pt-3">
                                <div className="flex justify-between font-semibold">
                                    <span>You receive</span>
                                    <span>$153</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sora Card - slides from right */}
                    <Card
                        className="overflow-hidden rounded-2xl border-2 border-primary/30 bg-background shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                        style={{
                            opacity: inView ? 1 : 0,
                            transform: inView ? 'translateX(0)' : 'translateX(20px)',
                            transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1) 100ms',
                        }}
                    >
                        <CardHeader className="pb-3">
                            <span className="mb-1 text-xs font-medium text-primary uppercase tracking-wider">
                                Direct bookings
                            </span>
                            <CardTitle className="flex items-center gap-2 text-base text-primary">
                                <IconCurrencyDollar className="size-5" />
                                With Sora (3% fee)
                            </CardTitle>
                            <CardDescription>
                                Direct bookings, more in your pocket
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-0">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Guest pays</span>
                                <span className="font-medium">$180</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Platform fee (3%)</span>
                                <span className="font-medium">−$5.40</span>
                            </div>
                            <div className="border-t pt-3">
                                <div className="flex justify-between font-semibold">
                                    <span>You receive</span>
                                    <span className="text-primary">$174.60</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Savings highlight bar - animates last */}
                <div
                    className="mt-6 flex flex-col items-center justify-center rounded-2xl bg-primary/10 px-6 py-5 sm:flex-row sm:gap-4"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'scale(1)' : 'scale(0.95)',
                        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1) 300ms',
                    }}
                >
                    <div className="text-center sm:text-left">
                        <p className="text-lg font-bold text-primary">
                            You keep $21.60 more per booking
                        </p>
                        <p className="text-sm text-muted-foreground">
                            With 10 bookings/month → $216 more in your pocket
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function WebsiteAddOnSection() {
    const [inView, setInView] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ob = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
        const el = sectionRef.current;
        if (el) ob.observe(el);
        return () => ob.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="website"
            className="border-t bg-muted/20 px-4 py-16 sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-5xl">
                <h2
                    className="text-center text-2xl font-bold sm:text-3xl"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                >
                    Your property. Your website. Your bookings.
                </h2>
                <p
                    className="mt-4 text-center text-muted-foreground"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1) 60ms',
                    }}
                >
                    Turn your property into a professional website where guests can book directly.
                </p>
                <div className="mt-10 grid gap-6 md:grid-cols-3">
                    {/* Basic Website - slides from left */}
                    <Card
                        className="group flex flex-col rounded-2xl border-0 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                        style={{
                            opacity: inView ? 1 : 0,
                            transform: inView ? 'translateX(0)' : 'translateX(-30px)',
                            transition: 'all 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                    >
                        <CardHeader className="pb-4">
                            <CardTitle>Basic Website</CardTitle>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-2xl font-bold">$199</span>
                                <span className="text-sm text-muted-foreground">one time</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col pt-0">
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2">
                                    <IconCheck className="size-4 shrink-0 text-green-500 transition-transform duration-150 group-hover:scale-110" />
                                    Property landing page
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconCheck className="size-4 shrink-0 text-green-500 transition-transform duration-150 group-hover:scale-110" />
                                    Photo gallery
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconCheck className="size-4 shrink-0 text-green-500 transition-transform duration-150 group-hover:scale-110" />
                                    Booking calendar
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconCheck className="size-4 shrink-0 text-green-500 transition-transform duration-150 group-hover:scale-110" />
                                    Inquiry form
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconCheck className="size-4 shrink-0 text-green-500 transition-transform duration-150 group-hover:scale-110" />
                                    Mobile optimized
                                </li>
                            </ul>
                            <p className="mt-4 text-xs text-muted-foreground">Example: staywithsofia.com</p>
                            <Link href="/join" className="mt-6 block">
                                <Button variant="outline" className="h-11 w-full rounded-xl transition-all duration-200 hover:scale-[1.03]">
                                    Learn more
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Pro Website - rises from bottom with scale emphasis */}
                    <Card
                        className="group flex flex-col rounded-2xl border-2 border-primary shadow-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
                        style={{
                            opacity: inView ? 1 : 0,
                            transform: inView ? 'translateY(0) scale(1.03)' : 'translateY(20px) scale(0.96)',
                            transition: 'all 0.65s cubic-bezier(0.22, 1, 0.36, 1) 120ms',
                        }}
                    >
                        <CardHeader className="pb-4">
                            <CardTitle>Pro Website</CardTitle>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-2xl font-bold">$399</span>
                                <span className="text-sm text-muted-foreground">one time</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col pt-0">
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2">
                                    <IconCheck className="size-4 shrink-0 text-green-500 transition-transform duration-150 group-hover:scale-110" />
                                    Multi-page website
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconCheck className="size-4 shrink-0 text-green-500 transition-transform duration-150 group-hover:scale-110" />
                                    Booking engine
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconCheck className="size-4 shrink-0 text-green-500 transition-transform duration-150 group-hover:scale-110" />
                                    Guest payment system
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconCheck className="size-4 shrink-0 text-green-500 transition-transform duration-150 group-hover:scale-110" />
                                    SEO optimized
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconCheck className="size-4 shrink-0 text-green-500 transition-transform duration-150 group-hover:scale-110" />
                                    Custom domain
                                </li>
                            </ul>
                            <Link href="/join" className="mt-6 block">
                                <Button className="h-11 w-full rounded-xl transition-all duration-200 hover:scale-[1.03] group/btn">
                                    Learn more
                                    <IconArrowRight className="ml-1 size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Premium Website - slides from right */}
                    <Card
                        className="group flex flex-col rounded-2xl border-0 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                        style={{
                            opacity: inView ? 1 : 0,
                            transform: inView ? 'translateX(0)' : 'translateX(30px)',
                            transition: 'all 0.55s cubic-bezier(0.22, 1, 0.36, 1) 220ms',
                        }}
                    >
                        <CardHeader className="pb-4">
                            <CardTitle>Premium Website</CardTitle>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-2xl font-bold">$799+</span>
                                <span className="text-sm text-muted-foreground">one time</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col pt-0">
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2">
                                    <IconCheck className="size-4 shrink-0 text-green-500 transition-transform duration-150 group-hover:scale-110" />
                                    Multiple properties
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconCheck className="size-4 shrink-0 text-green-500 transition-transform duration-150 group-hover:scale-110" />
                                    Full branding
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconCheck className="size-4 shrink-0 text-green-500 transition-transform duration-150 group-hover:scale-110" />
                                    Custom design
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconCheck className="size-4 shrink-0 text-green-500 transition-transform duration-150 group-hover:scale-110" />
                                    SEO setup
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconCheck className="size-4 shrink-0 text-green-500 transition-transform duration-150 group-hover:scale-110" />
                                    Marketing pages
                                </li>
                            </ul>
                            <p className="mt-6 text-center text-sm font-medium text-primary">Powered by Sempre Studios</p>
                            <Link href="/join" className="mt-4 block">
                                <Button variant="outline" className="h-11 w-full rounded-xl transition-all duration-200 hover:scale-[1.03]">
                                    Learn more
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}

function PricingFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const faqRef = useRef<HTMLDivElement>(null);
    const [faqInView, setFaqInView] = useState(false);

    useEffect(() => {
        const ob = new IntersectionObserver(([e]) => setFaqInView(e.isIntersecting), { threshold: 0.1 });
        const el = faqRef.current;
        if (el) ob.observe(el);
        return () => ob.disconnect();
    }, []);

    return (
        <section ref={faqRef} className="border-t bg-secondary/5 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 text-center">
                    <h2
                        className="text-3xl font-bold tracking-tight sm:text-4xl"
                        style={{
                            opacity: faqInView ? 1 : 0,
                            transform: faqInView ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                    >
                        Frequently Asked Questions
                    </h2>
                    <p
                        className="mx-auto mt-4 max-w-2xl text-muted-foreground"
                        style={{
                            opacity: faqInView ? 1 : 0,
                            transform: faqInView ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1) 60ms',
                        }}
                    >
                        Everything hosts ask before switching from OTAs.
                    </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    {pricingFaq.map((item, i) => (
                        <Collapsible
                            key={i}
                            open={openIndex === i}
                            onOpenChange={(open) => setOpenIndex(open ? i : null)}
                        >
                            <Card
                                className={`group overflow-hidden rounded-2xl border border-border/30 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${openIndex === i ? 'bg-muted/40' : 'bg-background'}`}
                                style={{
                                    opacity: faqInView ? 1 : 0,
                                    transform: faqInView ? 'translateY(0)' : 'translateY(20px)',
                                    transitionDelay: `${i * 90}ms`,
                                }}
                            >
                                <CollapsibleTrigger asChild>
                                    <button className="flex w-full items-center justify-between p-5 text-left">
                                        <span className="pr-4 text-base font-semibold">{item.q}</span>
                                        <span
                                            className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${openIndex === i ? 'bg-secondary text-background' : 'bg-primary text-background'}`}
                                            style={{
                                                transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.25s ease-out, background-color 0.3s',
                                            }}
                                        >
                                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                                            </svg>
                                        </span>
                                    </button>
                                </CollapsibleTrigger>
                                <CollapsibleContent
                                    className="data-[state=open]:animate-faqOpen data-[state=closed]:animate-faqClose"
                                >
                                    <div
                                        className="px-5 pb-5 pt-0 text-sm leading-relaxed text-muted-foreground"
                                        style={{
                                            opacity: openIndex === i ? 1 : 0,
                                            transform: openIndex === i ? 'translateY(0)' : 'translateY(6px)',
                                            transition: 'opacity 0.35s ease-out, transform 0.35s ease-out',
                                        }}
                                    >
                                        {item.a}
                                    </div>
                                </CollapsibleContent>
                            </Card>
                        </Collapsible>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function Pricing() {
    return (
        <>
            <Head title="Pricing - Sora" />
            <div className="min-h-screen bg-background">
                <PublicHeader />

                <main>
                    {/* 1. Hero */}
                    <section className="relative px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                        {/* Subtle gradient glow behind comparison */}
                        <div
                            className="pointer-events-none absolute left-1/2 top-[60%] h-32 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"
                            aria-hidden="true"
                        />
                        <div className="relative mx-auto mt-14 max-w-3xl text-center">
                            <h1
                                className="text-3xl text-secondary font-bold tracking-tight sm:text-4xl"
                                style={{
                                    opacity: 1,
                                    transform: 'translateY(0)',
                                    animation: 'fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                                }}
                            >
                                Simple pricing for direct bookings
                            </h1>
                            <p
                                className="mt-4 text-lg text-muted-foreground"
                                style={{
                                    opacity: 0,
                                    animation: 'fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 120ms forwards',
                                }}
                            >
                                Keep more of your revenue and manage your
                                rentals without OTA commissions.
                            </p>
                            <div
                                className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm"
                                style={{
                                    opacity: 0,
                                    animation: 'fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 200ms forwards',
                                }}
                            >
                                {/* OTA group */}
                                <div className="flex items-center gap-4">
                                    <span className="text-muted-foreground">
                                        Airbnb: 14–18%
                                    </span>
                                    <span className="text-muted-foreground">
                                        Booking.com: 15–20%
                                    </span>
                                    <span className="text-muted-foreground">
                                        Vrbo: 8–12%
                                    </span>
                                </div>
                                {/* Separator */}
                                <span className="hidden h-4 w-px bg-border sm:block" />
                                {/* Sora highlight */}
                                <span
                                    className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary transition-all duration-200 hover:scale-105 hover:bg-primary/20 cursor-default"
                                    style={{
                                        opacity: 0,
                                        transform: 'scale(0.9)',
                                        animation: 'scaleIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) 300ms forwards',
                                    }}
                                >
                                    Sora: 0–5%
                                </span>
                            </div>
                        </div>
                        {/* Keyframe animations */}
                        <style>{`
                            @keyframes fadeUp {
                                from {
                                    opacity: 0;
                                    transform: translateY(20px);
                                }
                                to {
                                    opacity: 1;
                                    transform: translateY(0);
                                }
                            }
                            @keyframes scaleIn {
                                from {
                                    opacity: 0;
                                    transform: scale(0.9);
                                }
                                to {
                                    opacity: 1;
                                    transform: scale(1);
                                }
                            }
                        `}</style>
                    </section>

                    {/* 4. Plan Comparison */}
                    <PlanComparison />

                    {/* 5. Revenue Example */}
                    <RevenueExampleSection />

                    {/* 6. Website Add-On (Sempre Studios) */}
                    <WebsiteAddOnSection />

                    {/* 7. FAQ */}
                    <PricingFAQ />

                    {/* 8. Final CTA */}
                    <section className="border-t px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-2xl font-bold sm:text-3xl">
                                Start getting direct bookings today
                            </h2>
                            <p className="mt-4 text-muted-foreground">
                                No credit card required. Create your free
                                listing in minutes.
                            </p>
                            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Link href="/host/register">
                                    <Button
                                        size="lg"
                                        className="h-12 gap-2 rounded-xl px-8"
                                    >
                                        Create Free Listing
                                        <IconArrowRight className="size-4" />
                                    </Button>
                                </Link>
                                <Link href="/join">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-12 rounded-xl px-8"
                                    >
                                        Book a Demo
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
