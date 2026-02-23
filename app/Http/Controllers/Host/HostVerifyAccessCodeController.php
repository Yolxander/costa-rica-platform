<?php

namespace App\Http\Controllers\Host;

use App\Http\Controllers\Controller;
use App\Mail\HostAccessCodeMail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class HostVerifyAccessCodeController extends Controller
{
    /**
     * Show the host access code verification form.
     */
    public function create(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if (!$user->isHost()) {
            return redirect()->route('dashboard');
        }

        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        return Inertia::render('auth/host-verify-access-code', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Verify the host access code and grant dashboard access.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $user = $request->user();
        $expectedCode = config('host.access_code', 'Toronto2026');

        if ($request->code !== $expectedCode) {
            return back()->withErrors(['code' => 'The access code is invalid.']);
        }

        $user->markEmailAsVerified();

        return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
    }

    /**
     * Resend the host access code email.
     */
    public function resend(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (!$user->isHost() || $user->hasVerifiedEmail()) {
            return redirect()->route('dashboard');
        }

        $accessCode = config('host.access_code', 'Toronto2026');
        Mail::to($user->email)->send(new HostAccessCodeMail($user, $accessCode));

        return back()->with('status', 'A new access code has been sent to your email.');
    }
}
