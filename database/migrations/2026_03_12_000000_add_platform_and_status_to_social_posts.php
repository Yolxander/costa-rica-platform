<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('social_posts', function (Blueprint $table) {
            $table->string('platform')->default('instagram')->after('property_id');
            $table->string('status')->default('draft')->after('location');
            $table->timestamp('scheduled_at')->nullable()->after('status');
            $table->timestamp('published_at')->nullable()->after('scheduled_at');
        });
    }

    public function down(): void
    {
        Schema::table('social_posts', function (Blueprint $table) {
            $table->dropColumn(['platform', 'status', 'scheduled_at', 'published_at']);
        });
    }
};
