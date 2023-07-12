<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class AnswerFactory extends Factory
{
    protected $model = \App\Models\Answer::class;

    public function definition()
    {
        $submission = \App\Models\Submission::inRandomOrder()->first();
        $candidate_id = $submission->candidate_id;
        $interview_id = $submission->interview_id;

        return [
            'submission_id' => $submission->id,
            'question_id' => \App\Models\Question::where('interview_id', $interview_id)->inRandomOrder()->first()->id,
            'file_path' => "uploads/answers/{$candidate_id}/{$interview_id}/" . Str::random(32) . ".mp4",
            'duration_seconds' => $this->faker->numberBetween(30, 300),
            'score' => $this->faker->numberBetween(0, 100),
            'review_comment' => $this->faker->optional()->sentence(),
            'reviewed_by' => \App\Models\User::where('role', 'reviewer')->inRandomOrder()->first()->id,
        ];
    }
}
