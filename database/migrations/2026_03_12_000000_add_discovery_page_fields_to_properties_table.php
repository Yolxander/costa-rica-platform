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
            // External booking platform links
            $table->string('airbnb_url')->nullable()->after('reviews');
            $table->string('bookingcom_url')->nullable()->after('airbnb_url');
            $table->string('vrbo_url')->nullable()->after('bookingcom_url');
            $table->string('website_url')->nullable()->after('vrbo_url');
            $table->string('whatsapp_number')->nullable()->after('website_url');

            // Discovery page settings
            $table->boolean('discovery_page_enabled')->default(true)->after('whatsapp_number');
            $table->boolean('show_book_direct_button')->default(true)->after('discovery_page_enabled');
            $table->boolean('show_airbnb_button')->default(true)->after('show_book_direct_button');
            $table->boolean('show_bookingcom_button')->default(true)->after('show_airbnb_button');
            $table->boolean('show_whatsapp_button')->default(true)->after('show_bookingcom_button');

            // Customization
            $table->text('custom_message')->nullable()->after('show_whatsapp_button');
            $table->string('accent_color')->default('#10b981')->after('custom_message');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn([
                'airbnb_url',
                'bookingcom_url',
                'vrbo_url',
                'website_url',
                'whatsapp_number',
                'discovery_page_enabled',
                'show_book_direct_button',
                'show_airbnb_button',
                'show_bookingcom_button',
                'show_whatsapp_button',
                'custom_message',
                'accent_color',
            ]);
        });
    }
};
