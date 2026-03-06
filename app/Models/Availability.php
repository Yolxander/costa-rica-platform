<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Availability extends Model
{
    protected $table = 'availability';

    protected $fillable = [
        'property_id',
        'date',
        'status',
        'reason',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    /**
     * Get the property that owns the availability.
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
