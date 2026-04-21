<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\JobsController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\TalentController;
use App\Http\Controllers\HireController;
use App\Http\Controllers\PrivacySettingsController;
use App\Models\Job;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

// ============================================
// PUBLIC ROUTES (No login required)
// ============================================

// Only the homepage is public
Route::get('/', function () {
    $jobs = Job::latest()->take(10)->get();

    $featuredTalents = User::where('profile_completed', '>=', 50)
                            ->with('profile')
                            ->orderBy('profile_completed', 'desc')
                            ->take(6)
                            ->get()
                            ->map(function($user) {
                                $skills = [];
                                if ($user->skills) {
                                    $skills = is_string($user->skills) ? json_decode($user->skills, true) : $user->skills;
                                }
                                if (empty($skills)) {
                                    $skills = ['Available for work'];
                                }
                                
                                $rating = 3.5;
                                if ($user->profile_completed >= 90) $rating = 5.0;
                                elseif ($user->profile_completed >= 80) $rating = 4.8;
                                elseif ($user->profile_completed >= 70) $rating = 4.5;
                                elseif ($user->profile_completed >= 60) $rating = 4.2;
                                elseif ($user->profile_completed >= 50) $rating = 4.0;
                                
                                $avatar = null;
                                if ($user->profile && $user->profile->profile_image_base64) {
                                    $avatar = $user->profile->profile_image_base64;
                                } elseif ($user->profile && $user->profile->avatar_url) {
                                    $avatar = $user->profile->avatar_url;
                                }
                                
                                $title = $user->title;
                                if (!$title && $user->profile && $user->profile->title) {
                                    $title = $user->profile->title;
                                }
                                if (!$title && $user->profile && $user->profile->position) {
                                    $title = $user->profile->position;
                                }
                                
                                return [
                                    'id' => $user->id,
                                    'name' => $user->name,
                                    'title' => $title ?? 'Professional',
                                    'avatar' => $avatar,
                                    'avatar_url' => $avatar,
                                    'profile_image_base64' => $avatar,
                                    'skills' => $skills,
                                    'rating' => $rating,
                                    'profile_completed' => $user->profile_completed,
                                ];
                            });
     
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
        'jobs'           => $jobs,
        'featuredTalents' => $featuredTalents,
    ]);
})->name('home');

// ============================================
// PROTECTED ROUTES (Login required for ALL)
// ============================================

