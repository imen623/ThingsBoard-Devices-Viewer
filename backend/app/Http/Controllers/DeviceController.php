<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\User; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class DeviceController extends Controller
{
    /**
     * Authenticate user by ThingsBoard token from Authorization header.
     */
    protected function authenticateUserByThingsboardToken(Request $request): ?User
    {
        $token = $request->bearerToken(); // Get the token from the Authorization: Bearer header

        if (!$token) {
            return null; 
        }

        // Find the user by the thingsboard_token in database
        $user = User::where('thingsboard_token', $token)->first();

        if ($user) {
            Auth::login($user);
            return $user;
        }

        return null;
    }

    /**
     * Get all devices for the authenticated user.
     */
    public function index(Request $request)
    {
        $user = $this->authenticateUserByThingsboardToken($request);

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return response()->json($user->devices);
    }

    /**
     * Store a newly created device in storage.
     */
    public function store(Request $request)
    {
        $user = $this->authenticateUserByThingsboardToken($request);

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:sensor,actuator,controller',
            'thingsboard_device_id' => [
                'required',
                'string',
                'uuid', 
                Rule::unique('devices', 'thingsboard_device_id')->where(function ($query) use ($user) {
                    return $query->where('user_id', $user->id); // Use $user->id here
                }),
            ],
        ]);

        $device = $user->devices()->create($validated); 
        return response()->json($device, 201);
    }

    // add update, show, destroy methods 
}
