<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailCampaign extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'subject',
        'body',
        'segment_type',
        'segment_config',
        'property_id',
        'recipient_count',
        'status',
        'sent_at',
    ];

    protected $casts = [
        'segment_config' => 'array',
        'sent_at' => 'datetime',
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
