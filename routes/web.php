<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\Auth\AdminAuthenticatedSessionController;
use App\Http\Controllers\AirbnbImportController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PropertyImportController;
use App\Http\Controllers\CrmController;
use App\Http\Controllers\MarketingController;

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

Route::get('/listing/{identifier}', function ($identifier) {
    $property = is_numeric($identifier)
        ? \App\Models\Property::find($identifier)
        : \App\Models\Property::where('slug', $identifier)->first();
    if ($property?->slug) {
        return redirect()->to('/' . $property->slug, 301);
    }
    abort(404);
})->name('listing.redirect');

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

    Route::get('import', function () {
        return Inertia::render('import-listing');
    })->name('import');

    Route::post('import/preview', [PropertyImportController::class, 'preview'])->name('import.preview');
    Route::post('import', [PropertyImportController::class, 'store'])->name('import.store');

    Route::post('properties', [PropertyController::class, 'store'])->name('properties.store');
    Route::put('properties/{id}', [PropertyController::class, 'update'])->name('properties.update');
    Route::delete('properties/{id}', [PropertyController::class, 'destroy'])->name('properties.destroy');

    Route::redirect('import-airbnb', 'import', 301);

    Route::get('listings', function () {
        $properties = \App\Models\Property::where('user_id', auth()->id())->get()->map(function ($property) {
            return [
                'id' => $property->id,
                'slug' => $property->slug,
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

    Route::get('calendar', [CalendarController::class, 'index'])->name('calendar');
    Route::post('calendar/availability', [CalendarController::class, 'storeAvailability'])->name('calendar.availability.store');
    Route::delete('calendar/availability/{id}', [CalendarController::class, 'destroyAvailability'])->name('calendar.availability.destroy');

    Route::post('inquiries/{id}/reply', [InquiryController::class, 'reply'])->name('inquiries.reply');
    Route::patch('inquiries/{id}', function ($id) {
        $inquiry = \App\Models\Inquiry::where('user_id', auth()->id())->findOrFail($id);
        $validated = request()->validate(['status' => 'required|in:new,contacted,booked,lost']);
        $inquiry->update($validated);
        return back();
    })->name('inquiries.update');

    Route::get('inquiries', function () {
        $propertyFilter = request()->query('property_id');
        $dbInquiries = \App\Models\Inquiry::where('user_id', auth()->id())
            ->with(['property', 'responses'])
            ->when($propertyFilter, fn ($q) => $q->where('property_id', $propertyFilter))
            ->orderByDesc('sent_at')
            ->get();

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
                'responses' => $inquiry->responses->map(fn ($r) => [
                    'id' => $r->id,
                    'sender' => $r->sender,
                    'message' => $r->message,
                    'created_at' => $r->created_at->format('M d, Y g:i A'),
                ])->toArray(),
            ];
        })->toArray();

        $properties = \App\Models\Property::where('user_id', auth()->id())->get(['id', 'name'])->map(fn ($p) => ['id' => $p->id, 'name' => $p->name])->toArray();

        return Inertia::render('inquiries', [
            'inquiries' => $inquiries,
            'properties' => $properties,
        ]);
    })->name('inquiries');

    Route::get('marketing', [MarketingController::class, 'index'])->name('marketing');
    Route::get('marketing/email/new', [MarketingController::class, 'createEmail'])->name('marketing.email.create');
    Route::get('marketing/email/{campaign}/edit', [MarketingController::class, 'editEmail'])->name('marketing.email.edit');
    Route::post('marketing/email', [MarketingController::class, 'storeEmail'])->name('marketing.email.store');
    Route::put('marketing/email/{campaign}', [MarketingController::class, 'updateEmail'])->name('marketing.email.update');
    Route::get('marketing/social/new', [MarketingController::class, 'createSocial'])->name('marketing.social.create');
    Route::get('marketing/social/{post}/edit', [MarketingController::class, 'editSocial'])->name('marketing.social.edit');
    Route::post('marketing/social', [MarketingController::class, 'storeSocial'])->name('marketing.social.store');
    Route::put('marketing/social/{post}', [MarketingController::class, 'updateSocial'])->name('marketing.social.update');
    Route::post('marketing/social/generate-caption', [MarketingController::class, 'generateCaption'])->name('marketing.social.generate-caption');
    Route::post('marketing/email/understand', [MarketingController::class, 'understandEmailIntent'])->name('marketing.email.understand');
    Route::post('marketing/email/generate-content', [MarketingController::class, 'generateEmailContent'])->name('marketing.email.generate-content');

    // Socials Routes
    Route::get('socials', function () {
        $user = auth()->user();
        $posts = \App\Models\SocialPost::where('user_id', $user->id)
            ->with('property:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        $allPosts = $posts->map(function ($post) {
            return [
                'id' => $post->id,
                'caption' => $post->caption,
                'hashtags' => $post->hashtags,
                'location' => $post->location,
                'property_name' => $post->property?->name ?? null,
                'images_count' => is_array($post->images) ? count($post->images) : 0,
                'created_at' => $post->created_at->toISOString(),
                'platform' => $post->platform,
                'status' => $post->status,
            ];
        });

        $facebookPosts = $allPosts->where('platform', 'facebook')->values()->all();
        $instagramPosts = $allPosts->where('platform', 'instagram')->values()->all();

        return Inertia::render('socials', [
            'facebookPosts' => $facebookPosts,
            'instagramPosts' => $instagramPosts,
        ]);
    })->name('socials');

    Route::get('socials/create', function () {
        $user = auth()->user();
        $properties = \App\Models\Property::where('user_id', $user->id)
            ->get(['id', 'name', 'slug', 'discovery_page_enabled'])
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'discovery_page_enabled' => $p->discovery_page_enabled,
                'discovery_page_url' => $p->discovery_page_enabled ? url("/discovery/{$p->slug}") : null,
            ])
            ->toArray();

        return Inertia::render('socials-create', [
            'properties' => $properties,
        ]);
    })->name('socials.create');

    Route::post('socials', function () {
        $validated = request()->validate([
            'platform' => 'required|in:instagram,facebook',
            'property_id' => 'nullable|exists:properties,id',
            'caption' => 'required|string',
            'hashtags' => 'nullable|string',
            'location' => 'nullable|string',
            'link_url' => 'nullable|url',
            'scheduled_at' => 'nullable|date',
        ]);

        $post = \App\Models\SocialPost::create([
            'user_id' => auth()->id(),
            'property_id' => $validated['property_id'] ?? null,
            'platform' => $validated['platform'],
            'images' => [],
            'caption' => $validated['caption'],
            'hashtags' => $validated['hashtags'] ?? null,
            'location' => $validated['location'] ?? null,
            'link_url' => $validated['link_url'] ?? null,
            'status' => 'draft',
            'scheduled_at' => $validated['scheduled_at'] ?? null,
        ]);

        return redirect()->route('socials')->with('success', 'Post saved as draft');
    })->name('socials.store');

    Route::delete('socials/{id}', function ($id) {
        $post = \App\Models\SocialPost::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $post->delete();

        return redirect()->route('socials')->with('success', 'Post deleted');
    })->name('socials.destroy');

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

    Route::get('crm/guests/{email}', [CrmController::class, 'show'])->name('crm.guests.show')->where('email', '.+');
    Route::post('crm/guests/{email}/notes', [CrmController::class, 'storeNote'])->name('crm.guests.notes.store')->where('email', '.+');
    Route::patch('crm/guests/{email}/tags', [CrmController::class, 'updateTags'])->name('crm.guests.tags.update')->where('email', '.+');
    Route::post('crm/tags', [CrmController::class, 'storeTag'])->name('crm.tags.store');

    // Discovery Pages Routes
    Route::get('discovery-pages', function () {
        $properties = \App\Models\Property::where('user_id', auth()->id())
            ->get()
            ->map(function ($property) {
                return [
                    'id' => $property->id,
                    'slug' => $property->slug,
                    'name' => $property->name,
                    'location' => $property->location,
                    'thumbnail' => $property->images && count($property->images) > 0 ? $property->images[0] : null,
                    'discovery_url' => url('/stay/' . $property->slug),
                    'is_enabled' => $property->discovery_page_enabled,
                    'views_30d' => $property->views_30d,
                ];
            })->toArray();

        return Inertia::render('discovery-pages', ['properties' => $properties]);
    })->name('discovery-pages');

    Route::get('discovery-pages/{id}/edit', function ($id) {
        $property = \App\Models\Property::where('user_id', auth()->id())->findOrFail($id);
        return Inertia::render('discovery-page-edit', ['property' => $property]);
    })->name('discovery-pages.edit');

    Route::put('discovery-pages/{id}', [PropertyController::class, 'updateDiscoveryPage'])->name('discovery-pages.update');

    Route::get('property/{id}', function ($id) {
        $propertyModel = \App\Models\Property::find($id);

        if (!$propertyModel) {
            abort(404);
        }

        // Transform the model data to match the frontend structure
        $property = [
            'id' => $propertyModel->id,
            'slug' => $propertyModel->slug,
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

$reservedPaths = 'pricing|how-it-works|blog|join|dashboard|listings|calendar|inquiries|marketing|crm|import|login|register|host|admin|settings|property|properties|forgot-password|reset-password|verify-email|two-factor|confirm-password|password|user|stay|discovery-pages';

// Public Discovery Page Route
Route::get('/stay/{slug}', function ($slug) {
    $property = \App\Models\Property::where('slug', $slug)
        ->where('discovery_page_enabled', true)
        ->with('user')
        ->firstOrFail();

    return Inertia::render('discovery-page', [
        'property' => [
            'id' => $property->id,
            'slug' => $property->slug,
            'name' => $property->name,
            'location' => $property->location,
            'type' => $property->type,
            'images' => $property->images ?? [],
            'guests' => $property->guests,
            'bedrooms' => $property->bedrooms,
            'bathrooms' => $property->bathrooms,
            'amenities' => $property->amenities ?? [],
            'base_price' => $property->base_price,
            'price_format' => $property->price_format,
            'currency' => $property->currency,
            'custom_message' => $property->custom_message,
            'primary_color' => $property->accent_color ?? '#e78a53',
            'secondary_color' => $property->secondary_color ?? '#5f8787',
            'host' => [
                'name' => $property->user?->name ?? 'Host',
                'avatar' => $property->user?->avatar ?? null,
            ],
            'buttons' => [
                'book_direct' => [
                    'visible' => $property->show_book_direct_button,
                    'url' => '/' . $property->slug,
                ],
                'airbnb' => [
                    'visible' => $property->show_airbnb_button && $property->airbnb_url,
                    'url' => $property->airbnb_url,
                ],
                'bookingcom' => [
                    'visible' => $property->show_bookingcom_button && $property->bookingcom_url,
                    'url' => $property->bookingcom_url,
                ],
                'vrbo' => [
                    'visible' => $property->vrbo_url ? true : false,
                    'url' => $property->vrbo_url,
                ],
                'whatsapp' => [
                    'visible' => $property->show_whatsapp_button && $property->whatsapp_number,
                    'url' => $property->whatsapp_number ? 'https://wa.me/' . preg_replace('/[^0-9]/', '', $property->whatsapp_number) : null,
                ],
                'website' => [
                    'visible' => $property->website_url ? true : false,
                    'url' => $property->website_url,
                ],
            ],
        ],
    ]);
})->where('slug', "^(?!({$reservedPaths})(?:\/|\$))[^/]+")->name('discovery-page');

Route::get('/{slug}', function ($slug) {
    $property = \App\Models\Property::where('slug', $slug)
        ->with('user')
        ->firstOrFail();

    return Inertia::render('listing-detail', [
        'property' => [
            'id' => $property->id,
            'slug' => $property->slug,
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
})->where('slug', "^(?!({$reservedPaths})(?:\\/|\$))[^/]+")->name('listing.detail');

Route::get('/{slug}/checkout', function (\Illuminate\Http\Request $request, $slug) {
    $property = \App\Models\Property::where('slug', $slug)
        ->with('user')
        ->firstOrFail();

    return Inertia::render('listing-checkout', [
        'property' => [
            'id' => $property->id,
            'slug' => $property->slug,
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
})->where('slug', "^(?!({$reservedPaths})(?:\\/|\$))[^/]+")->name('listing.checkout');

Route::post('/{slug}/inquire', [InquiryController::class, 'store'])
    ->where('slug', "^(?!({$reservedPaths})(?:\\/|\$))[^/]+")
    ->name('listing.inquire');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
