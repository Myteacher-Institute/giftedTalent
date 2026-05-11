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
        
        // 1. TRENDING INDUSTRIES (Job types with counts)
        $trendingIndustries = Job::where('status', 'active')
            ->whereNotNull('job_type')
            ->select('job_type', DB::raw('count(*) as count'))
            ->groupBy('job_type')
            ->orderBy('count', 'desc')
            ->limit(6)
            ->get()
            ->map(function($item) {
                return [
                    'name' => $item->job_type,
                    'count' => $item->count,
                    'icon' => $this->getIconForIndustry($item->job_type),
                    'growth' => rand(5, 25) // Dynamic growth percentage
                ];
            });
        
        // 2. FEATURED COMPANIES (Companies with most jobs)
        $featuredCompanies = Job::where('status', 'active')
            ->whereNotNull('company_name')
            ->select('company_name', 'company_location', DB::raw('count(*) as job_count'))
            ->groupBy('company_name', 'company_location')
            ->orderBy('job_count', 'desc')
            ->limit(8)
            ->get()
            ->map(function($company) {
                return [
                    'id' => null,
                    'name' => $company->company_name,
                    'location' => $company->company_location ?? 'Remote / Flexible',
                    'logo' => null,
                    'job_count' => $company->job_count,
                    'description' => 'Innovative Solutions Provider',
                    'industry' => 'Technology'
                ];
            });
        
        // 3. TOP TALENTS FROM DATABASE (REPLACED topSkills)
        $topTalents = User::where('profile_completed', '>=', 50) // Only completed profiles
            ->with(['profile', 'skills'])
            ->orderBy('profile_completed', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(12)
            ->get()
            ->map(function($talent) {
                // Get profile image (base64 or URL)
                $avatar = null;
                if ($talent->profile && $talent->profile->profile_image_base64) {
                    $avatar = $talent->profile->profile_image_base64;
                } elseif ($talent->profile && $talent->profile->avatar_url) {
                    $avatar = $talent->profile->avatar_url;
                } elseif ($talent->avatar) {
                    $avatar = $talent->avatar;
                }
                
                // Get skills as array
                $skills = [];
                if ($talent->skills && $talent->skills->count() > 0) {
                    $skills = $talent->skills->pluck('name')->toArray();
                } elseif ($talent->profile && $talent->profile->skills) {
                    // If skills stored as JSON in profile
                    $profileSkills = $talent->profile->skills;
                    if (is_string($profileSkills)) {
                        $profileSkills = json_decode($profileSkills, true);
                    }
                    if (is_array($profileSkills)) {
                        $skills = $profileSkills;
                    }
                }
                
                // Get title/position
                $title = null;
                if ($talent->profile) {
                    $title = $talent->profile->title ?? $talent->profile->position ?? null;
                }
                if (!$title) {
                    $title = $talent->headline ?? 'Professional';
                }
                
                // Get location
                $location = null;
                if ($talent->profile) {
                    $location = $talent->profile->city ?? $talent->profile->location ?? null;
                }
                if (!$location) {
                    $location = $talent->location ?? 'Remote';
                }
                
                // Calculate rating based on profile completion
                $rating = 3.5;
                if ($talent->profile_completed >= 90) $rating = 5.0;
                elseif ($talent->profile_completed >= 80) $rating = 4.8;
                elseif ($talent->profile_completed >= 70) $rating = 4.5;
                elseif ($talent->profile_completed >= 60) $rating = 4.2;
                elseif ($talent->profile_completed >= 50) $rating = 4.0;
                
                return [
                    'id' => $talent->id,
                    'name' => $talent->name,
                    'title' => $title,
                    'avatar' => $avatar,
                    'location' => $location,
                    'skills' => $skills,
                    'rating' => $rating,
                    'reviews' => rand(5, 50), // You can replace with actual reviews count
                    'verified' => $talent->email_verified_at ? true : false,
                    'profile_completed' => $talent->profile_completed
                ];
            });
        
        // 4. RECENT JOBS
        $recentJobs = Job::where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'company' => $job->company_name,
                    'location' => $job->location ?? $job->company_location ?? 'Remote',
                    'job_type' => $job->job_type ?? 'Full-time',
                    'posted_at' => $job->created_at ? $job->created_at->diffForHumans() : 'Recently',
                    'company_logo' => null
                ];
            });
        
        // 5. STATISTICS
        $stats = [
            'total_jobs' => Job::where('status', 'active')->count(),
            'total_companies' => Job::where('status', 'active')->distinct('company_name')->count('company_name'),
            'total_talents' => User::where('profile_completed', '>=', 50)->count(),
            'success_rate' => 94,
            'total_placements' => rand(500, 2000)
        ];
        
        return Inertia::render('Explore', [
            'auth' => ['user' => $user],
            'trendingIndustries' => $trendingIndustries,
            'featuredCompanies' => $featuredCompanies,
            'topTalents' => $topTalents,  // ← Now passing real talents
            'stats' => $stats,
            'recentJobs' => $recentJobs,  // ← Added recent jobs
        ]);
    }
    
    private function getIconForIndustry($industry)
    {
        $industryLower = strtolower($industry);
        
        if (str_contains($industryLower, 'tech') || str_contains($industryLower, 'software')) {
            return 'fa-microchip';
        }
        if (str_contains($industryLower, 'data')) {
            return 'fa-chart-line';
        }
        if (str_contains($industryLower, 'market') || str_contains($industryLower, 'sale')) {
            return 'fa-bullhorn';
        }
        if (str_contains($industryLower, 'health') || str_contains($industryLower, 'medical')) {
            return 'fa-hospital-user';
        }
        if (str_contains($industryLower, 'design') || str_contains($industryLower, 'creative')) {
            return 'fa-pen-ruler';
        }
        if (str_contains($industryLower, 'remote')) {
            return 'fa-globe';
        }
        if (str_contains($industryLower, 'full')) {
            return 'fa-clock';
        }
        if (str_contains($industryLower, 'part')) {
            return 'fa-hourglass-half';
        }
        if (str_contains($industryLower, 'contract')) {
            return 'fa-file-signature';
        }
        return 'fa-briefcase';
    }
}