<?php

namespace Tests\Feature;

use App\Models\Property;
use App\Models\User;
use App\Services\AirbnbScraper;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AirbnbImportTest extends TestCase
{
    use RefreshDatabase;

    // --- Route Access Tests ---

    public function test_guests_cannot_access_import_page()
    {
        $this->get(route('import-airbnb'))->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_access_import_page()
    {
        $this->actingAs(User::factory()->create());
        $this->get(route('import-airbnb'))->assertOk();
    }

    public function test_guests_cannot_call_preview_endpoint()
    {
        $this->postJson(route('import-airbnb.preview'), [
            'url' => 'https://www.airbnb.com/rooms/12345',
        ])->assertUnauthorized();
    }

    public function test_guests_cannot_call_store_endpoint()
    {
        $this->post(route('import-airbnb.store'), [
            'name' => 'Test',
            'type' => 'house',
            'base_price' => 100,
            'guests' => 2,
            'bedrooms' => 1,
            'bathrooms' => 1,
        ])->assertRedirect(route('login'));
    }

    // --- Validation Tests ---

    public function test_preview_requires_url()
    {
        $this->actingAs(User::factory()->create());

        $this->postJson(route('import-airbnb.preview'), [])
            ->assertStatus(422)
            ->assertJsonValidationErrors('url');
    }

    public function test_preview_rejects_non_airbnb_url()
    {
        $this->actingAs(User::factory()->create());

        $this->postJson(route('import-airbnb.preview'), [
            'url' => 'https://www.booking.com/hotel/12345',
        ])->assertStatus(422)
            ->assertJsonValidationErrors('url');
    }

    public function test_preview_rejects_invalid_airbnb_url_format()
    {
        $this->actingAs(User::factory()->create());

        $this->postJson(route('import-airbnb.preview'), [
            'url' => 'https://www.airbnb.com/experiences/12345',
        ])->assertStatus(422)
            ->assertJsonValidationErrors('url');
    }

    public function test_store_validates_required_fields()
    {
        $this->actingAs(User::factory()->create());

        $this->post(route('import-airbnb.store'), [])
            ->assertSessionHasErrors(['name', 'type', 'base_price', 'guests', 'bedrooms', 'bathrooms']);
    }

    // --- Preview / Scraper Tests ---

    public function test_preview_returns_parsed_data_from_airbnb()
    {
        $this->actingAs(User::factory()->create());

        $fakeHtml = $this->buildFakeAirbnbHtml([
            'name' => 'Beautiful Beach Villa',
            'description' => 'A stunning villa by the ocean.',
            'image' => 'https://example.com/photo1.jpg',
            'location' => 'Tamarindo, Guanacaste, Costa Rica',
            'rating' => 4.85,
            'reviews' => 120,
        ]);

        Http::fake([
            'www.airbnb.com/*' => Http::response($fakeHtml, 200),
        ]);

        $response = $this->postJson(route('import-airbnb.preview'), [
            'url' => 'https://www.airbnb.com/rooms/12345',
        ]);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Beautiful Beach Villa',
                    'description' => 'A stunning villa by the ocean.',
                ],
            ]);

        $data = $response->json('data');
        $this->assertNotEmpty($data['images']);
        $this->assertEquals('Tamarindo, Guanacaste, Costa Rica', $data['location']);
    }

    public function test_preview_handles_fetch_failure()
    {
        $this->actingAs(User::factory()->create());

        Http::fake([
            'www.airbnb.com/*' => Http::response('', 404),
        ]);

        $this->postJson(route('import-airbnb.preview'), [
            'url' => 'https://www.airbnb.com/rooms/99999999999',
        ])->assertStatus(422)
            ->assertJson(['success' => false]);
    }

    public function test_preview_handles_page_without_listing_data()
    {
        $this->actingAs(User::factory()->create());

        Http::fake([
            'www.airbnb.com/*' => Http::response('<html><head><title></title></head><body>No data</body></html>', 200),
        ]);

        $this->postJson(route('import-airbnb.preview'), [
            'url' => 'https://www.airbnb.com/rooms/99999999999',
        ])->assertStatus(422)
            ->assertJson(['success' => false]);
    }

    // --- Store / Save Tests ---

    public function test_store_creates_property_for_authenticated_user()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->post(route('import-airbnb.store'), [
            'name' => 'Imported Villa',
            'description' => 'A beautiful imported villa.',
            'type' => 'villa',
            'location' => 'Manuel Antonio, Costa Rica',
            'base_price' => 250.00,
            'currency' => 'USD',
            'guests' => 6,
            'bedrooms' => 3,
            'bathrooms' => 2,
            'amenities' => ['WiFi', 'Pool', 'Kitchen'],
            'images' => ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
            'rating' => 4.9,
            'reviews' => 45,
        ])->assertRedirect(route('listings'));

        $this->assertDatabaseHas('properties', [
            'user_id' => $user->id,
            'name' => 'Imported Villa',
            'type' => 'villa',
            'location' => 'Manuel Antonio, Costa Rica',
            'guests' => 6,
            'bedrooms' => 3,
            'bathrooms' => 2,
            'status' => 'Active',
            'approval_status' => 'pending',
        ]);

        $property = Property::where('user_id', $user->id)->first();
        $this->assertEquals(['WiFi', 'Pool', 'Kitchen'], $property->amenities);
        $this->assertCount(2, $property->images);
    }

    public function test_store_uses_defaults_for_optional_fields()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->post(route('import-airbnb.store'), [
            'name' => 'Minimal Import',
            'type' => 'house',
            'base_price' => 100,
            'guests' => 2,
            'bedrooms' => 1,
            'bathrooms' => 1,
        ])->assertRedirect(route('listings'));

        $this->assertDatabaseHas('properties', [
            'user_id' => $user->id,
            'name' => 'Minimal Import',
            'currency' => 'USD',
            'location' => 'Costa Rica',
        ]);
    }

    // --- Scraper Unit Tests ---

    public function test_scraper_extracts_json_ld_data()
    {
        $html = $this->buildFakeAirbnbHtml([
            'name' => 'Jungle Retreat',
            'description' => 'Surrounded by nature.',
            'image' => 'https://example.com/jungle.jpg',
            'location' => 'Uvita, Puntarenas, Costa Rica',
            'rating' => 4.7,
            'reviews' => 30,
        ]);

        Http::fake([
            '*' => Http::response($html, 200),
        ]);

        $scraper = new AirbnbScraper();
        $data = $scraper->scrape('https://www.airbnb.com/rooms/54321');

        $this->assertEquals('Jungle Retreat', $data['name']);
        $this->assertEquals('Surrounded by nature.', $data['description']);
        $this->assertContains('https://example.com/jungle.jpg', $data['images']);
        $this->assertEquals('Uvita, Puntarenas, Costa Rica', $data['location']);
        $this->assertEquals(4.7, $data['rating']);
        $this->assertEquals(30, $data['reviews']);
    }

    public function test_scraper_extracts_meta_tags_as_fallback()
    {
        $html = <<<HTML
        <html>
        <head>
            <title>Cozy Cabin - Airbnb</title>
            <meta property="og:title" content="Cozy Cabin in the Mountains - Airbnb" />
            <meta property="og:description" content="A warm and cozy cabin for your mountain escape." />
            <meta property="og:image" content="https://example.com/cabin.jpg" />
        </head>
        <body>
            <div>2 guests</div>
            <div>1 bedroom</div>
            <div>1 bathroom</div>
        </body>
        </html>
        HTML;

        Http::fake([
            '*' => Http::response($html, 200),
        ]);

        $scraper = new AirbnbScraper();
        $data = $scraper->scrape('https://www.airbnb.com/rooms/67890');

        $this->assertEquals('Cozy Cabin in the Mountains', $data['name']);
        $this->assertEquals('A warm and cozy cabin for your mountain escape.', $data['description']);
        $this->assertContains('https://example.com/cabin.jpg', $data['images']);
        $this->assertEquals(2, $data['guests']);
        $this->assertEquals('cabin', $data['type']);
    }

    public function test_scraper_extracts_capacity_from_text()
    {
        $html = <<<HTML
        <html>
        <head>
            <title>Nice Place - Airbnb</title>
            <meta property="og:title" content="Nice Place" />
        </head>
        <body>
            <span>8 guests</span>
            <span>4 bedrooms</span>
            <span>3 bathrooms</span>
        </body>
        </html>
        HTML;

        Http::fake([
            '*' => Http::response($html, 200),
        ]);

        $scraper = new AirbnbScraper();
        $data = $scraper->scrape('https://www.airbnb.com/rooms/11111');

        $this->assertEquals(8, $data['guests']);
        $this->assertEquals(4, $data['bedrooms']);
        $this->assertEquals(3, $data['bathrooms']);
    }

    public function test_scraper_throws_on_http_failure()
    {
        Http::fake([
            '*' => Http::response('', 500),
        ]);

        $this->expectException(\RuntimeException::class);

        $scraper = new AirbnbScraper();
        $scraper->scrape('https://www.airbnb.com/rooms/00000');
    }

    public function test_scraper_throws_when_no_data_found()
    {
        Http::fake([
            '*' => Http::response('<html><head><title></title></head><body></body></html>', 200),
        ]);

        $this->expectException(\RuntimeException::class);

        $scraper = new AirbnbScraper();
        $scraper->scrape('https://www.airbnb.com/rooms/00000');
    }

    // --- Helpers ---

    private function buildFakeAirbnbHtml(array $listing): string
    {
        $jsonLd = json_encode([
            '@context' => 'https://schema.org',
            '@type' => 'VacationRental',
            'name' => $listing['name'],
            'description' => $listing['description'],
            'image' => [$listing['image']],
            'address' => [
                '@type' => 'PostalAddress',
                'addressLocality' => explode(', ', $listing['location'])[0] ?? '',
                'addressRegion' => explode(', ', $listing['location'])[1] ?? '',
                'addressCountry' => explode(', ', $listing['location'])[2] ?? '',
            ],
            'aggregateRating' => [
                '@type' => 'AggregateRating',
                'ratingValue' => $listing['rating'],
                'reviewCount' => $listing['reviews'],
            ],
        ]);

        return <<<HTML
        <html>
        <head>
            <title>{$listing['name']} - Airbnb</title>
            <meta property="og:title" content="{$listing['name']} - Airbnb" />
            <meta property="og:description" content="{$listing['description']}" />
            <meta property="og:image" content="{$listing['image']}" />
            <script type="application/ld+json">{$jsonLd}</script>
        </head>
        <body>
            <div>6 guests</div>
            <div>3 bedrooms</div>
            <div>2 bathrooms</div>
        </body>
        </html>
        HTML;
    }
}
