<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\Auth\AdminAuthenticatedSessionController;

Route::get('/', function () {
    $hostCount = \App\Models\User::where('role', 'host')->count();
    return Inertia::render('landing', ['hostCount' => $hostCount]);
})->name('home');

Route::get('/pricing', function () {
    return Inertia::render('pricing');
})->name('pricing');

Route::get('/how-it-works', function () {
    return Inertia::render('how-it-works');
})->name('how-it-works');

Route::get('/blog', function () {
    return Inertia::render('blog');
})->name('blog');

Route::get('/join', function () {
    return Inertia::render('join');
})->name('join');

Route::get('/listing/{id}', function ($id) {
    $property = \App\Models\Property::where('id', $id)
        ->with('user')
        ->firstOrFail();

    return Inertia::render('listing-detail', [
        'property' => [
            'id' => $property->id,
            'name' => $property->name,
            'type' => $property->type,
            'status' => $property->status,
            'location' => $property->location,
            'description' => $property->description,
            'amenities' => $property->amenities ?? [],
            'images' => $property->images ?? [],
            'house_rules' => $property->house_rules ?? [],
            'policies' => $property->policies ?? [],
            'base_price' => (float) $property->base_price,
            'price_format' => $property->price_format,
            'currency' => $property->currency,
            'cleaning_fee' => (float) $property->cleaning_fee,
            'service_fee' => (float) $property->service_fee,
            'guests' => $property->guests,
            'bedrooms' => $property->bedrooms,
            'bathrooms' => $property->bathrooms,
            'check_in_time' => $property->check_in_time,
            'check_out_time' => $property->check_out_time,
            'minimum_stay' => $property->minimum_stay,
            'rating' => (float) $property->rating,
            'reviews' => $property->reviews,
            'host' => [
                'name' => $property->user?->name ?? 'Host',
                'avatar' => $property->user?->avatar ?? null,
                'id' => $property->user?->id,
            ],
        ],
    ]);
})->name('listing.detail');

Route::get('/listing/{id}/checkout', function (\Illuminate\Http\Request $request, $id) {
    $property = \App\Models\Property::where('id', $id)
        ->with('user')
        ->firstOrFail();

    return Inertia::render('listing-checkout', [
        'property' => [
            'id' => $property->id,
            'name' => $property->name,
            'type' => $property->type,
            'status' => $property->status,
            'location' => $property->location,
            'description' => $property->description,
            'amenities' => $property->amenities ?? [],
            'images' => $property->images ?? [],
            'house_rules' => $property->house_rules ?? [],
            'policies' => $property->policies ?? [],
            'base_price' => (float) $property->base_price,
            'price_format' => $property->price_format,
            'currency' => $property->currency,
            'cleaning_fee' => (float) $property->cleaning_fee,
            'service_fee' => (float) $property->service_fee,
            'guests' => $property->guests,
            'bedrooms' => $property->bedrooms,
            'bathrooms' => $property->bathrooms,
            'check_in_time' => $property->check_in_time,
            'check_out_time' => $property->check_out_time,
            'minimum_stay' => $property->minimum_stay,
            'rating' => (float) $property->rating,
            'reviews' => $property->reviews,
            'host' => [
                'name' => $property->user?->name ?? 'Host',
                'avatar' => $property->user?->avatar ?? null,
                'id' => $property->user?->id,
            ],
        ],
    ]);
})->name('listing.checkout');

