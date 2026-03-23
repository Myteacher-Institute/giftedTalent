<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('company_name');
            $table->string('company_location');
            $table->string('job_title');
            $table->string('job_type'); // Full-time, Part-time, Contract
            $table->string('salary_range');
            $table->text('description');
            $table->string('status')->default('under_review'); // active, passed, under_review, hired
            $table->integer('applicants_count')->default(0);
            $table->timestamp('posted_at')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
