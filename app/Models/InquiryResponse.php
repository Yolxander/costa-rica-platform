<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InquiryResponse extends Model
{
    protected $fillable = [
        'inquiry_id',
        'sender',
        'message',
    ];

    public function inquiry()
    {
        return $this->belongsTo(Inquiry::class);
    }
}
