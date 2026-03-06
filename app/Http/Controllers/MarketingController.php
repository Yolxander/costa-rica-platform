<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class MarketingController extends Controller
{
    /**
     * Display the marketing page with properties for social caption generation.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $properties = Property::where('user_id', $user->id)
            ->get()
            ->map(function ($property) {
                return [
                    'id' => $property->id,
                    'name' => $property->name,
                    'location' => $property->location ?? 'Costa Rica',
                    'description' => $property->description ?? '',
                    'amenities' => $property->amenities ?? [],
                    'images' => $property->images ?? [],
                ];
            })
            ->toArray();

        return Inertia::render('marketing', [
            'properties' => $properties,
        ]);
    }

    /**
     * Generate a social media caption using the AI/ML API.
     */
    public function generateCaption(Request $request)
    {
        $request->validate(['property_id' => 'required|integer|exists:properties,id']);

        $property = Property::where('user_id', $request->user()->id)
            ->findOrFail($request->property_id);

        $apiKey = config('services.ai_ml.api_key');
        $apiUrl = config('services.ai_ml.api_url');
        $model = config('services.ai_ml.model');

        if (! $apiKey || ! $apiUrl) {
            return response()->json([
                'error' => 'AI/ML API is not configured. Set AI_ML_API_KEY and AI_ML_API_URL in .env.',
            ], 503);
        }

        $listingUrl = url(route('listing.detail', ['id' => $property->id]));
        $amenities = is_array($property->amenities) ? implode(', ', array_slice($property->amenities, 0, 5)) : '';

        $prompt = "Generate a short, engaging Instagram-style caption for a vacation rental in Costa Rica. "
            . "Property name: {$property->name}. Location: {$property->location}. "
            . "Description: " . substr($property->description ?? '', 0, 300) . ". "
            . "Amenities: {$amenities}. "
            . "Include a call-to-action to book. End with the listing URL: {$listingUrl}. "
            . "Do not include hashtags (they are added separately). Keep it under 200 words.";

        try {
            $path = config('services.ai_ml.path', '/chat/completions');
            $endpoint = rtrim($apiUrl, '/') . (str_starts_with($path, '/') ? $path : '/' . $path);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post($endpoint, [
                'model' => $model,
                'messages' => [
                    ['role' => 'user', 'content' => $prompt],
                ],
                'max_tokens' => 300,
            ]);

            if (! $response->successful()) {
                Log::warning('AI/ML API error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return response()->json([
                    'error' => 'Failed to generate caption: ' . $response->reason(),
                ], $response->status());
            }

            $data = $response->json();
            $caption = $data['choices'][0]['message']['content'] ?? null;

            if (! $caption) {
                return response()->json([
                    'error' => 'Invalid API response format.',
                ], 502);
            }

            return response()->json(['caption' => trim($caption)]);
        } catch (\Throwable $e) {
            Log::error('AI/ML API exception', ['message' => $e->getMessage()]);

            return response()->json([
                'error' => 'Caption generation failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}
