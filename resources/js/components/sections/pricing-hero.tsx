export function PricingHero() {
    return (
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
    );
}
