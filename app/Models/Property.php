<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Property extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'type',
        'status',
        'approval_status',
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

    protected static function booted(): void
    {
        static::creating(function (Property $property) {
            if (empty($property->slug)) {
                $property->slug = static::generateUniqueSlug(Str::slug($property->name) ?: 'property', $property->id);
            }
        });

        static::updating(function (Property $property) {
            if ($property->isDirty('name') && ! $property->isDirty('slug')) {
                $property->slug = static::generateUniqueSlug(Str::slug($property->name) ?: 'property', $property->id);
            }
        });
    }

    protected static function generateUniqueSlug(string $base, ?int $excludeId = null): string
    {
        $slug = $base;
        $counter = 1;
        $query = static::where('slug', $slug);
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }
        while ($query->exists()) {
            $slug = $base . '-' . $counter;
            $counter++;
            $query = static::where('slug', $slug);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
        }
        return $slug;
    }

    /**
     * Get the user that owns the property.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the inquiries for the property.
     */
    public function inquiries()
    {
        return $this->hasMany(Inquiry::class);
    }

    /**
     * Get the availability records for the property.
     */
    public function availabilities()
    {
        return $this->hasMany(Availability::class);
    }
}
