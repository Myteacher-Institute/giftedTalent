<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Job;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Skill;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login');
        }
        
        // Update profile completion before loading dashboard
        $user->updateProfileCompletion();
        
        // Force fresh load from database with all relationships
        $user->refresh();
        $user->loadMissing([
            'profile', 
            'skills', 
            'experiences', 
            'applications', 
            'resumes', 
            'notifications'
        ]);
        
        $profile = $user->profile;
        
        // Create default profile if none exists
        if (!$profile) {
            $profile = Profile::create(['user_id' => $user->id]);
            $user->setRelation('profile', $profile);
            Log::info('Created default profile for user: ' . $user->id);
        } else {
            // Set avatar_url for easy access
            if ($profile->avatar) {
                $profile->avatar_url = asset('storage/' . $profile->avatar);
            }
            
            // Log the base64 image status for debugging
            Log::info('Profile base64 status: ' . ($profile->profile_image_base64 ? 'HAS BASE64 (length: ' . strlen($profile->profile_image_base64) . ')' : 'NO BASE64'));
        }

        // Debug: Log profile status
        Log::info('Dashboard loaded', [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'profile_completed' => $user->profile_completed,
            'profile_exists' => $user->profile ? 'yes' : 'no',
            'profile_id' => $user->profile->id ?? 'null',
            'profile_position' => $user->profile->position ?? 'null',
            'profile_bio' => $user->profile->bio ?? 'null',
            'avatar' => $user->profile->avatar ?? 'null',
            'avatar_url' => $user->profile->avatar_url ?? 'null',
            'has_base64' => $user->profile->profile_image_base64 ? 'yes' : 'no',
            'skills_count' => $user->skills()->count(),
            'resumes_count' => $user->resumes()->count(),
        ]);

        // Search parameters
        $query = $request->get('q', '');
        $jobType = $request->get('job_type', '');
        $location = $request->get('location', '');

        // Base query for admin jobs only
        $jobsQuery = Job::whereHas('user', function($q) {
            $q->where('is_admin', true);
        })->where('status', 'open');

        // Apply filters
        if ($query) {
            $jobsQuery->where(function($q) use ($query) {
                $q->where('job_title', 'like', '%' . $query . '%')
                  ->orWhere('company_name', 'like', '%' . $query . '%')
                  ->orWhere('description', 'like', '%' . $query . '%');
            });
        }

        if ($jobType) {
            $jobsQuery->where('job_type', $jobType);
        }

        if ($location) {
            $jobsQuery->where('company_location', 'like', '%' . $location . '%');
        }

        // Recommended jobs (now filtered admin jobs)
        $adminJobs = $jobsQuery->limit(10)->get();
        
        // No fallback jobs - skip skill matching for now
        $fallbackJobs = collect();

        $jobs = $adminJobs->merge($fallbackJobs);

        // Profile completion status from user model
        $profileComplete = $user->profile_completed;
        
        // Get profile status for checklist items
        $profileStatus = [
            'status' => [
                'portfolio' => !empty($profile->portfolio_url),
                'experience' => $user->experiences()->count() > 0,
                'email_verified' => !is_null($user->email_verified_at),
                'skills' => $user->skills()->count() > 0,
                'cv_uploaded' => $user->resumes()->count() > 0,
            ]
        ];

        // Job types for filter
        $jobTypes = Job::whereHas('user', fn($q) => $q->where('is_admin', true))
                          ->distinct()
                          ->pluck('job_type')
                          ->filter()
                          ->values();

        $notificationsData = [
            'unread_count' => $user->unreadNotifications->count(),
            'recent_unread' => $user->notifications()
                ->whereNull('read_at')
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn($n) => [
                    'id' => $n->id,
                    'title' => $n->data['title'],
                    'message' => $n->data['message'],
                    'time' => $n->created_at->diffForHumans(),
                    'resume_id' => $n->data['resume_id'] ?? null,
                    'status' => $n->data['status'] ?? null,
                ]),
        ];

        $skills = Skill::where('user_id', Auth::id())->get();

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => $user,
            ],
            'profile' => $profile, // IMPORTANT: Pass profile directly to access profile_image_base64
            'profileComplete' => $profileComplete,
            'profileStatus' => $profileStatus,
            'stats' => [
                'applied' => $user->applications()->count(),
                'pending_cv' => $user->resumes()->pending()->count(),
                'approved_cv' => $user->resumes()->approved()->count(),
                'rejected_cv' => $user->resumes()->rejected()->count(),
            ],
            'resumes' => $user->resumes,
            'jobs' => $jobs->map(fn($job) => [
                'id' => $job->id,
                'company' => $job->company_name ?? $job->company ?? 'Company',
                'title' => $job->job_title ?? $job->title,
                'tags' => $job->job_type . ($job->company_location ? ' • ' . $job->company_location : ''),
                'time' => $job->created_at->diffForHumans(),
                'image' => $job->logo_url ?? 'https://i.pravatar.cc/40?img=' . $job->id,
                'type' => $job->job_type,
                'location' => $job->company_location,
                'match_score' => $this->calculateMatchScore($user, $job),
            ]),
            'searchParams' => [
                'q' => $query,
                'job_type' => $jobType,
                'location' => $location,
            ],
            'jobTypes' => $jobTypes,
            'notifications' => $notificationsData,
        ]);
    }

    private function calculateMatchScore($user, $job)
    {
        $userSkills = $user->skills->pluck('name')->toArray();
        $jobSkills = $job->required_skills ?? [];
        
        if (empty($jobSkills)) {
            return 0;
        }
        
        $matchingSkills = array_intersect($userSkills, $jobSkills);
        $score = (count($matchingSkills) / count($jobSkills)) * 100;
        
        return round($score);
    }
}