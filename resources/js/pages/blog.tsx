import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { IconBeach } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

interface BlogProps extends SharedData {}

export default function Blog() {
    const { auth } = usePage<BlogProps>().props;

    return (
        <>
            <Head title="Blog - Costa Rica Rental Hub" />
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
                            <Link href="/join" className="text-sm text-muted-foreground hover:text-foreground">Join</Link>
                            {auth?.user ? <Link href="/dashboard"><Button>Dashboard</Button></Link> : <Link href="/host/register"><Button>Become a Host</Button></Link>}
                        </nav>
                    </div>
                </header>
                <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold">Blog</h1>
                    <p className="mt-4 text-muted-foreground">Tips and insights for Costa Rica hosts. Content coming soon.</p>
                </main>
            </div>
        </>
    );
}
