<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            if (!Schema::hasColumn('jobs', 'company_location')) {
                $table->string('company_location')->after('company_name');
            }
            if (!Schema::hasColumn('jobs', 'job_title')) {
                $table->string('job_title')->after('company_location');
            }
            if (!Schema::hasColumn('jobs', 'job_type')) {
                $table->string('job_type')->after('job_title');
            }
            if (!Schema::hasColumn('jobs', 'salary_range')) {
                $table->string('salary_range')->after('job_type');
            }
            if (!Schema::hasColumn('jobs', 'description')) {
                $table->text('description')->after('salary_range');
            }
            if (!Schema::hasColumn('jobs', 'status')) {
                $table->string('status')->default('under_review')->after('description');
            }
            if (!Schema::hasColumn('jobs', 'applicants_count')) {
                $table->integer('applicants_count')->default(0)->after('status');
            }
            if (!Schema::hasColumn('jobs', 'posted_at')) {
                $table->timestamp('posted_at')->nullable()->after('applicants_count');
            }
        });
    }

    public function down(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->dropColumn(['company_location', 'job_title', 'job_type', 'salary_range', 'description', 'status', 'applicants_count', 'posted_at']);
        });
    }
};

