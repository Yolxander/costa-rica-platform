<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HostSubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $hosts = \App\Models\User::where('role', 'host')->get();

        foreach ($hosts as $host) {
            $startDate = now()->subMonths(rand(1, 12));
            $endDate = $startDate->copy()->addYear();

            \App\Models\HostSubscription::create([
                'user_id' => $host->id,
                'plan_name' => fake()->randomElement(['Basic Plan', 'Premium Plan', 'Enterprise Plan']),
                'yearly_fee' => fake()->randomFloat(2, 299, 999),
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => fake()->randomElement(['active', 'active', 'active', 'expired']), // Mostly active
                'auto_renew' => fake()->boolean(70),
            ]);
        }

        // Create some expiring soon subscriptions
        for ($i = 0; $i < 5; $i++) {
            $host = $hosts->random();
            $endDate = now()->addDays(rand(1, 30)); // Expiring within 30 days

            \App\Models\HostSubscription::create([
                'user_id' => $host->id,
                'plan_name' => fake()->randomElement(['Basic Plan', 'Premium Plan', 'Enterprise Plan']),
                'yearly_fee' => fake()->randomFloat(2, 299, 999),
                'start_date' => $endDate->copy()->subYear(),
                'end_date' => $endDate,
                'status' => 'active',
                'auto_renew' => fake()->boolean(50),
            ]);
        }
    }
}
