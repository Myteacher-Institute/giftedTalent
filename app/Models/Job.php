<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $table = 'job_posts'; // Use the new table name
    
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
        'applicants_count' => 'integer'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class, 'job_id');
    }
}