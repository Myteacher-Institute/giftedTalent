<?php
namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Support\Facades\Auth;
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
     * Display the Find Talents page.
     */
    public function findTalents(): Response
    {
        return Inertia::render('FindTalents');
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
            'auth' => ['user' => Auth::user()],
        ]);
    }

    public function jobs()
    {
        $jobs = Job::latest()->get();
        return Inertia::render('Jobs', [
            'jobs' => $jobs,
        ]);
    }

    public function index($request)
    {
        $query = Job::query();

        // Search - works for ANY text
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('job_title', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('company_location', 'like', "%{$search}%")
                    ->orWhere('job_type', 'like', "%{$search}%");
            });
        }

        // Job Type filter - multiple selections
        if ($request->has('type') && is_array($request->type) && count($request->type) > 0) {
            $query->whereIn('job_type', $request->type);
        }

        // Location filter - multiple selections
        if ($request->has('location') && is_array($request->location) && count($request->location) > 0) {
            $query->whereIn('company_location', $request->location);
        }

        // Company filter - multiple selections
        if ($request->has('company') && is_array($request->company) && count($request->company) > 0) {
            $query->whereIn('company_name', $request->company);
        }

        // Remote filter
        if ($request->has('remote') && $request->remote == 'true') {
            $query->where('job_type', 'Remote');
        }

        // Experience filter
        if ($request->has('experience') && is_array($request->experience) && count($request->experience) > 0) {
            $query->where(function ($q) use ($request) {
                foreach ($request->experience as $level) {
                    $q->orWhere('job_title', 'like', "%{$level}%")
                        ->orWhere('description', 'like', "%{$level}%");
                }
            });
        }

        $jobs = $query->latest()->get();

        return Inertia::render('Jobs', [
            'jobs' => $jobs,
            'auth' => ['user' => Auth::user()],
        ]);
    }

}
