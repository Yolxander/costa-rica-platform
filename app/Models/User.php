<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is a team member
     */
    public function isTeamMember(): bool
    {
        return $this->role === 'team_member';
    }

    /**
     * Check if user is a host
     */
    public function isHost(): bool
    {
        return $this->role === 'host';
    }

    /**
     * Check if user has admin access (admin or team member)
     */
    public function hasAdminAccess(): bool
    {
        return $this->isAdmin() || $this->isTeamMember();
    }

    /**
     * Get the properties for the user.
     */
    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    /**
     * Get the host subscription for the user.
     */
    public function hostSubscription()
    {
        return $this->hasOne(HostSubscription::class);
    }

    /**
     * Get the inquiries sent to this user (host).
     */
    public function inquiries()
    {
        return $this->hasMany(Inquiry::class);
    }
}
