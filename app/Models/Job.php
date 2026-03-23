<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Job extends Model
{
    use HasFactory;

    protected $table = 'job_posts';

    protected $fillable = [
        'user_id',
        'company_name',
        'company_location',
        'job_title',
        'job_type',
        'salary_range',
        'description',
        'status',
        'applicants_count',
        'posted_at'
    ];

    protected $casts = [
        'posted_at' => 'datetime',
        'applicants_count' => 'integer',
        'tags' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class, 'job_id');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'applications');
    }

    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    public function scopeRecommended($query, $userSkills)
    {
        return $query->where(function ($q) use ($userSkills) {
            foreach ($userSkills as $skill) {
                $q->orWhereJsonContains('tags', $skill);
            }
        });
    }
}