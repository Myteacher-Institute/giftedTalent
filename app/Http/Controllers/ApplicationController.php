<?php

namespace App\Http\Controllers\Api;

use App\Models\Job;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class ApplicationController extends Controller
{
    /**
     * Apply to a job
     */
    public function store(Request $request, $jobId)
    {
        $job = Job::findOrFail($jobId);
        
        // Check if already applied
        $existingApplication = JobApplication::where('job_id', $jobId)
            ->where('user_id', Auth::id())
            ->first();
            
        if ($existingApplication) {
            return response()->json([
                'success' => false,
                'message' => 'You have already applied to this job'
            ], 400);
        }
        
        // Create application
        $application = JobApplication::create([
            'job_id' => $jobId,
            'user_id' => Auth::id(),
            'cover_letter' => $request->cover_letter,
            'status' => 'under_review'
        ]);
        
        // Increment applicants count
        $job->increment('applicants_count');
        
        return response()->json([
            'success' => true,
            'message' => 'Application submitted successfully',
            'application' => $application
        ]);
    }
}