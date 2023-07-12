<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Interview extends Model
{
    use HasFactory, SoftDeletes; // Enables factory and soft delete features

    /**
     * The attributes that are mass assignable.
     * These fields can be filled via create() or update() methods.
     */
    protected $fillable = [
        'title',       // Title of the interview
        'description', // Optional description of the interview
        'created_by',  // User ID of the creator (admin)
    ];

    /**
     * Relationship: An Interview has many Questions.
     * Allows $interview->questions to fetch all associated questions.
     */
    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    /**
     * Relationship: The creator (admin) of the interview.
     * Allows $interview->creator to fetch the user who created the interview.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Relationship: An Interview has many Submissions.
     * Allows $interview->submissions to access all candidate submissions.
     */
    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }

    /**
     * Relationship: Candidates assigned to this interview.
     * Many-to-many via pivot table 'interview_candidate'.
     * Allows $interview->candidates to fetch all assigned candidates.
     */
    public function candidates()
    {
        return $this->belongsToMany(
            User::class,
            'interview_candidate', // Pivot table
            'interview_id',        // Foreign key for this model in pivot
            'candidate_id'         // Foreign key for related model in pivot
        )
        ->select('users.id', 'users.name', 'users.email'); // Select only essential fields to avoid ambiguity
    }
}
