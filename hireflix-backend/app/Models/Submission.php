<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory; // Enables factory methods for testing and seeding

    /**
     * The attributes that are mass assignable.
     * These fields can be filled via create() or update() methods.
     */
    protected $fillable = [
        'interview_id',   // ID of the interview this submission belongs to
        'candidate_id',   // ID of the candidate who submitted the answers
        'status',         // Status of submission (e.g., 'submitted', 'pending', etc.)
    ];

    /**
     * Relationship: The interview this submission belongs to.
     * Allows $submission->interview to access its parent interview.
     */
    public function interview()
    {
        return $this->belongsTo(Interview::class);
    }

    /**
     * Relationship: The candidate (user) who made this submission.
     * Allows $submission->candidate to fetch the candidate details.
     */
    public function candidate()
    {
        return $this->belongsTo(User::class, 'candidate_id');
    }

    /**
     * Relationship: All answers associated with this submission.
     * Allows $submission->answers to fetch all answer records for this submission.
     */
    public function answers()
    {
        return $this->hasMany(Answer::class);
    }
}
