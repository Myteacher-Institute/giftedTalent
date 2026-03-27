<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'position',
        'title',                    // Added
        'company',                  // Added
        'education',
        'availability_status',
        'availability_type',
        'employment_type',          // Added
        'start_date',               // Added
        'skills',                   // Added
        'is_featured',              // Added
        'expected_salary',
        'currency',
        'years_experience',
        'is_verified',
        'linkedin_url',
        'github_url',
        'portfolio_url',
        'profile_image_base64',
    ];

    protected $casts = [
        'expected_salary' => 'decimal:2',
        'years_experience' => 'integer',
        'is_verified' => 'boolean',
        'is_featured' => 'boolean',
        'start_date' => 'date',
    ];

    /**
     * The accessors to append to the model's array form.
     */
    protected $appends = [
        'avatar_url',
        'cover_image_url',
    ];

    /**
     * Get avatar URL attribute.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        // First check for base64 image
        if ($this->profile_image_base64) {
            return $this->profile_image_base64;
        }
        return $this->avatar ? \Illuminate\Support\Facades\Storage::url($this->avatar) : null;
    }

    /**
     * Get cover image URL attribute.
     */
    public function getCoverImageUrlAttribute(): ?string
    {
        return $this->cover_image ? \Illuminate\Support\Facades\Storage::url($this->cover_image) : null;
    }

    /**
     * Get the user that owns the profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Get the user's resumes through profile.
     */
    public function resumes(): HasMany
    {
        return $this->hasMany(Resume::class);
    }
}