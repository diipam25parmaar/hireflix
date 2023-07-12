<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserManagementController extends Controller
{
    // ============================
    // List all candidates & reviewers
    // ============================
    public function index()
    {
        $users = User::whereIn('role', ['candidate', 'reviewer'])->get();
        return response()->json($users);
    }

    // ============================
    // Store new candidate/reviewer
    // ============================
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => ['required', Rule::in(['candidate', 'reviewer'])],
        ]);

        // Hash password
        $validated['password'] = Hash::make($validated['password']);

        // Create user
        $user = User::create($validated);

        return response()->json([
            'message' => 'User created successfully',
            'user'    => $user
        ], 201);
    }

    // ============================
    // Update user details
    // ============================
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $validated = $request->validate([
            'name'     => 'sometimes|string|max:100',
            'email'    => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6',
            'role'     => ['sometimes', Rule::in(['candidate', 'reviewer'])],
        ]);

        // Hash password if provided
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully',
            'user'    => $user
        ]);
    }

    // ============================
    // Delete user (soft delete)
    // ============================
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User soft deleted successfully']);
    }
}
