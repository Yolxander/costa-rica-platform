<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\Auth\AdminAuthenticatedSessionController;

Route::get('/', function (\Illuminate\Http\Request $request) {
    $query = \App\Models\Property::query()->with('user');

    if ($search = $request->query('search')) {
        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('location', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    if ($type = $request->query('type')) {
        $query->where('type', $type);
    }

    if ($guests = $request->query('guests')) {
        $query->where('guests', '>=', (int) $guests);
    }

    $properties = $query->get()->map(function ($property) {
        return [
            'id' => $property->id,
            'name' => $property->name,
            'type' => $property->type,
            'location' => $property->location,
            'image' => $property->images && count($property->images) > 0
                ? $property->images[0]
                : null,
            'base_price' => (float) $property->base_price,
            'price_format' => $property->price_format,
            'currency' => $property->currency,
            'guests' => $property->guests,
            'bedrooms' => $property->bedrooms,
            'bathrooms' => $property->bathrooms,
            'rating' => (float) $property->rating,
            'reviews' => $property->reviews,
            'amenities' => $property->amenities ?? [],
            'host_name' => $property->user?->name ?? 'Host',
        ];
    })->toArray();

    $types = \App\Models\Property::select('type')
        ->distinct()
        ->pluck('type')
        ->toArray();

    $savedListingIds = [];
    if ($user = $request->user()) {
        $savedListingIds = $user->savedListings()->pluck('properties.id')->toArray();
    }

    return Inertia::render('welcome', [
        'properties' => $properties,
        'types' => $types,
        'filters' => [
            'search' => $request->query('search', ''),
            'type' => $request->query('type', ''),
            'guests' => $request->query('guests', ''),
        ],
        'savedListingIds' => $savedListingIds,
    ]);
})->name('home');

Route::get('/listing/{id}', function (\Illuminate\Http\Request $request, $id) {
    $property = \App\Models\Property::where('id', $id)
        ->with('user')
        ->firstOrFail();

    $savedListingIds = [];
    if ($user = $request->user()) {
        $savedListingIds = $user->savedListings()->pluck('properties.id')->toArray();
    }

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
        'savedListingIds' => $savedListingIds,
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
        'traveler_user_id' => auth()->id(),
        'traveler_name' => $validated['traveler_name'],
        'traveler_email' => $validated['traveler_email'],
        'traveler_phone' => $validated['traveler_phone'] ?? null,
        'check_in' => $validated['check_in'],
        'check_out' => $validated['check_out'],
        'guests' => $validated['guests'],
        'message' => $validated['message'],
        'status' => 'pending',
        'sent_at' => now(),
    ]);

    return back()->with('success', 'Your inquiry has been sent! The host will get back to you soon.');
})->name('listing.inquire');

Route::post('/listing/{id}/save', function ($id) {
    $user = auth()->user();
    $property = \App\Models\Property::findOrFail($id);

    if ($user->savedListings()->where('property_id', $property->id)->exists()) {
        $user->savedListings()->detach($property->id);
    } else {
        $user->savedListings()->attach($property->id);
    }

    return back();
})->middleware('auth')->name('listing.save');

