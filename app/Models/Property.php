<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'type',
        'status',
        'location',
        'description',
        'amenities',
        'images',
        'house_rules',
        'policies',
        'base_price',
        'price_format',
        'currency',
        'cleaning_fee',
        'service_fee',
        'guests',
        'bedrooms',
        'bathrooms',
        'check_in_time',
        'check_out_time',
        'minimum_stay',
        'views_7d',
        'views_30d',
        'inquiries',
        'bookings',
        'rating',
        'reviews',
    ];

    protected $casts = [
        'amenities' => 'array',
        'images' => 'array',
        'house_rules' => 'array',
        'policies' => 'array',
        'base_price' => 'decimal:2',
        'cleaning_fee' => 'decimal:2',
        'service_fee' => 'decimal:2',
        'rating' => 'decimal:2',
    ];

    /**
     * Get the user that owns the property.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
