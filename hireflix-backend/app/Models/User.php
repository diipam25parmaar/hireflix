<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    // SoftDeletes column
    protected $dates = ['deleted_at'];

    /**
     * The attributes that are mass assignable.
     * These fields can be used in create() or update().
     *
     * @var array<int,string>
     */
    protected $fillable = [
        'name',      // User's full name
        'email',     // User email (unique)
        'password',  // Hashed password
        'role',      // Role: candidate, reviewer, admin
    ];

    /**
     * The attributes that should be hidden for arrays.
     * Useful when converting model to JSON.
     *
     * @var array<int,string>
     */
    protected $hidden = [
        'password',        // Hide password in responses
        'remember_token',  // Hide remember token
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string,string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime', // Cast email verification time
    ];

    /**
     * Relationship: Interviews assigned to the candidate.
     * Pivot table: interview_candidate (candidate_id, interview_id)
     * Allows: $user->assignedInterviews
     */
    public function assignedInterviews()
    {
        return $this->belongsToMany(
            Interview::class,
            'interview_candidate', // pivot table
            'candidate_id',        // foreign key on pivot table for this model
            'interview_id'         // foreign key on pivot table for related model
        );
    }
}
