<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ExploreController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Get featured jobs (active jobs with company info)
        $featuredJobs = Job::where('status', 'active')
            ->latest()
            ->take(6)
            ->get()
            ->map(function($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->job_title ?? $job->title ?? 'Job Title',
                    'company' => $job->company_name ?? $job->company ?? 'Company',
                    'location' => $job->company_location ?? $job->location ?? 'Location',
                    'job_type' => $job->job_type ?? 'Full-time',
                    'salary_range' => $job->salary_range ?? $job->salary ?? null,
                    'company_logo' => null, // Remove this if column doesn't exist
                    'created_at' => $job->created_at,
                ];
            });
        
        // Get featured talents (users with completed profiles)
        $featuredTalents = User::where('profile_completed', '>=', 50)
            ->with('profile')
            ->orderBy('profile_completed', 'desc')
            ->take(6)
            ->get()
            ->map(function($user) {
                // Get skills
                $skills = [];
                if ($user->skills) {
                    $skills = is_string($user->skills) ? json_decode($user->skills, true) : $user->skills;
                }
                if (empty($skills) && $user->profile && $user->profile->skills) {
                    $skills = is_string($user->profile->skills) ? json_decode($user->profile->skills, true) : $user->profile->skills;
                }
                
                // Get avatar
                $avatar = null;
                if ($user->profile && $user->profile->profile_image_base64) {
                    $avatar = $user->profile->profile_image_base64;
                } elseif ($user->profile && $user->profile->avatar_url) {
                    $avatar = $user->profile->avatar_url;
                }
                
                // Get title
                $title = $user->title;
                if (!$title && $user->profile) {
                    $title = $user->profile->position ?? $user->profile->title ?? 'Professional';
                }
                
                // Calculate rating
                $rating = 4.0;
                if ($user->profile_completed >= 90) $rating = 5.0;
                elseif ($user->profile_completed >= 80) $rating = 4.8;
                elseif ($user->profile_completed >= 70) $rating = 4.5;
                elseif ($user->profile_completed >= 60) $rating = 4.2;
                elseif ($user->profile_completed >= 50) $rating = 4.0;
                
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'title' => $title,
                    'avatar' => $avatar,
                    'skills' => $skills,
                    'rating' => $rating,
                ];
            });
        
        // Get popular companies (from jobs) - FIXED: removed logo_url
        $popularCompanies = Job::where('status', 'active')
            ->whereNotNull('company_name')
            ->select('company_name', 'company_location')
            ->groupBy('company_name', 'company_location')
            ->take(6)
            ->get()
            ->map(function($job) {
                return [
                    'name' => $job->company_name,
                    'location' => $job->company_location,
                    'logo' => null, // No logo column available
                    'job_count' => Job::where('company_name', $job->company_name)->count(),
                ];
            });
        
        // Get job categories (job types)
        $categories = Job::where('status', 'active')
            ->whereNotNull('job_type')
            ->select('job_type')
            ->distinct()
            ->pluck('job_type')
            ->filter()
            ->values()
            ->toArray();
        
        return Inertia::render('Explore', [
            'auth' => ['user' => $user],
            'featuredJobs' => $featuredJobs,
            'featuredTalents' => $featuredTalents,
            'popularCompanies' => $popularCompanies,
            'categories' => $categories,
        ]);
    }
}