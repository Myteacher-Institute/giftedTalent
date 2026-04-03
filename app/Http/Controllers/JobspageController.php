<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Job;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class JobController extends Controller
{
    /**
     * Display the search jobs page.
     */
    public function searchJobs(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login');
        }
        
        // Load user with profile relationship
        $user->load('profile');
        
        // Get profile data
        $profile = $user->profile;
        
        // Log for debugging
        Log::info('SearchJobs page loaded', [
            'user_id' => $user->id,
            'profile_id' => $profile->id ?? null,
            'profile_position' => $profile->position ?? null,
            'profile_city' => $profile->city ?? null,
        ]);
        
        // Get all active jobs
        $jobs = Job::where('status', 'open')
                    ->orderBy('created_at', 'desc')
                    ->get()
                    ->map(function($job) {
                        return [
                            'id' => $job->id,
                            'title' => $job->job_title ?? $job->title ?? 'Job Title',
                            'company' => $job->company_name ?? $job->company ?? 'Company',
                            'location' => $job->company_location ?? $job->location ?? 'Location',
                            'job_type' => $job->job_type ?? 'Full-time',
                            'salary_range' => $job->salary_range ?? $job->salary ?? null,
                            'salary' => $job->salary ?? null,
                            'tags' => is_array($job->required_skills) ? $job->required_skills : [],
                            'posted_at' => $job->created_at ? $job->created_at->diffForHumans() : 'Recently',
                            'easy_apply' => $job->easy_apply ?? false,
                            'urgent' => $job->is_urgent ?? false,
                            'featured' => $job->is_featured ?? false,
                            'experience_level' => $job->experience_level ?? null,
                            'description' => $job->description ?? '',
                            'created_at' => $job->created_at,
                            'image' => $job->logo_url ?? 'https://i.pravatar.cc/40?img=' . $job->id,
                        ];
                    });
        
        // Get saved jobs for this user (using the existing saved_jobs relationship)
        $savedJobs = [];
        try {
            if ($user->savedJobs) {
                $savedJobs = $user->savedJobs()->pluck('job_id')->toArray();
            }
        } catch (\Exception $e) {
            Log::warning('Saved jobs table may not exist yet: ' . $e->getMessage());
            $savedJobs = [];
        }
        
        // Get job types for filter
        $jobTypes = Job::where('status', 'open')
                        ->distinct()
                        ->pluck('job_type')
                        ->filter()
                        ->values()
                        ->toArray();
        
        return Inertia::render('SearchJob', [
            'auth' => [
                'user' => $user,
            ],
            'profile' => $profile, // Pass profile directly with all data
            'initialJobs' => $jobs,
            'savedJobs' => $savedJobs,
            'jobTypes' => $jobTypes,
        ]);
    }
    
    /**
     * Display a single job details.
     */
    public function show($id)
    {
        $user = Auth::user();
        $job = Job::findOrFail($id);
        
        return Inertia::render('JobDetails', [
            'auth' => [
                'user' => $user,
            ],
            'job' => $job,
        ]);
    }
}