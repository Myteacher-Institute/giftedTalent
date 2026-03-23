<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            // Add missing columns if they don't exist
            if (!Schema::hasColumn('jobs', 'description')) {
                $table->text('description')->nullable();
            }
            if (!Schema::hasColumn('jobs', 'status')) {
                $table->string('status')->default('under_review');
            }
            if (!Schema::hasColumn('jobs', 'applicants_count')) {
                $table->integer('applicants_count')->default(0);
            }
            if (!Schema::hasColumn('jobs', 'posted_at')) {
                $table->timestamp('posted_at')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->dropColumn(['description', 'status', 'applicants_count', 'posted_at']);
        });
    }
};