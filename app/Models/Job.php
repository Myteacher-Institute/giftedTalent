<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Job extends Model
{
    use HasFactory;

    protected $table = 'job_postings';

    protected $fillable = [
        'title',
        'company',
        'description',
        'tags',
        'salary_range',
        'location',
        'status',
    ];

    protected $casts = [
        'tags' => 'array',
    ];

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
