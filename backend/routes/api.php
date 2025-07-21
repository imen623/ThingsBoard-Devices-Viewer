<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DeviceController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


    Route::post('/thingsboard/register', [AuthController::class, 'registerAfterThingsBoard']) ->name('thingsboard.register');
    Route::get('/devices', [DeviceController::class, 'index']); // Get all devices
    Route::post('/devices', [DeviceController::class, 'store']); // Add a new device
    Route::put('/devices/{device}', [DeviceController::class, 'update']); // For updating a device by its ID
    Route::delete('/devices/{device}', [DeviceController::class, 'destroy']); // For deleting a device by its ID