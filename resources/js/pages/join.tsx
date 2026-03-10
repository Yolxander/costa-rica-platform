import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { IconArrowRight, IconBeach, IconCheck } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

interface JoinProps extends SharedData {}

const benefits = ['Own your guest list', 'No OTA commissions', 'Import from Airbnb or Booking.com', 'Direct Stripe payments', 'Guest CRM'];

export default function Join() {
    const { auth } = usePage<JoinProps>().props;

    const scrollToImport = () => {
        const element = document.getElementById('import-section');
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <Head title="Join - Sora" />
            <div className="min-h-screen bg-background">
                <header className="absolute top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/20">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link href="/" className="flex items-center gap-2">
                            <IconBeach className="size-7 text-white" />
                            <span className="font-bold text-white">Sora</span>
                        </Link>
                        <nav className="flex gap-4">
                            <Link href="/" className="text-sm text-white/80 hover:text-white">Home</Link>
                            <Link href="/pricing" className="text-sm text-white/80 hover:text-white">Pricing</Link>
                            <Link href="/how-it-works" className="text-sm text-white/80 hover:text-white">How it works</Link>
                            {auth?.user ? <Link href="/dashboard"><Button>Dashboard</Button></Link> : <Link href="/login"><Button variant="ghost" className="text-white hover:text-white hover:bg-white/20">Log in</Button></Link>}
                        </nav>
                    </div>
                </header>

                <main>
                    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-muted/30">
                        <div className="absolute inset-0 bg-[url('/sora-bg.jpg')] bg-cover bg-center" />
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="relative z-10 mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
                            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl drop-shadow-lg">
                                Own Your Direct Bookings in Costa Rica
                            </h1>
                            <p className="mt-5 text-lg text-white sm:text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
                                Stop paying commission. Accept payments directly. Capture guest emails. Build repeat bookings.
                            </p>
                            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                                <Button size="lg" className="w-full gap-2 rounded-full px-8 sm:w-auto bg-white text-black hover:bg-white/90" onClick={scrollToImport}>
                                    Import listing
                                    <IconArrowRight className="size-4" />
                                </Button>
                                <Button variant="outline" size="lg" className="w-full rounded-full sm:w-auto border-white text-white hover:bg-white/20">
                                    Watch Demo
                                </Button>
                            </div>
                        </div>
                    </section>

                    <section id="import-section" className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold">Join Sora</h2>
                        <p className="mt-4 text-muted-foreground">Start your free trial. No credit card required.</p>
                        <ul className="mt-8 space-y-3 text-left max-w-md mx-auto">
                            {benefits.map((b) => <li key={b} className="flex items-center gap-2"><IconCheck className="size-5 text-green-500 shrink-0" />{b}</li>)}
                        </ul>
                        <Link href="/host/register" className="mt-12 inline-block">
                            <Button size="lg">Become a Host</Button>
                        </Link>
                    </section>
                </main>
            </div>
        </>
    );
}
