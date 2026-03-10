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
        Schema::create('email_campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name')->nullable();
            $table->string('subject');
            $table->longText('body');
            $table->string('segment_type');
            $table->json('segment_config')->nullable();
            $table->foreignId('property_id')->nullable()->constrained()->onDelete('set null');
            $table->unsignedInteger('recipient_count')->default(0);
            $table->enum('status', ['draft', 'sent'])->default('draft');
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_campaigns');
    }
};
