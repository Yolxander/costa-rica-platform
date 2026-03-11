import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    IconBeach,
    IconCalculator,
    IconLink,
    IconChevronLeft,
    IconChevronRight,
    IconCheck,
    IconArrowRight,
    IconChevronDown,
    IconUsers,
    IconBrandInstagram,
    IconBrandX,
    IconBrandFacebook,
    IconChartLine,
    IconMapPin,
    IconCalendar,
    IconMail,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { PublicHeader } from '@/components/public-header';
import { useState, useRef, useEffect } from 'react';

interface LandingProps extends SharedData {
    hostCount?: number;
}

// Scroll to #airbnb-import section
function scrollToImport() {
    document.getElementById('airbnb-import')?.scrollIntoView({ behavior: 'smooth' });
}

// Count-up animation helper
function useCountUp(end: number, duration: number, trigger: boolean) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!trigger) return;
        const startTime = performance.now();
        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.round(progress * end));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [end, duration, trigger]);
    return count;
}



// FAQ Accordion
const faqItems = [
    {
        q: 'What if Airbnb lowers fees?',
        a: "Even at 8% fees, you still don't own your guest data. Direct booking means repeat business—that's where 40% of revenue comes from.",
    },
    {
        q: 'Can I keep using Airbnb?',
        a: "Yes. We're an additional channel, not a replacement. Keep Airbnb, capture overflow direct.",
    },
    {
        q: 'Is this legal in Costa Rica?',
        a: 'Yes. We help you collect IVA (13% sales tax) automatically through Stripe.',
    },
    {
        q: 'How do I receive payments?',
        a: 'Stripe deposits to your Costa Rican bank account (Banco Nacional, BAC, etc.) within 2 business days.',
    },
    {
        q: 'Do I need a website?',
        a: "No. We give you a branded page at bookdirect.yourproperty.com. Custom domain included in Pro.",
    },
];