Route::post('/listing/{id}/inquire', function (\Illuminate\Http\Request $request, $id) {
    $property = \App\Models\Property::findOrFail($id);

    $validated = $request->validate([
        'traveler_name' => 'required|string|max:255',
        'traveler_email' => 'required|email|max:255',
        'traveler_phone' => 'nullable|string|max:50',
        'check_in' => 'required|date|after_or_equal:today',
        'check_out' => 'required|date|after:check_in',
        'guests' => 'required|integer|min:1|max:' . $property->guests,
        'message' => 'required|string|max:2000',
    ]);

    \App\Models\Inquiry::create([
        'property_id' => $property->id,
        'user_id' => $property->user_id,
        'traveler_user_id' => null,
        'traveler_name' => $validated['traveler_name'],
        'traveler_email' => $validated['traveler_email'],
        'traveler_phone' => $validated['traveler_phone'] ?? null,
        'check_in' => $validated['check_in'],
        'check_out' => $validated['check_out'],
        'guests' => $validated['guests'],
        'message' => $validated['message'],
        'status' => 'new',
        'sent_at' => now(),
    ]);

    return back()->with('success', 'Your inquiry has been sent! The host will get back to you soon.');
})->name('listing.inquire');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        $properties = \App\Models\Property::where('user_id', $user->id)->get()->map(function ($property) {
            return [
                'id' => $property->id,
                'property' => $property->name,
                'type' => $property->type,
                'status' => $property->status,
                'inquiries' => (string) $property->inquiries,
                'bookings' => (string) $property->bookings,
            ];
        })->toArray();

        $directBookings = \App\Models\Property::where('user_id', $user->id)->sum('bookings');
        $revenueProcessed = 0; // Placeholder until Stripe Connect
        $guestEmailsCaptured = \App\Models\Inquiry::where('user_id', $user->id)->distinct()->count('traveler_email');
        $moneySaved = (int) round(0.15 * $revenueProcessed); // 15% OTA fee estimate

        return Inertia::render('dashboard', [
            'properties' => $properties,
            'directBookings' => $directBookings,
            'revenueProcessed' => $revenueProcessed,
            'guestEmailsCaptured' => $guestEmailsCaptured,
            'moneySaved' => $moneySaved,
        ]);
    })->name('dashboard');

    Route::get('import-airbnb', function () {
        return Inertia::render('import-airbnb');
    })->name('import-airbnb');

    Route::get('listings', function () {
        $properties = \App\Models\Property::where('user_id', auth()->id())->get()->map(function ($property) {
            return [
                'id' => $property->id,
                'title' => $property->name,
                'location' => $property->location,
                'status' => strtolower($property->status),
                'price' => $property->price_format ?? ('$' . number_format($property->base_price) . '/month'),
                'bedrooms' => $property->bedrooms,
                'bathrooms' => $property->bathrooms,
                'lastUpdated' => $property->updated_at->diffForHumans(),
                'thumbnail' => $property->images && count($property->images) > 0 ? $property->images[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop&crop=center',
            ];
        })->toArray();

        return Inertia::render('listings', [
            'properties' => $properties
        ]);
    })->name('listings');

    Route::get('calendar', function () {
        // Get events data from database if needed
        $events = [];

        return Inertia::render('calendar', [
            'events' => $events
        ]);
    })->name('calendar');

    Route::patch('inquiries/{id}', function ($id) {
        $inquiry = \App\Models\Inquiry::where('user_id', auth()->id())->findOrFail($id);
        $validated = request()->validate(['status' => 'required|in:new,contacted,booked,lost']);
        $inquiry->update($validated);
        return back();
    })->name('inquiries.update');

    Route::get('inquiries', function () {
        $dbInquiries = \App\Models\Inquiry::where('user_id', auth()->id())
            ->with('property')
            ->orderByDesc('sent_at')
            ->get();

        if ($dbInquiries->isNotEmpty()) {
            $inquiries = $dbInquiries->map(function ($inquiry) {
                return [
                    'id' => $inquiry->id,
                    'traveler_name' => $inquiry->traveler_name,
                    'traveler_email' => $inquiry->traveler_email,
                    'traveler_phone' => $inquiry->traveler_phone,
                    'property_id' => $inquiry->property_id,
                    'property_name' => $inquiry->property?->name ?? 'Unknown',
                    'check_in' => $inquiry->check_in->format('Y-m-d'),
                    'check_out' => $inquiry->check_out->format('Y-m-d'),
                    'guests' => $inquiry->guests,
                    'message' => $inquiry->message,
                    'status' => in_array($inquiry->status, ['new', 'contacted', 'booked', 'lost']) ? $inquiry->status : 'new',
                    'sent_at' => $inquiry->sent_at->format('M d, Y'),
                ];
            })->toArray();
        } else {
            $inquiries = [
                [
                    'id' => 1,
                    'traveler_name' => 'Sarah Johnson',
                    'traveler_email' => 'sarah.j@email.com',
                    'traveler_phone' => '+1 (555) 234-5678',
                    'property_name' => 'Beachfront Villa - Malibu',
                    'check_in' => '2026-03-15',
                    'check_out' => '2026-03-22',
                    'guests' => 2,
                    'message' => 'Hi! We are planning a romantic getaway and your beachfront villa looks absolutely perfect. Could you tell me more about the ocean views and nearby restaurants?',
                    'status' => 'booked',
                    'sent_at' => 'Feb 18, 2026',
                ],
                [
                    'id' => 2,
                    'traveler_name' => 'Mike Chen',
                    'traveler_email' => 'mike.chen@email.com',
                    'traveler_phone' => '+1 (555) 876-5432',
                    'property_name' => 'Mountain Retreat - Aspen',
                    'check_in' => '2026-04-01',
                    'check_out' => '2026-04-07',
                    'guests' => 4,
                    'message' => 'Hello! Our family of four is looking for a mountain retreat for spring break. Is the hot tub available during April? Also wondering about ski shuttle availability.',
                    'status' => 'contacted',
                    'sent_at' => 'Feb 19, 2026',
                ],
                [
                    'id' => 3,
                    'traveler_name' => 'Emma Wilson',
                    'traveler_email' => 'emma.wilson@email.com',
                    'traveler_phone' => null,
                    'property_name' => 'Downtown Loft - Austin',
                    'check_in' => '2026-03-20',
                    'check_out' => '2026-03-25',
                    'guests' => 1,
                    'message' => 'I\'m attending SXSW and your downtown loft is in the perfect location. Is it available for those dates? I\'m a quiet guest and very respectful of house rules.',
                    'status' => 'new',
                    'sent_at' => 'Feb 20, 2026',
                ],
                [
                    'id' => 4,
                    'traveler_name' => 'Carlos Rivera',
                    'traveler_email' => 'carlos.r@email.com',
                    'traveler_phone' => '+506 8845-1234',
                    'property_name' => 'Beachfront Villa - Malibu',
                    'check_in' => '2026-05-10',
                    'check_out' => '2026-05-17',
                    'guests' => 6,
                    'message' => 'Hola! I\'m organizing a group trip from Costa Rica. We need space for 6 people. Does the villa have enough beds, or would some of us need to share? Also, is the pool heated?',
                    'status' => 'contacted',
                    'sent_at' => 'Feb 20, 2026',
                ],
                [
                    'id' => 5,
                    'traveler_name' => 'Anje Keizer',
                    'traveler_email' => 'anje.k@email.com',
                    'traveler_phone' => '+31 6 12345678',
                    'property_name' => 'Jungle Canopy Treehouse',
                    'check_in' => '2026-04-15',
                    'check_out' => '2026-04-20',
                    'guests' => 2,
                    'message' => 'The treehouse looks magical! My partner and I are celebrating our anniversary. Is it truly secluded? We want total privacy and nature immersion.',
                    'status' => 'new',
                    'sent_at' => 'Feb 21, 2026',
                ],
                [
                    'id' => 6,
                    'traveler_name' => 'Darren Adams',
                    'traveler_email' => 'darren.a@email.com',
                    'traveler_phone' => '+1 (555) 999-0011',
                    'property_name' => 'Lakefront Cabin - Tahoe',
                    'check_in' => '2026-06-01',
                    'check_out' => '2026-06-08',
                    'guests' => 3,
                    'message' => 'Hey there! Looking for a week-long stay at the lake cabin for some fishing and relaxation. Do you provide kayaks or canoes? What\'s the fishing like in June?',
                    'status' => 'lost',
                    'sent_at' => 'Feb 17, 2026',
                ],
                [
                    'id' => 7,
                    'traveler_name' => 'Priya Sharma',
                    'traveler_email' => 'priya.s@email.com',
                    'traveler_phone' => '+91 98765 43210',
                    'property_name' => 'Mountain Retreat - Aspen',
                    'check_in' => '2026-03-28',
                    'check_out' => '2026-04-02',
                    'guests' => 2,
                    'message' => 'Hi! Is the mountain retreat suitable for remote work? I need reliable WiFi as I\'ll be working during the mornings. The rest of the time we\'ll be exploring!',
                    'status' => 'booked',
                    'sent_at' => 'Feb 16, 2026',
                ],
            ];
        }

        $properties = \App\Models\Property::where('user_id', auth()->id())->get(['id', 'name'])->map(fn ($p) => ['id' => $p->id, 'name' => $p->name])->toArray();

        return Inertia::render('inquiries', [
            'inquiries' => $inquiries,
            'properties' => $properties,
        ]);
    })->name('inquiries');

    Route::get('crm', function () {
        $user = auth()->user();
        $properties = \App\Models\Property::where('user_id', $user->id)->get(['id', 'name']);
        $propertyFilter = request()->query('property_id');

        $guests = \App\Models\Inquiry::where('user_id', $user->id)
            ->with('property')
            ->when($propertyFilter, fn ($q) => $q->where('property_id', $propertyFilter))
            ->get()
            ->groupBy('traveler_email')
            ->map(function ($inquiries, $email) {
                $first = $inquiries->first();
                $booked = $inquiries->filter(fn ($i) => $i->status === 'booked')->count();
                $lastBooking = $inquiries->filter(fn ($i) => $i->status === 'booked')->sortByDesc('check_out')->first();
                return [
                    'name' => $first->traveler_name,
                    'email' => $email,
                    'phone' => $first->traveler_phone,
                    'property_id' => $first->property_id,
                    'property_name' => $first->property?->name ?? 'Unknown',
                    'booking_count' => $booked ?: $inquiries->count(),
                    'total_spent' => 0,
                    'last_booking_date' => $lastBooking?->check_out?->format('Y-m-d'),
                ];
            })
            ->values()
            ->toArray();

        return Inertia::render('crm', [
            'guests' => $guests,
            'properties' => $properties->map(fn ($p) => ['id' => $p->id, 'name' => $p->name])->toArray(),
        ]);
    })->name('crm');

    Route::get('property/{id}', function ($id) {
        $propertyModel = \App\Models\Property::find($id);

        if (!$propertyModel) {
            abort(404);
        }

        // Transform the model data to match the frontend structure
        $property = [
            'id' => $propertyModel->id,
            'name' => $propertyModel->name,
            'type' => $propertyModel->type,
            'status' => $propertyModel->status,
            'location' => $propertyModel->location,
            'description' => $propertyModel->description,
            'amenities' => $propertyModel->amenities ?? [],
            'images' => $propertyModel->images ?? [],
            'house_rules' => $propertyModel->house_rules ?? [],
            'policies' => $propertyModel->policies ?? [],
            'pricing' => [
                'base_price' => (float) $propertyModel->base_price,
                'price_format' => $propertyModel->price_format,
                'currency' => $propertyModel->currency,
                'cleaning_fee' => (float) $propertyModel->cleaning_fee,
                'service_fee' => (float) $propertyModel->service_fee,
            ],
            'capacity' => [
                'guests' => $propertyModel->guests,
                'bedrooms' => $propertyModel->bedrooms,
                'bathrooms' => $propertyModel->bathrooms,
            ],
            'availability' => [
                'check_in' => $propertyModel->check_in_time,
                'check_out' => $propertyModel->check_out_time,
                'minimum_stay' => $propertyModel->minimum_stay,
            ],
            'performance' => [
                'views_7d' => $propertyModel->views_7d,
                'views_30d' => $propertyModel->views_30d,
                'inquiries' => $propertyModel->inquiries,
                'bookings' => $propertyModel->bookings,
                'rating' => (float) $propertyModel->rating,
                'reviews' => $propertyModel->reviews,
            ],
            'recent_inquiries' => [
                [
                    'id' => 1,
                    'guest_name' => 'Sarah Johnson',
                    'guest_email' => 'sarah.j@email.com',
                    'check_in' => '2024-02-15',
                    'check_out' => '2024-02-18',
                    'guests' => 2,
                    'message' => 'Hi! We are interested in booking your property for a romantic getaway. Could you tell me more about the amenities?',
                    'status' => 'new',
                    'created_at' => '2024-01-20 10:30:00',
                ],
                [
                    'id' => 2,
                    'guest_name' => 'Mike Chen',
                    'guest_email' => 'mike.chen@email.com',
                    'check_in' => '2024-02-22',
                    'check_out' => '2024-02-25',
                    'guests' => 4,
                    'message' => 'Perfect property for our family vacation! Please confirm availability.',
                    'status' => 'contacted',
                    'created_at' => '2024-01-19 14:15:00',
                ],
                [
                    'id' => 3,
                    'guest_name' => 'Emma Wilson',
                    'guest_email' => 'emma.wilson@email.com',
                    'check_in' => '2024-03-01',
                    'check_out' => '2024-03-07',
                    'guests' => 2,
                    'message' => 'Looking forward to our stay! Thank you for the quick response.',
                    'status' => 'booked',
                    'created_at' => '2024-01-18 09:45:00',
                ],
            ],
            'upcoming_bookings' => [
                [
                    'id' => 1,
                    'guest_name' => 'Emma Wilson',
                    'check_in' => '2024-03-01',
                    'check_out' => '2024-03-07',
                    'guests' => 2,
                    'total_amount' => 1050,
                    'status' => 'booked',
                ],
                [
                    'id' => 2,
                    'guest_name' => 'John Smith',
                    'check_in' => '2024-03-15',
                    'check_out' => '2024-03-18',
                    'guests' => 3,
                    'total_amount' => 675,
                    'status' => 'booked',
                ],
                [
                    'id' => 3,
                    'guest_name' => 'Lisa Davis',
                    'check_in' => '2024-04-02',
                    'check_out' => '2024-04-06',
                    'guests' => 2,
                    'total_amount' => 800,
                    'status' => 'new',
                ],
            ],
        ];

        return Inertia::render('property-details', [
            'property' => $property
        ]);
    })->name('property.details');
});

