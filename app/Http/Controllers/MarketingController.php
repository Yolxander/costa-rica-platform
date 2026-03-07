<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
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
                    'guests' => $property->guests,
                    'rating' => $property->rating ? (float) $property->rating : null,
                ];
            })
            ->toArray();

        $segments = $this->getEmailSegmentCounts($user->id);
        $propertyCounts = $this->getEmailPropertyCounts($user->id);

        return Inertia::render('marketing', [
            'properties' => $properties,
            'emailSegments' => $segments,
            'emailPropertyCounts' => $propertyCounts,
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

    /**
     * Understand the user's email intent and return a summary for confirmation.
     */
    public function understandEmailIntent(Request $request)
    {
        $request->validate(['prompt' => 'required|string|max:1000']);

        $apiKey = config('services.ai_ml.api_key');
        $apiUrl = config('services.ai_ml.api_url');
        $model = config('services.ai_ml.model');

        if (! $apiKey || ! $apiUrl) {
            return response()->json([
                'error' => 'AI/ML API is not configured.',
            ], 503);
        }

        $userPrompt = $request->prompt;
        $prompt = "The user is a vacation rental host in Costa Rica. They want to send an email to their guests. "
            . "User request: \"{$userPrompt}\". "
            . "Respond with a brief 2-3 sentence summary of what you understood the email should be about. "
            . "Be specific and mention: the purpose (e.g. feedback request, promo, rebooking invite), who it's for, and the tone. "
            . "Do NOT generate the email. Only summarize your understanding. "
            . "Use Costa Rica and vacation rental context. Keep it concise.";

        try {
            $path = config('services.ai_ml.path', '/chat/completions');
            $endpoint = rtrim($apiUrl, '/') . (str_starts_with($path, '/') ? $path : '/' . $path);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(20)->post($endpoint, [
                'model' => $model,
                'messages' => [['role' => 'user', 'content' => $prompt]],
                'max_tokens' => 200,
            ]);

            if (! $response->successful()) {
                return response()->json([
                    'error' => 'Failed to understand: ' . $response->reason(),
                ], $response->status());
            }

            $data = $response->json();
            $summary = trim($data['choices'][0]['message']['content'] ?? '');

            if (! $summary) {
                return response()->json(['error' => 'Invalid API response.'], 502);
            }

            return response()->json(['summary' => $summary]);
        } catch (\Throwable $e) {
            Log::error('AI understand exception', ['message' => $e->getMessage()]);

            return response()->json([
                'error' => 'Failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Generate HTML email content for the blank template using the AI/ML API.
     * Wraps AI output in Brisa template styling.
     * Returns both subject and html.
     */
    public function generateEmailContent(Request $request)
    {
        $request->validate([
            'prompt' => 'required|string|max:1000',
            'property_id' => 'nullable|integer|exists:properties,id',
        ]);

        $property = null;
        if ($request->property_id) {
            $property = Property::where('user_id', $request->user()->id)
                ->find($request->property_id);
        }

        $apiKey = config('services.ai_ml.api_key');
        $apiUrl = config('services.ai_ml.api_url');
        $model = config('services.ai_ml.model');

        if (! $apiKey || ! $apiUrl) {
            return response()->json([
                'error' => 'AI/ML API is not configured. Set AI_ML_API_KEY and AI_ML_API_URL in .env.',
            ], 503);
        }

        $userPrompt = $request->prompt;
        $propertyContext = $property
            ? "Property: {$property->name} in {$property->location}, Costa Rica. "
            : 'Vacation rental in Costa Rica (no specific property). ';

        $prompt = "IMPORTANT: This is for a vacation rental in COSTA RICA only. Do NOT mention Toronto, USA, or any other location. "
            . "User request: \"{$userPrompt}\". "
            . "Context: {$propertyContext} "
            . "Output in this exact format. First line: SUBJECT: <your suggested email subject line>. Then a blank line. Then the HTML body. "
            . "Generate ONLY the inner body (no full document). Use inline styles: font-family 'Segoe UI', color #374151/#4b5563, font-size 15-16px, line-height 1.6. "
            . "Include: greeting with {{ params.FIRST_NAME }}, 2-3 short paragraphs, a CTA using {{ params.LISTING_URL }}, sign-off with {{ params.HOST_NAME }}. "
            . "Use {{ params.PROPERTY_NAME }} and {{ params.PROPERTY_LOCATION }} (Costa Rica locations only). "
            . "Include {{ params.PROPERTY_IMAGE }} after the first paragraph if promoting a property. "
            . "Use <p style=\"margin:0 0 16px;font-size:15px;line-height:1.6;color:#4b5563\"> for paragraphs. "
            . "For CTA: <a href=\"{{ params.LISTING_URL }}\" style=\"display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600\">Button text</a>. "
            . "No markdown, no code blocks.";

        try {
            $path = config('services.ai_ml.path', '/chat/completions');
            $endpoint = rtrim($apiUrl, '/') . (str_starts_with($path, '/') ? $path : '/' . $path);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post($endpoint, [
                'model' => $model,
                'messages' => [['role' => 'user', 'content' => $prompt]],
                'max_tokens' => 900,
            ]);

            if (! $response->successful()) {
                Log::warning('AI/ML API error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return response()->json([
                    'error' => 'Failed to generate: ' . $response->reason(),
                ], $response->status());
            }

            $data = $response->json();
            $raw = trim($data['choices'][0]['message']['content'] ?? '');

            if (! $raw) {
                return response()->json([
                    'error' => 'Invalid API response format.',
                ], 502);
            }

            $raw = preg_replace('/^```\w*\n?|\n?```$/m', '', $raw);

            $subject = '';
            $innerHtml = $raw;
            if (preg_match('/^SUBJECT:\s*(.+?)(?:\n\n|\r\n\r\n)/s', $raw, $m)) {
                $subject = trim($m[1]);
                $innerHtml = trim(substr($raw, strlen($m[0])));
            } elseif (preg_match('/^SUBJECT:\s*(.+)$/m', $raw, $m)) {
                $subject = trim($m[1]);
                $innerHtml = trim(preg_replace('/^SUBJECT:.*$/m', '', $raw));
            }

            $html = $this->wrapEmailInTemplate($innerHtml);

            return response()->json(['html' => $html, 'subject' => $subject]);
        } catch (\Throwable $e) {
            Log::error('AI/ML API exception', ['message' => $e->getMessage()]);

            return response()->json([
                'error' => 'Email generation failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Wrap inner HTML body in Brisa email template styling.
     */
    private function wrapEmailInTemplate(string $innerHtml): string
    {
        return '<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;font-family:\'Segoe UI\',sans-serif;background:#f5f5f5;padding:24px">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.08)">
  <div style="background:linear-gradient(135deg,#047857 0%,#059669 100%);padding:28px;text-align:center">
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:600">Brisa</h1>
    <p style="margin:8px 0 0;color:rgba(255,255,255,.9);font-size:14px">Your message</p>
  </div>
  <div style="padding:28px">
    ' . $innerHtml . '
  </div>
  <div style="background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#9ca3af">
    Brisa · Unsubscribe
  </div>
</div>
</body>
</html>';
    }

    private function getEmailSegmentCounts(int $userId): array
    {
        $base = Inquiry::where('user_id', $userId);
        $countDistinct = fn ($q) => (clone $q)->selectRaw('COUNT(DISTINCT traveler_email) as c')->value('c') ?? 0;

        return [
            'didnt_book' => $countDistinct((clone $base)->whereIn('status', ['new', 'contacted', 'lost'])),
            'booked_before' => $countDistinct((clone $base)->where('status', 'booked')),
            'recent_30' => $countDistinct((clone $base)->where('sent_at', '>=', now()->subDays(30))),
            'recent_60' => $countDistinct((clone $base)->where('sent_at', '>=', now()->subDays(60))),
            'recent_90' => $countDistinct((clone $base)->where('sent_at', '>=', now()->subDays(90))),
            'all' => $countDistinct((clone $base)),
        ];
    }

    private function getEmailPropertyCounts(int $userId): array
    {
        $properties = Property::where('user_id', $userId)->get();
        $counts = [];
        foreach ($properties as $p) {
            $counts[$p->id] = Inquiry::where('user_id', $userId)
                ->where('property_id', $p->id)
                ->selectRaw('COUNT(DISTINCT traveler_email) as c')
                ->value('c') ?? 0;
        }
        return $counts;
    }
}
