<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SubmissionFactory extends Factory
{
    protected $model = \App\Models\Submission::class;

    public function definition()
    {
        $candidate = \App\Models\User::where('role', 'candidate')->inRandomOrder()->first();
        $interview = \App\Models\Interview::inRandomOrder()->first();

        return [
            'interview_id' => $interview->id,
            'candidate_id' => $candidate->id,
            'status' => $this->faker->randomElement(['in_progress', 'submitted']),
        ];
    }
}
