<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordResetToken extends Model
{
    // Table name
    protected $table = 'password_reset_tokens';

    // Primary key is not "id"
    protected $primaryKey = 'email';

    // Primary key is not auto-incrementing
    public $incrementing = false;

    // No default timestamps (we only have created_at)
    public $timestamps = false;

    // Mass assignable attributes
    protected $fillable = [
        'email',
        'token',
        'created_at',
    ];
}
