<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GuestTag extends Model
{
    protected $table = 'guest_tags';

    protected $fillable = [
        'user_id',
        'name',
        'color',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function syncForGuest(int $userId, string $travelerEmail, array $tagIds): void
    {
        $validIds = static::where('user_id', $userId)->whereIn('id', $tagIds)->pluck('id')->toArray();

        \DB::table('guest_tag_guest')
            ->where('user_id', $userId)
            ->where('traveler_email', $travelerEmail)
            ->delete();

        foreach ($validIds as $tagId) {
            \DB::table('guest_tag_guest')->insert([
                'user_id' => $userId,
                'traveler_email' => $travelerEmail,
                'tag_id' => $tagId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public static function getTagsForGuest(int $userId, string $travelerEmail): \Illuminate\Database\Eloquent\Collection
    {
        $tagIds = \DB::table('guest_tag_guest')
            ->where('user_id', $userId)
            ->where('traveler_email', $travelerEmail)
            ->pluck('tag_id');

        return static::whereIn('id', $tagIds)->get();
    }
}
