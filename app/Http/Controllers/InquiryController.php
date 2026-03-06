<?php

namespace App\Http\Controllers;

use App\Jobs\SendInquiryConfirmationMail;
use App\Jobs\SendInquiryResponseMail;
use App\Jobs\SendNewInquiryMail;
use App\Models\Inquiry;
use App\Models\InquiryResponse;
use App\Models\Property;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    public function store(Request $request, $id)
    {
        $property = Property::findOrFail($id);

        $validated = $request->validate([
            'traveler_name' => 'required|string|max:255',
            'traveler_email' => 'required|email|max:255',
            'traveler_phone' => 'nullable|string|max:50',
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'guests' => 'required|integer|min:1|max:' . $property->guests,
            'message' => 'required|string|max:2000',
        ]);

        $inquiry = Inquiry::create([
            'property_id' => $property->id,
            'user_id' => $property->user_id,
            'traveler_user_id' => null,
            'traveler_name' => $validated['traveler_name'],
            'traveler_email' => $validated['traveler_email'],
            'traveler_phone' => $validated['traveler_phone'] ?? null,
            'check_in' => $validated['check_in'],
            'check_out' => $validated['check_out'],
            'guests' => $validated['guests'],
            'message' => $validated['message'],
            'status' => 'new',
            'sent_at' => now(),
        ]);

        SendNewInquiryMail::dispatch($inquiry);
        SendInquiryConfirmationMail::dispatch($inquiry);

        return back()->with('success', 'Your inquiry has been sent! The host will get back to you soon.');
    }

    public function reply(Request $request, $id)
    {
        $inquiry = Inquiry::where('user_id', auth()->id())
            ->with(['property', 'host'])
            ->findOrFail($id);

        $validated = $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        InquiryResponse::create([
            'inquiry_id' => $inquiry->id,
            'sender' => 'host',
            'message' => $validated['message'],
        ]);

        $inquiry->update(['status' => 'contacted']);

        SendInquiryResponseMail::dispatch($inquiry, $validated['message']);

        return back();
    }
}
