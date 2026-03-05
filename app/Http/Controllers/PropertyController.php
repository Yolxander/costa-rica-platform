<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PropertyController extends Controller
{
    /**
     * Validation rules for create.
     */
    protected function storeRules(): array
    {
        return [
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
            'house_rules' => 'nullable|array',
            'house_rules.*' => 'string|max:500',
            'policies' => 'nullable|array',
            'policies.*' => 'string|max:500',
            'image_urls' => 'nullable|array',
            'image_urls.*' => 'url|max:2048',
            'image_files' => 'nullable|array',
            'image_files.*' => 'file|image|max:5120',
        ];
    }

    /**
     * Validation rules for update (all optional for partial updates).
     */
    protected function updateRules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'type' => 'sometimes|required|string|max:50',
            'location' => 'nullable|string|max:255',
            'base_price' => 'sometimes|required|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'guests' => 'sometimes|required|integer|min:1',
            'bedrooms' => 'sometimes|required|integer|min:0',
            'bathrooms' => 'sometimes|required|integer|min:1',
            'amenities' => 'nullable|array',
            'amenities.*' => 'string|max:255',
            'house_rules' => 'nullable|array',
            'house_rules.*' => 'string|max:500',
            'policies' => 'nullable|array',
            'policies.*' => 'string|max:500',
            'image_urls' => 'nullable|array',
            'image_urls.*' => 'url|max:2048',
            'image_files' => 'nullable|array',
            'image_files.*' => 'file|image|max:5120',
        ];
    }

    /**
     * Store a newly created property.
     */
    public function store(Request $request)
    {
        $validated = $request->validate($this->storeRules());

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
            'house_rules' => $validated['house_rules'] ?? [],
            'policies' => $validated['policies'] ?? [],
            'images' => $validated['image_urls'] ?? [],
            'rating' => 0,
            'reviews' => 0,
        ]);

        // Handle file uploads
        $imageUrls = $validated['image_urls'] ?? [];
        if ($request->hasFile('image_files')) {
            foreach ($request->file('image_files') as $file) {
                $path = $file->store("properties/{$property->id}", 'public');
                $imageUrls[] = Storage::disk('public')->url($path);
            }
            $property->update(['images' => $imageUrls]);
        }

        return redirect()->route('listings')->with('success', 'Property created successfully!');
    }

    /**
     * Update the specified property.
     */
    public function update(Request $request, string $id)
    {
        $property = Property::findOrFail($id);

        if ($property->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate($this->updateRules());

        $updateData = [];

        if (isset($validated['name'])) {
            $updateData['name'] = $validated['name'];
        }
        if (array_key_exists('description', $validated)) {
            $updateData['description'] = $validated['description'];
        }
        if (isset($validated['type'])) {
            $updateData['type'] = $validated['type'];
        }
        if (array_key_exists('location', $validated)) {
            $updateData['location'] = $validated['location'] ?? 'Costa Rica';
        }
        if (isset($validated['base_price'])) {
            $basePrice = (float) $validated['base_price'];
            $currency = $validated['currency'] ?? $property->currency ?? 'USD';
            $updateData['base_price'] = $basePrice;
            $updateData['price_format'] = $this->formatPrice($basePrice, $currency);
        }
        if (isset($validated['currency'])) {
            $updateData['currency'] = $validated['currency'];
        }
        if (isset($validated['guests'])) {
            $updateData['guests'] = $validated['guests'];
        }
        if (isset($validated['bedrooms'])) {
            $updateData['bedrooms'] = $validated['bedrooms'];
        }
        if (isset($validated['bathrooms'])) {
            $updateData['bathrooms'] = $validated['bathrooms'];
        }
        if (array_key_exists('amenities', $validated)) {
            $updateData['amenities'] = $validated['amenities'] ?? [];
        }
        if (array_key_exists('house_rules', $validated)) {
            $updateData['house_rules'] = $validated['house_rules'] ?? [];
        }
        if (array_key_exists('policies', $validated)) {
            $updateData['policies'] = $validated['policies'] ?? [];
        }

        // Merge image URLs with uploaded files
        $imageUrls = $validated['image_urls'] ?? $property->images ?? [];
        if ($request->hasFile('image_files')) {
            foreach ($request->file('image_files') as $file) {
                $path = $file->store("properties/{$property->id}", 'public');
                $imageUrls[] = Storage::disk('public')->url($path);
            }
        }
        if (array_key_exists('image_urls', $validated) || $request->hasFile('image_files')) {
            $updateData['images'] = is_array($imageUrls) ? $imageUrls : [];
        }

        $property->update($updateData);

        return redirect()->back()->with('success', 'Property updated successfully!');
    }

    /**
     * Remove the specified property.
     */
    public function destroy(Request $request, string $id)
    {
        $property = Property::findOrFail($id);

        if ($property->user_id !== $request->user()->id) {
            abort(403);
        }

        // Optionally delete stored images
        $path = "properties/{$property->id}";
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->deleteDirectory($path);
        }

        $property->delete();

        return redirect()->route('listings')->with('success', 'Property deleted successfully.');
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
