<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Contact;
use App\Models\Job;
use App\Models\Notification;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function dashboard(Request $request): Response
    {
        $adminUser = Auth::user()->load('profile');

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
            ->take(20)
            ->get()
            ->map(function ($job) {
                return [
                    'id'               => $job->id,
                    'company_name'     => $job->company_name,
                    'company_logo_url' => $job->company_logo_url,
                    'location'         => $job->company_location,
                    'job_type'         => $job->job_type,
                    'salary'           => $job->salary_range,
                    'description'      => $job->description,
                    'applicants'       => $job->applicants_count,
                    'posted_at'        => $job->posted_at ? $job->posted_at->diffForHumans() : $job->created_at->diffForHumans(),
                    'created_at'       => $job->created_at,
                    'status'           => $job->status ?? 'active',
                    'experience_level' => $job->experience_level ?? 'mid',
                ];
            });

        // Job posts statistics (unfiltered - for cards)
        $jobStats = [
            'active'       => Job::where('status', 'active')->count(),
            'passed'       => Job::where('status', 'passed')->count(),
            'under_review' => Job::where('status', 'under_review')->count(),
            'hired'        => Job::where('status', 'hired')->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'jobStats'            => $jobStats,
            'recentJobs'          => $recentJobs,
            'filters'             => $request->all(),
            'auth'                => [
                'user' => $adminUser,
            ],
            'unreadNotifications' => Notification::unread()->count(),
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
            'job_growth'  => [
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
            'status' => 'required|in:active,passed,under_review,hired',
        ]);

        $job->update([
            'status' => $request->status,
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
            'company_name'     => 'required|string|max:255',
            'company_logo_url' => 'nullable|url|max:500',
            'company_location' => 'required|string|max:255',
            'job_title'        => 'required|string|max:255',
            'job_type'         => 'required|string|max:255',
            'salary_range'     => 'required|string|max:255',
            'description'      => 'required|string',
            'tags'             => 'nullable|array',
            'application_link' => 'required|url|max:500',
        ]);

        $tags = $request->tags ?? [];

        $job = Job::create([
            'user_id'          => Auth::id(),
            'company_name'     => $request->company_name,
            'company_logo_url' => $request->company_logo_url,
            'company_location' => $request->company_location,
            'job_title'        => $request->job_title,
            'job_type'         => $request->job_type,
            'salary_range'     => $request->salary_range,
            'description'      => $request->description,
            'status'           => 'active',
            'posted_at'        => now(),
            'applicants_count' => 0,
        ]);

        return redirect()->route('admin.dashboard')->with('success', 'Job created successfully!');
    }

    public function editJob($id)
    {
        $job = Job::findOrFail($id);

        return Inertia::render('Admin/EditJob', [
            'job' => $job,
        ]);
    }

    public function updateJob(Request $request, $id)
    {
        $job = Job::findOrFail($id);

        $request->validate([
            'company_name'     => 'required|string|max:255',
            'company_location' => 'required|string|max:255',
            'job_type'         => 'required|string|max:255',
            'salary_range'     => 'required|string|max:255',
            'description'      => 'required|string',
        ]);

        $job->update($request->all());

        return redirect()->route('admin.dashboard')->with('success', 'Job updated successfully!');
    }

    public function deleteJob($id)
    {
        $job = Job::findOrFail($id);
        $job->delete();

        return redirect()->route('admin.dashboard')->with('success', 'Job deleted successfully!');
    }

    /**
     * Display messages from contact form
     */
    public function messages(Request $request): Response
    {
        $query = Contact::query();

        // Filter by read status
        if ($request->has('status') && $request->status !== '') {
            $query->where('is_read', $request->status === 'read');
        }

        // Search by name, email, or subject
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%");
            });
        }

        $messages = $query->latest()->paginate(10);

        // Get counts for stats
        $stats = [
            'total'   => Contact::count(),
            'unread'  => Contact::where('is_read', false)->count(),
            'read'    => Contact::where('is_read', true)->count(),
            'replied' => Contact::whereNotNull('admin_reply')->count(),
        ];

        return Inertia::render('Admin/Messages', [
            'messages' => $messages,
            'stats'    => $stats,
            'filters'  => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Reply to a message - REAL email sending
     */
    public function replyMessage(Request $request, $id)
    {
        $request->validate([
            'reply' => 'required|string|min:3',
        ]);

        $message = Contact::findOrFail($id);

        try {
            Mail::send([], [], function ($mail) use ($message, $request) {
                $mail->to($message->email)
                    ->subject('Re: ' . $message->subject)
                    ->html('
                    <html>
                    <head><title>Reply to your message</title></head>
                    <body>
                        <h2>Hello ' . htmlspecialchars($message->name) . ',</h2>
                        <p>Thank you for contacting GiftedTalents.</p>
                        <p><strong>Your message:</strong></p>
                        <p style="background:#f5f5f5; padding:15px; border-radius:5px;">' . nl2br(htmlspecialchars($message->message)) . '</p>
                        <p><strong>Our response:</strong></p>
                        <p style="background:#e8f4fd; padding:15px; border-radius:5px;">' . nl2br(htmlspecialchars($request->reply)) . '</p>
                        <p>Best regards,<br>GiftedTalents Team</p>
                        <hr>
                        <p style="font-size:12px; color:#999;">This is an automated response from GiftedTalents. Please do not reply to this email.</p>
                    </body>
                    </html>
                ');
            });

            $message->update([
                'is_read'     => true,
                'admin_reply' => $request->reply,
                'replied_at'  => now(),
            ]);

            return redirect()->back()->with('success', 'Reply sent successfully to ' . $message->email);

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to send reply: ' . $e->getMessage());
        }
    }

    /**
     * Delete a message
     */
    public function deleteMessage($id)
    {
        $message = Contact::findOrFail($id);
        $message->delete();

        return redirect()->back()->with('success', 'Message deleted successfully!');
    }

    /**
     * Mark message as read/unread
     */
    public function markAsRead(Request $request, $id)
    {
        $message = Contact::findOrFail($id);
        $message->update(['is_read' => $request->is_read]);

        return redirect()->back()->with('success', 'Message status updated!');
    }

    public function settings()
    {
        return Inertia::render('Admin/Settings', [
            'auth' => [
                'user' => Auth::user()->load('profile'),
            ],
        ]);
    }

    /**
     * Update admin profile
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|max:255|unique:users,email,' . Auth::id(),
            'bio'      => 'nullable|string|max:500',
            'phone'    => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
        ]);

        $user = Auth::user();

        // Update user
        $user->update([
            'name'  => $request->name,
            'email' => $request->email,
        ]);

        // Update or create profile
        if ($user->profile) {
            $user->profile->update([
                'bio'      => $request->bio,
                'phone'    => $request->phone,
                'location' => $request->location,
            ]);
        } else {
            $user->profile()->create([
                'user_id'  => $user->id,
                'bio'      => $request->bio,
                'phone'    => $request->phone,
                'location' => $request->location,
            ]);
        }

        return redirect()->back()->with('success', 'Profile updated successfully!');
    }

    /**
     * Update admin password
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'new_password'     => ['required', 'confirmed', Password::defaults()],
        ]);

        Auth::user()->update([
            'password' => Hash::make($request->new_password),
        ]);

        return redirect()->back()->with('success', 'Password updated successfully!');
    }

    /**
     * Display candidates (users who applied for jobs)
     */
    public function candidates(Request $request)
    {
        // Get users who have applications
        $users = User::where('is_admin', false)
            ->whereHas('applications')
            ->with(['applications.job', 'profile'])
            ->get();

        // Transform the data
        $candidatesData = [];
        foreach ($users as $candidate) {
            $application = $candidate->applications->first();
            if ($application) {
                $job = $application->job;

                $candidatesData[] = [
                    'id'           => $candidate->id,
                    'name'         => $candidate->name,
                    'email'        => $candidate->email,
                    'avatar'       => $candidate->profile?->avatar ?? null,
                    'status'       => $application->status ?? 'applied',
                    'created_at'   => $candidate->created_at,
                    'job_title'    => $job->job_title ?? 'N/A',
                    'company_name' => $job->company_name ?? 'N/A',
                    'applications' => $candidate->applications->map(function ($app) {
                        return [
                            'id'           => $app->id,
                            'job_id'       => $app->job_id,
                            'job_title'    => $app->job->job_title ?? 'N/A',
                            'company_name' => $app->job->company_name ?? 'N/A',
                            'applied_at'   => $app->applied_at ?? $app->created_at,
                            'status'       => $app->status,
                        ];
                    }),
                ];
            }
        }

        // Paginate manually
        $perPage       = 15;
        $currentPage   = request()->get('page', 1);
        $offset        = ($currentPage - 1) * $perPage;
        $paginatedData = array_slice($candidatesData, $offset, $perPage);

        $paginator = new \Illuminate\Pagination\LengthAwarePaginator(
            $paginatedData,
            count($candidatesData),
            $perPage,
            $currentPage,
            ['path' => request()->url()]
        );

        $stats = [
            'total'    => count($candidatesData),
            'pending'  => collect($candidatesData)->where('status', 'applied')->count(),
            'approved' => collect($candidatesData)->whereIn('status', ['review', 'interview', 'offered'])->count(),
            'rejected' => collect($candidatesData)->where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/Candidates', [
            'candidates' => $paginator,
            'stats'      => $stats,
        ]);
    }

    /**
     * Update candidate status
     */
    public function updateCandidateStatus(Request $request, $applicationId)
    {
        $application = Application::findOrFail($applicationId);
        $application->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Application status updated successfully');
    }

    /**
     * View candidate details with their applications
     */
    public function viewCandidate($id)
    {
        $candidate = User::with(['profile', 'skills', 'experiences', 'resumes', 'applications.job'])
            ->findOrFail($id);

        return Inertia::render('Admin/CandidateDetails', [
            'candidate' => $candidate,
        ]);
    }

    /**
     * Delete candidate
     */
    public function deleteCandidate($id)
    {
        $candidate = User::findOrFail($id);

        // Also delete their applications
        $candidate->applications()->delete();
        $candidate->delete();

        return redirect()->back()->with('success', 'Candidate deleted successfully');
    }

    public function jobApplicants($id)
    {
        $job = Job::findOrFail($id);

        // Get all applicants for this job
        $applicants = Application::where('job_id', $id)
            ->with('user')
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/JobApplicants', [
            'job'        => $job,
            'applicants' => $applicants,
        ]);
    }

    public function removeAvatar()
    {
        $user = Auth::user();

        if ($user->profile) {
            $user->profile->update(['avatar' => null]);
        }

        return redirect()->back()->with('success', 'Avatar removed successfully');
    }

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|string',
        ]);

        $user = Auth::user();

        // Find or create profile
        $profile = Profile::where('user_id', $user->id)->first();

        if ($profile) {
            $profile->update(['avatar' => $request->avatar]);
        } else {
            $profile = Profile::create([
                'user_id' => $user->id,
                'avatar'  => $request->avatar,
            ]);
        }

        return redirect()->back()->with('success', 'Avatar updated successfully');
    }
}
