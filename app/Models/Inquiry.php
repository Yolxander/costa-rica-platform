<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    protected $fillable = [
        'property_id',
        'user_id',
        'traveler_user_id',
        'traveler_name',
        'traveler_email',
        'traveler_phone',
        'check_in',
        'check_out',
        'guests',
        'message',
        'status',
        'sent_at',
    ];

    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
        'sent_at' => 'datetime',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function host()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function traveler()
    {
        return $this->belongsTo(User::class, 'traveler_user_id');
    }
}
