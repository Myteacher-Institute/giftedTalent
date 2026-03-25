<?php

namespace App\Http\Controllers\Api;

use App\Models\Job;
use App\Models\SavedJob;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class SavedJobController extends Controller
{
    /**
     * Get all saved jobs for the authenticated user
     */
    public function index()
    {
        $savedJobs = Auth::user()
            ->savedJobsList()
            ->with('user')
            ->latest()
            ->paginate(12);

        return response()->json([
            'success' => true,
            'data' => $savedJobs
        ]);
    }

    /**
     * Save a job
     */
    public function store($jobId)
    {
        $job = Job::findOrFail($jobId);
        
        // Check if already saved
        $existing = SavedJob::where('user_id', Auth::id())
            ->where('job_id', $jobId)
            ->first();
        
        if ($existing) {
            // If exists but is_saved is false, update it
            if (!$existing->is_saved) {
                $existing->update(['is_saved' => true]);
                return response()->json([
                    'success' => true,
                    'message' => 'Job saved successfully',
                    'saved' => true
                ]);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Job already saved',
                'saved' => true
            ], 400);
        }
        
        // Save the job
        SavedJob::create([
            'user_id' => Auth::id(),
            'job_id' => $jobId,
            'is_saved' => true
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Job saved successfully',
            'saved' => true
        ]);
    }
    
    /**
     * Unsave a job
     */
    public function destroy($jobId)
    {
        $savedJob = SavedJob::where('user_id', Auth::id())
            ->where('job_id', $jobId)
            ->firstOrFail();
        
        $savedJob->update(['is_saved' => false]);
        
        return response()->json([
            'success' => true,
            'message' => 'Job removed from saved',
            'saved' => false
        ]);
    }
    
    /**
     * Check if a job is saved
     */
    public function check($jobId)
    {
        $isSaved = SavedJob::where('user_id', Auth::id())
            ->where('job_id', $jobId)
            ->where('is_saved', true)
            ->exists();
        
        return response()->json([
            'success' => true,
            'saved' => $isSaved
        ]);
    }
    
    /**
     * Get count of saved jobs
     */
    public function count()
    {
        $count = SavedJob::where('user_id', Auth::id())
            ->where('is_saved', true)
            ->count();
        
        return response()->json([
            'success' => true,
            'count' => $count
        ]);
    }
}