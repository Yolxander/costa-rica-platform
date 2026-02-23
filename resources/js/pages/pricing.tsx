import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { IconBeach, IconCheck } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PricingProps extends SharedData {}

const tiers = [
    { name: 'Starter', price: 29, features: ['1 property', 'Direct booking page', 'Inquiry management', 'Guest CRM'] },
    { name: 'Growth', price: 59, popular: true, features: ['Up to 5 properties', 'Stripe Connect', 'Airbnb import', 'WhatsApp integration'] },
    { name: 'Scale', price: 99, features: ['Unlimited properties', 'Priority support', 'API access', 'Custom branding'] },
];

export default function Pricing() {
    const { auth } = usePage<PricingProps>().props;

    return (
        <>
            <Head title="Pricing - Costa Rica Rental Hub" />
            <div className="min-h-screen bg-background">
                <header className="border-b">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link href="/" className="flex items-center gap-2">
                            <IconBeach className="size-7 text-primary" />
                            <span className="font-bold">Costa Rica Rental Hub</span>
                        </Link>
                        <nav className="flex gap-4">
                            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
                            <Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground">How it works</Link>
                            <Link href="/join" className="text-sm text-muted-foreground hover:text-foreground">Join</Link>
                            {auth?.user ? <Link href="/dashboard"><Button>Dashboard</Button></Link> : <Link href="/host/register"><Button>Become a Host</Button></Link>}
                        </nav>
                    </div>
                </header>
                <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold">Pricing</h1>
                    <p className="mt-4 text-muted-foreground">Simple, transparent pricing. No commissions.</p>
                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        {tiers.map((tier) => (
                            <Card key={tier.name} className={tier.popular ? 'border-2 border-primary' : ''}>
                                {tier.popular && <div className="rounded-t-lg bg-primary py-1 text-center text-sm font-medium text-primary-foreground">Most Popular</div>}
                                <CardHeader>
                                    <CardTitle>{tier.name}</CardTitle>
                                    <div className="flex items-baseline gap-1"><span className="text-3xl font-bold">${tier.price}</span><span className="text-muted-foreground">/month</span></div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">{tier.features.map((f) => <li key={f} className="flex items-center gap-2"><IconCheck className="size-5 text-green-500" />{f}</li>)}</ul>
                                    <Link href="/join" className="mt-6 block"><Button className="w-full" variant={tier.popular ? 'default' : 'outline'}>Get Started</Button></Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
}
