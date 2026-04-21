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
        
        // Get user's skills
        $userSkills = [];
        if ($user->skills) {
            $userSkills = is_string($user->skills) ? json_decode($user->skills, true) : $user->skills;
        }
        
        // Get user's job title
        $userTitle = $profile->position ?? $profile->title ?? $user->title ?? '';
        
        // Get all active jobs
        $allJobs = Job::where('status', 'active')->orderBy('created_at', 'desc')->get();
        
        // Separate jobs into recommended and regular
        $recommendedJobs = [];
        $regularJobs = [];
        
        foreach ($allJobs as $job) {
            $matchScore = 0;
            
            // Calculate match score based on skills
            $jobSkills = is_array($job->required_skills) ? $job->required_skills : [];
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
            $jobTitle = strtolower($job->job_title ?? $job->title ?? '');
            if (!empty($userTitle) && !empty($jobTitle) && str_contains($jobTitle, strtolower($userTitle))) {
                $matchScore = min($matchScore + 20, 100);
            }
            
            $jobData = [
                'id' => $job->id,
                'title' => $job->job_title ?? $job->title ?? 'Job Title',
                'company' => $job->company_name ?? $job->company ?? 'Company',
                'location' => $job->company_location ?? $job->location ?? 'Location',
                'job_type' => $job->job_type ?? 'Full-time',
                'salary_range' => $job->salary_range ?? $job->salary ?? null,
                'description' => $job->description ?? '',
                'tags' => is_array($job->required_skills) ? $job->required_skills : [],
                'posted_at' => $job->created_at ? $job->created_at->diffForHumans() : 'Recently',
                'easy_apply' => $job->easy_apply ?? false,
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
        
        // Get saved jobs - using DB query directly (bypasses relationship issue)
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
                            'title' => $job->job_title ?? $job->title ?? 'Job Title',
                            'company' => $job->company_name ?? $job->company ?? 'Company',
                            'location' => $job->company_location ?? $job->location ?? 'Location',
                            'job_type' => $job->job_type ?? 'Full-time',
                            'salary_range' => $job->salary_range ?? $job->salary ?? null,
                            'description' => $job->description ?? '',
                            'tags' => is_array($job->required_skills) ? $job->required_skills : [],
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
        
        // Get user's skills and job title
        $userSkills = [];
        if ($user->skills) {
            $userSkills = is_string($user->skills) ? json_decode($user->skills, true) : $user->skills;
        }
        
        // Get user's job title from profile
        $userTitle = $user->profile?->position ?? $user->profile?->title ?? $user->title ?? '';
        
        // Get all active jobs
        $jobs = Job::where('status', 'active')->get();
        
        // Calculate match score for each job
        $recommendedJobs = $jobs->map(function($job) use ($userSkills, $userTitle) {
            $matchScore = 0;
            $matchReasons = [];
            
            // Check skills match (70% weight)
            $jobSkills = is_array($job->required_skills) ? $job->required_skills : [];
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
            $jobTitle = strtolower($job->job_title ?? $job->title ?? '');
            if (!empty($userTitle) && !empty($jobTitle)) {
                if (str_contains($jobTitle, strtolower($userTitle)) || str_contains(strtolower($userTitle), $jobTitle)) {
                    $matchScore += 30;
                    $matchReasons[] = 'Title matches your profile';
                }
            }
            
            return [
                'id' => $job->id,
                'title' => $job->job_title ?? $job->title ?? 'Job Title',
                'company' => $job->company_name ?? $job->company ?? 'Company',
                'location' => $job->company_location ?? $job->location ?? 'Location',
                'job_type' => $job->job_type ?? 'Full-time',
                'salary_range' => $job->salary_range ?? $job->salary ?? null,
                'description' => substr($job->description ?? '', 0, 120),
                'required_skills' => is_array($job->required_skills) ? array_slice($job->required_skills, 0, 3) : [],
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
                'title' => $job->job_title ?? $job->title ?? 'Job Title',
                'company' => $job->company_name ?? $job->company ?? 'Company',
                'location' => $job->company_location ?? $job->location ?? 'Location',
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
}