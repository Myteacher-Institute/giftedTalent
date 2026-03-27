<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Display the Find Jobs page.
     */
    public function findJobs(): Response
    {
        return Inertia::render('FindJobs');
    }

    /**
     * Display the Find Talents page with all talents or search results.
     */
    public function findTalents(Request $request): Response
    {
        $searchQuery = $request->get('search');
        
        if ($searchQuery) {
            // Search talents by name, title, skills, or location
            $talents = User::where('profile_completed', true)
                            ->where(function($q) use ($searchQuery) {
                                $q->where('name', 'LIKE', "%{$searchQuery}%")
                                  ->orWhere('title', 'LIKE', "%{$searchQuery}%")
                                  ->orWhere('company', 'LIKE', "%{$searchQuery}%")
                                  ->orWhere('location', 'LIKE', "%{$searchQuery}%")
                                  ->orWhereJsonContains('skills', $searchQuery);
                            })
                            ->latest()
                            ->get(); // Get all results for search
        } else {
            // Get paginated results for normal view
            $talents = User::where('profile_completed', true)
                            ->latest()
                            ->paginate(12);
        }
        
        return Inertia::render('FindTalents', [
            'talents' => $talents,
            'searchQuery' => $searchQuery,
        ]);
    }

    /**
     * Display the How It Works page.
     */
    public function howItWorks(): Response
    {
        return Inertia::render('HowItWorks');
    }

    /**
     * Display the About page.
     */
    public function about(): Response
    {
        return Inertia::render('About');
    }

    /**
     * Display the User Profile page.
     */
    public function userProfile(): Response
    {
        $user = Auth::user();
        $profile = $user->profile ?? null;
        
        return Inertia::render('userProfile', [
            'user' => $user,
            'profile' => $profile,
            'auth' => [
                'user' => $user,
            ],
        ]);
    }
    
    /**
     * Display the Easy Apply Job page.
     */
    public function easyApplyJob(): Response
    {
        $user = Auth::user();
        
        return Inertia::render('EasyApplyJob', [
            'user' => $user,
            'auth' => [
                'user' => $user,
            ],
        ]);
    }

    /**
     * Display the Search Jobs page.
     */
    public function searchJobs(): Response
    {
        $user = Auth::user();
        $profile = $user->profile ?? null;
        
        return Inertia::render('search-job', [
            'user' => $user,
            'profile' => $profile,
            'auth' => [
                'user' => $user,
            ],
        ]);
    }

    /**
     * Display all jobs listing page with full layout data.
     */
    public function jobs(): Response
    {
        $user = Auth::user();
        $jobs = Job::latest()->get();
        $profile = $user->profile ?? null;
        
        // Calculate profile completion percentage if user is logged in
        $profileComplete = 0;
        $profileStatus = [];
        
        if ($user) {
            // You can calculate profile completion based on your criteria
            $profileComplete = $user->profile_completed ?? 0;
            
            $profileStatus = [
                'status' => [
                    'portfolio' => !empty($profile->portfolio_url),
                    'experience' => $user->experiences()->count() > 0,
                    'email_verified' => !is_null($user->email_verified_at),
                    'skills' => $user->skills()->count() > 0,
                    'cv_uploaded' => $user->resumes()->count() > 0,
                ]
            ];
        }
        
        return Inertia::render('Jobs', [
            'jobs' => $jobs,
            'user' => $user,
            'profile' => $profile,
            'auth' => [
                'user' => $user,
            ],
            'profileComplete' => $profileComplete,
            'profileStatus' => $profileStatus,
            'stats' => null, // Jobs page doesn't need application stats
        ]);
    }

    /**
     * Get featured talents (only 3) for the homepage.
     */
    public function getFeaturedTalents()
    {
        $featuredTalents = User::where('profile_completed', true)
                                ->inRandomOrder()
                                ->take(3)
                                ->get();
        
        return response()->json($featuredTalents);
    }

    /**
     * Display a single talent profile.
     */
    public function showTalent($id)
    {
        $talent = User::findOrFail($id);
        $user = Auth::user();
        
        return Inertia::render('TalentProfile', [
            'talent' => $talent,
            'user' => $user,
            'auth' => [
                'user' => $user,
            ],
        ]);
    }

    /**
     * Search talents by name, title, skills, or location (API endpoint - kept for backward compatibility)
     */
    public function searchTalents(Request $request)
    {
        $query = $request->get('q');
        
        $talents = User::where('profile_completed', true)
                        ->where(function($q) use ($query) {
                            $q->where('name', 'LIKE', "%{$query}%")
                              ->orWhere('title', 'LIKE', "%{$query}%")
                              ->orWhere('company', 'LIKE', "%{$query}%")
                              ->orWhere('location', 'LIKE', "%{$query}%")
                              ->orWhereJsonContains('skills', $query);
                        })
                        ->latest()
                        ->get();
        
        return response()->json($talents);
    }
}