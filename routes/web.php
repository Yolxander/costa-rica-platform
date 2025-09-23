<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

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

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
