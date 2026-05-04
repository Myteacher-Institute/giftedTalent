<?php
namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\User;
use Illuminate\Http\Request;
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
        $user = Auth::user();
        
        // Get all active jobs from job_posts table
        $jobs = Job::where('status', 'open')
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
        $jobTypes = Job::where('status', 'open')
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
     * Display the Find Talents page.
     * Fetches all registered users with profile_completed >= 50
     */
    public function findTalents(): Response
    {
        $user = Auth::user();
        
        // Fetch all registered users with profiles (similar to featured talents)
        $talents = User::where('profile_completed', '>=', 35)
            ->with('profile')
            ->orderBy('profile_completed', 'desc')
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
                if (empty($skills)) {
                    $skills = ['Available for work'];
                }
                
                // Calculate rating based on profile completion
                $rating = 3.5;
                if ($user->profile_completed >= 90) $rating = 5.0;
                elseif ($user->profile_completed >= 80) $rating = 4.8;
                elseif ($user->profile_completed >= 70) $rating = 4.5;
                elseif ($user->profile_completed >= 60) $rating = 4.2;
                elseif ($user->profile_completed >= 50) $rating = 4.0;
                
                // Get avatar
                $avatar = null;
                if ($user->profile && $user->profile->profile_image_base64) {
                    $avatar = $user->profile->profile_image_base64;
                } elseif ($user->profile && $user->profile->avatar_url) {
                    $avatar = $user->profile->avatar_url;
                }
                
                // Get title
                $title = $user->title;
                if (!$title && $user->profile && $user->profile->title) {
                    $title = $user->profile->title;
                }
                if (!$title && $user->profile && $user->profile->position) {
                    $title = $user->profile->position;
                }
                
                // Get location
                $location = null;
                if ($user->profile && $user->profile->city) {
                    $location = $user->profile->city;
                } elseif ($user->location) {
                    $location = $user->location;
                }
                
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'title' => $title ?? 'Professional',
                    'location' => $location ?? 'Location not set',
                    'avatar' => $avatar,
                    'avatar_url' => $avatar,
                    'profile_image_base64' => $avatar,
                    'skills' => $skills,
                    'rating' => $rating,
                    'profile_completed' => $user->profile_completed,
                ];
            });
        
        return Inertia::render('FindTalents', [
            'auth' => ['user' => Auth::user()],
            'talents' => $talents,
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
    public function easyApplyJob($id = null): Response
    {
        if (!$id) {
            $id = request()->query('job_id');
        }

        if (!$id) {
            abort(404);
        }

        $job = Job::findOrFail($id);
        $user = Auth::user();
        
        // Check if user has already applied
        $hasApplied = \DB::table('job_applications')->where('user_id', $user->id)->where('job_id', $id)->exists();
        
        return Inertia::render('EasyApplyJob', [
            'job' => array_merge($job->toArray(), [
                'company_logo' => $job->company_logo_url,
            ]),
            'hasApplied' => $hasApplied,
            'auth' => ['user' => $user],
            'profile' => $user->profile,
        ]);
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

    public function jobs(Request $request)
    {
        $query = Job::query();

        // Filter by category if provided
        if ($request->has('category') && $request->category) {
            $category = $request->category;

            // Define keywords for each category
            $keywords = match ($category) {
                'technology' => ['developer', 'engineer', 'programmer', 'software', 'full-stack', 'frontend', 'backend', 'php', 'javascript', 'react', 'laravel', 'web developer', 'full stack', 'senior frontend'],
                'design'     => ['designer', 'ui', 'ux', 'graphic', 'creative', 'figma', 'web designer', 'tailwind css'],
                'marketing'  => ['marketing', 'seo', 'social media', 'digital marketing', 'content', 'digital marketer'],
                'finance'    => ['finance', 'accounting', 'banking', 'financial', 'audit'],
                'sales'      => ['sales', 'business development', 'account manager', 'client relations'],
                'support'    => ['support', 'customer service', 'help desk', 'customer care', 'technical support'],
                'other'      => ['administrative', 'operations', 'coordinator', 'assistant', 'hr', 'project manager'],
                default      => []
            };

            if (! empty($keywords)) {
                $query->where(function ($q) use ($keywords) {
                    foreach ($keywords as $keyword) {
                        $q->orWhere('job_title', 'like', "%{$keyword}%")
                            ->orWhere('description', 'like', "%{$keyword}%");
                    }
                });
            }
        }

        $jobs = $query->latest()->get();

        return Inertia::render('Jobs', [
            'jobs'     => $jobs,
            'category' => $request->category,
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
