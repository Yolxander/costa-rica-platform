<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InquirySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $properties = \App\Models\Property::all();
        $hosts = \App\Models\User::where('role', 'host')->get();

        // Create inquiries for the last 30 days
        for ($i = 0; $i < 50; $i++) {
            $property = $properties->random();
            $host = $property->user;

            $checkIn = now()->addDays(rand(1, 60));
            $checkOut = $checkIn->copy()->addDays(rand(2, 14));

            \App\Models\Inquiry::create([
                'property_id' => $property->id,
                'user_id' => $host->id,
                'traveler_name' => fake()->name(),
                'traveler_email' => fake()->email(),
                'traveler_phone' => fake()->optional(0.7)->phoneNumber(),
                'check_in' => $checkIn,
                'check_out' => $checkOut,
                'guests' => rand(1, 8),
                'message' => fake()->paragraph(),
                'status' => fake()->randomElement(['pending', 'responded', 'confirmed', 'declined']),
                'sent_at' => now()->subDays(rand(0, 30)),
            ]);
        }

        // Create some recent inquiries (last 7 days)
        for ($i = 0; $i < 15; $i++) {
            $property = $properties->random();
            $host = $property->user;

            $checkIn = now()->addDays(rand(1, 30));
            $checkOut = $checkIn->copy()->addDays(rand(2, 10));

            \App\Models\Inquiry::create([
                'property_id' => $property->id,
                'user_id' => $host->id,
                'traveler_name' => fake()->name(),
                'traveler_email' => fake()->email(),
                'traveler_phone' => fake()->optional(0.8)->phoneNumber(),
                'check_in' => $checkIn,
                'check_out' => $checkOut,
                'guests' => rand(1, 6),
                'message' => fake()->paragraph(),
                'status' => fake()->randomElement(['pending', 'responded']),
                'sent_at' => now()->subDays(rand(0, 7)),
            ]);
        }
    }
}
