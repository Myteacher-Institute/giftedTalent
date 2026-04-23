<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Job;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Skill;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
        } else {
            // Set avatar_url for easy access
            if ($profile->avatar) {
                $profile->avatar_url = asset('storage/' . $profile->avatar);
            }
        }

        // ========== GET RECOMMENDED JOBS BASED ON USER PROFILE ==========
        // Get user's skills
        $userSkills = [];
        if ($user->skills) {
            $userSkills = is_string($user->skills) ? json_decode($user->skills, true) : $user->skills;
        }
        
        // Get user's job title from profile
        $userTitle = $profile->position ?? $profile->title ?? $user->title ?? '';
        
        // Get all active jobs from job_posts table
        $allJobs = Job::where('status', 'active')->get();
        
        // Calculate match score for each job
        $recommendedJobs = $allJobs->map(function($job) use ($userSkills, $userTitle) {
            $matchScore = 0;
            $matchReasons = [];
            
            // Skills match (70% weight)
            $jobSkills = is_array($job->required_skills) ? $job->required_skills : [];
            if (!empty($jobSkills) && !empty($userSkills)) {
                $matchingSkills = array_intersect(
                    array_map('strtolower', $userSkills),
                    array_map('strtolower', $jobSkills)
                );
                if (count($jobSkills) > 0) {
                    $skillsMatchPercentage = (count($matchingSkills) / count($jobSkills)) * 70;
                    $matchScore += $skillsMatchPercentage;
                }
                if (count($matchingSkills) > 0) {
                    $matchReasons[] = count($matchingSkills) . ' skill(s) match';
                }
            }
            
            // Title match (30% weight)
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
                'tags' => is_array($job->required_skills) ? array_slice($job->required_skills, 0, 3) : [],
                'match_score' => round($matchScore),
                'match_reasons' => $matchReasons,
                'posted_at' => $job->created_at ? $job->created_at->diffForHumans() : 'Recently',
                'easy_apply' => $job->easy_apply ?? false,
                'image' => $job->logo_url ?? 'https://i.pravatar.cc/40?img=' . $job->id,
            ];
        })->filter(function($job) {
            return $job['match_score'] > 0;
        })->sortByDesc('match_score')->take(6)->values();
        // ================================================================

        // Search parameters
        $query = $request->get('q', '');
        $jobType = $request->get('job_type', '');
        $location = $request->get('location', '');

        // Base query for admin jobs only
        $jobsQuery = Job::whereHas('user', function($q) {
            $q->where('is_admin', true);
        })->where('status', 'active');

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

        // Recommended jobs (now filtered admin jobs, fallback to skill-matched if no results)
        $userSkills = $user->skills->pluck('name');
        $adminJobs = $jobsQuery->limit(10)->get();

        if ($adminJobs->isEmpty() && $userSkills->isNotEmpty()) {
            $fallbackJobs = Job::where('status', 'open')
                ->where(function($q) use ($userSkills) {
                    foreach ($userSkills as $skill) {
                        $q->orWhereJsonContains('skills_required ?? []', $skill)
                          ->orWhereJsonContains('preferred_skills ?? []', $skill);
                    }
                })->limit(5)->get();
        } else {
            $fallbackJobs = collect();
        }

        $jobs = $adminJobs->merge($fallbackJobs);


        // Profile completion status
        $profileStatus = ['percent' => 0, 'status' => []];
        $profileComplete = 0;
        if ($user->profile) {
            $completion = $this->calculateProfileCompletion($user->profile);
            $profileStatus = $completion;
            $profileComplete = $completion['percent'];
        }





        // Notifications data for bell/navbar
        // Extract job types before return
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

        // ========== GET SAVED JOBS (FULL JOB OBJECTS) ==========
        $savedJobIds = DB::table('saved_jobs')
            ->where('user_id', $user->id)
            ->pluck('job_id')
            ->toArray();

        // Get full job details for saved jobs
        $savedJobs = [];
        if (!empty($savedJobIds)) {
            $savedJobs = Job::whereIn('id', $savedJobIds)
                ->get()
                ->map(function($job) {
                    return [
                        'id' => $job->id,
                        'company' => $job->company_name ?? $job->company ?? 'Company',
                        'title' => $job->job_title ?? $job->title,
                        'tags' => ($job->job_type ?? 'Full-time') . ($job->company_location ? ' • ' . $job->company_location : ''),
                        'time' => $job->created_at ? $job->created_at->diffForHumans() : 'Recently',
                        'image' => $job->logo_url ?? 'https://i.pravatar.cc/40?img=' . $job->id,
                        'type' => $job->job_type ?? 'Full-time',
                        'location' => $job->company_location ?? 'Remote',
                        'match_score' => 0,
                    ];
                })
                ->toArray();
        }
        // =======================================================

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => $user,
            ],
            'profile' => $profile,
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
            ]),
            'searchParams' => [
                'q' => $query,
                'job_type' => $jobType,
                'location' => $location,
            ],
            'jobTypes' => $jobTypes,
            'notifications' => $notificationsData,
            'recommendedJobs' => $recommendedJobs,
            'savedJobs' => $savedJobs,
        ]);
    }



    private function calculateProfileCompletion(Profile $profile): array
    {
        $user = $profile->user;
        
        $status = [
            'email_verified' => $user->email_verified_at !== null,
            'bio' => !empty($profile->bio) && strlen(trim($profile->bio)) > 20,
            'skills' => $user->skills()->count() >= 3,
            'experience' => $user->experiences()->count() > 0,
'education' => false, // Add Education model/relation if needed
            'portfolio' => !empty($profile->portfolio_url),
            'position' => !empty($profile->position),
            'cv_uploaded' => $user->resumes()->count() > 0,
        ];

        $total = count($status);
        $complete = array_sum(array_map(fn($v) => $v ? 1 : 0, $status));
        
        return [
            'percent' => round(($complete / $total) * 100),
            'status' => $status
        ];
    }
}
