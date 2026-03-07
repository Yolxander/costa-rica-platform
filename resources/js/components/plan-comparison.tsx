import { Link } from '@inertiajs/react';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

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

function CellContent({ value }: { value: PlanValue }) {
    if (value === true) {
        return <IconCheck className="size-5 text-green-500" />;
    }
    if (value === false) {
        return <IconX className="size-5 text-muted-foreground/50" />;
    }
    return <span className="font-medium">{value}</span>;
}

export function PlanComparison() {
    return (
        <section className="border-t bg-muted/20 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <h2 className="text-center text-2xl font-bold sm:text-3xl">Compare plans</h2>
                <p className="mt-2 text-center text-muted-foreground">See what&apos;s included in each tier.</p>
                <div className="mt-10 overflow-hidden rounded-2xl border bg-background shadow-sm">
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
                                <TableRow key={row.feature} className={i % 2 === 1 ? 'bg-muted/20' : ''}>
                                    <TableCell className="px-6 py-3 font-medium">{row.feature}</TableCell>
                                    <TableCell className="px-6 py-3 text-center">
                                        <span className="flex justify-center">
                                            <CellContent value={row.starter} />
                                        </span>
                                    </TableCell>
                                    <TableCell className="border-x border-primary/20 bg-primary/5 px-6 py-3 text-center">
                                        <span className="flex justify-center">
                                            <CellContent value={row.proHost} />
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-6 py-3 text-center">
                                        <span className="flex justify-center">
                                            <CellContent value={row.professional} />
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    <Link href="/host/register">
                        <Button variant="outline" className="rounded-xl">Start Free</Button>
                    </Link>
                    <Link href="/host/register">
                        <Button className="rounded-xl">Upgrade to Pro Host</Button>
                    </Link>
                    <Link href="/host/register">
                        <Button variant="outline" className="rounded-xl">Start Professional Trial</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
