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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('bio')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->string('avatar')->nullable();
            $table->string('cover_image')->nullable();
            $table->enum('availability_status', ['available', 'not_available', 'open_to_work'])->default('available');
            $table->enum('availability_type', ['full_time', 'part_time', 'contract', 'freelance', 'internship'])->nullable();
            $table->decimal('expected_salary', 10, 2)->nullable();
            $table->string('currency', 3)->default('USD');
            $table->integer('years_experience')->default(0);
            $table->boolean('is_verified')->default(false);
            $table->string('linkedin_url')->nullable();
            $table->string('github_url')->nullable();
            $table->string('portfolio_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};

