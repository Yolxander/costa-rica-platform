<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteAnalytic extends Model
{
    protected $fillable = [
        'date',
        'page_views',
        'unique_visitors',
        'property_views',
        'inquiry_submissions',
        'bounce_rate',
        'avg_session_duration',
    ];

    protected $casts = [
        'date' => 'date',
        'bounce_rate' => 'decimal:2',
        'avg_session_duration' => 'decimal:2',
    ];
}
