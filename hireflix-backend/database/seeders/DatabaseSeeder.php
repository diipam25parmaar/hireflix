<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Interview;
use App\Models\Question;
use App\Models\Submission;
use App\Models\Answer;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // 5 Admins
        User::factory()->count(5)->admin()->create();

        // 5 Candidates
        User::factory()->count(5)->candidate()->create();

        // 5 Reviewers
        User::factory()->count(5)->reviewer()->create();

        // 5 Interviews per user (for all admins)
        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            Interview::factory()->count(5)->create(['created_by' => $admin->id]);
        }

        // Add 3-5 questions per interview
        Interview::all()->each(function($interview){
            Question::factory()->count(rand(3,5))->create(['interview_id' => $interview->id]);
        });

        // Submissions: Each candidate submits each interview assigned (for simplicity assign all)
        $candidates = User::where('role','candidate')->get();
        $interviews = Interview::all();
        foreach ($candidates as $candidate) {
            foreach ($interviews as $interview) {
                $submission = Submission::factory()->create([
                    'candidate_id' => $candidate->id,
                    'interview_id' => $interview->id,
                ]);

                // Each submission has answers for each question
                $interview->questions->each(function($question) use ($submission){
                    Answer::factory()->create([
                        'submission_id' => $submission->id,
                        'question_id' => $question->id,
                    ]);
                });
            }
        }
    }
}
