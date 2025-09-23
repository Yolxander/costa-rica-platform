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
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Host who receives the inquiry
            $table->string('traveler_name');
            $table->string('traveler_email');
            $table->string('traveler_phone')->nullable();
            $table->date('check_in');
            $table->date('check_out');
            $table->integer('guests');
            $table->text('message');
            $table->enum('status', ['pending', 'responded', 'confirmed', 'declined'])->default('pending');
            $table->timestamp('sent_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
