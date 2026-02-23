import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { IconBeach, IconCheck } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

interface JoinProps extends SharedData {}

const benefits = ['Own your guest list', 'No OTA commissions', 'Import from Airbnb', 'Direct Stripe payments', 'Guest CRM'];

export default function Join() {
    const { auth } = usePage<JoinProps>().props;

    return (
        <>
            <Head title="Join - Costa Rica Rental Hub" />
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
                            <Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground">How it works</Link>
                            {auth?.user ? <Link href="/dashboard"><Button>Dashboard</Button></Link> : <Link href="/login"><Button variant="ghost">Log in</Button></Link>}
                        </nav>
                    </div>
                </header>
                <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl font-bold">Join Costa Rica Rental Hub</h1>
                    <p className="mt-4 text-muted-foreground">Start your free trial. No credit card required.</p>
                    <ul className="mt-8 space-y-3 text-left max-w-md mx-auto">
                        {benefits.map((b) => <li key={b} className="flex items-center gap-2"><IconCheck className="size-5 text-green-500 shrink-0" />{b}</li>)}
                    </ul>
                    <Link href="/host/register" className="mt-12 inline-block">
                        <Button size="lg">Become a Host</Button>
                    </Link>
                </main>
            </div>
        </>
    );
}
