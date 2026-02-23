import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { logout } from '@/routes';
import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import AuthLayout from '@/layouts/auth-layout';

interface HostVerifyAccessCodeProps {
    status?: string;
}

export default function HostVerifyAccessCode({ status }: HostVerifyAccessCodeProps) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/host/verify-access-code');
    };

    const handleResend = () => {
        router.post('/host/resend-access-code');
    };

    return (
        <AuthLayout
            title="Enter access code"
            description="Enter the access code we sent to your email to access your host dashboard."
        >
            <Head title="Host Access Code" />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="code">Access code</Label>
                        <Input
                            id="code"
                            name="code"
                            type="text"
                            placeholder="Enter the code from your email"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            required
                            autoFocus
                            autoComplete="one-time-code"
                            className="text-center tracking-widest font-mono text-lg"
                        />
                        <InputError message={errors.code} />
                    </div>

                    <Button type="submit" className="w-full" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Verify and continue
                    </Button>
                </div>

                <div className="space-y-2 text-center text-sm text-muted-foreground">
                    <p>Didn&apos;t receive the code?</p>
                    <button
                        type="button"
                        onClick={handleResend}
                        className="text-primary hover:underline underline-offset-4"
                    >
                        Resend code
                    </button>
                </div>

                <TextLink href={logout()} className="mx-auto block text-sm">
                    Log out
                </TextLink>
            </form>
        </AuthLayout>
    );
}
