<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Job;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user()->loadMissing(['profile', 'skills', 'experiences', 'applications', 'resumes', 'notifications.unreadNotifications']);

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

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => $user,
            ],
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
