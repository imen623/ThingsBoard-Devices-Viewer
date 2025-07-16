<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException; // <--- Import this

class DeviceController extends Controller
{
    /**
     * Authenticate user by ThingsBoard token from Authorization header.
     * @param Request $request
     * @return User|null
     */
    protected function authenticateUserByThingsboardToken(Request $request): ?User
    {
        $token = $request->bearerToken();

        if (!$token) {
            return null;
        }

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

        // --- CRUCIAL CHANGE START ---
        // Manually check for existing device_id for this user BEFORE general validation
        $thingsboardDeviceId = $request->input('thingsboard_device_id');

        if ($thingsboardDeviceId) {
            $existingDevice = $user->devices()->where('thingsboard_device_id', $thingsboardDeviceId)->first();

            if ($existingDevice) {
                // If device ID is taken by another device of this user, return a custom error
                throw ValidationException::withMessages([
                    'thingsboard_device_id' => ["This ID is already taken by device '{$existingDevice->name}'."],
                ])->status(409); // Use 409 Conflict for this specific case
            }
        }
        // --- CRUCIAL CHANGE END ---

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:sensor,actuator,controller',
            'thingsboard_device_id' => [
                'required',
                'string',
                'uuid', // Keep UUID validation
                // Removed Rule::unique here as we are handling uniqueness manually above
            ],
        ]);

        $device = $user->devices()->create($validated);

        return response()->json($device, 201);
    }
}
