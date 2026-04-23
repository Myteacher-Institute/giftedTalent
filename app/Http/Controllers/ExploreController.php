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
                    'icon' => $this->getIconForIndustry($item->job_type)
                ];
            });
        
        // 2. FEATURED COMPANIES (Companies with most jobs) - FIXED: removed logo_url
        $featuredCompanies = Job::where('status', 'active')
            ->whereNotNull('company_name')
            ->select('company_name', 'company_location', DB::raw('count(*) as job_count'))
            ->groupBy('company_name', 'company_location')
            ->orderBy('job_count', 'desc')
            ->limit(8)
            ->get()
            ->map(function($company) {
                return [
                    'name' => $company->company_name,
                    'location' => $company->company_location ?? 'Remote / Flexible',
                    'logo' => null,
                    'job_count' => $company->job_count,
                    'description' => 'Innovative Solutions Provider'
                ];
            });
        
        // 3. TOP SKILLS IN DEMAND
        $allJobs = Job::where('status', 'active')->get();
        $skillCounts = [];
        
        foreach ($allJobs as $job) {
            $skills = $job->required_skills;
            if (is_string($skills)) {
                $skills = json_decode($skills, true);
            }
            if (is_array($skills)) {
                foreach ($skills as $skill) {
                    $skillName = trim($skill);
                    if (!empty($skillName)) {
                        if (!isset($skillCounts[$skillName])) {
                            $skillCounts[$skillName] = 0;
                        }
                        $skillCounts[$skillName]++;
                    }
                }
            }
        }
        
        arsort($skillCounts);
        $topSkills = array_slice($skillCounts, 0, 8, true);
        
        $colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];
        $skillsData = [];
        $i = 0;
        foreach ($topSkills as $skill => $count) {
            $skillsData[] = [
                'name' => $skill,
                'count' => $count,
                'color' => $colors[$i++ % count($colors)]
            ];
        }
        
        // 4. STATISTICS
        $stats = [
            'total_jobs' => Job::where('status', 'active')->count(),
            'total_companies' => Job::where('status', 'active')->distinct('company_name')->count('company_name'),
            'total_talents' => User::where('profile_completed', '>=', 50)->count(),
            'success_rate' => 98
        ];
        
        return Inertia::render('Explore', [
            'auth' => ['user' => $user],
            'trendingIndustries' => $trendingIndustries,
            'featuredCompanies' => $featuredCompanies,
            'topSkills' => $skillsData,
            'stats' => $stats,
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
        if (str_contains($industryLower, 'market')) {
            return 'fa-bullhorn';
        }
        if (str_contains($industryLower, 'health') || str_contains($industryLower, 'medical')) {
            return 'fa-hospital-user';
        }
        if (str_contains($industryLower, 'design')) {
            return 'fa-pen-ruler';
        }
        if (str_contains($industryLower, 'remote')) {
            return 'fa-globe';
        }
        return 'fa-briefcase';
    }
}