<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class HostTestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Creates a test host user for onboarding flow testing.
     * Email: yolxanderjaca@jaca.com
     * Password: nosotros31!
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'yolxanderjaca@jaca.com'],
            [
                'name' => 'Test Host',
                'password' => Hash::make('nosotros31!'),
                'role' => 'host',
                'email_verified_at' => null,
            ]
        );
    }
}
