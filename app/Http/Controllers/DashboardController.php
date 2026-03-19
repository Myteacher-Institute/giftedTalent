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
        $user = $request->user()->loadMissing(['profile', 'skills', 'experiences', 'applications']);

        // Profile completion %
        $profileComplete = 0;
        if ($user->profile) {
            $profileComplete = $this->calculateProfileCompletion($user->profile);
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

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => $user
            ],
            'profileComplete' => $profileComplete,
            'stats' => $stats,
            'jobs' => $jobs->map(fn($job) => [
                'id' => $job->id,
                'company' => $job->company_name ?? $job->company ?? 'Company',
                'title' => $job->title,
                'tags' => implode(', ', $job->tags ?? []),
                'time' => $job->created_at->diffForHumans(),
                'image' => $job->logo_url ?? 'https://i.pravatar.cc/40?img=' . $job->id,
            ]),
        ]);
    }


    private function calculateProfileCompletion(Profile $profile): int
    {
        $total = 4; // profile pic, bio, experience, skills
        $complete = 0;

        if ($profile->avatar) $complete++;
        if ($profile->bio && strlen($profile->bio) > 10) $complete++;
        if ($profile->user->experiences->count() > 0) $complete++;
        if ($profile->user->skills->count() > 0) $complete++;

        return round(($complete / $total) * 100);
    }
}
