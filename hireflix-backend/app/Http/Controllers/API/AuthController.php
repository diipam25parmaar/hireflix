<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\User;
use App\Models\PasswordResetToken;

class AuthController extends Controller
{
    // ============================
    // Register new user
    // ============================
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'role'     => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role ?? 'candidate',
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'User registered',
            'user'    => $user,
            'token'   => $token,
        ], 201);
    }

    // ============================
    // Login user
    // ============================
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password ?? '', $user->password ?? '')) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Logged in',
            'user'    => $user,
            'token'   => $token,
        ], 200);
    }

    // ============================
    // Logout user (current token)
    // ============================
    public function logout(Request $request)
    {
        if ($request->user()?->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json(['message' => 'Logged out'], 200);
    }

    // ============================
    // Get current logged-in user
    // ============================
    public function me(Request $request)
    {
        return response()->json($request->user(), 200);
    }

    // ============================
    // Forgot password (offline-friendly)
    // ============================
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $email = $request->email;
        $user = User::where('email', $email)->first();

        if (! $user) {
            return response()->json(['message' => 'No user found with this email'], 404);
        }

        // Generate raw token and store hashed version via Eloquent
        $rawToken = Str::random(64);
        $hashedToken = Hash::make($rawToken);

        PasswordResetToken::updateOrCreate(
            ['email' => $email],
            [
                'token'      => $hashedToken,
                'created_at' => Carbon::now(),
            ]
        );

        $offline = env('OFFLINE_PASSWORD_RESET', true);

        if ($offline) {
            return response()->json([
                'message' => 'Password reset token generated (offline mode). Use this token to reset your password.',
                'token'   => $rawToken,
            ], 200);
        }

        return response()->json([
            'message' => 'If an account with that email exists, a password reset link has been sent.'
        ], 200);
    }

    // ============================
    // Reset password
    // ============================
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'                 => 'required|email',
            'token'                 => 'required|string',
            'password'              => 'required|string|min:6|confirmed',
            'password_confirmation' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $email = $request->email;
        $record = PasswordResetToken::where('email', $email)->first();

        if (! $record?->token) {
            return response()->json(['message' => 'Invalid or expired token (no record found)'], 400);
        }

        // Check token expiry (60 minutes)
        $createdAt = $record->created_at ? Carbon::parse($record->created_at) : null;
        if ($createdAt?->addMinutes(60)->isPast()) {
            $record->delete();
            return response()->json(['message' => 'Token expired. Please request a new one.'], 400);
        }

        // Verify hashed token
        if (! Hash::check($request->token ?? '', $record->token ?? '')) {
            return response()->json(['message' => 'Invalid token'], 400);
        }

        $user = User::where('email', $email)->first();

        if (! $user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Update user password
        $user->password = Hash::make($request->password);
        $user->save();

        // Delete token entry via Eloquent
        $record->delete();

        // Return new Sanctum token (same shape as login)
        $newToken = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Password reset successful',
            'user'    => $user,
            'token'   => $newToken,
        ], 200);
    }
}
