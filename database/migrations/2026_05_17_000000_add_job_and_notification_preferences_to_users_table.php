<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('users', 'job_preferences') || !Schema::hasColumn('users', 'notification_preferences')) {
            Schema::table('users', function (Blueprint $table) {
                if (!Schema::hasColumn('users', 'job_preferences')) {
                    $table->json('job_preferences')->nullable()->after('privacy_settings');
                }
                if (!Schema::hasColumn('users', 'notification_preferences')) {
                    $table->json('notification_preferences')->nullable()->after('job_preferences');
                }
            });
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['job_preferences', 'notification_preferences']);
        });
    }
};
