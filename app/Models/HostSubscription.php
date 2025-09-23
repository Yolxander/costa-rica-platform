<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HostSubscription extends Model
{
    protected $fillable = [
        'user_id',
        'plan_name',
        'yearly_fee',
        'start_date',
        'end_date',
        'status',
        'auto_renew',
    ];

    protected $casts = [
        'yearly_fee' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'auto_renew' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isExpiringSoon($days = 30)
    {
        return $this->end_date <= now()->addDays($days) && $this->status === 'active';
    }
}
