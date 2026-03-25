<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('saved_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('job_id')->constrained('job_postings')->onDelete('cascade');
            $table->boolean('is_saved')->default(true);
            $table->timestamps();
            
            // Prevent duplicate saves
            $table->unique(['user_id', 'job_id']);
            
            // Add indexes
            $table->index(['user_id', 'is_saved']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('saved_jobs');
    }
};