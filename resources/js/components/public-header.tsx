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
            className={`text-sm transition-colors ${
                active ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
        >
            {label}
        </Link>
    );

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${
                showStyled ? 'border-b border-border/50 bg-background/95 shadow-sm backdrop-blur' : ''
            }`}
        >
            <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2 justify-self-start">
                    <IconBeach className="size-7 text-primary" />
                    <span className="text-lg font-bold tracking-tight">Brisa</span>
                </Link>
                <nav className="hidden items-center justify-center gap-6 md:flex">
                    {navLink('/', 'Home', isActive('/'))}
                    {navLink('/pricing', 'Pricing', isActive('/pricing'))}
                    {navLink('/how-it-works', 'How it works', isActive('/how-it-works'))}
                    {navLink('/join', 'Join', isActive('/join'))}
                </nav>
                <div className="flex items-center justify-end gap-3 justify-self-end">
                    {auth?.user ? (
                        <Link href="/dashboard">
                            <Button className="rounded-full">Dashboard</Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" className="rounded-full">Log in</Button>
                            </Link>
                            <Link href="/host/register">
                                <Button className="rounded-full">Become a Host</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
