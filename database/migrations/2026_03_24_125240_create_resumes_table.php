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
        Schema::create('resumes', function (Blueprint $table) {
            
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');                      
            $table->string('file_name');                      
            $table->integer('file_size')->nullable();                   
            $table->string('file_mime_type')->nullable();             
            $table->string('file_path')->nullable();               
            $table->longText('file_base64')->nullable();                
            $table->boolean('is_primary')->default(false);        
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');                                
            $table->text('feedback')->nullable();                     
            $table->timestamp('reviewed_at')->nullable();              
            $table->foreignId('reviewer_id')->nullable()->constrained('users')->nullOnDelete();                                    
            $table->timestamps();             
            // Indexes for better performance
            $table->index(['user_id', 'status']);
            $table->index('is_primary');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resumes');
    }
};