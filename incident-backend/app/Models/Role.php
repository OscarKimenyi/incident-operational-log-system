<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description'];

    /**
     * Get the users for this role.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Check if role is admin
     */
    public function isAdmin()
    {
        return $this->name === 'admin';
    }

    /**
     * Check if role is operator
     */
    public function isOperator()
    {
        return $this->name === 'operator';
    }

    /**
     * Check if role is reporter
     */
    public function isReporter()
    {
        return $this->name === 'reporter';
    }
}