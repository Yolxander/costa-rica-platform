<?php

namespace Tests\Feature;

use App\Models\Property;
use App\Models\User;
use App\Services\BookingScraper;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class BookingImportTest extends TestCase
{
    use RefreshDatabase;

    public function test_preview_accepts_valid_booking_url()
    {
        $this->actingAs(User::factory()->create());

        $fakeHtml = $this->buildFakeBookingHtml([
            'name' => 'Hotel Daleese',
            'description' => 'A comfortable hotel in Costa Rica.',
            'image' => 'https://example.com/hotel.jpg',
            'location' => 'San Jose, Costa Rica',
            'rating' => 4.2,
            'reviews' => 85,
            'amenities' => ['WiFi', 'Air conditioning', 'Pool'],
        ]);

        Http::fake([
            'www.booking.com/*' => Http::response($fakeHtml, 200),
        ]);

        $response = $this->postJson(route('import.preview'), [
            'url' => 'https://www.booking.com/hotel/cr/hotel-daleese.en-gb.html',
        ]);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Hotel Daleese',
                    'description' => 'A comfortable hotel in Costa Rica.',
                ],
            ]);

        $data = $response->json('data');
        $this->assertNotEmpty($data['images']);
        $this->assertEquals('San Jose, Costa Rica', $data['location']);
        $this->assertEquals('hotel', $data['type']);
    }

    public function test_preview_extracts_amenities_from_booking_com()
    {
        $this->actingAs(User::factory()->create());

        $fakeHtml = $this->buildFakeBookingHtml([
            'name' => 'Beach Resort',
            'description' => 'Oceanfront property.',
            'image' => 'https://example.com/resort.jpg',
            'location' => 'Tamarindo, Costa Rica',
            'rating' => 4.8,
            'reviews' => 200,
            'amenities' => ['Free WiFi', 'Pool', 'Restaurant', 'Air conditioning'],
        ]);

        Http::fake([
            'www.booking.com/*' => Http::response($fakeHtml, 200),
        ]);

        $response = $this->postJson(route('import.preview'), [
            'url' => 'https://www.booking.com/hotel/cr/beach-resort.en.html',
        ]);

        $response->assertOk();
        $data = $response->json('data');
        $this->assertNotEmpty($data['amenities']);
        $this->assertContains('WiFi', $data['amenities']);
        $this->assertContains('Pool', $data['amenities']);
        $this->assertContains('Restaurant', $data['amenities']);
        $this->assertContains('Air conditioning', $data['amenities']);
    }

    public function test_store_creates_property_from_booking_import()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->post(route('import.store'), [
            'name' => 'Imported Hotel',
            'description' => 'A hotel imported from Booking.com.',
            'type' => 'hotel',
            'location' => 'Liberia, Costa Rica',
            'base_price' => 150.00,
            'currency' => 'USD',
            'guests' => 4,
            'bedrooms' => 2,
            'bathrooms' => 2,
            'amenities' => ['WiFi', 'Pool', 'Parking'],
            'images' => ['https://example.com/h1.jpg'],
            'rating' => 4.5,
            'reviews' => 100,
        ])->assertRedirect(route('listings'));

        $this->assertDatabaseHas('properties', [
            'user_id' => $user->id,
            'name' => 'Imported Hotel',
            'type' => 'hotel',
            'location' => 'Liberia, Costa Rica',
        ]);

        $property = Property::where('user_id', $user->id)->first();
        $this->assertEquals(['WiFi', 'Pool', 'Parking'], $property->amenities);
    }

    public function test_scraper_extracts_booking_json_ld()
    {
        $html = $this->buildFakeBookingHtml([
            'name' => 'Mountain Lodge',
            'description' => 'In the cloud forest.',
            'image' => 'https://example.com/lodge.jpg',
            'location' => 'Monteverde, Costa Rica',
            'rating' => 4.9,
            'reviews' => 50,
            'amenities' => ['WiFi', 'Restaurant'],
        ]);

        Http::fake(['*' => Http::response($html, 200)]);

        $scraper = new BookingScraper();
        $data = $scraper->scrape('https://www.booking.com/hotel/cr/mountain-lodge.en-gb.html');

        $this->assertEquals('Mountain Lodge', $data['name']);
        $this->assertEquals('In the cloud forest.', $data['description']);
        $this->assertContains('https://example.com/lodge.jpg', $data['images']);
        $this->assertEquals('Monteverde, Costa Rica', $data['location']);
        $this->assertEquals(4.9, $data['rating']);
        $this->assertEquals(50, $data['reviews']);
        $this->assertEquals(['WiFi', 'Restaurant'], $data['amenities']);
    }

    public function test_scraper_strips_free_prefix_from_amenities()
    {
        $html = $this->buildFakeBookingHtml([
            'name' => 'Test Hotel',
            'description' => 'Test.',
            'image' => 'https://example.com/img.jpg',
            'location' => 'Costa Rica',
            'rating' => 4,
            'reviews' => 0,
            'amenities' => ['Free WiFi', 'Free Parking'],
        ]);

        Http::fake(['*' => Http::response($html, 200)]);

        $scraper = new BookingScraper();
        $data = $scraper->scrape('https://www.booking.com/hotel/cr/test.en.html');

        $this->assertContains('WiFi', $data['amenities']);
        $this->assertContains('Parking', $data['amenities']);
    }

    public function test_scraper_throws_on_http_failure()
    {
        Http::fake([
            '*' => Http::response('', 500),
        ]);

        $this->expectException(\RuntimeException::class);

        $scraper = new BookingScraper();
        $scraper->scrape('https://www.booking.com/hotel/cr/fail.en.html');
    }

    public function test_scraper_throws_helpful_error_when_booking_blocks_with_captcha()
    {
        $captchaHtml = <<<'HTML'
        <html><head><title>Verify</title></head>
        <body>In order to continue, we need to verify that you're not a robot. This requires JavaScript. Enable JavaScript and then reload the page.</body></html>
        HTML;

        Http::fake(['*' => Http::response($captchaHtml, 200)]);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Booking.com blocks automated access');

        $scraper = new BookingScraper();
        $scraper->scrape('https://www.booking.com/hotel/cr/test.en.html');
    }

    private function buildFakeBookingHtml(array $listing): string
    {
        $amenityFeature = isset($listing['amenities'])
            ? array_map(fn ($a) => ['name' => $a], $listing['amenities'])
            : [];
        $locationParts = array_map('trim', explode(', ', $listing['location']));
        $jsonLdData = [
            '@context' => 'https://schema.org',
            '@type' => 'Hotel',
            'name' => $listing['name'],
            'description' => $listing['description'],
            'image' => [$listing['image']],
            'address' => [
                '@type' => 'PostalAddress',
                'addressLocality' => $locationParts[0] ?? '',
                'addressRegion' => $locationParts[1] ?? '',
                'addressCountry' => $locationParts[2] ?? '',
            ],
            'aggregateRating' => [
                '@type' => 'AggregateRating',
                'ratingValue' => $listing['rating'],
                'reviewCount' => $listing['reviews'],
            ],
            'offers' => [
                '@type' => 'Offer',
                'lowPrice' => 100,
                'priceCurrency' => 'USD',
            ],
        ];
        if (!empty($amenityFeature)) {
            $jsonLdData['amenityFeature'] = $amenityFeature;
        }
        $jsonLd = json_encode($jsonLdData);

        return <<<HTML
        <html>
        <head>
            <title>{$listing['name']} - Booking.com</title>
            <meta property="og:title" content="{$listing['name']} - Booking.com" />
            <meta property="og:description" content="{$listing['description']}" />
            <meta property="og:image" content="{$listing['image']}" />
            <script type="application/ld+json">{$jsonLd}</script>
        </head>
        <body></body>
        </html>
        HTML;
    }
}
