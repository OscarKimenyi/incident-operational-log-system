<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 
        'description', 
        'severity', 
        'status', 
        'reporter_id', 
        'assigned_to'
    ];

    protected $casts = [
        'status' => 'string',
        'severity' => 'string',
    ];

    const STATUSES = ['open', 'investigating', 'resolved', 'closed'];
    const SEVERITIES = ['low', 'medium', 'high', 'critical'];

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function updates()
    {
        return $this->hasMany(IncidentUpdate::class)->orderBy('created_at', 'desc');
    }

    public function auditLogs()
    {
        return $this->morphMany(AuditLog::class, 'entity');
    }

    public function canTransitionTo($newStatus)
    {
        $statusFlow = [
            'open' => ['investigating'],
            'investigating' => ['resolved'],
            'resolved' => ['closed'],
            'closed' => []
        ];

        return in_array($newStatus, $statusFlow[$this->status] ?? []);
    }
}