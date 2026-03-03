<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Services\AirbnbScraper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AirbnbImportController extends Controller
{
    /**
     * Scrape an Airbnb listing and return a preview of the parsed data.
     */
    public function preview(Request $request, AirbnbScraper $scraper)
    {
        $request->validate([
            'url' => ['required', 'url', 'regex:/^https?:\/\/(www\.)?airbnb\.[a-z.]+\/rooms\/\d+/i'],
        ], [
            'url.regex' => 'Please provide a valid Airbnb listing URL (e.g. https://www.airbnb.com/rooms/12345).',
        ]);

        $url = $this->normalizeListingUrl($request->input('url'));

        try {
            $data = $scraper->scrape($url);

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\RuntimeException $e) {
            $message = $e->getMessage();
            if (str_contains($message, 'Could not extract listing data')) {
                $message = 'Could not extract listing data from this page. Airbnb may block automated access—try a different listing, or add the listing manually.';
            }
            return response()->json([
                'success' => false,
                'error' => $message,
            ], 422);
        } catch (\Exception $e) {
            Log::error('Airbnb import failed', ['url' => $request->input('url'), 'error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'error' => 'An unexpected error occurred while importing the listing. Please try again.',
            ], 500);
        }
    }

    /**
     * Confirm and save the imported Airbnb listing as a new Property.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'type' => 'required|string|max:50',
            'location' => 'nullable|string|max:255',
            'base_price' => 'required|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'guests' => 'required|integer|min:1',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'required|integer|min:1',
            'amenities' => 'nullable|array',
            'amenities.*' => 'string|max:255',
            'images' => 'nullable|array',
            'images.*' => 'url|max:2048',
            'rating' => 'nullable|numeric|min:0|max:5',
            'reviews' => 'nullable|integer|min:0',
        ]);

        $basePrice = (float) $validated['base_price'];
        $currency = $validated['currency'] ?? 'USD';
        $priceFormat = $this->formatPrice($basePrice, $currency);

        $property = Property::create([
            'user_id' => $request->user()->id,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'type' => $validated['type'],
            'status' => 'Active',
            'approval_status' => 'pending',
            'location' => $validated['location'] ?? 'Costa Rica',
            'base_price' => $basePrice,
            'price_format' => $priceFormat,
            'currency' => $currency,
            'guests' => $validated['guests'],
            'bedrooms' => $validated['bedrooms'],
            'bathrooms' => $validated['bathrooms'],
            'amenities' => $validated['amenities'] ?? [],
            'images' => $validated['images'] ?? [],
            'rating' => $validated['rating'] ?? 0,
            'reviews' => $validated['reviews'] ?? 0,
        ]);

        return redirect()->route('listings')->with('success', 'Listing imported successfully from Airbnb!');
    }

    private function formatPrice(float $basePrice, string $currency): string
    {
        if ($basePrice <= 0) {
            return '';
        }
        $symbols = ['USD' => '$', 'EUR' => '€', 'GBP' => '£', 'CAD' => 'CA$', 'CRC' => '₡'];
        $symbol = $symbols[strtoupper($currency)] ?? strtoupper($currency) . ' ';
        return $symbol . number_format($basePrice, 0) . '/night';
    }

    private function normalizeListingUrl(string $url): string
    {
        $parsed = parse_url($url);
        if (! $parsed || ! isset($parsed['host'], $parsed['path'])) {
            return $url;
        }
        if (preg_match('#/rooms/(\d+)#', $parsed['path'], $m)) {
            $scheme = $parsed['scheme'] ?? 'https';
            return "{$scheme}://{$parsed['host']}/rooms/{$m[1]}";
        }
        return $url;
    }
}
