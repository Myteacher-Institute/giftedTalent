<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Job extends Model
{
    use HasFactory;

    protected $table = 'job_posts';

    protected $fillable = [
        'user_id',
        'company_name',
        'company_logo_url',
        'company_location',
        'job_title',
        'job_type',
        'salary_range',
        'description',
        'status',
        'applicants_count',
        'posted_at',
        'application_link',
        'tags',
    ];

    protected function casts(): array
    {
        return [
            'posted_at'        => 'datetime',
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

    public function getTagsAttribute($value)
    {
        if (empty($value)) {
            return [];
        }

        $tags = json_decode($value, true);
        if (is_array($tags)) {
            return $tags;
        }

        // If it's already a string like '["React","PHP"]'
        if (is_string($value) && str_starts_with($value, '[')) {
            return json_decode($value, true) ?? [];
        }

        return [];
    }

    public function setTagsAttribute($value)
    {
        if (is_array($value)) {
            $this->attributes['tags'] = json_encode($value);
        } else {
            $this->attributes['tags'] = $value;
        }
    }
}
