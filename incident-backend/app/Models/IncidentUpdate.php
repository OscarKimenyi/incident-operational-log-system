<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IncidentUpdate extends Model
{
    use HasFactory;

    protected $table = 'incident_updates';

    protected $fillable = [
        'incident_id',
        'user_id',
        'old_status',
        'new_status',
        'comment',
    ];

    protected $casts = [
        'old_status' => 'string',
        'new_status' => 'string',
    ];

    /**
     * Get the incident that owns the update.
     */
    public function incident()
    {
        return $this->belongsTo(Incident::class);
    }

    /**
     * Get the user who made the update.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}