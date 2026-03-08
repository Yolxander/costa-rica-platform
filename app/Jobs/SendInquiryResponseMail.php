<?php

namespace App\Jobs;

use App\Models\Inquiry;
use App\Services\BrevoService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendInquiryResponseMail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Inquiry $inquiry,
        public string $hostMessage
    ) {}

    public function handle(BrevoService $brevo): void
    {
        $inquiry = $this->inquiry->loadMissing(['property', 'host']);
        $host = $inquiry->host;
        $property = $inquiry->property;

        $params = [
            'TRAVELER_NAME' => $inquiry->traveler_name,
            'HOST_NAME' => $host?->name ?? 'Host',
            'PROPERTY_NAME' => $property?->name ?? 'Property',
            'PROPERTY_LOCATION' => $property?->location ?? '',
            'PROPERTY_IMAGE' => $this->propertyImage($property),
            'CHECKIN_DATE' => $inquiry->check_in->format('M j, Y'),
            'CHECKOUT_DATE' => $inquiry->check_out->format('M j, Y'),
            'GUEST_COUNT' => (string) $inquiry->guests,
            'HOST_MESSAGE' => $this->hostMessage,
            'CONVERSATION_URL' => url(route('inquiries', [], false)),
            'LISTING_URL' => $property?->slug ? url(route('listing.detail', ['slug' => $property->slug], false)) : config('app.url'),
            'BROWSE_URL' => config('app.url'),
            'HOST_URL' => url(route('join', [], false)),
            'SUPPORT_URL' => config('app.url') . '/support',
        ];

        $replyTo = $host?->email
            ? ['email' => $host->email, 'name' => $host->name]
            : null;

        $brevo->sendTransactional(
            (int) config('services.brevo.templates.inquiry_response'),
            [['email' => $inquiry->traveler_email, 'name' => $inquiry->traveler_name]],
            $params,
            $replyTo
        );
    }

    private function propertyImage(?object $property): string
    {
        $images = $property?->images ?? [];
        $url = is_array($images) && count($images) > 0 ? $images[0] : null;

        return $url ?? 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop';
    }
}
