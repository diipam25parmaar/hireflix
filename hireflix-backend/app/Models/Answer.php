<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * These fields can be filled via create() or update() methods.
     */
    protected $fillable = [
        'submission_id',    // ID of the submission this answer belongs to
        'question_id',      // ID of the related question
        'file_path',        // Path or URL to the uploaded answer file (video/audio)
        'duration_seconds', // Duration of the answer in seconds
        'score',            // Reviewer-assigned score (0-100)
        'review_comment',   // Reviewer comment
        'reviewed_by',      // User ID of the reviewer
    ];

    /**
     * Relationship: An Answer belongs to a Submission.
     * Allows $answer->submission to access the submission details.
     */
    public function submission()
    {
        return $this->belongsTo(Submission::class);
    }

    /**
     * Relationship: An Answer belongs to a Question.
     * Allows $answer->question to access the question details.
     */
    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    /**
     * Relationship: The reviewer who reviewed this answer.
     * Allows $answer->reviewer to access reviewer (User model).
     */
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
