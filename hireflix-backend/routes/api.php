<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\{
    AuthController,
    InterviewController,
    SubmissionController,
    ReviewController,
    CandidateController,
    UserManagementController
};

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where all API routes for the application are registered.
| Routes are grouped by authentication and role-based access.
|
*/

// ---------------------- Public / Auth Routes ----------------------

// Register a new user (anyone can call)
Route::post('/register', [AuthController::class, 'register']);

// Login for existing users
Route::post('/login', [AuthController::class, 'login']);

// Forgot password (offline-friendly token generation)
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

// Reset password using token
Route::post('/reset-password', [AuthController::class, 'resetPassword']);


// ---------------------- Protected Routes (Requires Auth) ----------------------
Route::middleware(['auth:sanctum'])->group(function () {

    // Logout current token
    Route::post('/logout', [AuthController::class, 'logout']);

    // Get current authenticated user info
    Route::get('/me', [AuthController::class, 'me']);


    // ---------------------- Admin-only Routes ----------------------
    Route::middleware('role:admin')->group(function () {

        // CRUD operations for Interviews
        Route::post('/interviews', [InterviewController::class, 'store']); // Create
        Route::put('/interviews/{interview}', [InterviewController::class, 'update']); // Update
        Route::put('/interviews/{interview}/update', [InterviewController::class, 'updateInterview']);
        Route::delete('/interviews/{interview}', [InterviewController::class, 'destroy']); // Delete
        Route::get('/interviews', [InterviewController::class, 'index']); // List all
        Route::get('/interviews/{interview}', [InterviewController::class, 'show']); // View single

        // Assign candidates to an interview
        Route::post('/interviews/{interview}/assign', [InterviewController::class, 'assign']);

        // View all assigned interviews (admin perspective)
        Route::get('/admin/assigned-interviews', [InterviewController::class, 'assignedInterviewsAdmin']);

        // Candidate & user management
        Route::get('/candidates', [CandidateController::class, 'index']); // List all candidates
        Route::get('/users', [UserManagementController::class, 'index']); // List all users (reviewers + candidates)
        Route::post('/users', [UserManagementController::class, 'store']); // Create user
        Route::put('/users/{id}', [UserManagementController::class, 'update']); // Update user
        Route::delete('/users/{id}', [UserManagementController::class, 'destroy']); // Delete user
    });


    // ---------------------- Submissions & Review Routes ----------------------

    // Candidate submits answers (everyone authenticated can submit, but validation in controller)
    Route::post('/submissions', [SubmissionController::class, 'store']);

    // Reviewer & Admin routes
    Route::middleware('role:reviewer,admin')->group(function () {

        // List submissions for a specific interview
        Route::get('/interviews/{interviewId}/submissions', [SubmissionController::class, 'index']);

        // Review an individual answer
        Route::post('/answers/{answerId}/review', [ReviewController::class, 'review']);

        // List all interviews (for reviewer/admin view)
        Route::get('/interviews', [InterviewController::class, 'index']);
    });


    // ---------------------- Candidate-specific Routes ----------------------
    Route::middleware('role:candidate')->group(function () {

        // Get all interviews assigned to the candidate
        Route::get('/candidate/interviews', [CandidateController::class, 'assignedInterviews']);

        // Get submission for a specific interview
        Route::get('/candidate/submission/{interviewId}', [CandidateController::class, 'mySubmission']);

        // Submit answers for a specific interview
        Route::post('/candidate/submit/{interviewId}', [CandidateController::class, 'submitAnswers']);

        // View interview details (assigned interviews)
        Route::get('/interviews/{interview}', [InterviewController::class, 'show']);
    });
});
