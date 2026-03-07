import { Head, Link } from '@inertiajs/react';
import {
    IconCheck,
    IconChevronDown,
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
import { useState } from 'react';

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

function PricingFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    return (
        <section className="border-t bg-muted/20 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">
                <h2 className="text-center text-2xl font-bold sm:text-3xl">Frequently Asked Questions</h2>
                <div className="mt-10 space-y-3">
                    {pricingFaq.map((item, i) => (
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

export default function Pricing() {
    return (
        <>
            <Head title="Pricing - Costa Rica Rental Hub" />
            <div className="min-h-screen bg-background">
                <PublicHeader />

                <main>
                    {/* 1. Hero */}
                    <section className="px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple pricing for direct bookings</h1>
                            <p className="mt-4 text-lg text-muted-foreground">Keep more of your revenue and manage your rentals without OTA commissions.</p>
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm">
                                <span className="text-muted-foreground">Airbnb: 14–18%</span>
                                <span className="text-muted-foreground">Booking.com: 15–20%</span>
                                <span className="text-muted-foreground">Vrbo: 8–12%</span>
                                <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">Your platform: 0–5%</span>
                            </div>
                            <Link href="/host/register" className="mt-8 inline-block">
                                <Button size="lg" className="h-12 gap-2 rounded-xl px-8">
                                    Start Free
                                    <IconArrowRight className="size-4" />
                                </Button>
                            </Link>
                        </div>
                    </section>


                    {/* 3. Simple Pricing Tiers */}
                    <section className="border-t px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-6xl">
                            <h2 className="text-center text-2xl font-bold sm:text-3xl">Simple pricing tiers</h2>
                            <p className="mt-2 text-center text-muted-foreground">Hosts hate complicated pricing. We keep it simple.</p>
                            <div className="mt-10 grid gap-6 lg:grid-cols-3">
                                {/* Starter */}
                                <Card className="flex flex-col rounded-2xl border-0 shadow-lg">
                                    <CardHeader className="pb-4">
                                        <CardTitle>Starter</CardTitle>
                                        <CardDescription>Best for new hosts</CardDescription>
                                        <div className="mt-4 flex items-baseline gap-1">
                                            <span className="text-3xl font-bold">$0</span>
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
                                            <Button variant="outline" className="h-11 w-full rounded-xl">Start Free</Button>
                                        </Link>
                                    </CardContent>
                                </Card>

                                {/* Pro Host */}
                                <Card className="relative flex flex-col rounded-2xl border-2 border-primary shadow-xl">
                                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">Most Popular</div>
                                    <CardHeader className="pt-7 pb-4">
                                        <CardTitle>Pro Host</CardTitle>
                                        <CardDescription>Best for serious hosts</CardDescription>
                                        <div className="mt-4 flex items-baseline gap-1">
                                            <span className="text-3xl font-bold">$24</span>
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
                                            <Button className="h-11 w-full rounded-xl">Upgrade</Button>
                                        </Link>
                                    </CardContent>
                                </Card>

                                {/* Professional */}
                                <Card className="flex flex-col rounded-2xl border-0 shadow-lg">
                                    <CardHeader className="pb-4">
                                        <CardTitle>Professional</CardTitle>
                                        <CardDescription>Best for property managers</CardDescription>
                                        <div className="mt-4 flex items-baseline gap-1">
                                            <span className="text-3xl font-bold">$64</span>
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
                                            <Button variant="outline" className="h-11 w-full rounded-xl">Start Trial</Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>

                    {/* 4. Plan Comparison */}
                    <PlanComparison />

                    {/* 5. Revenue Example */}
                    <section className="border-t bg-muted/20 px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl">
                            <h2 className="text-center text-2xl font-bold sm:text-3xl">See how hosts save</h2>
                            <p className="mt-2 text-center text-muted-foreground">Example: $180/night, 10 bookings per month</p>
                            <div className="mt-10 grid gap-6 md:grid-cols-2">
                                <Card className="overflow-hidden rounded-2xl border border-destructive/20 bg-background shadow-lg">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2 text-base text-destructive">
                                            <IconTrendingDown className="size-5" />
                                            With OTA (15% fee)
                                        </CardTitle>
                                        <CardDescription>Fees you pay to platforms like Airbnb</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pt-0">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Monthly revenue</span>
                                            <span className="font-medium">$1,800</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Platform fee (15%)</span>
                                            <span className="font-medium text-destructive">−$270</span>
                                        </div>
                                        <div className="border-t pt-3">
                                            <div className="flex justify-between font-semibold">
                                                <span>You keep</span>
                                                <span>$1,530</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="overflow-hidden rounded-2xl border-2 border-primary/30 bg-background shadow-lg">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2 text-base text-primary">
                                            <IconCurrencyDollar className="size-5" />
                                            With Costa Rica Rental Hub (3% fee)
                                        </CardTitle>
                                        <CardDescription>Direct bookings, more in your pocket</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pt-0">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Monthly revenue</span>
                                            <span className="font-medium">$1,800</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Platform fee (3%)</span>
                                            <span className="font-medium">−$54</span>
                                        </div>
                                        <div className="border-t pt-3">
                                            <div className="flex justify-between font-semibold">
                                                <span>You keep</span>
                                                <span>$1,746</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="mt-6 flex flex-col items-center justify-center rounded-2xl bg-primary/10 px-6 py-5 sm:flex-row sm:gap-4">
                                <div className="text-center sm:text-left">
                                    <p className="text-lg font-bold text-primary">You save $216 per month</p>
                                    <p className="text-sm text-muted-foreground">That&apos;s $2,592 per year staying in your pocket</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 6. Website Add-On (Sempre Studios) */}
                    <section className="border-t bg-muted/20 px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-5xl">
                            <h2 className="text-center text-2xl font-bold sm:text-3xl">Get your own booking website</h2>
                            <p className="mt-4 text-center text-muted-foreground">Turn your property into a professional website where guests can book directly.</p>
                            <div className="mt-10 grid gap-6 md:grid-cols-3">
                                <Card className="flex flex-col rounded-2xl border-0 shadow-lg">
                                    <CardHeader className="pb-4">
                                        <CardTitle>Basic Website</CardTitle>
                                        <div className="mt-2 flex items-baseline gap-1">
                                            <span className="text-2xl font-bold">$199</span>
                                            <span className="text-muted-foreground text-sm">one time</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex flex-1 flex-col pt-0">
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-center gap-2"><IconCheck className="size-4 shrink-0 text-green-500" />Property landing page</li>
                                            <li className="flex items-center gap-2"><IconCheck className="size-4 shrink-0 text-green-500" />Photo gallery</li>
                                            <li className="flex items-center gap-2"><IconCheck className="size-4 shrink-0 text-green-500" />Booking calendar</li>
                                            <li className="flex items-center gap-2"><IconCheck className="size-4 shrink-0 text-green-500" />Inquiry form</li>
                                            <li className="flex items-center gap-2"><IconCheck className="size-4 shrink-0 text-green-500" />Mobile optimized</li>
                                        </ul>
                                        <p className="mt-4 text-xs text-muted-foreground">Example: staywithsofia.com</p>
                                        <Link href="/join" className="mt-6 block">
                                            <Button variant="outline" className="h-11 w-full rounded-xl">Learn more</Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                                <Card className="flex flex-col rounded-2xl border-2 border-primary shadow-xl">
                                    <CardHeader className="pb-4">
                                        <CardTitle>Pro Website</CardTitle>
                                        <div className="mt-2 flex items-baseline gap-1">
                                            <span className="text-2xl font-bold">$399</span>
                                            <span className="text-muted-foreground text-sm">one time</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex flex-1 flex-col pt-0">
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-center gap-2"><IconCheck className="size-4 shrink-0 text-green-500" />Multi-page website</li>
                                            <li className="flex items-center gap-2"><IconCheck className="size-4 shrink-0 text-green-500" />Booking engine</li>
                                            <li className="flex items-center gap-2"><IconCheck className="size-4 shrink-0 text-green-500" />Guest payment system</li>
                                            <li className="flex items-center gap-2"><IconCheck className="size-4 shrink-0 text-green-500" />SEO optimized</li>
                                            <li className="flex items-center gap-2"><IconCheck className="size-4 shrink-0 text-green-500" />Custom domain</li>
                                        </ul>
                                        <Link href="/join" className="mt-6 block">
                                            <Button className="h-11 w-full rounded-xl">Learn more</Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                                <Card className="flex flex-col rounded-2xl border-0 shadow-lg">
                                    <CardHeader className="pb-4">
                                        <CardTitle>Premium Website</CardTitle>
                                        <div className="mt-2 flex items-baseline gap-1">
                                            <span className="text-2xl font-bold">$799+</span>
                                            <span className="text-muted-foreground text-sm">one time</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex flex-1 flex-col pt-0">
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-center gap-2"><IconCheck className="size-4 shrink-0 text-green-500" />Multiple properties</li>
                                            <li className="flex items-center gap-2"><IconCheck className="size-4 shrink-0 text-green-500" />Full branding</li>
                                            <li className="flex items-center gap-2"><IconCheck className="size-4 shrink-0 text-green-500" />Custom design</li>
                                            <li className="flex items-center gap-2"><IconCheck className="size-4 shrink-0 text-green-500" />SEO setup</li>
                                            <li className="flex items-center gap-2"><IconCheck className="size-4 shrink-0 text-green-500" />Marketing pages</li>
                                        </ul>
                                        <p className="mt-6 text-center text-sm font-medium text-primary">Powered by Sempre Studios</p>
                                        <Link href="/join" className="mt-4 block">
                                            <Button variant="outline" className="h-11 w-full rounded-xl">Learn more</Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>

                    {/* 7. FAQ */}
                    <PricingFAQ />

                    {/* 8. Final CTA */}
                    <section className="border-t px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-2xl font-bold sm:text-3xl">Start getting direct bookings today</h2>
                            <p className="mt-4 text-muted-foreground">No credit card required. Create your free listing in minutes.</p>
                            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Link href="/host/register">
                                    <Button size="lg" className="h-12 gap-2 rounded-xl px-8">
                                        Create Free Listing
                                        <IconArrowRight className="size-4" />
                                    </Button>
                                </Link>
                                <Link href="/join">
                                    <Button variant="outline" size="lg" className="h-12 rounded-xl px-8">
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