Route::middleware(['auth'])->group(function () {

    // Job Details Route
    Route::get('/jobs/{id}', function ($id) {
        $job = Job::findOrFail($id);
        return Inertia::render('JobDetails', ['job' => $job]);
    })->name('jobs.show');

    Route::post('/jobs/{jobId}/apply', [App\Http\Controllers\JobsController::class, 'apply'])->name('jobs.apply');
    Route::get('/my-applications', [App\Http\Controllers\JobsController::class, 'myApplications'])->name('my.applications');
});

    // ============================================
    // HIRE PAGE - Browse Talent (No API, just Inertia)
    // ============================================
    Route::get('/hire', [HireController::class, 'index'])->name('hire');

    // Talent Profile Route
    Route::get('/talent/{id}', [TalentController::class, 'show'])->name('talent.show');

    // Navigation Pages
    Route::get('/find-jobs', [JobsController::class, 'index'])->name('pages.findJobs');
    Route::get('/find-talents', [PageController::class, 'findTalents'])->name('pages.findTalents');
    Route::get('/how-it-works', [PageController::class, 'howItWorks'])->name('pages.howItWorks');
    Route::get('/about', [PageController::class, 'about'])->name('pages.about');
    Route::get('/jobs', [PageController::class, 'jobs'])->name('jobs');

    // User Profile Routes
    Route::get('/user-profile', [ProfileController::class, 'show'])->name('pages.userProfile');
    Route::get('/easy-apply-job', [PageController::class, 'easyApplyJob'])->name('pages.easyApplyJob');
    Route::get('/search-jobs', [JobsController::class, 'searchJobs'])->name('search-jobs');

    // Contact Routes
    Route::get('/contact', [ContactController::class, 'index'])->name('contact');
    Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

    // Privacy & Guidelines
    Route::get('/privacy', function () {
        return Inertia::render('Privacy');
    })->name('privacy');

    Route::get('/guidelines', function () {
        return Inertia::render('Guidelines');
    })->name('guidelines');

    // User Dashboard
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
        ->middleware(['not_admin'])
        ->name('dashboard');

    // Settings
    Route::get('/settings', function () {
        return Inertia::render('Settings', [
            'user' => Auth::user(),
            'profile' => Auth::user()->profile,
            'auth' => ['user' => Auth::user()],
        ]);
    })->name('settings');

    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'read'])->name('notifications.read');
    Route::post('/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'readAll'])->name('notifications.readAll');

    // CV Routes
    Route::get('/cv', [ProfileController::class, 'cv'])->name('cv');
    Route::post('/profile/resume', [ProfileController::class, 'storeResume'])->name('profile.resume.store');
    Route::delete('/profile/resume/{id}', [ProfileController::class, 'destroyResume'])->name('profile.resume.destroy');

    // Profile Routes
    Route::get('/profile/edit', [ProfileController::class, 'editExtendedProfile'])->name('profile.editExtended');
    Route::patch('/profile/extended', [ProfileController::class, 'updateExtendedProfile'])->name('profile.updateExtended');
    Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar'])->name('profile.avatar.upload');
    Route::delete('/profile/avatar', [ProfileController::class, 'removeAvatar'])->name('profile.avatar.remove');
    Route::post('/profile/skills', [ProfileController::class, 'addSkill'])->name('profile.skills.add');
    Route::delete('/profile/skills/{skillId}', [ProfileController::class, 'removeSkill'])->name('profile.skills.remove');
    Route::post('/profile/experiences', [ProfileController::class, 'addExperience'])->name('profile.experiences.add');
    Route::put('/profile/experiences/{experience}', [ProfileController::class, 'updateExperience'])->name('profile.experiences.update');
    Route::delete('/profile/experiences/{experience}', [ProfileController::class, 'deleteExperience'])->name('profile.experiences.delete');

    // Job Preferences Routes
    Route::get('/user/job-preferences', [ProfileController::class, 'getJobPreferences'])->name('user.job-preferences.get');
    Route::put('/user/job-preferences', [ProfileController::class, 'updateJobPreferences'])->name('user.job-preferences.update');
    
    // Privacy Settings Routes
    Route::get('/user/privacy-settings', [PrivacySettingsController::class, 'getSettings'])->name('user.privacy-settings.get');
    Route::put('/user/privacy-settings', [PrivacySettingsController::class, 'updateSettings'])->name('user.privacy-settings.update');

    // Saved Jobs Routes
    Route::post('/saved-jobs/{jobId}', function ($jobId) {
        $user = auth()->user();
        
        $exists = DB::table('saved_jobs')
            ->where('user_id', $user->id)
            ->where('job_id', $jobId)
            ->exists();
        
        if (!$exists) {
            DB::table('saved_jobs')->insert([
                'user_id' => $user->id,
                'job_id' => $jobId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            return response()->json(['message' => 'Job saved successfully']);
        }
        
        return response()->json(['message' => 'Job already saved'], 409);
    })->name('saved-jobs.store');

    Route::delete('/saved-jobs/{jobId}', function ($jobId) {
        $user = auth()->user();
        
        DB::table('saved_jobs')
            ->where('user_id', $user->id)
            ->where('job_id', $jobId)
            ->delete();
        
        return response()->json(['message' => 'Job removed from saved']);
    })->name('saved-jobs.destroy');

    // Explore Page Route
    Route::get('/explore', [App\Http\Controllers\ExploreController::class, 'index'])->name('explore');
    
    // Google Authentication Routes
    Route::get('/auth/google', [GoogleController::class, 'redirect'])->name('google.redirect');
    Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('google.callback');

       // ============================================
// USER MESSAGE ROUTES
// ============================================

// GET routes first (no parameters or specific patterns)
Route::get('/messages', [MessageController::class, 'index'])->name('messages.index');
Route::get('/messages/conversations', [MessageController::class, 'getConversations'])->name('messages.conversations');
Route::get('/messages/unread/count', [MessageController::class, 'getUnreadCount'])->name('messages.unread.count');

// GET routes with parameters
Route::get('/messages/user/{userId}', [MessageController::class, 'getUserMessages'])->name('messages.user');

// POST routes
Route::post('/messages/send', [MessageController::class, 'send'])->name('messages.send');

// PATCH routes
Route::patch('/messages/{messageId}/read', [MessageController::class, 'markAsRead'])->name('messages.read');

// DELETE routes (always last)
Route::delete('/messages/{messageId}', [MessageController::class, 'destroy'])->name('messages.destroy');

// ============================================
// ADMIN ROUTES (Auth + Admin middleware)
// ============================================

Route::middleware(['auth', 'admin'])->prefix('Admin')->name('admin.')->group(function () {

    // Admin Dashboard & Management Routes
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::get('/jobs', [AdminController::class, 'jobs'])->name('jobs');
    Route::get('/jobs/create', [AdminController::class, 'createJob'])->name('jobs.create');
    Route::post('/jobs', [AdminController::class, 'storeJob'])->name('jobs.store');
    Route::get('/jobs/{id}/edit', [AdminController::class, 'editJob'])->name('jobs.edit');
    Route::patch('/jobs/{id}', [AdminController::class, 'updateJob'])->name('jobs.update');
    Route::delete('/jobs/{id}', [AdminController::class, 'deleteJob'])->name('jobs.delete');
    Route::get('/jobs/{id}/applicants', [AdminController::class, 'jobApplicants'])->name('admin.jobs.applicants');

    // Profile Management Routes
    Route::post('/profile/avatar', [AdminController::class, 'uploadAvatar'])->name('profile.avatar.upload');
    Route::delete('/profile/avatar', [AdminController::class, 'removeAvatar'])->name('profile.avatar.remove');

    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications');
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllRead');
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
    Route::get('/analytics', [AdminController::class, 'analytics'])->name('analytics');

    Route::get('/messages', [AdminController::class, 'messages'])->name('messages');
    Route::post('/messages/{id}/reply', [AdminController::class, 'replyMessage'])->name('messages.reply');
    Route::delete('/messages/{id}', [AdminController::class, 'deleteMessage'])->name('messages.delete');
    Route::patch('/messages/{id}/read', [AdminController::class, 'markAsRead'])->name('messages.read');
    
    Route::post('/messages/send-to-user', [MessageController::class, 'adminSend'])->name('messages.admin.send');

    Route::get('/my-messages', [MessageController::class, 'index'])->name('messages.index');

    // Settings Route
    Route::get('/settings', [AdminController::class, 'settings'])->name('settings');

    // Profile Management Routes
    Route::patch('/profile', [AdminController::class, 'updateProfile'])->name('profile.update');
    Route::put('/password', [AdminController::class, 'updatePassword'])->name('password.update');

    // Candidate Management Routes
    Route::get('/candidates', [AdminController::class, 'candidates'])->name('candidates');
    Route::patch('/candidates/{applicationId}/status', [AdminController::class, 'updateCandidateStatus'])->name('candidates.status'); // Keep only this one
    Route::get('/candidates/{id}', [AdminController::class, 'viewCandidate'])->name('candidates.show');
    Route::delete('/candidates/{id}', [AdminController::class, 'deleteCandidate'])->name('candidates.delete');

    // CV Review Routes
    Route::resource('cv-review', \App\Http\Controllers\Admin\CvReviewController::class)->only(['index', 'show']);
    Route::patch('cv-review/{resume}', [\App\Http\Controllers\Admin\CvReviewController::class, 'update'])->name('admin.cv-review.update');
    Route::get('cv-review/{resume}/download', [\App\Http\Controllers\Admin\CvReviewController::class, 'download'])->name('admin.cv-review.download');
    Route::delete('cv-review/{resume}', [\App\Http\Controllers\Admin\CvReviewController::class, 'destroy'])->name('admin.cv-review.destroy');
});

// Google Authentication Routes
Route::get('/auth/google', [GoogleController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('google.callback');

require __DIR__ . '/auth.php';
