<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('title')->nullable()->after('name');
            $table->string('company')->nullable()->after('title');
            $table->text('bio')->nullable()->after('company');
            $table->string('avatar')->nullable()->after('bio');
            $table->string('phone')->nullable()->after('email');
            $table->string('location')->nullable()->after('phone');
            $table->string('availability_status')->default('Open to work')->after('location');
            $table->string('employment_type')->default('Full-Time, Remote')->after('availability_status');
            $table->string('start_date')->default('Available Immediately')->after('employment_type');
            $table->json('skills')->nullable()->after('start_date');
            $table->boolean('is_featured')->default(false)->after('skills');
            $table->boolean('profile_completed')->default(false)->after('is_featured');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'title', 'company', 'bio', 'avatar', 'phone', 'location',
                'availability_status', 'employment_type', 'start_date', 'skills',
                'is_featured', 'profile_completed'
            ]);
        });
    }
};