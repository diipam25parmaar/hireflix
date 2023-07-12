<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    protected $model = \App\Models\User::class;

    public function definition()
    {
        $roles = ['admin', 'candidate', 'reviewer'];

        return [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'role' => $this->faker->randomElement($roles),
            'password' => Hash::make('password'), // default password
            'email_verified_at' => now(),
        ];
    }

    public function admin() { return $this->state(fn() => ['role' => 'admin']); }
    public function candidate() { return $this->state(fn() => ['role' => 'candidate']); }
    public function reviewer() { return $this->state(fn() => ['role' => 'reviewer']); }
}
