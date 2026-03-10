<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'bio',
        'phone',
        'address',
        'city',
        'country',
        'avatar',
        'cover_image',
        'availability_status',
        'availability_type',
        'expected_salary',
        'currency',
        'years_experience',
        'is_verified',
        'linkedin_url',
        'github_url',
        'portfolio_url',
    ];

    protected $casts = [
        'expected_salary' => 'decimal:2',
        'years_experience' => 'integer',
        'is_verified' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

