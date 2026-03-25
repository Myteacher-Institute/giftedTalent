<?php
// app/Models/Resume.php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Resume extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'title',
        'file_path',
        'file_base64',
        'file_name',
        'file_size',
        'file_mime_type',
        'is_primary',
        'status',
        'feedback',
        'reviewed_at',
        'reviewer_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'file_size' => 'integer',
            'is_primary' => 'boolean',
            'reviewed_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the data URL for the file (base64 with mime type)
     * Example: data:application/pdf;base64,JVBERi0xLjQK...
     */
    public function getDataUrlAttribute(): ?string
    {
        if ($this->file_base64 && $this->file_mime_type) {
            return 'data:' . $this->file_mime_type . ';base64,' . $this->file_base64;
        }
        return null;
    }

    /**
     * Get the base64 encoded file content
     */
    public function getBase64ContentAttribute(): ?string
    {
        return $this->file_base64;
    }


    public function getHumanFileSizeAttribute(): string
    {
        if (!$this->file_size) {
            return '0 KB';
        }
        
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = floor(log($bytes, 1024));
        
        return round($bytes / pow(1024, $i), 2) . ' ' . $units[$i];
    }

  
    public function getFileExtensionAttribute(): string
    {
        return pathinfo($this->file_name, PATHINFO_EXTENSION);
    }

   
    public function getIsPdfAttribute(): bool
    {
        return $this->file_mime_type === 'application/pdf';
    }

   
    public function getIsWordAttribute(): bool
    {
        return in_array($this->file_mime_type, [
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]);
    }

   
    public function getStatusBadgeClassAttribute(): string
    {
        return match($this->status) {
            'approved' => 'bg-green-100 text-green-800',
            'rejected' => 'bg-red-100 text-red-800',
            default => 'bg-yellow-100 text-yellow-800',
        };
    }


    public function getStatusTextAttribute(): string
    {
        return match($this->status) {
            'approved' => 'Approved',
            'rejected' => 'Rejected',
            default => 'Pending Review',
        };
    }

   
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

  
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

   
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    /**
     * Scope for primary resumes
     */
    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

   
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

  
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

   
    protected static function boot()
    {
        parent::boot();
        
        // Auto-set file_mime_type if not set when file_base64 is set
        static::saving(function ($model) {
            if ($model->file_base64 && !$model->file_mime_type) {
                // Try to detect MIME type from file_name
                $extension = strtolower(pathinfo($model->file_name, PATHINFO_EXTENSION));
                $mimeTypes = [
                    'pdf' => 'application/pdf',
                    'doc' => 'application/msword',
                    'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                ];
                $model->file_mime_type = $mimeTypes[$extension] ?? 'application/octet-stream';
            }
        });
    }
}