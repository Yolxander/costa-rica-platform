<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $driver = DB::connection()->getDriverName();

        // MySQL needs MODIFY COLUMN; SQLite already uses varchar so just update data
        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE inquiries MODIFY COLUMN status VARCHAR(20) NOT NULL DEFAULT 'pending'");
        }

        // Update to new CRM status values
        DB::table('inquiries')->where('status', 'pending')->update(['status' => 'new']);
        DB::table('inquiries')->where('status', 'responded')->update(['status' => 'contacted']);
        DB::table('inquiries')->where('status', 'confirmed')->update(['status' => 'booked']);
        DB::table('inquiries')->where('status', 'declined')->update(['status' => 'lost']);

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE inquiries MODIFY COLUMN status VARCHAR(20) NOT NULL DEFAULT 'new'");
        }
    }

    public function down(): void
    {
        DB::table('inquiries')->where('status', 'new')->update(['status' => 'pending']);
        DB::table('inquiries')->where('status', 'contacted')->update(['status' => 'responded']);
        DB::table('inquiries')->where('status', 'booked')->update(['status' => 'confirmed']);
        DB::table('inquiries')->where('status', 'lost')->update(['status' => 'declined']);

        $driver = DB::connection()->getDriverName();
        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE inquiries MODIFY COLUMN status ENUM('pending','responded','confirmed','declined') NOT NULL DEFAULT 'pending'");
        }
    }
};
