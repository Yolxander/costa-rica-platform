<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Traveler registration has been removed - only host registration is available.
     */
    public function test_traveler_registration_route_no_longer_exists()
    {
        $response = $this->get('/register');

        $response->assertStatus(404);
    }

    public function test_host_registration_screen_can_be_rendered()
    {
        $response = $this->get(route('host.register'));

        $response->assertStatus(200);
    }
}
