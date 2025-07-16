<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function registerAfterThingsBoard(Request $request)
    {
        $validated = $request->validate([
            'username' => [
                'required',
                'string',
                'email',
                'max:255',
            ],
            'thingsboard_token' => 'required|string|min:20'
        ]);

        $email = $validated['username'];
        $thingsboardToken = $validated['thingsboard_token'];

        $user = User::where('email', $email)->first();

        if ($user) {
            // User exists:
            // 1. Update their thingsboard_token (if it's new or changed)
            // 2. Manually "login" the user for this request context
            // 3. Return success response with their existing token
            if ($user->thingsboard_token !== $thingsboardToken) {
                $user->thingsboard_token = $thingsboardToken;
                $user->save();
            }

            Auth::login($user);

            return response()->json([
                'message' => 'User already registered, logged in successfully.',
                'user' => $user->makeHidden(['password', 'thingsboard_token']),
                'access_token' => $user->thingsboard_token,
                'token_type' => 'Bearer',
            ], 200); 
        } else {
            $user = User::create([
                'name' => $this->extractNameFromEmail($email),
                'email' => $email,
                'password' => Hash::make(Str::random(32)),
                'thingsboard_token' => $thingsboardToken
            ]);

            Auth::login($user);

            return response()->json([
                'message' => 'User registered successfully',
                'user' => $user->makeHidden(['password', 'thingsboard_token']),
                'access_token' => $user->thingsboard_token,
                'token_type' => 'Bearer',
            ], 201); 
        }
    }

    protected function extractNameFromEmail(string $email): string
    {
        return explode('@', $email)[0];
    }
}
