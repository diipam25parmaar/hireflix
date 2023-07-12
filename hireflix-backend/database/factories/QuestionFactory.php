<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionFactory extends Factory
{
    protected $model = \App\Models\Question::class;

    public function definition()
    {
        return [
            'interview_id' => \App\Models\Interview::inRandomOrder()->first()->id,
            'text' => $this->faker->sentence(8),
            'position' => $this->faker->numberBetween(1, 5),
            'max_seconds' => $this->faker->numberBetween(30, 300),
        ];
    }
}
