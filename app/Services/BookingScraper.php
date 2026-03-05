<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class BookingScraper
{
    /**
     * Fetch and parse a Booking.com hotel page.
     *
     * @param string $url
     * @return array Parsed listing data
     * @throws \RuntimeException
     */
    public function scrape(string $url): array
    {
        $response = Http::withHeaders([
            'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language' => 'en-US,en;q=0.9',
            'Accept-Encoding' => 'gzip, deflate, br',
            'Referer' => 'https://www.booking.com/',
            'Sec-Fetch-Dest' => 'document',
            'Sec-Fetch-Mode' => 'navigate',
            'Sec-Fetch-Site' => 'none',
            'Upgrade-Insecure-Requests' => '1',
        ])->timeout(30)->get($url);

        if ($response->failed()) {
            throw new \RuntimeException('Failed to fetch the Booking.com listing. The page may be unavailable or the URL may be incorrect.');
        }

        $html = $response->body();

        if ($this->isBlockedOrCaptchaPage($html)) {
            throw new \RuntimeException(
                'Booking.com blocks automated access—they require JavaScript and often show a verification step. Please add this property manually using "Add Property" below, or try importing from Airbnb instead.'
            );
        }

        $data = $this->parseHtml($html, $url);

        if (empty($data['name'])) {
            throw new \RuntimeException(
                'Could not extract listing data from this page. Booking.com may block automated access—add the property manually using "Add Property", or try importing from Airbnb.'
            );
        }

        return $data;
    }

    protected function isBlockedOrCaptchaPage(string $html): bool
    {
        // Only detect strong bot-block indicators; avoid "enable javascript" which appears in noscript on normal pages
        $indicators = [
            "verify that you're not a robot",
            "verify you're not a robot",
            'unusual traffic from your computer',
            'blocked automated',
            'access denied',
            'request blocked',
        ];
        $lower = strtolower($html);
        foreach ($indicators as $needle) {
            if (str_contains($lower, $needle)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Parse listing data from the HTML response.
     */
    protected function parseHtml(string $html, string $url = ''): array
    {
        $data = [
            'name' => null,
            'description' => null,
            'images' => [],
            'location' => null,
            'type' => 'hotel',
            'base_price' => 0,
            'currency' => 'USD',
            'guests' => 1,
            'bedrooms' => 1,
            'bathrooms' => 1,
            'amenities' => [],
            'rating' => 0,
            'reviews' => 0,
        ];

        $jsonLdData = $this->extractJsonLd($html);
        if ($jsonLdData) {
            $data = $this->mergeJsonLdData($data, $jsonLdData);
        }

        $data = $this->extractMetaTags($data, $html);
        $data = $this->extractBootstrapAndHtml($data, $html);

        if (empty($data['name'])) {
            $data['name'] = $this->extractTitleTag($html);
        }
        if (empty($data['name']) && $url !== '') {
            $data['name'] = $this->extractNameFromUrl($url);
        }

        $data['name'] = $data['name'] ? trim($data['name']) : null;
        $data['description'] = $data['description'] ? trim($data['description']) : null;
        $data['base_price'] = max(0, (float) $data['base_price']);
        $data['guests'] = max(1, (int) $data['guests']);
        $data['bedrooms'] = max(0, (int) $data['bedrooms']);
        $data['bathrooms'] = max(1, (int) $data['bathrooms']);
        $data['rating'] = min(5, max(0, (float) $data['rating']));
        $data['reviews'] = max(0, (int) $data['reviews']);
        $data['amenities'] = $this->normalizeAmenities($data['amenities'] ?? []);

        return $data;
    }

    protected function extractJsonLd(string $html): ?array
    {
        if (!preg_match_all('/<script[^>]*type=["\']application\/ld\+json["\'][^>]*>(.*?)<\/script>/si', $html, $matches)) {
            return null;
        }

        foreach ($matches[1] as $json) {
            $decoded = json_decode(trim($json), true);
            if (!$decoded) continue;

            $type = $decoded['@type'] ?? '';
            if (in_array($type, ['Hotel', 'LodgingBusiness', 'Accommodation', 'Product']) || isset($decoded['name'])) {
                return $decoded;
            }
        }

        return null;
    }

    protected function mergeJsonLdData(array $data, array $jsonLd): array
    {
        if (!empty($jsonLd['name'])) {
            $data['name'] = $jsonLd['name'];
        }

        if (!empty($jsonLd['description'])) {
            $data['description'] = $jsonLd['description'];
        }

        if (!empty($jsonLd['image'])) {
            $images = is_array($jsonLd['image']) ? $jsonLd['image'] : [$jsonLd['image']];
            $data['images'] = array_values(array_filter(array_map(function ($img) {
                return is_string($img) ? $img : ($img['url'] ?? $img['contentUrl'] ?? null);
            }, $images)));
        }

        if (!empty($jsonLd['address'])) {
            $addr = $jsonLd['address'];
            if (is_string($addr)) {
                $data['location'] = $addr;
            } elseif (is_array($addr)) {
                $parts = array_filter([
                    $addr['addressLocality'] ?? null,
                    $addr['addressRegion'] ?? null,
                    $addr['addressCountry'] ?? null,
                ]);
                $data['location'] = implode(', ', $parts);
            }
        }

        if (!empty($jsonLd['aggregateRating'])) {
            $data['rating'] = (float) ($jsonLd['aggregateRating']['ratingValue'] ?? 0);
            $data['reviews'] = (int) ($jsonLd['aggregateRating']['reviewCount'] ?? 0);
        }

        if (!empty($jsonLd['offers'])) {
            $offers = $jsonLd['offers'];
            if (isset($offers['lowPrice'])) {
                $data['base_price'] = (float) $offers['lowPrice'];
            } elseif (isset($offers['price'])) {
                $data['base_price'] = (float) $offers['price'];
            }
            if (isset($offers['priceCurrency'])) {
                $data['currency'] = $offers['priceCurrency'];
            }
        }

        if (!empty($jsonLd['numberOfRooms'])) {
            $data['bedrooms'] = (int) $jsonLd['numberOfRooms'];
        }

        if (!empty($jsonLd['amenityFeature'])) {
            $amenities = $jsonLd['amenityFeature'];
            if (is_array($amenities)) {
                $extracted = array_values(array_filter(array_map(function ($a) {
                    $val = is_string($a) ? $a : ($a['name'] ?? $a['value'] ?? null);
                    return $val ? $this->stripBookingAmenityPrefix($val) : null;
                }, $amenities)));
                $data['amenities'] = array_merge($data['amenities'], $extracted);
            }
        }

        return $data;
    }

    protected function extractMetaTags(array $data, string $html): array
    {
        if (empty($data['name']) && preg_match('/<meta[^>]+property=["\']og:title["\'][^>]+content=["\']([^"\']+)["\']/', $html, $m)) {
            $name = html_entity_decode($m[1], ENT_QUOTES, 'UTF-8');
            $name = preg_replace('/\s*[-–—]\s*Booking\.com.*$/i', '', $name);
            $data['name'] = $name;
        }

        if (empty($data['description']) && preg_match('/<meta[^>]+property=["\']og:description["\'][^>]+content=["\']([^"\']+)["\']/', $html, $m)) {
            $data['description'] = html_entity_decode($m[1], ENT_QUOTES, 'UTF-8');
        }

        if (empty($data['images']) && preg_match_all('/<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']/', $html, $m)) {
            $data['images'] = $m[1];
        }

        if (empty($data['description']) && preg_match('/<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']/', $html, $m)) {
            $data['description'] = html_entity_decode($m[1], ENT_QUOTES, 'UTF-8');
        }

        return $data;
    }

    protected function extractBootstrapAndHtml(array $data, string $html): array
    {
        if ($data['base_price'] <= 0) {
            $data = $this->extractPriceFromHtml($data, $html);
        }

        if ($data['guests'] <= 1 && preg_match('/(\d+)\s*(?:guests?|people|occupancy)/i', $html, $m)) {
            $data['guests'] = (int) $m[1];
        }
        if ($data['bedrooms'] <= 1 && preg_match('/(\d+)\s*bedrooms?/i', $html, $m)) {
            $data['bedrooms'] = (int) $m[1];
        }
        if ($data['bathrooms'] <= 1 && preg_match('/(\d+)\s*bathrooms?/i', $html, $m)) {
            $data['bathrooms'] = (int) $m[1];
        }
        if ($data['reviews'] <= 0 && preg_match('/(\d+)\s*reviews?/i', $html, $m)) {
            $data['reviews'] = (int) $m[1];
        }

        $data = $this->extractAmenitiesFromHtml($data, $html);

        $typePatterns = [
            'villa' => '/\bvilla\b/i',
            'apartment' => '/\bapartment\b/i',
            'hostel' => '/\bhostel\b/i',
            'resort' => '/\bresort\b/i',
            'lodge' => '/\blodge\b/i',
        ];
        $text = ($data['name'] ?? '') . ' ' . ($data['description'] ?? '');
        foreach ($typePatterns as $type => $pattern) {
            if (preg_match($pattern, $text)) {
                $data['type'] = $type;
                break;
            }
        }

        return $data;
    }

    protected function extractPriceFromHtml(array $data, string $html): array
    {
        $patterns = [
            '/[\$€£]\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:per\s+night|night|\/night)/i',
            '/(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:USD|EUR|GBP|CAD|CRC)\s*(?:per\s+night|night)?/i',
            '/price[^0-9]*[\$€£]?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i',
            '/["\']price["\']\s*:\s*"?(\d+(?:\.\d+)?)"?/i',
            '/"lowPrice"\s*:\s*"?(\d+(?:\.\d+)?)"?/i',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $html, $m)) {
                $price = (float) str_replace(',', '', $m[1]);
                if ($price > 0 && $price < 100000) {
                    $data['base_price'] = $price;
                    break;
                }
            }
        }

        return $data;
    }

    protected function extractAmenitiesFromHtml(array $data, string $html): array
    {
        $commonAmenities = [
            'WiFi', 'Free WiFi', 'Air conditioning', 'Pool', 'Kitchen', 'Parking',
            'Restaurant', 'Bar', 'Spa', 'Gym', 'Beach access', 'Garden',
            'Room service', 'Non-smoking rooms', 'Pets allowed', 'Elevator',
        ];

        $found = [];
        foreach ($commonAmenities as $amenity) {
            if (preg_match('/' . preg_quote($amenity, '/') . '/i', $html)) {
                $found[] = $this->stripBookingAmenityPrefix($amenity);
            }
        }

        if (!empty($found)) {
            $data['amenities'] = array_merge($data['amenities'] ?? [], $found);
        }

        if (preg_match_all('/data-testid="[^"]*amenity[^"]*"[^>]*>([^<]+)</i', $html, $m)) {
            foreach ($m[1] as $txt) {
                $txt = trim(html_entity_decode(strip_tags($txt), ENT_QUOTES, 'UTF-8'));
                if (strlen($txt) > 0 && strlen($txt) <= 255) {
                    $data['amenities'][] = $this->stripBookingAmenityPrefix($txt);
                }
            }
        }

        return $data;
    }

    protected function stripBookingAmenityPrefix(string $amenity): string
    {
        return preg_replace('/^(Free\s+)+/i', '', trim($amenity));
    }

    protected function normalizeAmenities(array $amenities): array
    {
        $normalized = [];
        $seen = [];
        foreach ($amenities as $a) {
            $a = trim((string) $a);
            if ($a === '') continue;
            $a = substr($a, 0, 255);
            $key = strtolower($a);
            if (isset($seen[$key])) continue;
            $seen[$key] = true;
            $normalized[] = $a;
        }
        return array_values($normalized);
    }

    protected function extractTitleTag(string $html): ?string
    {
        if (preg_match('/<title[^>]*>(.*?)<\/title>/si', $html, $m)) {
            $title = html_entity_decode(trim($m[1]), ENT_QUOTES, 'UTF-8');
            $title = preg_replace('/\s*[-–—|]\s*Booking\.com.*$/i', '', $title);
            return $title ?: null;
        }
        return null;
    }

    /**
     * Extract a fallback name from the Booking.com URL slug (e.g. hotel-daleese -> Hotel Daleese).
     */
    protected function extractNameFromUrl(string $url): ?string
    {
        if (preg_match('#/hotel/[a-z]{2}/([^/.]+)\.#i', $url, $m)) {
            $slug = $m[1];
            $name = str_replace('-', ' ', $slug);
            return ucwords($name);
        }
        return null;
    }
}
