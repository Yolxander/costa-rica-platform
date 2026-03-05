<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AirbnbScraper
{
    /**
     * Fetch and parse an Airbnb listing page.
     *
     * @param string $url
     * @return array Parsed listing data
     * @throws \RuntimeException
     */
    public function scrape(string $url): array
    {
        $response = Http::withHeaders([
            'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language' => 'en-US,en;q=0.9',
        ])->timeout(30)->get($url);

        if ($response->failed()) {
            throw new \RuntimeException('Failed to fetch the Airbnb listing. The page may be unavailable or the URL may be incorrect.');
        }

        $html = $response->body();

        $data = $this->parseHtml($html);

        if (empty($data['name'])) {
            throw new \RuntimeException('Could not extract listing data from the page. Please verify the URL points to a valid Airbnb listing.');
        }

        return $data;
    }

    /**
     * Parse listing data from the HTML response.
     */
    protected function parseHtml(string $html): array
    {
        $data = [
            'name' => null,
            'description' => null,
            'images' => [],
            'location' => null,
            'type' => 'house',
            'base_price' => 0,
            'currency' => 'USD',
            'guests' => 1,
            'bedrooms' => 1,
            'bathrooms' => 1,
            'amenities' => [],
            'rating' => 0,
            'reviews' => 0,
        ];

        // Strategy 1: Extract JSON-LD structured data
        $jsonLdData = $this->extractJsonLd($html);
        if ($jsonLdData) {
            $data = $this->mergeJsonLdData($data, $jsonLdData);
        }

        // Strategy 2: Extract from meta tags (fallback / supplement)
        $data = $this->extractMetaTags($data, $html);

        // Strategy 3: Extract from Airbnb's bootstrapped data in script tags
        $data = $this->extractBootstrapData($data, $html);

        // Strategy 4: Extract from HTML title tag as last resort for name
        if (empty($data['name'])) {
            $data['name'] = $this->extractTitleTag($html);
        }

        // Clean up
        $data['name'] = $data['name'] ? trim($data['name']) : null;
        $data['description'] = $data['description'] ? trim($data['description']) : null;
        $data['base_price'] = max(0, (float) $data['base_price']);
        $data['guests'] = max(1, (int) $data['guests']);
        $data['bedrooms'] = max(0, (int) $data['bedrooms']);
        $data['bathrooms'] = max(1, (int) $data['bathrooms']);
        $data['rating'] = min(5, max(0, (float) $data['rating']));
        $data['reviews'] = max(0, (int) $data['reviews']);

        return $data;
    }

    /**
     * Extract JSON-LD structured data from the HTML.
     */
    protected function extractJsonLd(string $html): ?array
    {
        if (!preg_match_all('/<script[^>]*type=["\']application\/ld\+json["\'][^>]*>(.*?)<\/script>/si', $html, $matches)) {
            return null;
        }

        foreach ($matches[1] as $json) {
            $decoded = json_decode(trim($json), true);
            if (!$decoded) continue;

            // Look for VacationRental, LodgingBusiness, Product, or similar types
            $type = $decoded['@type'] ?? '';
            if (in_array($type, ['VacationRental', 'LodgingBusiness', 'Hotel', 'Product', 'Accommodation', 'House', 'Apartment']) ||
                isset($decoded['name'])) {
                return $decoded;
            }
        }

        return null;
    }

    /**
     * Merge JSON-LD data into the result array.
     */
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
            // Handle nested image objects
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
            if (isset($offers['price'])) {
                $data['base_price'] = (float) $offers['price'];
            } elseif (isset($offers['lowPrice'])) {
                $data['base_price'] = (float) $offers['lowPrice'];
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
                $data['amenities'] = array_values(array_filter(array_map(function ($a) {
                    return is_string($a) ? $a : ($a['name'] ?? $a['value'] ?? null);
                }, $amenities)));
            }
        }

        return $data;
    }

    /**
     * Extract data from Open Graph and other meta tags.
     */
    protected function extractMetaTags(array $data, string $html): array
    {
        // OG title
        if (empty($data['name']) && preg_match('/<meta[^>]+property=["\']og:title["\'][^>]+content=["\']([^"\']+)["\']/', $html, $m)) {
            $name = html_entity_decode($m[1], ENT_QUOTES, 'UTF-8');
            // Remove common suffixes like " - Airbnb"
            $name = preg_replace('/\s*[-–—]\s*Airbnb.*$/i', '', $name);
            $data['name'] = $name;
        }

        // OG description
        if (empty($data['description']) && preg_match('/<meta[^>]+property=["\']og:description["\'][^>]+content=["\']([^"\']+)["\']/', $html, $m)) {
            $data['description'] = html_entity_decode($m[1], ENT_QUOTES, 'UTF-8');
        }

        // OG image
        if (empty($data['images'])) {
            if (preg_match_all('/<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']/', $html, $m)) {
                $data['images'] = $m[1];
            }
        }

        // Description meta tag fallback
        if (empty($data['description']) && preg_match('/<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']/', $html, $m)) {
            $data['description'] = html_entity_decode($m[1], ENT_QUOTES, 'UTF-8');
        }

        return $data;
    }

    /**
     * Extract data from Airbnb's bootstrapped __NEXT_DATA__ or similar script tags.
     */
    protected function extractBootstrapData(array $data, string $html): array
    {
        // Look for __NEXT_DATA__ or deferred_state JSON
        $patterns = [
            '/<script[^>]*id=["\']__NEXT_DATA__["\'][^>]*>(.*?)<\/script>/si',
            '/<!--\s*(\{.*?"listing".*?\})\s*-->/si',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $html, $match)) {
                $bootstrapData = json_decode($match[1], true);
                if ($bootstrapData) {
                    $data = $this->extractFromBootstrap($data, $bootstrapData);
                    break;
                }
            }
        }

        // Strategy 4b: Extract price from HTML text patterns (e.g. "$150", "€120", "150 USD")
        if ($data['base_price'] <= 0) {
            $data = $this->extractPriceFromHtml($data, $html);
        }

        // Try to extract capacity info from visible text patterns
        if ($data['guests'] <= 1) {
            if (preg_match('/(\d+)\s*guests?/i', $html, $m)) {
                $data['guests'] = (int) $m[1];
            }
        }
        if ($data['bedrooms'] <= 1) {
            if (preg_match('/(\d+)\s*bedrooms?/i', $html, $m)) {
                $data['bedrooms'] = (int) $m[1];
            }
        }
        if ($data['bathrooms'] <= 1) {
            if (preg_match('/(\d+)\s*bathrooms?/i', $html, $m)) {
                $data['bathrooms'] = (int) $m[1];
            }
        }
        if ($data['reviews'] <= 0) {
            if (preg_match('/(\d+)\s*reviews?/i', $html, $m)) {
                $data['reviews'] = (int) $m[1];
            } elseif (preg_match('/["\']reviewCount["\']\s*:\s*(\d+)/i', $html, $m)) {
                $data['reviews'] = (int) $m[1];
            } elseif (preg_match('/["\']reviewsCount["\']\s*:\s*(\d+)/i', $html, $m)) {
                $data['reviews'] = (int) $m[1];
            }
        }

        // Extract amenities from HTML (supplements JSON-LD/bootstrap)
        $data = $this->extractAmenitiesFromHtml($data, $html);
        $data['amenities'] = $this->normalizeAmenities($data['amenities'] ?? []);

        // Extract property type from text
        $typePatterns = [
            'villa' => '/\bvilla\b/i',
            'apartment' => '/\bapartment\b/i',
            'condo' => '/\bcondo(?:minium)?\b/i',
            'house' => '/\bhouse\b/i',
            'cabin' => '/\bcabin\b/i',
            'cottage' => '/\bcottage\b/i',
            'studio' => '/\bstudio\b/i',
            'loft' => '/\bloft\b/i',
            'bungalow' => '/\bbungalow\b/i',
            'treehouse' => '/\btreehouse\b/i',
        ];

        $titleAndDesc = ($data['name'] ?? '') . ' ' . ($data['description'] ?? '');
        foreach ($typePatterns as $type => $pattern) {
            if (preg_match($pattern, $titleAndDesc)) {
                $data['type'] = $type;
                break;
            }
        }

        return $data;
    }

    /**
     * Recursively search bootstrap data for listing information.
     */
    protected function extractFromBootstrap(array $data, array $bootstrap): array
    {
        // Search for listing data recursively (Airbnb nests it deep in the JSON)
        $listing = $this->findNestedKey($bootstrap, 'listing');
        if (!$listing) {
            $listing = $this->findNestedKey($bootstrap, 'pdpListing');
        }

        if ($listing && is_array($listing)) {
            if (empty($data['name']) && !empty($listing['name'])) {
                $data['name'] = $listing['name'];
            }
            if (!empty($listing['personCapacity'])) {
                $data['guests'] = (int) $listing['personCapacity'];
            }
            if (!empty($listing['bedroomCount']) || !empty($listing['bedrooms'])) {
                $data['bedrooms'] = (int) ($listing['bedroomCount'] ?? $listing['bedrooms']);
            }
            if (!empty($listing['bathroomCount']) || !empty($listing['bathrooms'])) {
                $data['bathrooms'] = (int) ($listing['bathroomCount'] ?? $listing['bathrooms']);
            }
            if (!empty($listing['photos'])) {
                $photos = array_map(function ($p) {
                    return $p['large'] ?? $p['picture'] ?? $p['url'] ?? null;
                }, $listing['photos']);
                $data['images'] = array_merge($data['images'], array_filter($photos));
            }
            if (empty($data['amenities'])) {
                $amenitiesData = $listing['listingAmenities'] ?? $listing['listing_amenities'] ?? $listing['amenities'] ?? null;
                if (!empty($amenitiesData)) {
                    $data['amenities'] = $this->extractAmenitiesFromBootstrap($amenitiesData);
                }
            }
            if (!empty($listing['lat']) && !empty($listing['lng'])) {
                // Keep existing location if we already have one
            }
            if (!empty($listing['locationTitle'])) {
                $data['location'] = $listing['locationTitle'];
            }
            if ($data['reviews'] <= 0) {
                $reviews = $listing['reviewsCount'] ?? $listing['reviewCount'] ?? $listing['numberOfReviews']
                    ?? $listing['reviews']['count'] ?? $listing['reviews'] ?? null;
                if (is_numeric($reviews)) {
                    $data['reviews'] = (int) $reviews;
                } elseif (is_array($reviews) && isset($reviews['count'])) {
                    $data['reviews'] = (int) $reviews['count'];
                }
            }
            if (empty($data['rating']) && !empty($listing['starRating']) && is_numeric($listing['starRating'])) {
                $data['rating'] = (float) $listing['starRating'];
            }
            if ($data['base_price'] <= 0) {
                $price = $listing['price']['rate'] ?? $listing['price']['total'] ?? $listing['price'] ?? null;
                if (is_numeric($price)) {
                    $data['base_price'] = (float) $price;
                } elseif (is_array($price) && isset($price['amount'])) {
                    $data['base_price'] = (float) $price['amount'];
                }
                $pricingQuote = $listing['pricingQuote'] ?? $listing['priceDetails'] ?? null;
                if (is_array($pricingQuote)) {
                    $rate = $pricingQuote['rate']['amount'] ?? $pricingQuote['price']['total']['amount'] ?? $pricingQuote['rate'] ?? $pricingQuote['price'] ?? null;
                    if (is_numeric($rate) && $data['base_price'] <= 0) {
                        $data['base_price'] = (float) $rate;
                    }
                }
                if (!empty($listing['currency'])) {
                    $data['currency'] = $listing['currency'];
                }
            }
        }

        return $data;
    }

    /**
     * Extract amenity strings from Airbnb bootstrap listingAmenities/amenities.
     */
    protected function extractAmenitiesFromBootstrap(mixed $amenitiesData): array
    {
        $result = [];
        if (is_array($amenitiesData)) {
            foreach ($amenitiesData as $item) {
                if (is_string($item)) {
                    $result[] = trim($item);
                } elseif (is_array($item)) {
                    $name = $item['title'] ?? $item['name'] ?? $item['label'] ?? $item['value'] ?? null;
                    if (is_string($name) && $name !== '') {
                        $result[] = trim($name);
                    }
                }
            }
        }
        return array_values(array_filter($result));
    }

    /**
     * Extract amenities from HTML using common patterns.
     */
    protected function extractAmenitiesFromHtml(array $data, string $html): array
    {
        $commonAmenities = [
            'WiFi', 'Wifi', 'Pool', 'Kitchen', 'Parking', 'Air conditioning',
            'Gym', 'Washer', 'Dryer', 'TV', 'Workspace', 'Pets allowed',
        ];
        $found = [];
        foreach ($commonAmenities as $amenity) {
            if (preg_match('/' . preg_quote($amenity, '/') . '/i', $html)) {
                $found[] = $amenity;
            }
        }
        if (!empty($found)) {
            $data['amenities'] = array_merge($data['amenities'] ?? [], $found);
        }
        if (preg_match_all('/data-amenity="([^"]+)"/i', $html, $m)) {
            foreach ($m[1] as $txt) {
                $txt = trim(html_entity_decode($txt, ENT_QUOTES, 'UTF-8'));
                if (strlen($txt) > 0 && strlen($txt) <= 255) {
                    $data['amenities'][] = $txt;
                }
            }
        }
        return $data;
    }

    /**
     * Normalize and deduplicate amenities array.
     */
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

    /**
     * Extract price from HTML using common patterns.
     */
    protected function extractPriceFromHtml(array $data, string $html): array
    {
        $patterns = [
            '/[\$€£]\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:per\s+night|night|\/night)/i',
            '/(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:USD|EUR|GBP|CAD|CRC)\s*(?:per\s+night|night|\/night)?/i',
            '/price[^0-9]*[\$€£]?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i',
            '/["\']price["\']\s*:\s*(\d+(?:\.\d+)?)/i',
            '/"amount"\s*:\s*"(\d+(?:\.\d+)?)"/i',
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

    /**
     * Recursively find a key in a nested array (limited depth to prevent runaway).
     */
    protected function findNestedKey(array $array, string $key, int $depth = 0): mixed
    {
        if ($depth > 10) return null;

        if (isset($array[$key]) && is_array($array[$key])) {
            return $array[$key];
        }

        foreach ($array as $value) {
            if (is_array($value)) {
                $result = $this->findNestedKey($value, $key, $depth + 1);
                if ($result !== null) {
                    return $result;
                }
            }
        }

        return null;
    }

    /**
     * Extract the page title as a fallback for the listing name.
     */
    protected function extractTitleTag(string $html): ?string
    {
        if (preg_match('/<title[^>]*>(.*?)<\/title>/si', $html, $m)) {
            $title = html_entity_decode(trim($m[1]), ENT_QUOTES, 'UTF-8');
            // Remove common suffixes
            $title = preg_replace('/\s*[-–—|]\s*(Airbnb|Vacation Rentals).*$/i', '', $title);
            return $title ?: null;
        }
        return null;
    }
}
