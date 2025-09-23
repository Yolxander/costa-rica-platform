<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::create([
            'name' => 'Admin User',
            'email' => 'admin@costaricarentalhub.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        \App\Models\User::create([
            'name' => 'Team Member',
            'email' => 'team@costaricarentalhub.com',
            'password' => bcrypt('password'),
            'role' => 'team_member',
            'email_verified_at' => now(),
        ]);
    }
}
