<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class BrevoService
{
    protected string $apiUrl = 'https://api.brevo.com/v3/smtp/email';

    public function sendTransactional(
        int $templateId,
        array $to,
        array $params,
        ?array $replyTo = null
    ): array {
        $toList = collect($to)->map(function ($recipient) {
            return is_array($recipient)
                ? ['email' => $recipient['email'] ?? $recipient[0], 'name' => $recipient['name'] ?? $recipient[1] ?? null]
                : ['email' => $recipient, 'name' => null];
        })->values()->all();

        $payload = [
            'sender' => config('services.brevo.sender'),
            'to' => $toList,
            'templateId' => $templateId,
            'params' => $params,
        ];

        if ($replyTo) {
            $payload['replyTo'] = [
                'email' => $replyTo['email'] ?? $replyTo[0] ?? null,
                'name' => $replyTo['name'] ?? $replyTo[1] ?? null,
            ];
        }

        $response = Http::withHeaders([
            'accept' => 'application/json',
            'api-key' => config('services.brevo.api_key'),
            'content-type' => 'application/json',
        ])->post($this->apiUrl, $payload);

        return [
            'success' => $response->successful(),
            'status' => $response->status(),
            'body' => $response->json(),
        ];
    }
}
