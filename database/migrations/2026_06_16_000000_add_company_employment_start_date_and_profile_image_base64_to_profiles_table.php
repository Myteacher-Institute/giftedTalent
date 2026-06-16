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
        Schema::table('profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('profiles', 'company')) {
                $table->string('company')->nullable()->after('education');
            }

            if (!Schema::hasColumn('profiles', 'employment_type')) {
                $table->string('employment_type')->nullable()->after('company');
            }

            if (!Schema::hasColumn('profiles', 'start_date')) {
                $table->string('start_date')->nullable()->after('employment_type');
            }

            if (!Schema::hasColumn('profiles', 'profile_image_base64')) {
                $table->longText('profile_image_base64')->nullable()->after('cover_image');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn([
                'company',
                'employment_type',
                'start_date',
                'profile_image_base64',
            ]);
        });
    }
};
