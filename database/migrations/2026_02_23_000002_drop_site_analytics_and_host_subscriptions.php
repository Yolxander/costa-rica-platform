<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('site_analytics');
        Schema::dropIfExists('host_subscriptions');
    }

    public function down(): void
    {
        Schema::create('site_analytics', function ($table) {
            $table->id();
            $table->date('date');
            $table->unsignedInteger('page_views')->default(0);
            $table->unsignedInteger('unique_visitors')->default(0);
            $table->unsignedInteger('property_views')->default(0);
            $table->unsignedInteger('inquiry_submissions')->default(0);
            $table->decimal('bounce_rate', 5, 2)->default(0);
            $table->decimal('avg_session_duration', 8, 2)->default(0);
            $table->timestamps();
        });

        Schema::create('host_subscriptions', function ($table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('plan_name');
            $table->decimal('yearly_fee', 10, 2);
            $table->date('start_date');
            $table->date('end_date');
            $table->string('status')->default('active');
            $table->boolean('auto_renew')->default(true);
            $table->timestamps();
        });
    }
};
