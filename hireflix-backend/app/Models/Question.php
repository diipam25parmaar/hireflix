<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory; // Enables factory methods for testing and seeding

    /**
     * The attributes that are mass assignable.
     * These fields can be filled via create() or update() methods.
     */
    protected $fillable = [
        'interview_id', // ID of the interview this question belongs to
        'text',         // The actual question text
        'position',     // Optional: order/position of the question in the interview
        'max_seconds',  // Optional: maximum allowed duration to answer (in seconds)
    ];

    /**
     * Relationship: The interview this question belongs to.
     * Allows $question->interview to access its parent interview.
     */
    public function interview()
    {
        return $this->belongsTo(Interview::class);
    }

    /**
     * Relationship: All answers submitted for this question.
     * Allows $question->answers to fetch all associated answers.
     */
    public function answers()
    {
        return $this->hasMany(Answer::class);
    }
}
