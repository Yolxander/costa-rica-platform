<?php

namespace App\Http\Controllers;

use App\Models\Availability;
use App\Models\Property;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CalendarController extends Controller
{
    /**
     * Display the calendar page with events and availability for a property.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $properties = Property::where('user_id', $user->id)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn ($p) => ['id' => $p->id, 'name' => $p->name])
            ->toArray();

        $propertyId = $request->query('property_id');
        $selectedPropertyId = null;
        $events = [];
        $dateAvailability = [];

        if (! empty($properties) && $propertyId) {
            $property = Property::where('user_id', $user->id)->find($propertyId);
            if ($property) {
                $selectedPropertyId = (int) $propertyId;

                // Load availability records for the property
                $availabilities = Availability::where('property_id', $property->id)->get();
                foreach ($availabilities as $av) {
                    $dateKey = $av->date->format('Y-m-d');
                    $dateAvailability[$dateKey] = [
                        'id' => $av->id,
                        'date' => $dateKey,
                        'status' => $av->status,
                        'reason' => $av->reason,
                    ];
                }

                // Load booked inquiries as calendar events
                $bookedInquiries = $property->inquiries()
                    ->where('status', 'booked')
                    ->get();
                foreach ($bookedInquiries as $i => $inquiry) {
                    $events[] = [
                        'id' => 'inquiry-' . $inquiry->id,
                        'start' => $inquiry->check_in->format('Y-m-d') . 'T14:00:00',
                        'end' => $inquiry->check_out->format('Y-m-d') . 'T11:00:00',
                        'title' => $inquiry->traveler_name . ' - Check-in',
                        'color' => 'purple',
                    ];
                }
            }
        }

        // If user has properties but no valid property_id, redirect to first property
        if (! empty($properties) && $selectedPropertyId === null && $propertyId === null) {
            return redirect()->route('calendar', ['property_id' => $properties[0]['id']]);
        }

        return Inertia::render('calendar', [
            'events' => $events,
            'dateAvailability' => $dateAvailability,
            'properties' => $properties,
            'selectedPropertyId' => $selectedPropertyId,
        ]);
    }

    /**
     * Bulk upsert availability dates for a property.
     */
    public function storeAvailability(Request $request)
    {
        $validated = $request->validate([
            'property_id' => ['required', 'integer', 'exists:properties,id'],
            'dates' => ['required', 'array'],
            'dates.*' => ['required', 'date'],
            'status' => ['required', 'string', 'in:available,blocked,maintenance,pending-inquiry'],
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $property = Property::where('user_id', $request->user()->id)->findOrFail($validated['property_id']);

        foreach ($validated['dates'] as $dateStr) {
            Availability::updateOrCreate(
                [
                    'property_id' => $property->id,
                    'date' => $dateStr,
                ],
                [
                    'status' => $validated['status'],
                    'reason' => $validated['reason'] ?? null,
                ]
            );
        }

        return redirect()
            ->route('calendar', ['property_id' => $property->id])
            ->with('success', 'Availability updated successfully.');
    }

    /**
     * Delete a single availability record.
     */
    public function destroyAvailability(Request $request, int $id)
    {
        $availability = Availability::findOrFail($id);

        if ($availability->property->user_id !== $request->user()->id) {
            abort(403);
        }

        $propertyId = $availability->property_id;
        $availability->delete();

        return redirect()
            ->route('calendar', ['property_id' => $propertyId])
            ->with('success', 'Availability removed.');
    }
}
