<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AdminAuthenticatedSessionController extends Controller
{
    /**
     * Show the admin login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('admin/admin-login', [
            'canResetPassword' => false, // Admin password reset can be handled separately
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming admin authentication request.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');
        $remember = $request->boolean('remember');

        // First, try to authenticate the user
        if (!Auth::attempt($credentials, $remember)) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        $user = Auth::user();

        // Check if user has admin access
        if (!$user->hasAdminAccess()) {
            Auth::logout();
            throw ValidationException::withMessages([
                'email' => 'Access denied. Admin privileges required.',
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated admin session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
