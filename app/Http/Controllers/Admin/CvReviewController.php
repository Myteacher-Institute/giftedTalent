<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Resume;
use App\Notifications\CvReviewNotification;
use App\Policies\ResumePolicy;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Auth\Access\AuthorizationException;

class CvReviewController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('admin');
        $this->authorizeResource(Resume::class, 'cv-review');
    }

    /**
     * Display list of pending CVs for review.
     */
    public function index(Request $request)
    {
        $pendingResumes = Resume::pending()
            ->with(['user', 'user.profile', 'reviewer'])
            ->withCount('user.skills', 'user.experiences')
            ->paginate(15)
            ->through(function ($resume) {
                return [
                    ...$resume->toArray(),
                    'user_name' => $resume->user->name,
                    'user_position' => $resume->user->profile?->position ?? 'Not set',
                    'profile_complete' => $this->calculateUserProfileCompletion($resume->user),
                ];
            });

        return Inertia::render('Admin/CvReview/Index', [
            'pendingResumes' => $pendingResumes,
            'stats' => [
                'pending' => Resume::pending()->count(),
                'approved' => Resume::approved()->count(),
                'rejected' => Resume::rejected()->count(),
            ],
        ]);
    }

    /**
     * Display specific resume for review.
     */
    public function show(Resume $resume)
    {
        $resume->load(['user', 'user.profile', 'user.skills', 'reviewer']);
        
        return Inertia::render('Admin/CvReview/Show', [
            'resume' => [
                ...$resume->toArray(),
                'user_name' => $resume->user->name,
                'user_position' => $resume->user->profile?->position ?? 'Not set',
                'user_email' => $resume->user->email,
                'profile_complete' => $this->calculateUserProfileCompletion($resume->user),
                'download_url' => Storage::url($resume->file_path),
                'file_url' => Storage::url($resume->file_path),
            ],
            'stats' => [
                'pending' => Resume::pending()->count(),
            ],
        ]);
    }

    /**
     * Update resume review status.
     */
    public function update(Request $request, Resume $resume): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'feedback' => 'required|string|max:1000',
        ]);

        $resume->update([
            'status' => $validated['status'],
            'feedback' => $validated['feedback'],
            'reviewed_at' => now(),
            'reviewer_id' => Auth::id(),
        ]);

        $resume->user->notify(new CvReviewNotification($resume));

        return redirect()->route('admin.cv-review.index')
            ->with('success', ucfirst($validated['status']) . ' CV reviewed! User notified with feedback.');
    }

    /**
     * Download resume file.
     */
    public function download(Resume $resume)
    {
        if (!Storage::disk('public')->exists($resume->file_path)) {
            abort(404, 'File not found.');
        }

        return Storage::disk('public')->download($resume->file_path, $resume->file_name ?? 'resume.pdf');
    }

    /**
     * Delete resume.
     */
    public function destroy(Resume $resume)
    {
        Storage::disk('public')->delete($resume->file_path);
        $resume->delete();

        return redirect()->route('admin.cv-review.index')
            ->with('success', 'CV deleted successfully.');
    }

    private function calculateUserProfileCompletion($user)
    {
        $fields = 0;
        $total = 5;
        if ($user->profile?->position) $fields++;
        if ($user->skills()->count() > 0) $fields++;
        if ($user->experiences()->count() > 0) $fields++;
        if (!empty($user->profile?->bio)) $fields++;
        if ($user->email_verified_at) $fields++;

        return round(($fields / $total) * 100);
    }
}

