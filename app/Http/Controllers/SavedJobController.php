<?php

namespace App\Http\Controllers\Api;

use App\Models\Job;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class SavedJobController extends Controller
{
    /**
     * Save a job
     */
    public function store($jobId)
    {
        $job = Job::findOrFail($jobId);
        
        // Check if already saved
        if (Auth::user()->savedJobs()->where('job_id', $jobId)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Job already saved'
            ], 400);
        }
        
        // Save the job
        Auth::user()->savedJobs()->attach($jobId);
        
        return response()->json([
            'success' => true,
            'message' => 'Job saved successfully'
        ]);
    }
    
    /**
     * Unsave a job
     */
    public function destroy($jobId)
    {
        $job = Job::findOrFail($jobId);
        
        // Remove saved job
        Auth::user()->savedJobs()->detach($jobId);
        
        return response()->json([
            'success' => true,
            'message' => 'Job removed from saved'
        ]);
    }
}