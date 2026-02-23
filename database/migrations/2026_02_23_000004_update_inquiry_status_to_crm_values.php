<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // First change column to varchar to allow new values
        DB::statement("ALTER TABLE inquiries MODIFY COLUMN status VARCHAR(20) NOT NULL DEFAULT 'pending'");

        // Then update to new CRM status values
        DB::table('inquiries')->where('status', 'pending')->update(['status' => 'new']);
        DB::table('inquiries')->where('status', 'responded')->update(['status' => 'contacted']);
        DB::table('inquiries')->where('status', 'confirmed')->update(['status' => 'booked']);
        DB::table('inquiries')->where('status', 'declined')->update(['status' => 'lost']);

        DB::statement("ALTER TABLE inquiries MODIFY COLUMN status VARCHAR(20) NOT NULL DEFAULT 'new'");
    }

    public function down(): void
    {
        DB::table('inquiries')->where('status', 'new')->update(['status' => 'pending']);
        DB::table('inquiries')->where('status', 'contacted')->update(['status' => 'responded']);
        DB::table('inquiries')->where('status', 'booked')->update(['status' => 'confirmed']);
        DB::table('inquiries')->where('status', 'lost')->update(['status' => 'declined']);

        DB::statement("ALTER TABLE inquiries MODIFY COLUMN status ENUM('pending','responded','confirmed','declined') NOT NULL DEFAULT 'pending'");
    }
};