Route::get('/account', function () {
    $user = auth()->user();

    $inquiries = $user->sentInquiries()
        ->with('property')
        ->orderByDesc('sent_at')
        ->get()
        ->map(function ($inquiry) {
            return [
                'id' => $inquiry->id,
                'property_id' => $inquiry->property_id,
                'property_name' => $inquiry->property?->name ?? 'Unknown',
                'property_image' => $inquiry->property?->images[0] ?? null,
                'property_location' => $inquiry->property?->location ?? '',
                'check_in' => $inquiry->check_in->format('M d, Y'),
                'check_out' => $inquiry->check_out->format('M d, Y'),
                'guests' => $inquiry->guests,
                'message' => $inquiry->message,
                'status' => $inquiry->status,
                'sent_at' => $inquiry->sent_at->format('M d, Y'),
            ];
        })
        ->toArray();

    $savedListings = $user->savedListings()
        ->with('user')
        ->get()
        ->map(function ($property) {
            return [
                'id' => $property->id,
                'name' => $property->name,
                'type' => $property->type,
                'location' => $property->location,
                'image' => $property->images && count($property->images) > 0 ? $property->images[0] : null,
                'base_price' => (float) $property->base_price,
                'price_format' => $property->price_format,
                'currency' => $property->currency,
                'guests' => $property->guests,
                'bedrooms' => $property->bedrooms,
                'bathrooms' => $property->bathrooms,
                'rating' => (float) $property->rating,
                'reviews' => $property->reviews,
                'amenities' => $property->amenities ?? [],
                'host_name' => $property->user?->name ?? 'Host',
            ];
        })
        ->toArray();

    return Inertia::render('account', [
        'inquiries' => $inquiries,
        'savedListings' => $savedListings,
    ]);
})->middleware('auth')->name('account');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        // Get properties data from database and transform to match the expected format
        $properties = \App\Models\Property::all()->map(function ($property) {
            return [
                'id' => $property->id,
                'property' => $property->name,
                'type' => $property->type,
                'status' => $property->status,
                'views_7d' => (string) $property->views_7d,
                'views_30d' => (string) $property->views_30d,
                'inquiries' => (string) $property->inquiries,
                'bookings' => (string) $property->bookings,
            ];
        })->toArray();

        return Inertia::render('dashboard', [
            'properties' => $properties
        ]);
    })->name('dashboard');

    Route::get('listings', function () {
        // Get properties data from database and transform to match the listings page format
        $properties = \App\Models\Property::all()->map(function ($property) {
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

    Route::get('inquiries', function () {
        $dbInquiries = \App\Models\Inquiry::with('property')
            ->orderByDesc('sent_at')
            ->get();

        if ($dbInquiries->isNotEmpty()) {
            $inquiries = $dbInquiries->map(function ($inquiry) {
                return [
                    'id' => $inquiry->id,
                    'traveler_name' => $inquiry->traveler_name,
                    'traveler_email' => $inquiry->traveler_email,
                    'traveler_phone' => $inquiry->traveler_phone,
                    'property_name' => $inquiry->property?->name ?? 'Unknown',
                    'check_in' => $inquiry->check_in->format('Y-m-d'),
                    'check_out' => $inquiry->check_out->format('Y-m-d'),
                    'guests' => $inquiry->guests,
                    'message' => $inquiry->message,
                    'status' => $inquiry->status,
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
                    'status' => 'confirmed',
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
                    'status' => 'responded',
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
                    'status' => 'pending',
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
                    'status' => 'responded',
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
                    'status' => 'pending',
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
                    'status' => 'declined',
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
                    'status' => 'confirmed',
                    'sent_at' => 'Feb 16, 2026',
                ],
            ];
        }

        return Inertia::render('inquiries', [
            'inquiries' => $inquiries,
        ]);
    })->name('inquiries');

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
                    'status' => 'pending',
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
                    'status' => 'responded',
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
                    'status' => 'confirmed',
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
                    'status' => 'confirmed',
                ],
                [
                    'id' => 2,
                    'guest_name' => 'John Smith',
                    'check_in' => '2024-03-15',
                    'check_out' => '2024-03-18',
                    'guests' => 3,
                    'total_amount' => 675,
                    'status' => 'confirmed',
                ],
                [
                    'id' => 3,
                    'guest_name' => 'Lisa Davis',
                    'check_in' => '2024-04-02',
                    'check_out' => '2024-04-06',
                    'guests' => 2,
                    'total_amount' => 800,
                    'status' => 'pending',
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
        // Get properties data with approval status
        $properties = \App\Models\Property::with('user')->get()->map(function ($property) {
            return [
                'id' => $property->id,
                'property' => $property->name,
                'type' => $property->type,
                'status' => $property->status,
                'approval_status' => $property->approval_status,
                'host_name' => $property->user->name,
                'views_7d' => (string) $property->views_7d,
                'views_30d' => (string) $property->views_30d,
                'inquiries' => (string) $property->inquiries,
                'bookings' => (string) $property->bookings,
                'created_at' => $property->created_at->format('Y-m-d'),
            ];
        })->toArray();

        // Get hosts data
        $hosts = \App\Models\User::where('role', 'host')->with('hostSubscription')->get()->map(function ($host) {
            return [
                'id' => $host->id,
                'name' => $host->name,
                'email' => $host->email,
                'properties_count' => \App\Models\Property::where('user_id', $host->id)->count(),
                'subscription_status' => $host->hostSubscription?->status ?? 'none',
                'subscription_expires' => $host->hostSubscription?->end_date?->format('Y-m-d'),
                'joined_at' => $host->created_at->diffForHumans(),
            ];
        })->toArray();

        // Calculate admin-specific metrics
        $total_listings = \App\Models\Property::count();
        $active_listings = \App\Models\Property::where('approval_status', 'approved')->count();
        $pending_approvals = \App\Models\Property::where('approval_status', 'pending')->count();

        $expiring_subscriptions = \App\Models\HostSubscription::where('status', 'active')
            ->where('end_date', '<=', now()->addDays(30))
            ->count();

        $recent_inquiries = \App\Models\Inquiry::where('sent_at', '>=', now()->subDays(7))->count();

        $yearly_revenue = \App\Models\HostSubscription::where('status', 'active')
            ->sum('yearly_fee');

        // Get site analytics data for the last 7 days
        $site_analytics = \App\Models\SiteAnalytic::where('date', '>=', now()->subDays(7))
            ->orderBy('date')
            ->get()
            ->map(function ($analytic) {
                return [
                    'date' => $analytic->date->format('Y-m-d'),
                    'page_views' => $analytic->page_views,
                    'unique_visitors' => $analytic->unique_visitors,
                    'property_views' => $analytic->property_views,
                    'inquiry_submissions' => $analytic->inquiry_submissions,
                    'bounce_rate' => $analytic->bounce_rate,
                    'avg_session_duration' => $analytic->avg_session_duration,
                ];
            });

        return Inertia::render('admin/admin-dashboard', [
            'properties' => $properties,
            'hosts' => $hosts,
            'total_listings' => $total_listings,
            'active_listings' => $active_listings,
            'pending_approvals' => $pending_approvals,
            'expiring_subscriptions' => $expiring_subscriptions,
            'recent_inquiries' => $recent_inquiries,
            'yearly_revenue' => $yearly_revenue,
            'site_analytics' => $site_analytics,
        ]);
    })->name('dashboard');

    // Placeholder routes for other admin pages
    Route::get('hosts', function () {
        return Inertia::render('admin/host-management');
    })->name('hosts');

    Route::get('properties', function () {
        return Inertia::render('admin/property-listings');
    })->name('properties');

    Route::get('billing', function () {
        return Inertia::render('admin/renewals-billing');
    })->name('billing');

    Route::get('content', function () {
        return Inertia::render('admin/content-management');
    })->name('content');

    Route::get('inquiries', function () {
        return Inertia::render('admin/traveler-inquiries');
    })->name('inquiries');

    Route::get('analytics', function () {
        return Inertia::render('admin/analytics-reports');
    })->name('analytics');
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
