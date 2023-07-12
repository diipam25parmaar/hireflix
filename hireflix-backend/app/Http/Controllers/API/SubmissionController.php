<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Answer;
use App\Models\Interview;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class SubmissionController extends Controller
{
    /**
     * Candidate uploads answers for an interview
     * Expect multipart/form-data:
     * - interview_id
     * - answers[<question_id>] => file
     * - optional answers_meta[<question_id>][duration_seconds]
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'interview_id' => 'required|exists:interviews,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $interview = Interview::findOrFail($request->interview_id);

        // Create submission record
        $submission = Submission::create([
            'interview_id' => $interview->id,
            'candidate_id' => $user->id,
            'status' => 'submitted',
        ]);

        // Process uploaded files: answers array keys = question IDs
        $files = $request->file('answers', []);

        foreach ($files as $question_id => $file) {
            if (!$file?->isValid()) {
                continue;
            }

            // Generate unique filename and store
            $ext = $file->getClientOriginalExtension();
            $filename = Str::random(12) . '.' . $ext;
            $path = $file->storeAs("public/submissions/{$submission->id}/{$question_id}", $filename);

            // Generate full accessible URL
            $file_path = asset(Storage::url(str_replace('public/', '', $path)));

            // Optional duration
            $duration = $request->input('answers_meta.' . $question_id . '.duration_seconds');
            $duration = $duration ? (int) $duration : null;

            // Save answer
            Answer::create([
                'submission_id' => $submission->id,
                'question_id' => $question_id,
                'file_path' => $file_path,
                'duration_seconds' => $duration,
            ]);
        }

        return response()->json($submission->load('answers.question'), 201);
    }

    /**
     * Reviewer: list submissions for an interview
     */
    public function index($interviewId)
    {
        $user = request()->user();
        if (!$user || !in_array($user->role, ['admin', 'reviewer'])) {
            return response()->json(['message' => 'Forbidden. Insufficient role.'], 403);
        }

        $submissions = Submission::with([
            'candidate:id,name,email',
            'answers.question:id,text,max_seconds',
            'answers.reviewer:id,name,email'
        ])->where('interview_id', $interviewId)->get();

        // Ensure all file paths are fully accessible URLs
        $submissions->transform(function ($submission) {
            $submission->answers->transform(function ($ans) {
                if ($ans->file_path && !str_starts_with($ans->file_path, 'http')) {
                    $ans->file_path = asset(Storage::url(str_replace('public/', '', $ans->file_path)));
                }
                return $ans;
            });
            return $submission;
        });

        return response()->json($submissions);
    }

    /**
     * Show one submission with answers and questions
     */
    public function show($id)
    {
        $submission = Submission::with(['candidate', 'answers.question'])->findOrFail($id);

        $submission->answers->transform(function ($ans) {
            if ($ans->file_path && !str_starts_with($ans->file_path, 'http')) {
                $ans->file_path = asset(Storage::url(str_replace('public/', '', $ans->file_path)));
            }
            return $ans;
        });

        return response()->json($submission);
    }
}
