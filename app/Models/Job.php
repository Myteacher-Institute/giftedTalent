<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Job extends Model
{
    use HasFactory;

    protected $table = 'jobs';

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

    protected function casts(): array
    {
        return [
            'posted_at' => 'datetime',
            'applicants_count' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }
}
