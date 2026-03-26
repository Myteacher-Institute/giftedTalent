<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            if (!Schema::hasColumn('jobs', 'payload')) {
                $table->longText('payload')->nullable()->after('queue');
            } else {
                $table->longText('payload')->nullable()->change();
            }
            if (!Schema::hasColumn('jobs', 'attempts')) {
                $table->unsignedTinyInteger('attempts')->default(0)->after('payload');
            } else {
                DB::statement('ALTER TABLE jobs MODIFY attempts tinyint unsigned NOT NULL DEFAULT 0');
            }
            if (!Schema::hasColumn('jobs', 'reserved_at')) {
                $table->unsignedInteger('reserved_at')->nullable()->after('attempts');
            } else {
                $table->unsignedInteger('reserved_at')->nullable()->change();
            }
            if (!Schema::hasColumn('jobs', 'available_at')) {
                $table->unsignedInteger('available_at')->after('reserved_at');
            } else {
                $table->unsignedInteger('available_at')->change();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->dropColumn(['payload', 'attempts', 'reserved_at', 'available_at']);
        });
    }
};
