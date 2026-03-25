<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Migration disabled - fields already merged into create_resumes_table
        // Schema::table('resumes', function (Blueprint $table) {
        //     $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
        //     $table->text('feedback')->nullable();
        //     $table->timestamp('reviewed_at')->nullable();
        //     $table->unsignedBigInteger('reviewer_id')->nullable();
        //     $table->foreign('reviewer_id')->references('id')->on('users');
        // });
    }

    public function down(): void
    {
        Schema::table('resumes', function (Blueprint $table) {
            $table->dropForeign(['reviewer_id']);
            $table->dropColumn(['status', 'feedback', 'reviewed_at', 'reviewer_id']);
        });
    }
};

