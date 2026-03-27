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
        return Inertia::render('userProfile');
    }
    
    /**
     * Display the Easy Apply Job page.
     */
    public function easyApplyJob(): Response
    {
        return Inertia::render('EasyApplyJob');
    }

    /**
     * Display the Search Jobs page.
     */
    public function searchJobs(): Response
    {
        return Inertia::render('search-job', [
            'auth' => ['user' => Auth::user()]
        ]);
    }

    /**
     * Display all jobs listing.
     */
    public function jobs()
    {
        $jobs = Job::latest()->get();
        return Inertia::render('Jobs', [
            'jobs' => $jobs
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
        
        return Inertia::render('TalentProfile', [
            'talent' => $talent,
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