function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    return (
        <section className="border-t bg-secondary/5 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">
                <h2 className="text-center text-2xl font-bold sm:text-3xl">Frequently Asked Questions</h2>
                <div className="mt-10 space-y-3">
                    {faqItems.map((item, i) => (
                        <Collapsible
                            key={i}
                            open={openIndex === i}
                            onOpenChange={(open) => setOpenIndex(open ? i : null)}
                        >
                            <Card className="overflow-hidden rounded-xl border-0 bg-background shadow-sm">
                                <CollapsibleTrigger asChild>
                                    <button className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-muted/50 sm:px-6">
                                        <span className="pr-4 font-medium">{item.q}</span>
                                        <IconChevronDown
                                            className={`size-5 shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <div className="border-t px-5 py-4 text-sm leading-relaxed text-muted-foreground sm:px-6">{item.a}</div>
                                </CollapsibleContent>
                            </Card>
                        </Collapsible>
                    ))}
                </div>
            </div>
        </section>
    );
}

const REGIONS = [
    { name: 'Tamarindo', tag: 'Beach paradise', region: 'Guanacaste', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80' },
    { name: 'Santa Teresa', tag: 'Surf town', region: 'Nicoya Peninsula', img: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=400&q=80' },
    { name: 'Manuel Antonio', tag: 'Rainforest & beach', region: 'Central Pacific', img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=80' },
    { name: 'Nosara', tag: 'Yoga retreats', region: 'Guanacaste', img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80' },
];

const WHAT_YOU_GET_CARDS = [
    {
        icon: IconMail,
        title: 'Marketing',
        subtitle: 'Reach guests without OTAs',
        desc: 'Launch email campaigns and social posts to attract your first direct guests. Promote your property to past OTA guests, social followers, or new audiences. AI-powered captions and templates help you get started even before you have a big list.',
        features: ['Email campaigns with smart segments', 'Social post wizard (Instagram, Facebook)', 'AI-generated captions & hashtags', 'One-click sharing to your network'],
    },
    {
        icon: IconUsers,
        title: 'Guest CRM',
        subtitle: 'Build your first guest list',
        desc: 'From day one, capture every inquiry and booking contact in one place. Track who’s interested, who’s booked, and who’s coming back—no spreadsheet needed. Your guest list grows with you so you can nurture relationships and drive repeat bookings.',
        features: ['Inquiry capture from your listing', 'Status tracking (New, Contacted, Booked)', 'Booking history per guest', 'Ready for repeat-booking outreach'],
    },
    {
        icon: IconCalendar,
        title: 'Calendar',
        subtitle: 'Sync availability from day one',
        desc: 'Import your existing Airbnb calendar so your direct listing shows real-time availability. Block dates, manage bookings, and keep everything in sync—no double-bookings. Start taking direct reservations without losing your OTA visibility.',
        features: ['Airbnb calendar sync (read-only)', 'Block dates & manage availability', 'Prevent double-bookings', 'Single source of truth for availability'],
    },
    {
        icon: IconChartLine,
        title: 'Savings Tracker',
        subtitle: 'Real-time commission avoided',
        desc: 'See exactly how much commission you avoid with every direct booking. Track revenue processed vs. what OTAs would have taken at 15–20%. Watch your savings add up and measure the real impact of going direct.',
        features: ['Live savings dashboard', 'OTA fee comparison', 'Revenue processed metric', 'Historical trend view'],
    },
];

export default function Landing() {
    const { hostCount = 0 } = usePage<LandingProps>().props;
    const [demoModalOpen, setDemoModalOpen] = useState(false);
    const regionsRef = useRef<HTMLDivElement>(null);
    const hostCountRef = useRef<HTMLDivElement>(null);
    const [hostCountInView, setHostCountInView] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [vh, setVh] = useState(800);

    useEffect(() => {
        setVh(window.innerHeight);
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initialize Lenis smooth scroll
        const initLenis = () => {
            const win = window as unknown as { Lenis?: new (options: Record<string, unknown>) => { raf: (time: number) => void; destroy: () => void } };
            if (typeof window !== 'undefined' && win.Lenis) {
                const lenis = new win.Lenis({
                    duration: 1.2,
                    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    orientation: 'vertical',
                    gestureOrientation: 'vertical',
                    smoothWheel: true,
                });
                function raf(time: number) {
                    lenis.raf(time);
                    requestAnimationFrame(raf);
                }
                requestAnimationFrame(raf);
                return lenis;
            }
        };
        const lenisInstance = initLenis();
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (lenisInstance) lenisInstance.destroy();
        };
    }, []);

    // Parallax: hero image zooms out (scales down) as we scroll
    // Starts at normal size (1.0) and zooms out to 1.15x over scroll
    const heroBgScale = 1 + Math.min(0.15, scrollY * 0.0003);
    const heroContentOpacity = Math.max(0, 1 - scrollY / (vh * 0.6));
    // Hero width expansion: interpolate from max-w-7xl (1280px) to 100vw
    const heroWidthProgress = Math.min(1, scrollY / 300); // 0 to 1 over 300px scroll
    const heroWidth = 1280 + (window.innerWidth - 1280) * heroWidthProgress;
    const heroPadding = 24 * (1 - heroWidthProgress); // 24px down to 0

    useEffect(() => {
        const ob = new IntersectionObserver(([e]) => setHostCountInView(e.isIntersecting), { threshold: 0.5 });
        const el = hostCountRef.current;
        if (el) ob.observe(el);
        return () => ob.disconnect();
    }, []);

    const scrollRegions = (dir: 'l' | 'r') => {
        if (regionsRef.current) {
            regionsRef.current.scrollBy({ left: dir === 'l' ? -316 : 316, behavior: 'smooth' });
        }
    };

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

    return (
        <>
            <Head title="Own Your Direct Bookings in Costa Rica" />
            <div className="min-h-screen bg-background">
                <PublicHeader transparentUntilScroll />

                <main>
                    {/* 1. HERO */}
                    <section
                        className="transition-all duration-100 ease-out"
                        style={{
                            padding: `${heroPadding}px`,
                        }}
                    >
                        <div
                            className="relative mx-auto flex min-h-[85vh] items-center justify-center overflow-hidden rounded-2xl bg-muted/30 mt-14"
                            style={{
                                width: `${heroWidth}px`,
                                borderRadius: heroWidthProgress > 0.5 ? '0px' : '16px',
                            }}
                        >
                            {/* Background image - top half with zoom parallax */}
                            <div
                                className="absolute inset-0 bg-[url('/sora-bg.jpg')] bg-[length:100%_200%] bg-[position:50%_0%]"
                                style={{
                                    transform: `scale(${heroBgScale})`,
                                    transformOrigin: 'center center',
                                }}
                            />

                            {/* Dark overlay */}
                            <div className="absolute inset-0 bg-black/20" />

                            {/* Content with fade and subtle parallax */}
                            <div
                                className="relative z-10 mx-auto w-full max-w-3xl px-6 py-16 text-center sm:px-8 sm:py-20"
                                style={{ opacity: heroContentOpacity }}
                            >
                                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                                    Own Your Direct Bookings
                                </h1>

                                <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white sm:text-lg md:text-xl">
                                    Accept direct bookings, collect payments,
                                    and turn one-time guests into repeat
                                    customers without paying OTA commissions.
                                </p>

                                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                                    <Button
                                        size="lg"
                                        className="w-full gap-2 rounded-full px-8 sm:w-auto"
                                        onClick={scrollToImport}
                                    >
                                        Import listing
                                        <IconArrowRight className="size-4" />
                                    </Button>

                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        className="w-full rounded-full sm:w-auto"
                                        onClick={() => setDemoModalOpen(true)}
                                    >
                                        Watch Demo
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. WHY CHOOSE */}
                    <section className="px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-7xl">
                            <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
                                <div className="lg:sticky lg:top-24 lg:col-span-5">
                                    <h2 className="text-2xl leading-tight font-bold sm:text-3xl">
                                        Why Costa Rica Hosts Choose Direct
                                        Bookings
                                    </h2>
                                    <p className="mt-4 leading-relaxed text-muted-foreground sm:text-base">
                                        Get your direct booking page live in
                                        minutes—no website needed. Add your
                                        listing, sync your calendar, and start
                                        reaching guests with email and social.
                                        Connect Stripe when you&apos;re ready to
                                        take payments.
                                    </p>
                                    <div className="mt-6 flex gap-3">
                                        <a
                                            href="#"
                                            className="flex size-10 items-center justify-center rounded-full bg-secondary/20 text-secondary-foreground transition-colors hover:bg-secondary"
                                            aria-label="Instagram"
                                        >
                                            <IconBrandInstagram className="size-5" />
                                        </a>
                                        <a
                                            href="#"
                                            className="flex size-10 items-center justify-center rounded-full bg-secondary/20 text-secondary-foreground transition-colors hover:bg-secondary"
                                            aria-label="X"
                                        >
                                            <IconBrandX className="size-5" />
                                        </a>
                                        <a
                                            href="#"
                                            className="flex size-10 items-center justify-center rounded-full bg-secondary/20 text-secondary-foreground transition-colors hover:bg-secondary"
                                            aria-label="Facebook"
                                        >
                                            <IconBrandFacebook className="size-5" />
                                        </a>
                                    </div>
                                </div>
                                <div className="space-y-4 lg:col-span-7">
                                    {[
                                        {
                                            icon: IconLink,
                                            title: 'Add your listing',
                                            desc: 'Import photos, title, description, and amenities. Your direct listing goes live—free to start, no credit card required.',
                                        },
                                        {
                                            icon: IconCalendar,
                                            title: 'Sync your calendar',
                                            desc: 'Import your calendar so your direct page shows real-time availability. Block dates, prevent double-bookings, and keep one source of truth from day one.',
                                        },
                                        {
                                            icon: IconMail,
                                            title: 'Reach guests without OTAs',
                                            desc: 'Build your guest list from inquiries, run email campaigns to past guests, and post to social with AI captions. Get your first direct booking.',
                                        },
                                    ].map((item, i) => (
                                        <Card
                                            key={i}
                                            className="flex flex-row items-start gap-5 rounded-2xl border-0 bg-muted/40 p-6 shadow-sm transition-all hover:shadow-md"
                                        >
                                            <div
                                                className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${i === 1 ? 'bg-secondary/20' : 'bg-primary/10'}`}
                                            >
                                                <item.icon
                                                    className={`size-6 ${i === 1 ? 'text-secondary' : 'text-primary'}`}
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-semibold">
                                                    {item.title}
                                                </h3>
                                                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 6. WHAT YOU GET */}
                    <section className="border-t bg-secondary/5 px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-6xl">
                            <h2 className="text-center text-2xl font-bold sm:text-3xl">
                                What You Get
                            </h2>
                            <p className="mt-2 text-center text-muted-foreground">
                                Everything you need to grow direct bookings
                            </p>
                            <div className="mt-10 flex flex-col">
                                {WHAT_YOU_GET_CARDS.map((f, i) => (
                                    <div
                                        key={f.title}
                                        className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'} ${i > 0 ? '-mt-8' : ''}`}
                                    >
                                        <Card
                                            className={`flex w-full max-w-lg flex-col rounded-2xl border-0 bg-background p-6 shadow-sm transition-all hover:shadow-md sm:p-8 ${i % 2 === 1 ? 'border-l-4 border-l-secondary' : ''}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${i % 2 === 1 ? 'bg-secondary/20' : 'bg-primary/10'}`}
                                                >
                                                    <f.icon
                                                        className={`size-6 ${i % 2 === 1 ? 'text-secondary' : 'text-primary'}`}
                                                    />
                                                </div>
                                                <h3 className="text-lg font-semibold">
                                                    {f.title}
                                                </h3>
                                            </div>
                                            {f.subtitle && (
                                                <p
                                                    className={`mt-2 text-sm font-medium ${i % 2 === 1 ? 'text-secondary' : 'text-primary'}`}
                                                >
                                                    {f.subtitle}
                                                </p>
                                            )}
                                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                                {f.desc}
                                            </p>
                                            {f.features &&
                                                f.features.length > 0 && (
                                                    <ul className="mt-4 space-y-2">
                                                        {f.features.map(
                                                            (feature) => (
                                                                <li
                                                                    key={
                                                                        feature
                                                                    }
                                                                    className="flex items-center gap-2 text-sm text-muted-foreground"
                                                                >
                                                                    <IconCheck className="size-4 shrink-0 text-green-500" />
                                                                    {feature}
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                )}
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 5. POPULAR REGIONS */}
                    <section className="border-t px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-7xl">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                                <div>
                                    <h2 className="text-2xl font-bold sm:text-3xl">
                                        Popular Regions
                                    </h2>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Hosts across Costa Rica are taking back
                                        their bookings.
                                    </p>
                                </div>
                                <button
                                    onClick={scrollToImport}
                                    className="text-sm font-medium text-secondary hover:underline sm:shrink-0"
                                >
                                    View all →
                                </button>
                            </div>
                            <div className="relative -mx-4 mt-8 sm:mx-0">
                                <div
                                    ref={regionsRef}
                                    className="flex scroll-pl-4 gap-4 overflow-x-auto scroll-smooth px-4 pt-1 pb-4 [scrollbar-width:none] sm:gap-6 sm:px-0 [&::-webkit-scrollbar]:hidden"
                                >
                                    {REGIONS.map((r) => (
                                        <div
                                            key={r.name}
                                            className="flex w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl bg-card shadow-md transition-shadow hover:shadow-lg"
                                        >
                                            <div className="relative aspect-[4/3] w-full overflow-hidden">
                                                <img
                                                    src={r.img}
                                                    alt={r.name}
                                                    className="h-full w-full object-cover"
                                                />
                                                <span className="absolute top-3 right-3 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground backdrop-blur-sm">
                                                    Popular
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1 p-5">
                                                <h3 className="font-semibold">
                                                    {r.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {r.tag}
                                                </p>
                                                <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <IconMapPin className="size-3.5 shrink-0" />
                                                    {r.region}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="size-10 rounded-full"
                                        onClick={() => scrollRegions('l')}
                                    >
                                        <IconChevronLeft className="size-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="size-10 rounded-full"
                                        onClick={() => scrollRegions('r')}
                                    >
                                        <IconChevronRight className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 7. PRICING */}
                    <section className="border-t px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-6xl">
                            <h2 className="text-center text-2xl font-bold sm:text-3xl">
                                Simple pricing tiers
                            </h2>
                            <p className="mt-2 text-center text-muted-foreground">
                                Hosts hate complicated pricing. We keep it
                                simple.
                            </p>
                            <div className="mt-10 grid gap-6 lg:grid-cols-3">
                                {/* Starter */}
                                <Card className="flex flex-col rounded-2xl border-0 shadow-lg">
                                    <CardHeader className="pb-4">
                                        <CardTitle>Starter</CardTitle>
                                        <CardDescription>
                                            Best for new hosts
                                        </CardDescription>
                                        <div className="mt-4 flex items-baseline gap-1">
                                            <span className="text-3xl font-bold">
                                                $0
                                            </span>
                                            <span className="text-muted-foreground">
                                                /month
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm font-medium text-primary">
                                            5% per booking
                                        </p>
                                    </CardHeader>
                                    <CardContent className="flex flex-1 flex-col pt-0">
                                        <ul className="flex-1 space-y-2.5">
                                            {starterFeatures.map((f) => (
                                                <li
                                                    key={f}
                                                    className="flex items-start gap-2 text-sm"
                                                >
                                                    <IconCheck className="mt-0.5 size-4 shrink-0 text-green-500" />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link
                                            href="/host/register"
                                            className="mt-6 block"
                                        >
                                            <Button
                                                variant="secondary"
                                                className="h-11 w-full rounded-xl"
                                            >
                                                Start Free
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                                {/* Pro Host */}
                                <Card className="relative flex flex-col rounded-2xl border-2 border-primary shadow-xl">
                                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                                        Most Popular
                                    </div>
                                    <CardHeader className="pt-7 pb-4">
                                        <CardTitle>Pro Host</CardTitle>
                                        <CardDescription>
                                            Best for serious hosts
                                        </CardDescription>
                                        <div className="mt-4 flex items-baseline gap-1">
                                            <span className="text-3xl font-bold">
                                                $24
                                            </span>
                                            <span className="text-muted-foreground">
                                                /month
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm font-medium text-primary">
                                            2–3% per booking
                                        </p>
                                    </CardHeader>
                                    <CardContent className="flex flex-1 flex-col pt-0">
                                        <ul className="flex-1 space-y-2.5">
                                            {proHostFeatures.map((f) => (
                                                <li
                                                    key={f}
                                                    className="flex items-start gap-2 text-sm"
                                                >
                                                    <IconCheck className="mt-0.5 size-4 shrink-0 text-green-500" />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link
                                            href="/host/register"
                                            className="mt-6 block"
                                        >
                                            <Button className="h-11 w-full rounded-xl">
                                                Upgrade
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                                {/* Professional */}
                                <Card className="flex flex-col rounded-2xl border-0 shadow-lg">
                                    <CardHeader className="pb-4">
                                        <CardTitle>Professional</CardTitle>
                                        <CardDescription>
                                            Best for property managers
                                        </CardDescription>
                                        <div className="mt-4 flex items-baseline gap-1">
                                            <span className="text-3xl font-bold">
                                                $64
                                            </span>
                                            <span className="text-muted-foreground">
                                                /month
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm font-medium text-primary">
                                            0–1% per booking
                                        </p>
                                    </CardHeader>
                                    <CardContent className="flex flex-1 flex-col pt-0">
                                        <ul className="flex-1 space-y-2.5">
                                            {professionalFeatures.map((f) => (
                                                <li
                                                    key={f}
                                                    className="flex items-start gap-2 text-sm"
                                                >
                                                    <IconCheck className="mt-0.5 size-4 shrink-0 text-green-500" />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link
                                            href="/host/register"
                                            className="mt-6 block"
                                        >
                                            <Button
                                                variant="secondary"
                                                className="h-11 w-full rounded-xl"
                                            >
                                                Start Trial
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="mt-8 text-center">
                                <Link
                                    href="/pricing"
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    Compare plans →
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* 8. FAQ */}
                    <FAQSection />

                    {/* 9. FINAL CTA */}
                    <section
                        id="airbnb-import"
                        className="px-4 py-8 sm:px-6 lg:px-8"
                    >
                        <div className="relative mx-auto flex min-h-[55vh] max-w-7xl items-center justify-center overflow-hidden rounded-2xl bg-muted/30">
                            {/* Background image - bottom half */}
                            <div className="absolute inset-0 bg-[url('/sora-bg.jpg')] bg-[length:100%_200%] bg-[position:50%_100%]" />

                            {/* Dark overlay */}
                            <div className="absolute inset-0 bg-black/30" />

                            <div className="relative z-10 mx-auto w-full max-w-2xl px-6 py-16 text-center sm:py-20">
                                <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                                    Stop Renting Your Business from OTAs
                                </h2>
                                <p className="mt-4 text-lg text-white/90 sm:text-xl">
                                    Import your Airbnb listing in 2 minutes
                                </p>
                                <Link
                                    href="/host/register"
                                    className="mt-8 inline-block"
                                >
                                    <Button
                                        size="lg"
                                        className="h-12 gap-2 rounded-full px-8 text-base"
                                    >
                                        Import Now
                                        <IconArrowRight className="size-4" />
                                    </Button>
                                </Link>
                                <p className="mt-4 text-sm text-white/70">
                                    No credit card required · Free setup
                                </p>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Video Demo Modal */}
                {demoModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                        onClick={() => setDemoModalOpen(false)}
                    >
                        <div
                            className="max-w-4xl rounded-2xl bg-background p-4 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-semibold">
                                    8-Minute Setup Demo
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-full"
                                    onClick={() => setDemoModalOpen(false)}
                                >
                                    Close
                                </Button>
                            </div>
                            <div className="flex aspect-video w-full max-w-3xl items-center justify-center rounded-xl bg-muted">
                                <p className="text-muted-foreground">
                                    Video placeholder — embed YouTube or
                                    self-hosted
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <footer className="mt-16 border-t bg-secondary/5">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <IconBeach className="size-5 text-secondary" />
                                <span>
                                    &copy; {new Date().getFullYear()} Sora
                                </span>
                            </div>
                            <div className="flex gap-6 text-sm text-muted-foreground">
                                <Link
                                    href="/pricing"
                                    className="transition-colors hover:text-secondary"
                                >
                                    Pricing
                                </Link>
                                <Link
                                    href="/how-it-works"
                                    className="transition-colors hover:text-secondary"
                                >
                                    How it works
                                </Link>
                                <Link
                                    href="/blog"
                                    className="transition-colors hover:text-secondary"
                                >
                                    Blog
                                </Link>
                                <Link
                                    href="/join"
                                    className="transition-colors hover:text-secondary"
                                >
                                    Join
                                </Link>
                                <Link
                                    href="/admin/login"
                                    className="transition-colors hover:text-secondary"
                                >
                                    Admin
                                </Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
            `}</style>
            <script src="https://unpkg.com/lenis@1.3.18/dist/lenis.min.js"></script>
        </>
    );
}
