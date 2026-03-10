<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function dashboard(): Response
    {
        // Get admin statistics
        $stats = [
            'total_users' => \App\Models\User::count(),
            'total_jobs' => 0, // Placeholder until Job model exists
            'total_profiles' => \App\Models\Profile::count(),
            'recent_users' => \App\Models\User::latest()->take(5)->get(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }

    /**
     * Display the users management page.
     */
    public function users(): Response
    {
        $users = \App\Models\User::with('profile')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    /**
     * Display the jobs management page.
     */
    public function jobs(): Response
    {
        // You'll need to create a Job model for this to work
        $jobs = []; // Placeholder until Job model exists

        return Inertia::render('Admin/Jobs', [
            'jobs' => $jobs,
        ]);
    }

    /**
     * Display the analytics page.
     */
    public function analytics(): Response
    {
        $analytics = [
            'user_growth' => [
                'this_month' => \App\Models\User::whereMonth('created_at', now()->month)->count(),
                'last_month' => \App\Models\User::whereMonth('created_at', now()->subMonth()->month)->count(),
            ],
            'profile_completion' => [
                'completed' => \App\Models\Profile::whereNotNull('bio')->count(),
                'total' => \App\Models\User::count(),
            ],
            'daily_activity' => [
                'today' => \App\Models\User::whereDate('created_at', today())->count(),
                'yesterday' => \App\Models\User::whereDate('created_at', now()->subDay()->toDateString())->count(),
            ],
        ];

        return Inertia::render('Admin/Analytics', [
            'analytics' => $analytics,
        ]);
    }

    /**
     * Get admin dashboard statistics (AJAX endpoint).
     */
    public function getStats(Request $request): \Illuminate\Http\JsonResponse
    {
        $period = $request->get('period', 'week'); // week, month, year

        $stats = match($period) {
            'week' => [
                'users' => \App\Models\User::whereBetween('created_at', [now()->startOfWeek(), now()])->count(),
                'profiles' => \App\Models\Profile::whereBetween('created_at', [now()->startOfWeek(), now()])->count(),
            ],
            'month' => [
                'users' => \App\Models\User::whereMonth('created_at', now()->month)->count(),
                'profiles' => \App\Models\Profile::whereMonth('created_at', now()->month)->count(),
            ],
            'year' => [
                'users' => \App\Models\User::whereYear('created_at', now()->year)->count(),
                'profiles' => \App\Models\Profile::whereYear('created_at', now()->year)->count(),
            ],
            default => [],
        };

        return response()->json($stats);
    }
}
