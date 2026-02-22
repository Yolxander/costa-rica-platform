import { type SharedData, type User } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    IconBeach,
    IconUser,
    IconCalendar,
    IconUsers,
    IconMapPin,
    IconStar,
    IconBed,
    IconBath,
    IconHeart,
    IconHeartFilled,
    IconHome,
    IconSend,
    IconTrash,
    IconLock,
    IconArrowLeft,
    IconInbox,
    IconBookmark,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type React from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import InputError from '@/components/input-error';
import { type FormEvent, useRef, useState } from 'react';

interface AccountInquiry {
    id: number;
    property_id: number;
    property_name: string;
    property_image: string | null;
    property_location: string;
    check_in: string;
    check_out: string;
    guests: number;
    message: string;
    status: string;
    sent_at: string;
}

interface SavedProperty {
    id: number;
    name: string;
    type: string;
    location: string;
    image: string | null;
    base_price: number;
    price_format: string;
    currency: string;
    guests: number;
    bedrooms: number;
    bathrooms: number;
    rating: number;
    reviews: number;
    amenities: string[];
    host_name: string;
}

interface AccountProps extends SharedData {
    inquiries: AccountInquiry[];
    savedListings: SavedProperty[];
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    responded: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    declined: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

function ProfileTab({ user }: { user: User }) {
    const profileForm = useForm({
        name: user.name,
        email: user.email,
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const deleteForm = useForm({ password: '' });
    const deletePasswordRef = useRef<HTMLInputElement>(null);

    function handleProfileSubmit(e: FormEvent) {
        e.preventDefault();
        profileForm.patch('/settings/profile', { preserveScroll: true });
    }

    function handlePasswordSubmit(e: FormEvent) {
        e.preventDefault();
        passwordForm.put('/settings/password', {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    }

    function handleDeleteSubmit(e: FormEvent) {
        e.preventDefault();
        deleteForm.delete('/settings/profile', {
            onError: () => deletePasswordRef.current?.focus(),
        });
    }

    return (
        <div className="space-y-8">
            {/* Avatar + Name */}
            <div className="flex items-center gap-5">
                <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                    {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                </div>
            </div>

            <Separator />

            {/* Profile Info Form */}
            <div>
                <h3 className="text-lg font-semibold">Profile Information</h3>
                <p className="text-sm text-muted-foreground">Update your name and email address.</p>
                <form onSubmit={handleProfileSubmit} className="mt-4 max-w-md space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={profileForm.data.name}
                            onChange={(e) => profileForm.setData('name', e.target.value)}
                            required
                        />
                        <InputError message={profileForm.errors.name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={profileForm.data.email}
                            onChange={(e) => profileForm.setData('email', e.target.value)}
                            required
                        />
                        <InputError message={profileForm.errors.email} />
                    </div>
                    <Button type="submit" disabled={profileForm.processing}>
                        {profileForm.processing ? 'Saving...' : 'Save changes'}
                    </Button>
                    {profileForm.recentlySuccessful && (
                        <span className="ml-3 text-sm text-green-600">Saved.</span>
                    )}
                </form>
            </div>

            <Separator />

            {/* Password Change */}
            <div>
                <h3 className="text-lg font-semibold">Change Password</h3>
                <p className="text-sm text-muted-foreground">Ensure your account is using a strong password.</p>
                <form onSubmit={handlePasswordSubmit} className="mt-4 max-w-md space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current_password">Current Password</Label>
                        <Input
                            id="current_password"
                            type="password"
                            value={passwordForm.data.current_password}
                            onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                            autoComplete="current-password"
                        />
                        <InputError message={passwordForm.errors.current_password} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={passwordForm.data.password}
                            onChange={(e) => passwordForm.setData('password', e.target.value)}
                            autoComplete="new-password"
                        />
                        <InputError message={passwordForm.errors.password} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={passwordForm.data.password_confirmation}
                            onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                            autoComplete="new-password"
                        />
                    </div>
                    <Button type="submit" disabled={passwordForm.processing}>
                        <IconLock className="mr-2 size-4" />
                        {passwordForm.processing ? 'Updating...' : 'Update password'}
                    </Button>
                    {passwordForm.recentlySuccessful && (
                        <span className="ml-3 text-sm text-green-600">Password updated.</span>
                    )}
                </form>
            </div>

            <Separator />

            {/* Delete Account */}
            <div>
                <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
                <div className="mt-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="destructive">
                                <IconTrash className="mr-2 size-4" />
                                Delete account
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
                            <DialogDescription>
                                Once your account is deleted, all of its resources and data will be permanently deleted.
                                Please enter your password to confirm.
                            </DialogDescription>
                            <form onSubmit={handleDeleteSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="delete_password" className="sr-only">Password</Label>
                                    <Input
                                        id="delete_password"
                                        type="password"
                                        ref={deletePasswordRef}
                                        value={deleteForm.data.password}
                                        onChange={(e) => deleteForm.setData('password', e.target.value)}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                    />
                                    <InputError message={deleteForm.errors.password} />
                                </div>
                                <DialogFooter className="gap-2">
                                    <DialogClose asChild>
                                        <Button variant="secondary" onClick={() => deleteForm.reset()}>
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" variant="destructive" disabled={deleteForm.processing}>
                                        Delete account
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

function InquiriesTab({ inquiries }: { inquiries: AccountInquiry[] }) {
    if (inquiries.length === 0) {
        return (
            <div className="py-16 text-center">
                <IconInbox className="mx-auto size-12 text-muted-foreground/40" />
                <h3 className="mt-4 text-lg font-semibold">No inquiries yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    When you send an inquiry to a host, it will appear here.
                </p>
                <Link href="/">
                    <Button variant="outline" className="mt-4">
                        <IconArrowLeft className="mr-2 size-4" />
                        Browse listings
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {inquiries.map((inquiry) => (
                <Card key={inquiry.id}>
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            <Link href={`/listing/${inquiry.property_id}`} className="shrink-0">
                                <div className="size-20 overflow-hidden rounded-lg bg-muted">
                                    {inquiry.property_image ? (
                                        <img
                                            src={inquiry.property_image}
                                            alt={inquiry.property_name}
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex size-full items-center justify-center">
                                            <IconHome className="size-8 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                            </Link>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                    <Link
                                        href={`/listing/${inquiry.property_id}`}
                                        className="font-semibold hover:underline"
                                    >
                                        {inquiry.property_name}
                                    </Link>
                                    <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[inquiry.status] || ''}`}>
                                        {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                                    </span>
                                </div>
                                {inquiry.property_location && (
                                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                        <IconMapPin className="size-3" />
                                        {inquiry.property_location}
                                    </p>
                                )}
                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <IconCalendar className="size-3" />
                                        {inquiry.check_in} &ndash; {inquiry.check_out}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <IconUsers className="size-3" />
                                        {inquiry.guests} guest{inquiry.guests !== 1 ? 's' : ''}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <IconSend className="size-3" />
                                        Sent {inquiry.sent_at}
                                    </span>
                                </div>
                                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{inquiry.message}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function SavedListingsTab({ listings }: { listings: SavedProperty[] }) {
    if (listings.length === 0) {
        return (
            <div className="py-16 text-center">
                <IconBookmark className="mx-auto size-12 text-muted-foreground/40" />
                <h3 className="mt-4 text-lg font-semibold">No saved listings</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Tap the heart on any listing to save it for later.
                </p>
                <Link href="/">
                    <Button variant="outline" className="mt-4">
                        <IconArrowLeft className="mr-2 size-4" />
                        Browse listings
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((property) => (
                <div key={property.id} className="group relative">
                    <Link href={`/listing/${property.id}`} className="block">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                            {property.image ? (
                                <img
                                    src={property.image}
                                    alt={property.name}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                    <IconHome className="size-12 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <div className="mt-3 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold leading-tight text-foreground">
                                    {property.name}
                                </h3>
                                {property.rating > 0 && (
                                    <div className="flex shrink-0 items-center gap-1 text-sm">
                                        <IconStar className="size-4 fill-current text-foreground" />
                                        <span className="font-medium">{property.rating.toFixed(1)}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <IconMapPin className="size-3.5" />
                                <span>{property.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <IconUsers className="size-3.5" />
                                    {property.guests}
                                </span>
                                <span className="flex items-center gap-1">
                                    <IconBed className="size-3.5" />
                                    {property.bedrooms}
                                </span>
                                <span className="flex items-center gap-1">
                                    <IconBath className="size-3.5" />
                                    {property.bathrooms}
                                </span>
                            </div>
                            <p className="pt-1 text-sm">
                                <span className="font-semibold text-foreground">
                                    ${property.base_price.toLocaleString()}
                                </span>{' '}
                                <span className="text-muted-foreground">/ night</span>
                            </p>
                        </div>
                    </Link>
                    <button
                        className="absolute top-3 right-3 rounded-full bg-white/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-white dark:bg-black/50 dark:hover:bg-black/70"
                        onClick={() => {
                            router.post(`/listing/${property.id}/save`, {}, { preserveScroll: true });
                        }}
                    >
                        <IconHeartFilled className="size-5 text-red-500" />
                    </button>
                </div>
            ))}
        </div>
    );
}

function SidebarNavItem({
    icon,
    label,
    count,
    active,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    count?: number;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
        >
            {icon}
            <span>{label}</span>
            {count != null && count > 0 && (
                <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                    {count}
                </Badge>
            )}
        </button>
    );
}

export default function Account() {
    const { auth, inquiries, savedListings } = usePage<AccountProps>().props;
    const user = auth.user;
    const [activeSection, setActiveSection] = useState<'profile' | 'inquiries' | 'saved'>('profile');

    return (
        <>
            <Head title="My Account - Costa Rica Rental Hub" />
            <div className="bg-background" style={{ minHeight: '90vh' }}>
                {/* Header */}
                <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link href="/" className="flex items-center gap-2">
                            <IconBeach className="size-7 text-primary" />
                            <span className="text-lg font-bold tracking-tight">
                                Costa Rica Rental Hub
                            </span>
                        </Link>
                        <nav className="flex items-center gap-3">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <IconArrowLeft className="size-4" />
                                Back to listings
                            </Link>
                        </nav>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8" style={{ minHeight: 'calc(90vh - 4rem)' }}>
                    <div className="flex flex-col gap-8 md:flex-row">
                        {/* Sidebar */}
                        <aside className="shrink-0 md:w-64">
                            {/* User card */}
                            <div className="mb-6 flex items-center gap-3 md:flex-col md:items-start md:gap-2">
                                <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary md:size-16 md:text-2xl">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="md:mt-1">
                                    <h1 className="text-lg font-bold md:text-xl">{user.name}</h1>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                            </div>

                            <Separator className="mb-4 hidden md:block" />

                            {/* Nav items */}
                            <nav className="flex gap-1 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0">
                                <SidebarNavItem
                                    icon={<IconUser className="size-4" />}
                                    label="Profile"
                                    active={activeSection === 'profile'}
                                    onClick={() => setActiveSection('profile')}
                                />
                                <SidebarNavItem
                                    icon={<IconSend className="size-4" />}
                                    label="My Inquiries"
                                    count={inquiries.length}
                                    active={activeSection === 'inquiries'}
                                    onClick={() => setActiveSection('inquiries')}
                                />
                                <SidebarNavItem
                                    icon={<IconHeart className="size-4" />}
                                    label="Saved Listings"
                                    count={savedListings.length}
                                    active={activeSection === 'saved'}
                                    onClick={() => setActiveSection('saved')}
                                />
                            </nav>
                        </aside>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                            {activeSection === 'profile' && <ProfileTab user={user} />}
                            {activeSection === 'inquiries' && <InquiriesTab inquiries={inquiries} />}
                            {activeSection === 'saved' && <SavedListingsTab listings={savedListings} />}
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t bg-muted/40">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <IconBeach className="size-5 text-primary" />
                                <span>&copy; {new Date().getFullYear()} Costa Rica Rental Hub</span>
                            </div>
                            <div className="flex gap-6 text-sm text-muted-foreground">
                                <span>Privacy</span>
                                <span>Terms</span>
                                <span>Support</span>
                                <Link
                                    href="/admin/login"
                                    className="transition-colors hover:text-foreground"
                                >
                                    Admin
                                </Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
