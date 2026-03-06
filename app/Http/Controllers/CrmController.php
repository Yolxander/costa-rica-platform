<?php

namespace App\Http\Controllers;

use App\Models\GuestNote;
use App\Models\GuestTag;
use App\Models\Inquiry;
use Illuminate\Http\Request;

class CrmController extends Controller
{
    public function show(string $email)
    {
        $user = auth()->user();
        $travelerEmail = urldecode($email);

        $inquiries = Inquiry::where('user_id', $user->id)
            ->where('traveler_email', $travelerEmail)
            ->with(['property', 'responses'])
            ->orderByDesc('sent_at')
            ->get();

        if ($inquiries->isEmpty()) {
            return response()->json(['error' => 'Guest not found'], 404);
        }

        $first = $inquiries->first();
        $stays = $inquiries->filter(fn ($i) => $i->status === 'booked');
        $tags = GuestTag::getTagsForGuest($user->id, $travelerEmail);
        $notes = GuestNote::where('user_id', $user->id)
            ->where('traveler_email', $travelerEmail)
            ->with('property:id,name')
            ->orderByDesc('created_at')
            ->get();

        $inquiryList = $inquiries->map(function ($inquiry) {
            return [
                'id' => $inquiry->id,
                'property_name' => $inquiry->property?->name ?? 'Unknown',
                'check_in' => $inquiry->check_in->format('Y-m-d'),
                'check_out' => $inquiry->check_out->format('Y-m-d'),
                'status' => $inquiry->status,
                'message' => $inquiry->message,
                'guests' => $inquiry->guests,
                'responses' => $inquiry->responses->map(fn ($r) => [
                    'id' => $r->id,
                    'sender' => $r->sender,
                    'message' => $r->message,
                    'created_at' => $r->created_at->format('M d, Y H:i'),
                ])->toArray(),
                'sent_at' => $inquiry->sent_at->format('M d, Y'),
            ];
        })->toArray();

        $stayList = $stays->map(function ($inquiry) {
            return [
                'id' => $inquiry->id,
                'property_name' => $inquiry->property?->name ?? 'Unknown',
                'check_in' => $inquiry->check_in->format('Y-m-d'),
                'check_out' => $inquiry->check_out->format('Y-m-d'),
                'guests' => $inquiry->guests,
            ];
        })->values()->toArray();

        return response()->json([
            'name' => $first->traveler_name,
            'email' => $travelerEmail,
            'phone' => $first->traveler_phone,
            'inquiries' => $inquiryList,
            'stays' => $stayList,
            'tags' => $tags->map(fn ($t) => ['id' => $t->id, 'name' => $t->name, 'color' => $t->color])->toArray(),
            'notes' => $notes->map(fn ($n) => [
                'id' => $n->id,
                'note' => $n->note,
                'created_at' => $n->created_at->format('M d, Y H:i'),
                'property_name' => $n->property?->name,
            ])->toArray(),
            'all_tags' => GuestTag::where('user_id', $user->id)->get(['id', 'name', 'color'])->toArray(),
        ]);
    }

    public function storeNote(Request $request, string $email)
    {
        $user = auth()->user();
        $travelerEmail = urldecode($email);

        $validated = $request->validate([
            'note' => 'required|string|max:5000',
            'property_id' => 'nullable|integer',
        ]);

        if (! empty($validated['property_id'])) {
            $validProperty = \App\Models\Property::where('user_id', $user->id)->where('id', $validated['property_id'])->exists();
            if (! $validProperty) {
                $validated['property_id'] = null;
            }
        }

        $note = GuestNote::create([
            'user_id' => $user->id,
            'traveler_email' => $travelerEmail,
            'property_id' => $validated['property_id'] ?? null,
            'note' => $validated['note'],
        ]);

        $note->load('property:id,name');

        return response()->json([
            'id' => $note->id,
            'note' => $note->note,
            'created_at' => $note->created_at->format('M d, Y H:i'),
            'property_name' => $note->property?->name,
        ]);
    }

    public function updateTags(Request $request, string $email)
    {
        $user = auth()->user();
        $travelerEmail = urldecode($email);

        $validated = $request->validate([
            'tag_ids' => 'required|array',
            'tag_ids.*' => 'integer',
        ]);

        $validTagIds = GuestTag::where('user_id', $user->id)->whereIn('id', $validated['tag_ids'])->pluck('id')->toArray();
        GuestTag::syncForGuest($user->id, $travelerEmail, $validTagIds);

        $tags = GuestTag::getTagsForGuest($user->id, $travelerEmail);

        return response()->json([
            'tags' => $tags->map(fn ($t) => ['id' => $t->id, 'name' => $t->name, 'color' => $t->color])->toArray(),
        ]);
    }

    public function storeTag(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'color' => 'nullable|string|max:20',
        ]);

        $tag = GuestTag::create([
            'user_id' => $user->id,
            'name' => $validated['name'],
            'color' => $validated['color'] ?? '#3b82f6',
        ]);

        return response()->json([
            'id' => $tag->id,
            'name' => $tag->name,
            'color' => $tag->color,
        ]);
    }
}
