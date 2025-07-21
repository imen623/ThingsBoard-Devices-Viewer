<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

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

        $thingsboardDeviceId = $request->input('thingsboard_device_id');

        if ($thingsboardDeviceId) {
            $existingDevice = $user->devices()->where('thingsboard_device_id', $thingsboardDeviceId)->first();

            if ($existingDevice) {
                throw ValidationException::withMessages([
                    'thingsboard_device_id' => ["This ID is already taken by device '{$existingDevice->name}'."],
                ])->status(409);
            }
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:outdoor,indoor,',
            'thingsboard_device_id' => [
                'required',
                'string',
                'uuid', // Keep UUID validation
            ],
        ]);

        $device = $user->devices()->create($validated);

        return response()->json($device, 201);
    }


    /**
     * Update Only device type
     */
    public function update(Request $request, Device $device)
    {
        $user = $this->authenticateUserByThingsboardToken($request);

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Ensure the authenticated user owns this device
        if ($user->id !== $device->user_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Validate only the 'type' field for update
        $validated = $request->validate([
            'type' => 'required|string|in:outdoor,indoor', // Match your frontend options
        ]);

        $device->update($validated);

        return response()->json($device, 200); // Return the updated device
    }

    /**
     * Remove device
     */
    public function destroy(Request $request, Device $device)
    {
        $user = $this->authenticateUserByThingsboardToken($request);

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Ensure the authenticated user owns this device
        if ($user->id !== $device->user_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $device->delete();

        return response()->json(null, 204); // 204 No Content for successful deletion
    }
}