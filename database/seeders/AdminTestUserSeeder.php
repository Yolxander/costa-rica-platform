<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminTestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Creates a test admin/host user for testing.
     * Email: yolxanderjaca@gmail.com
     * Password: nostros
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'yolxanderjaca@gmail.com'],
            [
                'name' => 'Admin Test User',
                'password' => Hash::make('nostros'),
                'role' => 'host',
                'email_verified_at' => now(),
            ]
        );
    }
}
