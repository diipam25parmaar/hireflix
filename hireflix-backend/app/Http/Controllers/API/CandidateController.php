<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Answer;
use App\Models\Interview;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Http\Request;

class CandidateController extends Controller
{
    /**
     * List all candidates (admin-facing)
     */
    public function index()
    {
        $candidates = User::where('role', 'candidate')
            ->select('id', 'name', 'email')
            ->get();

        return response()->json($candidates);
    }

    /**
     * Get all interviews assigned to the authenticated candidate
     */
    public function assignedInterviews(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        $interviews = $user->assignedInterviews()?->with('questions')->get() ?? collect();

        return response()->json($interviews);
    }

    /**
     * Get submissions made by the candidate for a specific interview
     */
    public function mySubmission(Request $request, $interviewId)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'candidate') {
            return response()->json(['message' => 'Forbidden. Insufficient role.'], 403);
        }

        $submission = Submission::where('interview_id', $interviewId)
            ->where('candidate_id', $user->id)
            ->first();

        if (!$submission) {
            return response()->json(['message' => 'No submission found.'], 404);
        }

        return response()->json($submission);
    }

    /**
     * Submit answers (video files) for a given interview
     */
    public function submitAnswers(Request $request, $interviewId)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'candidate') {
            return response()->json(['message' => 'Forbidden. Insufficient role.'], 403);
        }

        // Check if already submitted
        $alreadySubmitted = Submission::where('interview_id', $interviewId)
            ->where('candidate_id', $user->id)
            ->exists();

        if ($alreadySubmitted) {
            return response()->json([
                'message' => 'You have already submitted this interview. Multiple submissions are not allowed.'
            ], 409);
        }

        // Fetch interview with questions
        $interview = Interview::with('questions')->find($interviewId);

        if (!$interview) {
            return response()->json(['message' => 'Interview not found.'], 404);
        }

        // Validate each question has a corresponding video file
        foreach ($interview->questions ?? [] as $q) {
            if (!$request->hasFile("answers.$q->id.file")) {
                return response()->json(['message' => "Missing video for question: {$q->text}"], 422);
            }
        }

        // Create submission record
        $submission = Submission::create([
            'interview_id' => $interviewId,
            'candidate_id' => $user->id,
        ]);

        // Store videos and create Answer records
        foreach ($interview->questions ?? [] as $q) {
            $file = $request->file("answers.{$q->id}.file");
            $duration = $request->input("answers.{$q->id}.duration_seconds") ?? 0;

            if ($file) {
                $path = $file->store("uploads/answers/{$user->id}/{$interviewId}", "public");

                Answer::create([
                    'submission_id'   => $submission->id,
                    'question_id'     => $q->id,
                    'file_path'       => $path,
                    'duration_seconds'=> $duration,
                ]);
            }
        }

        return response()->json([
            'message' => 'Answers submitted successfully.',
            'submission_id' => $submission->id,
        ]);
    }
}
