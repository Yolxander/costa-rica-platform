<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GuestNote extends Model
{
    protected $table = 'guest_notes';

    protected $fillable = [
        'user_id',
        'traveler_email',
        'property_id',
        'note',
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
