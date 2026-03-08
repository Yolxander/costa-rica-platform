<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $properties = DB::table('properties')->orderBy('id')->get();
        $usedSlugs = [];

        foreach ($properties as $property) {
            $base = Str::slug($property->name) ?: 'property';
            $slug = $base;
            $counter = 1;
            while (in_array($slug, $usedSlugs, true)) {
                $slug = $base . '-' . $counter;
                $counter++;
            }
            $usedSlugs[] = $slug;

            DB::table('properties')->where('id', $property->id)->update(['slug' => $slug]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to name-id format
        $properties = DB::table('properties')->get();
        foreach ($properties as $property) {
            $base = Str::slug($property->name) ?: 'property';
            $slug = $base . '-' . $property->id;
            DB::table('properties')->where('id', $property->id)->update(['slug' => $slug]);
        }
    }
};
