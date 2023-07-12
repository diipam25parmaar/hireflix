<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Answer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * Review an answer
     * POST /api/answers/{id}/review
     */
    public function review(Request $request, $id)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'score'   => 'required|integer|min:0|max:100',
            'comment' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Find the answer or fail
        $answer = Answer::findOrFail($id);

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Update answer review fields
        $answer->score = $request->score ?? $answer->score;
        $answer->review_comment = $request->comment ?? $answer->review_comment;
        $answer->reviewed_by = $user->id;
        $answer->save();

        return response()->json($answer);
    }
}
