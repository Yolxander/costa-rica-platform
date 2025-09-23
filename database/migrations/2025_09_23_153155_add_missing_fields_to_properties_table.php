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
            $table->json('house_rules')->nullable()->after('amenities');
            $table->json('policies')->nullable()->after('house_rules');
            $table->string('price_format')->nullable()->after('service_fee'); // e.g., "$2,500/month"
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn(['house_rules', 'policies', 'price_format']);
        });
    }
};
