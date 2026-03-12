import { Link } from '@inertiajs/react';
import { IconCheck, IconX, IconArrowRight } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useEffect, useRef, useState } from 'react';

type PlanValue = true | false | string;

interface PlanComparisonRow {
    feature: string;
    starter: PlanValue;
    proHost: PlanValue;
    professional: PlanValue;
}

const comparisonRows: PlanComparisonRow[] = [
    { feature: 'Properties', starter: '1', proHost: 'Up to 10', professional: 'Unlimited' },
    { feature: 'Price', starter: '$0/mo', proHost: '$24/mo', professional: '$64/mo' },
    { feature: 'Commission per booking', starter: '5%', proHost: '2–3%', professional: '0–1%' },
    { feature: 'Direct listing page', starter: true, proHost: true, professional: true },
    { feature: 'Booking calendar', starter: true, proHost: true, professional: true },
    { feature: 'Guest inquiries', starter: true, proHost: true, professional: true },
    { feature: 'Direct payments', starter: false, proHost: true, professional: true },
    { feature: 'Email notifications', starter: true, proHost: true, professional: true },
    { feature: 'Automated emails', starter: false, proHost: true, professional: true },
    { feature: 'Guest messaging', starter: false, proHost: true, professional: true },
    { feature: 'Booking management dashboard', starter: false, proHost: true, professional: true },
    { feature: 'Guest CRM', starter: false, proHost: true, professional: true },
    { feature: 'Multi-calendar', starter: false, proHost: false, professional: true },
    { feature: 'Team members', starter: false, proHost: false, professional: true },
    { feature: 'Channel sync', starter: false, proHost: true, professional: true },
    { feature: 'Analytics', starter: 'Basic', proHost: 'Performance', professional: 'Advanced' },
    { feature: 'Custom domain', starter: false, proHost: false, professional: true },
    { feature: 'Priority support', starter: false, proHost: false, professional: true },
];

function CellContent({ value, delay }: { value: PlanValue; delay: number }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setShow(true), delay);
        return () => clearTimeout(t);
    }, [delay]);

    if (value === true) {
        return (
            <span
                className="flex justify-center transition-all duration-300"
                style={{
                    opacity: show ? 1 : 0,
                    transform: show ? 'translateY(0)' : 'translateY(8px)',
                    transitionDelay: `${delay}ms`,
                }}
            >
                <IconCheck className="size-5 text-green-500 transition-transform duration-150 hover:scale-110" />
            </span>
        );
    }
    if (value === false) {
        return (
            <span
                className="flex justify-center transition-all duration-300"
                style={{
                    opacity: show ? 1 : 0,
                    transform: show ? 'translateY(0)' : 'translateY(8px)',
                    transitionDelay: `${delay}ms`,
                }}
            >
                <IconX className="size-5 text-muted-foreground/50" />
            </span>
        );
    }
    return (
        <span
            className="font-medium transition-all duration-300"
            style={{
                opacity: show ? 1 : 0,
                transform: show ? 'translateY(0)' : 'translateY(8px)',
                transitionDelay: `${delay}ms`,
            }}
        >
            {value}
        </span>
    );
}

export function PlanComparison() {
    const [inView, setInView] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ob = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.1 });
        const el = sectionRef.current;
        if (el) ob.observe(el);
        return () => ob.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="border-t bg-muted/20 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <h2
                    className="text-center text-2xl font-bold sm:text-3xl"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                >
                    Compare plans
                </h2>
                <p
                    className="mt-2 text-center text-muted-foreground"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1) 80ms',
                    }}
                >
                    See what&apos;s included in each tier.
                </p>
                {/* Reinforcing message for middle plan */}
                <p
                    className="mx-auto mt-4 max-w-xl text-center text-sm font-medium text-primary"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'translateY(0)' : 'translateY(15px)',
                        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1) 120ms',
                    }}
                >
                    Most hosts choose Pro Host for the best balance of cost and control.
                </p>
                <div
                    className="mt-8 overflow-hidden rounded-2xl border bg-background shadow-sm"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1) 160ms',
                    }}
                >
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
                                <TableHead className="px-6 py-4 font-semibold">Feature</TableHead>
                                <TableHead className="px-6 py-4 text-center font-semibold">Starter</TableHead>
                                <TableHead className="border-x border-primary/20 bg-primary/5 px-6 py-4 text-center font-semibold text-primary">
                                    <span className="block">Pro Host</span>
                                    <span className="mt-1 block text-xs font-normal text-muted-foreground">Most Popular</span>
                                </TableHead>
                                <TableHead className="px-6 py-4 text-center font-semibold">Professional</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {comparisonRows.map((row, i) => (
                                <TableRow
                                    key={row.feature}
                                    className={`transition-colors duration-200 hover:bg-muted/30 ${i % 2 === 1 ? 'bg-muted/20' : ''}`}
                                >
                                    <TableCell className="px-6 py-3 font-medium">{row.feature}</TableCell>
                                    <TableCell className="px-6 py-3 text-center">
                                        <CellContent value={row.starter} delay={i * 50} />
                                    </TableCell>
                                    <TableCell className="border-x border-primary/20 bg-primary/5 px-6 py-3 text-center">
                                        <CellContent value={row.proHost} delay={i * 50} />
                                    </TableCell>
                                    <TableCell className="px-6 py-3 text-center">
                                        <CellContent value={row.professional} delay={i * 50} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div
                    className="mt-8 flex flex-wrap items-center justify-center gap-4"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'translateY(0)' : 'translateY(15px)',
                        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1) 200ms',
                    }}
                >
                    <Link href="/host/register">
                        <Button variant="outline" className="rounded-xl transition-all duration-200 hover:scale-[1.03]">
                            Start Free
                        </Button>
                    </Link>
                    <Link href="/host/register">
                        <Button className="rounded-xl transition-all duration-200 hover:scale-[1.03] group">
                            Upgrade to Pro Host
                            <IconArrowRight className="ml-1 size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </Button>
                    </Link>
                    <Link href="/host/register">
                        <Button variant="outline" className="rounded-xl transition-all duration-200 hover:scale-[1.03]">
                            Start Professional Trial
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
