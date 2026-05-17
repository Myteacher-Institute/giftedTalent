<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('users', 'appearance_settings')) {
            Schema::table('users', function (Blueprint $table) {
                $table->json('appearance_settings')->nullable()->after('notification_preferences');
            });
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('appearance_settings');
        });
    }
};
