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
            $table->boolean('show_vrbo_button')->default(true)->after('show_whatsapp_button');
            $table->boolean('show_website_button')->default(true)->after('show_vrbo_button');
            $table->json('highlighted_amenities')->nullable()->after('accent_color');
            $table->json('highlighted_images')->nullable()->after('highlighted_amenities');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn(['show_vrbo_button', 'show_website_button', 'highlighted_amenities', 'highlighted_images']);
        });
    }
};
