<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use Illuminate\Http\Request;

class IncidentController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(['message' => 'Incidents index']);
    }

    public function store(Request $request)
    {
        return response()->json(['message' => 'Incident created']);
    }

    public function show($id)
    {
        return response()->json(['message' => 'Incident details']);
    }

    public function dashboard(Request $request)
    {
        return response()->json(['message' => 'Dashboard stats']);
    }
}