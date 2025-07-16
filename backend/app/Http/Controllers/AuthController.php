<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
   public function registerAfterThingsBoard(Request $request)
{
    $validated = $request->validate([
        'username' => 'required|string|email|max:255',
        'thingsboard_token' => 'required|string|min:20'
    ]);

    // Check if user already exists
    $user = User::where('email', $validated['username'])->first();

    if (!$user) {
        // Create new user
        $user = User::create([
            'name' => $this->extractNameFromEmail($validated['username']),
            'email' => $validated['username'],
            'password' => Hash::make(Str::random(32)),
            'thingsboard_token' => $validated['thingsboard_token']
        ]);
    } else {
        // Update token if needed
        $user->update([
            'thingsboard_token' => $validated['thingsboard_token']
        ]);
    }

    return response()->json([
        'message' => 'User authenticated',
        'user' => $user->makeHidden(['password', 'thingsboard_token'])
    ], 200);
}

}