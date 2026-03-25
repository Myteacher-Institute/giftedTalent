<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PageController extends Controller
{
    // Add this method for the search jobs page
    public function searchJobs(Request $request)
    {
        // Get active jobs
        $jobs = Job::where('status', 'active')
            ->orderBy('posted_at', 'desc')
            ->get();
        
        // Transform jobs to match frontend expectations
        $formattedJobs = $jobs->map(function($job) {
            return [
                'id' => $job->id,
                'title' => $job->job_title,
                'company' => $job->company_name,
                'location' => $job->company_location,
                'description' => $job->description,
                'job_type' => $job->job_type,
                'salary_range' => $job->salary_range,
                'easy_apply' => true, // You can add this field to your jobs table if needed
                'tags' => [$job->job_type],
                'posted_at' => $job->posted_at ? $job->posted_at->diffForHumans() : 'Recently posted',
            ];
        });
        
        // Get saved jobs for this user
        $savedJobIds = [];
        if (Auth::check()) {
            $savedJobIds = Auth::user()->savedJobs()->pluck('job_id')->toArray();
        }
        
        return Inertia::render('SearchJob', [
            'auth' => [
                'user' => Auth::user()
            ],
            'initialJobs' => $formattedJobs,
            'savedJobs' => $savedJobIds
        ]);
    }
    
    // Keep your other methods...
    public function findJobs()
    {
        return Inertia::render('FindJobs');
    }
    
    public function findTalents()
    {
        return Inertia::render('FindTalents');
    }
    
    public function howItWorks()
    {
        return Inertia::render('HowItWorks');
    }
    
    public function about()
    {
        return Inertia::render('About');
    }
    
    public function easyApplyJob()
    {
        return Inertia::render('EasyApplyJob');
    }
    
    public function jobs()
    {
        $jobs = Job::latest()->get();
        
        return Inertia::render('Jobs', [
            'jobs' => $jobs
        ]);
    }
}