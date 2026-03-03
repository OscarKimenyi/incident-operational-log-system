<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the role that owns the user.
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get incidents reported by the user.
     */
    public function reportedIncidents()
    {
        return $this->hasMany(Incident::class, 'reporter_id');
    }

    /**
     * Get incidents assigned to the user.
     */
    public function assignedIncidents()
    {
        return $this->hasMany(Incident::class, 'assigned_to');
    }

    /**
     * Check if user has a specific role.
     */
    public function hasRole($roleName)
    {
        return $this->role && $this->role->name === $roleName;
    }

    /**
     * Check if user is admin.
     */
    public function isAdmin()
    {
        return $this->hasRole('admin');
    }

    /**
     * Check if user is operator.
     */
    public function isOperator()
    {
        return $this->hasRole('operator');
    }

    /**
     * Check if user is reporter.
     */
    public function isReporter()
    {
        return $this->hasRole('reporter');
    }

    /**
     * Get user's role name directly.
     */
    public function getRoleNameAttribute()
    {
        return $this->role ? $this->role->name : null;
    }
}