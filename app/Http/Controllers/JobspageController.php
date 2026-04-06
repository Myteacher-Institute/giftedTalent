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
        // ... keep your existing code ...
    }
    
    /**
     * Display a single job details.
     */
    public function show($id)
    {
        // ... keep your existing code ...
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
}