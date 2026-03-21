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
$user = $request->user()->loadMissing(['profile', 'skills', 'experiences', 'applications', 'resumes']);

        // Profile completion status
        $profileStatus = ['percent' => 0, 'status' => []];
        $profileComplete = 0;
        if ($user->profile) {
            $completion = $this->calculateProfileCompletion($user->profile);
            $profileStatus = $completion;
            $profileComplete = $completion['percent'];
        }

        // Application stats
        $stats = [
            'applied' => $user->applications()->count(),
            'review' => 0, // Adjust scopes as needed
            'interview' => 0,
            'rejected' => 0,
        ];

        // Recommended jobs (match skills)
        $userSkills = $user->skills->pluck('name');
        $jobs = Job::where('status', 'open')
            ->when($userSkills->isNotEmpty(), function($q) use ($userSkills) {
                $q->where(function($subQ) use ($userSkills) {
                    $subQ->whereJsonContains('skills_required', $userSkills->first())
                         ->orWhereJsonContains('preferred_skills', $userSkills->first());
                });
            })
            ->limit(3)
            ->get();

        // Notifications data for bell/navbar
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

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => $user
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
                'title' => $job->title,
                'tags' => implode(', ', $job->tags ?? []),
                'time' => $job->created_at->diffForHumans(),
                'image' => $job->logo_url ?? 'https://i.pravatar.cc/40?img=' . $job->id,
            ]),
            'notifications' => $notificationsData,
        ]);
    }


    private function calculateProfileCompletion(Profile $profile): array
    {
        $status = [
            'portfolio' => !empty($profile->portfolio_url),
            'experience' => $profile->user->experiences()->count() > 0,
            'skills' => $profile->user->skills()->count() > 0,
            'email_verified' => $profile->user->email_verified_at !== null,
        ];

        $total = count($status);
        $complete = array_sum(array_map(fn($v) => $v ? 1 : 0, $status));
        
        return [
            'percent' => round(($complete / $total) * 100),
            'status' => $status
        ];
    }
}
