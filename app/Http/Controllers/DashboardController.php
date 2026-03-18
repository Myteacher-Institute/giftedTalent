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
        $user = $request->user();

        // Profile completion %
        $profileComplete = 0;
        if ($user->profile) {
            $profileComplete = $this->calculateProfileCompletion($user->profile);
        }

        // Application stats
        $stats = [
            'applied' => $user->applications()->byStatus('applied')->count(),
            'review' => $user->applications()->byStatus('review')->count(),
            'interview' => $user->applications()->byStatus('interview')->count(),
            'rejected' => $user->applications()->byStatus('rejected')->count(),
        ];

        // Recommended jobs (match skills)
        $userSkills = $user->skills->pluck('name');
        $jobs = Job::open()
            ->when($userSkills->isNotEmpty(), fn($q) => $q->recommended($userSkills))
            ->limit(3)
            ->get();

        return Inertia::render('Dashboard', [
            'profileComplete' => $profileComplete,
            'stats' => $stats,
            'jobs' => $jobs->map(fn($job) => [
                'id' => $job->id,
                'company' => $job->company,
                'title' => $job->title,
                'tags' => implode(', ', $job->tags ?? []),
                'time' => $job->created_at->diffForHumans(),
                'image' => 'https://i.pravatar.cc/40?img=' . $job->id,
            ]),
        ]);
    }

    private function calculateProfileCompletion(Profile $profile): int
    {
        $total = 5; // profile pic, bio, experience, education, skills
        $complete = 0;

        if ($profile->avatar) $complete++;
        if ($profile->bio && strlen($profile->bio) > 10) $complete++;
        if ($profile->user->experiences->count() > 0) $complete++;
        if ($profile->user->educations->count() > 0) $complete++;
        if ($profile->user->skills->count() > 0) $complete++;

        return round(($complete / $total) * 100);
    }
}
