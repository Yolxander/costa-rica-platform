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
        Schema::create('site_analytics', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->integer('page_views')->default(0);
            $table->integer('unique_visitors')->default(0);
            $table->integer('property_views')->default(0);
            $table->integer('inquiry_submissions')->default(0);
            $table->decimal('bounce_rate', 5, 2)->default(0);
            $table->decimal('avg_session_duration', 8, 2)->default(0); // in minutes
            $table->timestamps();

            $table->unique('date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_analytics');
    }
};
