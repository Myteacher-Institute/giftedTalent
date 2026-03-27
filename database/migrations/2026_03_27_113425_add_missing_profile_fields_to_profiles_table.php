<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            // Add fields that are currently in users but missing from profiles
            $table->string('title')->nullable()->after('position');
            $table->string('company')->nullable()->after('title');
            $table->string('employment_type')->nullable()->after('availability_type');
            $table->date('start_date')->nullable()->after('employment_type');
            $table->text('skills')->nullable()->after('start_date');
            $table->boolean('is_featured')->default(false)->after('skills');
        });
    }

    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn([
                'title', 'company', 'employment_type', 
                'start_date', 'skills', 'is_featured'
            ]);
        });
    }
};