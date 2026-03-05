<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Services\AirbnbScraper;
use App\Services\BookingScraper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PropertyImportController extends Controller
{
    /**
     * Scrape a listing (Airbnb or Booking.com) and return a preview of the parsed data.
     */
    public function preview(Request $request, AirbnbScraper $airbnbScraper, BookingScraper $bookingScraper)
    {
        $request->validate([
            'url' => ['required', 'url', function ($attribute, $value, $fail) {
                if ($this->isAirbnbUrl($value) || $this->isBookingUrl($value)) {
                    return;
                }
                $fail('Please provide a valid Airbnb or Booking.com listing URL.');
            }],
        ], [
            'url.required' => 'Please enter a listing URL.',
            'url.url' => 'Please enter a valid URL.',
        ]);

        $url = $this->normalizeUrl($request->input('url'));
        $scraper = $this->isAirbnbUrl($url) ? $airbnbScraper : $bookingScraper;
        $sourceName = $this->isAirbnbUrl($url) ? 'Airbnb' : 'Booking.com';

        try {
            $data = $scraper->scrape($url);

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\RuntimeException $e) {
            $message = $e->getMessage();
            if (str_contains($message, 'Could not extract') && !str_contains($message, 'Add Property')) {
                $message = $sourceName === 'Booking.com'
                    ? 'Booking.com blocks automated access—add the property manually using "Add Property", or try importing from Airbnb instead.'
                    : "Could not extract listing data from this page. {$sourceName} may block automated access—try a different listing, or add the listing manually.";
            }
            return response()->json([
                'success' => false,
                'error' => $message,
            ], 422);
        } catch (\Exception $e) {
            Log::error('Property import failed', ['url' => $request->input('url'), 'error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'error' => 'An unexpected error occurred while importing the listing. Please try again.',
            ], 500);
        }
    }

    /**
     * Confirm and save the imported listing as a new Property.
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

        Property::create([
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

        return redirect()->route('listings')->with('success', 'Listing imported successfully!');
    }

    private function isAirbnbUrl(string $url): bool
    {
        return (bool) preg_match('/^https?:\/\/(www\.)?airbnb\.[a-z.]+\/rooms\/\d+/i', $url);
    }

    private function isBookingUrl(string $url): bool
    {
        return (bool) preg_match('/^https?:\/\/(www\.)?booking\.com\/hotel\/[a-z]{2}\/[\w-]+\.[a-z]{2}(-[a-z]{2})?\.html/i', $url);
    }

    private function normalizeUrl(string $url): string
    {
        $parsed = parse_url($url);
        if (!$parsed || !isset($parsed['host'], $parsed['path'])) {
            return $url;
        }
        $scheme = $parsed['scheme'] ?? 'https';

        if ($this->isAirbnbUrl($url) && preg_match('#/rooms/(\d+)#', $parsed['path'], $m)) {
            return "{$scheme}://{$parsed['host']}/rooms/{$m[1]}";
        }

        if ($this->isBookingUrl($url)) {
            $path = $parsed['path'] ?? '';
            return "{$scheme}://{$parsed['host']}{$path}";
        }

        return $url;
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
}
