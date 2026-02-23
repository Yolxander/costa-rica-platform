<?php

namespace App\Http\Controllers\Host;

use App\Http\Controllers\Controller;
use App\Mail\HostAccessCodeMail;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class HostRegisteredUserController extends Controller
{
    /**
     * Show the host registration (onboarding) page.
     */
    public function create(Request $request): Response
    {
        if ($redirect = $request->query('redirect')) {
            $request->session()->put('url.intended', url($redirect));
        }

        return Inertia::render('auth/host-register');
    }

    /**
     * Handle an incoming host registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'host',
        ]);

        event(new Registered($user));

        $accessCode = config('host.access_code', 'Toronto2026');
        Mail::to($user->email)->send(new HostAccessCodeMail($user, $accessCode));

        return redirect()->route('login')->with('status', 'Registration successful. Check your email for the access code to complete setup.');
    }
}
