<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SiteAnalyticSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create analytics data for the last 30 days
        for ($i = 30; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $baseViews = rand(800, 1500);
            $uniqueVisitors = (int) ($baseViews * (rand(60, 80) / 100));
            $propertyViews = (int) ($baseViews * (rand(40, 60) / 100));
            $inquirySubmissions = rand(5, 25);

            \App\Models\SiteAnalytic::create([
                'date' => $date,
                'page_views' => $baseViews,
                'unique_visitors' => $uniqueVisitors,
                'property_views' => $propertyViews,
                'inquiry_submissions' => $inquirySubmissions,
                'bounce_rate' => rand(35, 65),
                'avg_session_duration' => rand(2, 8) + (rand(0, 99) / 100),
            ]);
        }
    }
}
