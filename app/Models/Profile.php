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
        'position',
        'education',
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

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
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
        return $this->avatar ? \Illuminate\Support\Facades\Storage::url($this->avatar) : null;
    }

    /**
     * Get cover image URL attribute.
     */
    public function getCoverImageUrlAttribute(): ?string
    {
        return $this->cover_image ? \Illuminate\Support\Facades\Storage::url($this->cover_image) : null;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the user's resumes.
     */
    public function resumes(): HasMany
    {
        return $this->hasMany(Resume::class);
    }

    /**
     * Check if user has uploaded CV.
     */
    public function getCvUploadedAttribute(): bool
    {
        return $this->user->resumes()->exists();
    }
}

