<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->boolean('show_welcome_message')->default(true)->after('show_website_button');
            $table->boolean('show_booking_buttons')->default(true)->after('show_welcome_message');
            $table->boolean('show_property_highlights')->default(true)->after('show_booking_buttons');
            $table->boolean('show_photo_gallery')->default(true)->after('show_property_highlights');
            $table->boolean('show_contact_section')->default(true)->after('show_photo_gallery');
            $table->boolean('show_pricing')->default(true)->after('show_contact_section');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn([
                'show_welcome_message',
                'show_booking_buttons',
                'show_property_highlights',
                'show_photo_gallery',
                'show_contact_section',
                'show_pricing',
            ]);
        });
    }
};
