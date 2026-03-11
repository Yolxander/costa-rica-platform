import { Link, usePage } from '@inertiajs/react';
import { IconBeach } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { type SharedData } from '@/types';

interface PublicHeaderProps {
    /** When true, header stays minimal until user scrolls (for landing hero). When false, always styled. */
    transparentUntilScroll?: boolean;
}

export function PublicHeader({ transparentUntilScroll = false }: PublicHeaderProps) {
    const page = usePage<{ props: SharedData }>();
    const auth = (page.props as SharedData).auth;
    const url = page.url;
    const [scrolled, setScrolled] = useState(false);

    const isActive = (path: string) => (path === '/' ? url === '/' : url.startsWith(path));

    useEffect(() => {
        if (!transparentUntilScroll) return;
        const onScroll = () => setScrolled(window.scrollY > 16);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [transparentUntilScroll]);

    const showStyled = transparentUntilScroll ? scrolled : true;

    const navLink = (href: string, label: string, active: boolean) => (
        <Link
            href={href}
            className={`text-sm font-medium transition-colors ${
                active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
        >
            {label}
        </Link>
    );

    return (
        <header
            className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 transition-all duration-300 ${
                showStyled
                    ? 'rounded-full border border-border/50 bg-background/95 shadow-lg backdrop-blur-md px-6 w-7xl'
                    : 'w-7xl px-4'
            }`}
        >
            <div className={`flex h-14 items-center gap-6 ${showStyled ? '' : 'mx-auto max-w-full'}`}>
                <Link href="/" className="flex items-center gap-2">
                    <img
                        src="/brisa-logo.png"
                        alt="Sora Logo"
                        className="h-6 w-auto"
                    />
                    <p className="text-lg font-semibold">Sora</p>
                </Link>
                <div className="ml-auto flex items-center gap-6">
                    <nav className="hidden items-center gap-6 md:flex">
                        {navLink('/', 'Home', isActive('/'))}
                        {navLink('/pricing', 'Pricing', isActive('/pricing'))}
                        {navLink('/how-it-works', 'How it works', isActive('/how-it-works'))}
                    </nav>
                    {auth?.user ? (
                        <Link href="/dashboard">
                            <Button className="h-9 rounded-full bg-foreground text-background hover:bg-foreground/90">Dashboard</Button>
                        </Link>
                    ) : (
                        <Link href="/pricing">
                            <Button className="h-9 rounded-full bg-primary text-background hover:bg-foreground/90">View Plans</Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
