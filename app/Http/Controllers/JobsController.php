<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Job;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class JobsController extends Controller
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
        
        // Load user with profile
        $user->load('profile');
        $profile = $user->profile;
        
        $userSkills = $user->skills()->pluck('name')->toArray();
        
        // Get user's job title
        $userTitle = $profile->position ?? $profile->title ?? $user->title ?? '';
        
        // Get all jobs from the job_posts table
        $allJobs = Job::orderBy('created_at', 'desc')->get();
        
        // Separate jobs into recommended and regular
        $recommendedJobs = [];
        $regularJobs = [];
        
        foreach ($allJobs as $job) {
            $matchScore = 0;
            
            // Calculate match score based on skills - USING 'tags' column
            $jobSkills = is_array($job->tags) ? $job->tags : [];
            if (!empty($jobSkills) && !empty($userSkills)) {
                $matchingSkills = array_intersect(
                    array_map('strtolower', $userSkills),
                    array_map('strtolower', $jobSkills)
                );
                if (count($jobSkills) > 0) {
                    $matchScore = (count($matchingSkills) / count($jobSkills)) * 100;
                }
            }
            
            // Boost score if title matches
            $jobTitle = strtolower($job->job_title ?? '');
            if (!empty($userTitle) && !empty($jobTitle) && str_contains($jobTitle, strtolower($userTitle))) {
                $matchScore = min($matchScore + 20, 100);
            }
            
            $jobData = [
                'id' => $job->id,
                'title' => $job->job_title ?? 'Job Title',
                'company' => $job->company_name ?? 'Company',
                'location' => $job->company_location ?? 'Location',
                'job_type' => $job->job_type ?? 'Full-time',
                'salary_range' => $job->salary_range ?? null,
                'description' => $job->description ?? '',
                'tags' => is_array($job->tags) ? $job->tags : [],
                'posted_at' => $job->created_at ? $job->created_at->diffForHumans() : 'Recently',
                'easy_apply' => $job->easy_apply ?? false,
                'application_link' => $job->application_link ?? null,
                'match_score' => round($matchScore),
                'image' => $job->logo_url ?? 'https://i.pravatar.cc/40?img=' . $job->id,
                'created_at' => $job->created_at,
            ];
            
            if ($matchScore >= 30) {
                $recommendedJobs[] = $jobData;
            } else {
                $regularJobs[] = $jobData;
            }
        }
        
        // Sort recommended by match score
        usort($recommendedJobs, function($a, $b) {
            return $b['match_score'] - $a['match_score'];
        });
        
        // Get saved jobs
        $savedJobs = DB::table('saved_jobs')
                        ->where('user_id', $user->id)
                        ->pluck('job_id')
                        ->toArray();
        
        return Inertia::render('SearchJob', [
            'auth' => ['user' => $user],
            'profile' => $profile,
            'recommendedJobs' => $recommendedJobs,
            'exploreJobs' => $regularJobs,
            'savedJobs' => $savedJobs,
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
    
    /**
     * Display all jobs for Find Jobs page
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get all active jobs
        $jobs = Job::where('status', 'active')
                    ->orderBy('created_at', 'desc')
                    ->get()
                    ->map(function($job) {
                        return [
                            'id' => $job->id,
                            'title' => $job->job_title ?? 'Job Title',
                            'company' => $job->company_name ?? 'Company',
                            'location' => $job->company_location ?? 'Location',
                            'job_type' => $job->job_type ?? 'Full-time',
                            'salary_range' => $job->salary_range ?? null,
                            'description' => $job->description ?? '',
                            'tags' => is_array($job->tags) ? $job->tags : [],
                            'posted_at' => $job->created_at ? $job->created_at->diffForHumans() : 'Recently',
                            'easy_apply' => $job->easy_apply ?? false,
                            'is_featured' => $job->is_featured ?? false,
                            'company_logo' => $job->logo_url ?? null,
                            'created_at' => $job->created_at,
                        ];
                    });
        
        // Get job types for filter
        $jobTypes = Job::where('status', 'active')
                        ->distinct()
                        ->pluck('job_type')
                        ->filter()
                        ->values()
                        ->toArray();
        
        return Inertia::render('FindJobs', [
            'auth' => ['user' => $user],
            'jobs' => $jobs,
            'jobTypes' => $jobTypes,
        ]);
    }
    
    /**
     * Get recommended jobs for dashboard based on user profile
     */
    public function recommended()
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([]);
        }
        
        $userSkills = $user->skills()->pluck('name')->toArray();
        
        // Get user's job title from profile
        $userTitle = $user->profile?->position ?? $user->profile?->title ?? $user->title ?? '';
        
        // Get all active jobs
        $jobs = Job::where('status', 'active')->get();
        
        // Calculate match score for each job
        $recommendedJobs = $jobs->map(function($job) use ($userSkills, $userTitle) {
            $matchScore = 0;
            $matchReasons = [];
            
            // Check skills match (70% weight) - USING 'tags' column
            $jobSkills = is_array($job->tags) ? $job->tags : [];
            if (!empty($jobSkills) && !empty($userSkills)) {
                $matchingSkills = array_intersect(
                    array_map('strtolower', $userSkills),
                    array_map('strtolower', $jobSkills)
                );
                $skillsMatchPercentage = count($matchingSkills) / count($jobSkills) * 70;
                $matchScore += $skillsMatchPercentage;
                if (count($matchingSkills) > 0) {
                    $matchReasons[] = count($matchingSkills) . ' skill(s) match';
                }
            }
            
            // Check title match (30% weight)
            $jobTitle = strtolower($job->job_title ?? '');
            if (!empty($userTitle) && !empty($jobTitle)) {
                if (str_contains($jobTitle, strtolower($userTitle)) || str_contains(strtolower($userTitle), $jobTitle)) {
                    $matchScore += 30;
                    $matchReasons[] = 'Title matches your profile';
                }
            }
            
            return [
                'id' => $job->id,
                'title' => $job->job_title ?? 'Job Title',
                'company' => $job->company_name ?? 'Company',
                'location' => $job->company_location ?? 'Location',
                'job_type' => $job->job_type ?? 'Full-time',
                'salary_range' => $job->salary_range ?? null,
                'description' => substr($job->description ?? '', 0, 120),
                'tags' => is_array($job->tags) ? array_slice($job->tags, 0, 3) : [],
                'match_score' => round($matchScore),
                'match_reasons' => $matchReasons,
                'posted_at' => $job->created_at ? $job->created_at->diffForHumans() : 'Recently',
                'easy_apply' => $job->easy_apply ?? false,
                'image' => $job->logo_url ?? 'https://i.pravatar.cc/40?img=' . $job->id,
            ];
        })->filter(function($job) {
            return $job['match_score'] > 0;
        })->sortByDesc('match_score')->take(6)->values();
        
        return response()->json($recommendedJobs);
    }

    /**
     * Apply for a job
     */
    public function apply($jobId)
    {
        $user = auth()->user();
        
        // Check if job exists
        $job = DB::table('job_posts')->where('id', $jobId)->first();
        
        if (!$job) {
            return response()->json(['message' => 'Job not found'], 404);
        }
        
        // Check if already applied
        $existing = DB::table('job_applications')
            ->where('user_id', $user->id)
            ->where('job_id', $jobId)
            ->exists();
        
        if ($existing) {
            return response()->json(['message' => 'You have already applied for this job'], 409);
        }
        
        // Create application
        DB::table('job_applications')->insert([
            'user_id' => $user->id,
            'job_id' => $jobId,
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        return response()->json(['message' => 'Application submitted successfully!']);
    }

    /**
     * Get user's job applications
     */
    public function myApplications()
    {
        $user = auth()->user();
        
        $applications = \App\Models\JobApplication::where('user_id', $user->id)
            ->with('job')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($application) {
                $job = $application->job;
                return [
                    'id' => $application->id,
                    'job_id' => $application->job_id,
                    'title' => $job->job_title ?? 'Job Title',
                    'company' => $job->company_name ?? 'Company',
                    'location' => $job->company_location ?? 'Location',
                    'status' => $application->status,
                    'applied_at' => $application->created_at,
                    'applied_at_human' => $application->created_at->diffForHumans(),
                ];
            });
        
        return response()->json([
            'success' => true,
            'data' => $applications
        ]);
    }

    public function applicationsPage()
    {
        $user = Auth::user();
        
        $applications = DB::table('job_applications')
            ->join('job_posts', 'job_applications.job_id', '=', 'job_posts.id')
            ->where('job_applications.user_id', $user->id)
            ->select('job_applications.*', 'job_posts.job_title as title', 'job_posts.company_name as company', 'job_posts.company_location as location')
            ->orderBy('job_applications.created_at', 'desc')
            ->get()
            ->map(function($app) {
                return [
                    'id' => $app->id,
                    'title' => $app->title,
                    'company' => $app->company,
                    'location' => $app->location,
                    'status' => $app->status,
                    'applied_at' => $app->created_at,
                ];
            });
        
        return Inertia::render('Applications', [
            'applications' => $applications,
            'auth' => ['user' => $user],
        ]);
    }
}