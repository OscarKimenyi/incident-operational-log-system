<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\IncidentController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    
    // Test
    // Route::get('/test', function() {
    //     return response()->json(['message' => 'API is working']);
    // });
    
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Dashboard
    Route::get('/dashboard', [IncidentController::class, 'dashboard']);
    
    // Incidents
    Route::apiResource('incidents', IncidentController::class);
    Route::post('/incidents/{incident}/status', [IncidentController::class, 'updateStatus']);
    Route::post('/incidents/{incident}/assign', [IncidentController::class, 'assign']);

    // Users
    // Route::get('/users', [UserController::class, 'index']);
    // Route::get('/users/operators', [UserController::class, 'getOperators']);

    
});

