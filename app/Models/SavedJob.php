<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavedJob extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'job_id',
        'is_saved'
    ];

    protected $casts = [
        'is_saved' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    public function scopeSaved($query)
    {
        return $query->where('is_saved', true);
    }
}