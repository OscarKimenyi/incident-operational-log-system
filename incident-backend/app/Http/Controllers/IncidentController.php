<?php
namespace App\Http\Controllers;

use App\Models\Incident;
use App\Models\IncidentUpdate;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class IncidentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Incident::with(['reporter', 'assignedTo', 'updates']);

        // Role-based filtering
        if ($user->isReporter()) {
            $query->where('reporter_id', $user->id);
        }

        // Apply filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('severity')) {
            $query->where('severity', $request->severity);
        }

        if ($request->has('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        $incidents = $query->latest()->paginate(15);

        return response()->json($incidents);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'severity' => 'required|in:low,medium,high,critical',
        ]);

        $incident = DB::transaction(function () use ($request) {
            $incident = Incident::create([
                'title' => $request->title,
                'description' => $request->description,
                'severity' => $request->severity,
                'status' => 'open',
                'reporter_id' => $request->user()->id,
            ]);

            // Create initial audit log
            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => 'created',
                'entity_type' => 'incident',
                'entity_id' => $incident->id,
                'new_values' => json_encode($incident->toArray()),
                'ip_address' => $request->ip(),
            ]);

            return $incident;
        });

        return response()->json($incident->load(['reporter', 'assignedTo']), 201);
    }

    public function show(Incident $incident, Request $request)
    {
        $user = $request->user();
        
        // Check authorization
        if ($user->isReporter() && $incident->reporter_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($incident->load(['reporter', 'assignedTo', 'updates.user']));
    }

    public function updateStatus(Request $request, Incident $incident)
    {
        $request->validate([
            'status' => 'required|in:open,investigating,resolved,closed',
            'comment' => 'nullable|string',
        ]);

        $user = $request->user();

        // Check authorization
        if ($user->isReporter()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Validate status transition
        if (!$incident->canTransitionTo($request->status)) {
            return response()->json([
                'message' => 'Invalid status transition'
            ], 422);
        }

        $oldStatus = $incident->status;

        $incident = DB::transaction(function () use ($incident, $request, $user, $oldStatus) {
            $incident->update(['status' => $request->status]);

            // Create incident update record
            IncidentUpdate::create([
                'incident_id' => $incident->id,
                'user_id' => $user->id,
                'old_status' => $oldStatus,
                'new_status' => $request->status,
                'comment' => $request->comment,
            ]);

            // Create audit log
            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'status_updated',
                'entity_type' => 'incident',
                'entity_id' => $incident->id,
                'old_values' => json_encode(['status' => $oldStatus]),
                'new_values' => json_encode(['status' => $request->status]),
                'ip_address' => $request->ip(),
            ]);

            return $incident;
        });

        return response()->json($incident->load('updates'));
    }

    public function assign(Request $request, Incident $incident)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $oldAssignedTo = $incident->assigned_to;

        $incident = DB::transaction(function () use ($incident, $request, $user, $oldAssignedTo) {
            $incident->update(['assigned_to' => $request->user_id]);

            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'assigned',
                'entity_type' => 'incident',
                'entity_id' => $incident->id,
                'old_values' => json_encode(['assigned_to' => $oldAssignedTo]),
                'new_values' => json_encode(['assigned_to' => $request->user_id]),
                'ip_address' => $request->ip(),
            ]);

            return $incident;
        });

        return response()->json($incident->load('assignedTo'));
    }

    public function dashboard(Request $request)
    {
        $user = $request->user();
        $query = Incident::query();

        if ($user->isReporter()) {
            $query->where('reporter_id', $user->id);
        }

        $counts = [
            'open' => (clone $query)->where('status', 'open')->count(),
            'investigating' => (clone $query)->where('status', 'investigating')->count(),
            'resolved' => (clone $query)->where('status', 'resolved')->count(),
            'closed' => (clone $query)->where('status', 'closed')->count(),
            'total' => (clone $query)->count(),
        ];

        $recentIncidents = (clone $query)
            ->with(['reporter', 'assignedTo'])
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'counts' => $counts,
            'recent_incidents' => $recentIncidents,
        ]);
    }
}