import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IconInnerShadowTop } from "@tabler/icons-react"
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';

interface AdminLoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function AdminLogin({ status, canResetPassword }: AdminLoginProps) {
    const [processing, setProcessing] = useState(false);

    const { data, setData, post, processing: formProcessing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.login.store'), {
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="w-full max-w-md">
                <Head title="Admin Login" />

                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-primary/10">
                            <IconInnerShadowTop className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Costa Rica Rental Hub</h1>
                    <p className="text-muted-foreground">Admin Portal</p>
                </div>

                <Card className="shadow-xl border-0">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Admin Login</CardTitle>
                        <CardDescription>
                            Enter your admin credentials to access the dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-6">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="admin@costaricarentalhub.com"
                                        className="h-11"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email}</p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        className="h-11"
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-destructive">{errors.password}</p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-3">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        tabIndex={3}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <Label htmlFor="remember">Remember me</Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-4 w-full h-11"
                                    tabIndex={4}
                                    disabled={processing || formProcessing}
                                >
                                    {(processing || formProcessing) && (
                                        <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                    )}
                                    Access Admin Dashboard
                                </Button>
                            </div>

                            {status && (
                                <div className="text-center text-sm font-medium text-green-600 bg-green-50 p-3 rounded-md">
                                    {status}
                                </div>
                            )}

                            {errors.email && errors.email.includes('admin') && (
                                <div className="text-center text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
                                    {errors.email}
                                </div>
                            )}
                        </form>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            <p className="mb-2">Need help accessing the admin panel?</p>
                            <Link
                                href="/login"
                                className="text-primary hover:underline underline-offset-4"
                            >
                                Back to regular login
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center text-xs text-muted-foreground">
                    <p>© 2024 Costa Rica Rental Hub. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