// Admin routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', function () {
        $properties = \App\Models\Property::with('user')->get()->map(function ($property) {
            return [
                'id' => $property->id,
                'property' => $property->name,
                'type' => $property->type,
                'status' => $property->status,
                'approval_status' => $property->approval_status,
                'host_name' => $property->user?->name ?? 'Host',
                'inquiries' => (string) $property->inquiries,
                'bookings' => (string) $property->bookings,
                'created_at' => $property->created_at->format('Y-m-d'),
            ];
        })->toArray();

        $hosts = \App\Models\User::where('role', 'host')->get()->map(function ($host) {
            return [
                'id' => $host->id,
                'name' => $host->name,
                'email' => $host->email,
                'properties_count' => \App\Models\Property::where('user_id', $host->id)->count(),
                'joined_at' => $host->created_at->diffForHumans(),
            ];
        })->toArray();

        $total_listings = \App\Models\Property::count();
        $active_listings = \App\Models\Property::where('approval_status', 'approved')->count();
        $pending_approvals = \App\Models\Property::where('approval_status', 'pending')->count();
        $recent_inquiries = \App\Models\Inquiry::where('sent_at', '>=', now()->subDays(7))->count();

        return Inertia::render('admin/admin-dashboard', [
            'properties' => $properties,
            'hosts' => $hosts,
            'total_listings' => $total_listings,
            'active_listings' => $active_listings,
            'pending_approvals' => $pending_approvals,
            'recent_inquiries' => $recent_inquiries,
        ]);
    })->name('dashboard');

    Route::get('hosts', function () {
        return Inertia::render('admin/host-management');
    })->name('hosts');

    Route::get('properties', function () {
        return Inertia::render('admin/property-listings');
    })->name('properties');

    Route::get('billing', function () {
        return Inertia::render('admin/renewals-billing');
    })->name('billing');
});

// Admin authentication routes
Route::middleware('guest')->group(function () {
    Route::get('admin/login', [AdminAuthenticatedSessionController::class, 'create'])
        ->name('admin.login');

    Route::post('admin/login', [AdminAuthenticatedSessionController::class, 'store'])
        ->name('admin.login.store');
});


Route::middleware('auth')->group(function () {
    Route::post('admin/logout', [AdminAuthenticatedSessionController::class, 'destroy'])
        ->name('admin.logout');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
