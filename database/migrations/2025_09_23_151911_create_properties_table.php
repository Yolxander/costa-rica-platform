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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type');
            $table->string('status')->default('Active');
            $table->string('location');
            $table->text('description')->nullable();
            $table->json('amenities')->nullable();
            $table->json('images')->nullable();

            // Pricing
            $table->decimal('base_price', 10, 2);
            $table->string('currency', 3)->default('USD');
            $table->decimal('cleaning_fee', 10, 2)->default(0);
            $table->decimal('service_fee', 10, 2)->default(0);

            // Capacity
            $table->integer('guests')->default(1);
            $table->integer('bedrooms')->default(1);
            $table->integer('bathrooms')->default(1);

            // Availability
            $table->string('check_in_time')->default('3:00 PM');
            $table->string('check_out_time')->default('11:00 AM');
            $table->integer('minimum_stay')->default(1);

            // Performance metrics
            $table->integer('views_7d')->default(0);
            $table->integer('views_30d')->default(0);
            $table->integer('inquiries')->default(0);
            $table->integer('bookings')->default(0);
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('reviews')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
