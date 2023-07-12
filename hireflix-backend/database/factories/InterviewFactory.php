<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class InterviewFactory extends Factory
{
    protected $model = \App\Models\Interview::class;

    public function definition()
    {
        return [
            'title' => $this->faker->sentence(5),
            'description' => $this->faker->paragraph,
            'created_by' => \App\Models\User::where('role', 'admin')->inRandomOrder()->first()->id,
        ];
    }
}
