<!-- a simple test file to verify the API -->
<?php

use Illuminate\Support\Facades\Route;

Route::get('/test', function() {
    return response()->json(['message' => 'API is working']);
});