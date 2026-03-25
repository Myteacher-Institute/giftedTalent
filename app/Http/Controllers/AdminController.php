<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Application;
use App\Models\Message;

class AdminController extends Controller
{
    public function dashboard(Request $request): Response
    {
        $adminUser = Auth::user();

        // Start with base query for recent jobs
        $query = Job::with('user');

        // Apply filters if they exist
        if ($request->has('jobType') && $request->jobType && $request->jobType !== '') {
            $query->where('job_type', $request->jobType);
        }

        if ($request->has('location') && $request->location && $request->location !== '') {
            $query->where('company_location', 'like', '%' . $request->location . '%');
        }

        if ($request->has('salary') && $request->salary && $request->salary !== '') {
            switch ($request->salary) {
                case '0-100k':
                    $query->where('salary_range', '<=', 100000);
                    break;
                case '100k-200k':
                    $query->whereBetween('salary_range', [100001, 200000]);
                    break;
                case '200k-300k':
                    $query->whereBetween('salary_range', [200001, 300000]);
                    break;
                case '300k+':
                    $query->where('salary_range', '>=', 300001);
                    break;
            }
        }

        if ($request->has('experience') && $request->experience && $request->experience !== '') {
            $query->where('experience_level', $request->experience);
        }

        if ($request->has('datePosted') && $request->datePosted && $request->datePosted !== '') {
            switch ($request->datePosted) {
                case 'today':
                    $query->whereDate('created_at', today());
                    break;
                case 'week':
                    $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
                    break;
                case 'month':
                    $query->whereMonth('created_at', now()->month)
                          ->whereYear('created_at', now()->year);
                    break;
            }
        }

        if ($request->has('status') && $request->status && $request->status !== '') {
            $query->where('status', $request->status);
        }

        // Get recent jobs (with filters applied)
        $recentJobs = $query->latest()
            ->take(10)
            ->get()
            ->map(function ($job) {
                return [
                    'id' => $job->id,
                    'company_name' => $job->company_name,
                    'location' => $job->company_location,
                    'job_type' => $job->job_type,
                    'salary' => $job->salary_range,
                    'description' => $job->description,
                    'applicants' => $job->applicants_count,
                    'posted_at' => $job->posted_at ? $job->posted_at->diffForHumans() : $job->created_at->diffForHumans(),
                    'created_at' => $job->created_at,
                    'status' => $job->status ?? 'active',
                    'experience_level' => $job->experience_level ?? 'mid',
                ];
            });

        // Job posts statistics (unfiltered - for cards)
        $jobStats = [
            'active' => Job::where('status', 'active')->count(),
            'passed' => Job::where('status', 'passed')->count(),
            'under_review' => Job::where('status', 'under_review')->count(),
            'hired' => Job::where('status', 'hired')->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'jobStats' => $jobStats,
            'recentJobs' => $recentJobs,
            'filters' => $request->all(),
        ]);
    }

    public function users(): Response
    {
        $users = User::with('profile')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    public function jobs(): Response
    {
        $jobs = Job::with('user')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Jobs', [
            'jobs' => $jobs,
        ]);
    }

    public function analytics(): Response
    {
        $analytics = [
            'user_growth' => [
                'this_month' => User::whereMonth('created_at', now()->month)
                                    ->whereYear('created_at', now()->year)
                                    ->count(),
                'last_month' => User::whereMonth('created_at', now()->subMonth()->month)
                                    ->whereYear('created_at', now()->subMonth()->year)
                                    ->count(),
            ],
            'job_growth' => [
                'this_month' => Job::whereMonth('created_at', now()->month)
                                   ->whereYear('created_at', now()->year)
                                   ->count(),
                'last_month' => Job::whereMonth('created_at', now()->subMonth()->month)
                                   ->whereYear('created_at', now()->subMonth()->year)
                                   ->count(),
            ],
        ];

        return Inertia::render('Admin/Analytics', [
            'analytics' => $analytics,
        ]);
    }

    public function updateJobStatus(Request $request, Job $job)
    {
        $request->validate([
            'status' => 'required|in:active,passed,under_review,hired'
        ]);

        $job->update([
            'status' => $request->status
        ]);

        return response()->json(['message' => 'Job status updated successfully']);
    }

    public function createJob()
    {
        return Inertia::render('Admin/CreateJob');
    }

    public function storeJob(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'company_location' => 'required|string|max:255',
            'job_title' => 'required|string|max:255',
            'job_type' => 'required|string|max:255',
            'salary_range' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'experience_level' => 'nullable|string',
        ]);

        $job = Job::create([
            'user_id' => Auth::id(),
            'company_name' => $request->company_name,
            'company_location' => $request->company_location,
            'job_title' => $request->job_title,
            'job_type' => $request->job_type,
            'salary_range' => $request->salary_range,
            'description' => $request->description,
            'status' => 'active',
            'posted_at' => now(),
            'applicants_count' => 0,
        ]);

        return redirect()->route('admin.dashboard')->with('success', 'Job created successfully!');
    }

    public function editJob($id)
    {
        $job = Job::findOrFail($id);
        
        return Inertia::render('Admin/EditJob', [
            'job' => $job
        ]);
    }

    public function updateJob(Request $request, $id)
    {
        $job = Job::findOrFail($id);
        
        $request->validate([
            'company_name' => 'required|string|max:255',
            'company_location' => 'required|string|max:255',
            'job_type' => 'required|string|max:255',
            'salary_range' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $job->update($request->all());

        return redirect()->route('admin.jobs')->with('success', 'Job updated successfully!');
    }

    public function deleteJob($id)
    {
        $job = Job::findOrFail($id);
        $job->delete();

        return redirect()->route('admin.jobs')->with('success', 'Job deleted successfully!');
    }
    
    //Application management for admin
    public function getPendingApplications()
    {
        $applications = Application::with(['user', 'job'])
            ->where('status', 'applied')
            ->orderBy('applied_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $applications,
            'count' => $applications->count()
        ]);
    }

    public function updateApplicationStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:applied,review,interview,rejected,offered',
            'message' => 'required|string'
        ]);

        $application = Application::with('user')->findOrFail($id);
        
        $messageType = 'general';
        if (in_array($request->status, ['interview', 'offered'])) {
            $messageType = 'application_accepted';
        } elseif ($request->status === 'rejected') {
            $messageType = 'application_rejected';
        }

        $application->update([
            'status' => $request->status,
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
            'message_sent' => true
        ]);

        $message = Message::create([
            'user_id' => $application->user_id,
            'admin_id' => Auth::id(),
            'application_id' => $application->id,
            'message' => $request->message,
            'type' => $messageType,
            'is_read' => false
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Application status updated and notification sent',
            'data' => [
                'application' => $application,
                'notification' => $message
            ]
        ]);
    }
}