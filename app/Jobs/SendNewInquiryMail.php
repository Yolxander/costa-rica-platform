<?php

namespace App\Jobs;

use App\Models\Inquiry;
use App\Services\BrevoService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendNewInquiryMail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Inquiry $inquiry
    ) {}

    public function handle(BrevoService $brevo): void
    {
        $inquiry = $this->inquiry->loadMissing(['property', 'host']);
        $host = $inquiry->host;
        $property = $inquiry->property;

        if (! $host?->email) {
            return;
        }

        $params = [
            'HOST_NAME' => $host->name ?? 'Host',
            'TRAVELER_NAME' => $inquiry->traveler_name,
            'PROPERTY_NAME' => $property?->name ?? 'Property',
            'TRAVELER_EMAIL' => $inquiry->traveler_email,
            'TRAVELER_PHONE' => $inquiry->traveler_phone ?? '—',
            'CHECKIN_DATE' => $inquiry->check_in->format('M j, Y'),
            'CHECKOUT_DATE' => $inquiry->check_out->format('M j, Y'),
            'GUEST_COUNT' => (string) $inquiry->guests,
            'TRAVELER_MESSAGE' => $inquiry->message,
            'PROPERTY_IMAGE' => $this->propertyImage($property),
            'DASHBOARD_URL' => url(route('dashboard', [], false)),
            'CONVERSATION_URL' => url(route('inquiries', [], false)),
            'LISTING_URL' => $property?->slug ? url(route('listing.detail', ['slug' => $property->slug], false)) : config('app.url'),
            'SUPPORT_URL' => config('app.url') . '/support',
        ];

        $brevo->sendTransactional(
            (int) config('services.brevo.templates.new_inquiry'),
            [['email' => $host->email, 'name' => $host->name]],
            $params
        );
    }

    private function propertyImage(?object $property): string
    {
        $images = $property?->images ?? [];
        $url = is_array($images) && count($images) > 0 ? $images[0] : null;

        return $url ?? 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop';
    }
}
