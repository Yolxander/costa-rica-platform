<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'property_id',
        'booking_count',
        'total_spent',
        'last_booking_date',
    ];

    protected $casts = [
        'last_booking_date' => 'date',
        'total_spent' => 'decimal:2',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
