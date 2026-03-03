<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('role');
        
        if ($request->has('role')) {
            $query->whereHas('role', function($q) use ($request) {
                $q->where('name', $request->role);
            });
        }
        
        $users = $query->get();
        
        return response()->json($users);
    }

    public function getOperators()
    {
        $operators = User::whereHas('role', function($q) {
            $q->where('name', 'operator');
        })->get();
        
        return response()->json($operators);
    }
}