<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function registerAfterThingsBoard(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:255|unique:users,email',
            'thingsboard_token' => 'required|string'
        ]);

        $user = User::create([
            'name' => explode('@', $validated['username'])[0],
            'email' => $validated['username'],
            'password' => Hash::make(Str::random(24)),
            'thingsboard_token' => $validated['thingsboard_token']
        ]);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user
        ], 201);
    }
}