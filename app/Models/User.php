<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Job;
use App\Models\Resume;
use App\Models\Skill;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
        'google_id',
        'email_verified_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
        ];
    }

    /**
     * Get the user's profile.
     */
    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class, 'user_id', 'id');
    }

    /**
     * Get the user's skills.
     */
    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'user_skills')
            ->withPivot('proficiency_level', 'years_experience')
            ->withTimestamps();
    }

    /**
     * Get the user's work experiences.
     */
    public function experiences(): HasMany
    {
        return $this->hasMany(Experience::class);
    }

    /**
     * Get the user's resumes.
     */
    public function resumes(): HasMany
    {
        return $this->hasMany(Resume::class);
    }

    /**
     * Get the user's applications.
     */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    /**
     * Get the user's posted jobs.
     */
    public function jobs(): HasMany
    {
        return $this->hasMany(Job::class, 'job_postings');
    }

    public function conversations()
    {
        return $this->belongsToMany(Conversation::class, 'conversations', 'user_one_id', 'user_two_id')
            ->orWhere('user_one_id', $this->id)
            ->orWhere('user_two_id', $this->id);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'user_id');
    }

    public function unreadMessagesCount()
    {
        return $this->messages()
            ->where('is_read', false)
            ->count();
    }

    public function savedJobs(): HasMany
    {
        return $this->hasMany(SavedJob::class);
    }

    public function savedJobsList(): BelongsToMany
    {
        return $this->belongsToMany(Job::class, 'saved_jobs', 'user_id', 'job_id')
            ->withTimestamps()
            ->wherePivot('is_saved', true);
    }

    public function hasSavedJob($jobId): bool
    {
        return $this->savedJobs()->where('job_id', $jobId)->where('is_saved', true)->exists();
    }

    /**
     * Calculate profile completion percentage using data from all related tables
     * 
     * @return int Percentage of profile completion (0-100)
     */
    public function calculateProfileCompletion()
    {
        $score = 0;
        $total = 12; // Total fields to check
        
        // === FROM USERS TABLE ===
        // Personal Information (2 points)
        if (!empty($this->name)) $score++;
        if (!empty($this->email)) $score++;
        
        // Employment Details from users table (2 points)
        if (!empty($this->availability_status)) $score++;
        if (!empty($this->employment_type)) $score++;
        
        // === FROM PROFILES TABLE (via relationship) ===
        $profile = $this->profile;
        
        if ($profile) {
            // Professional Details (3 points)
            if (!empty($profile->title) || !empty($profile->position)) $score++;
            if (!empty($profile->company)) $score++;
            if (!empty($profile->bio)) $score++;
            
            // Contact & Location (2 points)
            if (!empty($profile->phone)) $score++;
            if (!empty($profile->address) || !empty($profile->city)) $score++;
            
            // Education (1 point)
            if (!empty($profile->education)) $score++;
            
            // Social Links (1 point) - at least one social link
            if (!empty($profile->portfolio_url) || !empty($profile->github_url) || !empty($profile->linkedin_url)) {
                $score++;
            }
        }
        
        // === FROM SKILLS TABLE (via relationship) ===
        if ($this->skills()->count() > 0) {
            $score++;
        }
        
        // === FROM RESUMES TABLE (via relationship) ===
        if ($this->resumes()->count() > 0) {
            $score++;
        }
        
        // Calculate percentage
        $percentage = round(($score / $total) * 100);
        
        // Cap at 100
        return min($percentage, 100);
    }

    /**
     * Update profile completion percentage and save to database
     * 
     * @return int The updated completion percentage
     */
    public function updateProfileCompletion()
    {
        $this->profile_completed = $this->calculateProfileCompletion();
        $this->save();
        
        return $this->profile_completed;
    }
}