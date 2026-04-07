<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('saved_jobs')) {
            Schema::create('saved_jobs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->foreignId('job_id')->constrained('job_posts')->onDelete('cascade');
                $table->boolean('is_saved')->default(true);
                $table->timestamps();
                
                $table->unique(['user_id', 'job_id']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('saved_jobs');
    }
};