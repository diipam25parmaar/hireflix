<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Interview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InterviewController extends Controller
{
    /**
     * List all interviews (open to all authenticated users)
     */
    public function index()
    {
        $interviews = Interview::with('questions')->latest()->get() ?? collect();
        return response()->json($interviews);
    }

    /**
     * Store a new interview (admin only)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'questions' => 'required|array|min:1',
            'questions.*.text' => 'required|string',
            'questions.*.position' => 'nullable|integer',
            'questions.*.max_seconds' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Create interview
        $interview = Interview::create([
            'title' => $request->title,
            'description' => $request->description ?? '',
            'created_by' => $user->id,
        ]);

        // Prepare questions array with defaults
        $questions = array_map(function ($q) {
            return [
                'text' => $q['text'],
                'position' => $q['position'] ?? 0,
                'max_seconds' => $q['max_seconds'] ?? null,
            ];
        }, $request->questions ?? []);

        // Create questions related to interview
        $interview->questions()->createMany($questions);

        return response()->json($interview->load('questions'), 201);
    }

    /**
     * Show a single interview with questions
     */
    public function show(Interview $interview)
    {
        return response()->json($interview->load('questions'));
    }

    /**
     * Update interview (admin only)
     */
    public function update(Request $request, Interview $interview)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Optionally, enforce policy or admin check
        // $this->authorize('update', $interview);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $interview->update([
            'title' => $request->title,
            'description' => $request->description ?? $interview->description,
        ]);

        return response()->json($interview->load('questions'));
    }

    /**
     * Delete an interview
     */
    public function destroy(Interview $interview)
    {
        $interview->delete();
        return response()->json(['message' => 'Interview deleted successfully.']);
    }

    /**
     * Assign users (candidates) to an interview (admin only)
     */
    public function assign(Request $request, Interview $interview)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        $userIds = $request->input('user_ids') ?? [];

        // Assign users without removing existing assignments
        $interview->candidates()->syncWithoutDetaching($userIds);

        return response()->json(['message' => 'Assigned successfully.'], 200);
    }

    /**
     * Admin: view all interviews with assigned candidates
     */
    public function assignedInterviewsAdmin()
    {
        $interviews = Interview::with('candidates:id,name,email')->get() ?? collect();
        return response()->json($interviews);
    }
}
