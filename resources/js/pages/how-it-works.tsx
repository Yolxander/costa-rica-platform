import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { IconBeach, IconDownload, IconLink, IconCurrencyDollar } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

interface HowItWorksProps extends SharedData {}

const steps = [
    { icon: IconDownload, title: 'Import or Add', desc: 'Import from Airbnb or add your property manually.' },
    { icon: IconLink, title: 'Get Your Link', desc: 'Share your direct booking link with guests.' },
    { icon: IconCurrencyDollar, title: 'Collect Payment', desc: 'Connect Stripe and receive payments directly.' },
];

export default function HowItWorks() {
    const { auth } = usePage<HowItWorksProps>().props;

    return (
        <>
            <Head title="How It Works - Costa Rica Rental Hub" />
            <div className="min-h-screen bg-background">
                <header className="border-b">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link href="/" className="flex items-center gap-2">
                            <IconBeach className="size-7 text-primary" />
                            <span className="font-bold">Costa Rica Rental Hub</span>
                        </Link>
                        <nav className="flex gap-4">
                            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
                            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link>
                            <Link href="/join" className="text-sm text-muted-foreground hover:text-foreground">Join</Link>
                            {auth?.user ? <Link href="/dashboard"><Button>Dashboard</Button></Link> : <Link href="/host/register"><Button>Become a Host</Button></Link>}
                        </nav>
                    </div>
                </header>
                <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold">How It Works</h1>
                    <p className="mt-4 text-muted-foreground">Get your direct booking page live in under 10 minutes.</p>
                    <div className="mt-12 space-y-12">
                        {steps.map((step, i) => (
                            <div key={i} className="flex gap-6">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <step.icon className="size-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Step {i + 1}: {step.title}</h2>
                                    <p className="mt-2 text-muted-foreground">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-16 text-center">
                        <Link href="/host/register"><Button size="lg">Get Started</Button></Link>
                    </div>
                </main>
            </div>
        </>
    );
}
