<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SocialPost extends Model
{
    protected $fillable = [
        'user_id',
        'property_id',
        'platform',
        'images',
        'caption',
        'hashtags',
        'location',
        'link_url',
        'status',
        'scheduled_at',
        'published_at',
    ];

    protected $casts = [
        'images' => 'array',
        'scheduled_at' => 'datetime',
        'published_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
