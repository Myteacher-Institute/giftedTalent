<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PrivacySettingsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\JobController;  // ADDED THIS LINE
use App\Models\Job;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

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

// Job Details Route
Route::get('/jobs/{id}', function ($id) {
    $job = Job::findOrFail($id);
    return Inertia::render('JobDetails', ['job' => $job]);
})->name('jobs.show');

// Navigation Pages
Route::get('/find-jobs', [PageController::class, 'findJobs'])->name('pages.findJobs');
Route::get('/find-talents', [PageController::class, 'findTalents'])->name('pages.findTalents');
Route::get('/how-it-works', [PageController::class, 'howItWorks'])->name('pages.howItWorks');
Route::get('/about', [PageController::class, 'about'])->name('pages.about');
Route::get('/jobs', [PageController::class, 'jobs'])->name('jobs');

// User Profile Routes
Route::get('/user-profile', [ProfileController::class, 'show'])->middleware('auth')->name('pages.userProfile');
Route::get('/easy-apply-job', [PageController::class, 'easyApplyJob'])->middleware(['auth', 'verified'])->name('pages.easyApplyJob');
Route::get('/search-jobs', [PageController::class, 'searchJobs'])->middleware(['auth', 'verified'])->name('pages.searchJobs');

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

// User Dashboard (non-admin)
Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'not_admin'])
    ->name('dashboard');

// ========== JOB ROUTES ==========
Route::get('/find-jobs', [JobController::class, 'index'])->name('jobs.index');
// =================================

// Authenticated User Routes
Route::middleware(['auth', 'not_admin'])->group(function () {
    // ========== SETTINGS ROUTE ==========
    Route::get('/settings', function () {
        return Inertia::render('Settings', [
            'user' => auth()->user(),
            'profile' => auth()->user()->profile,
            'auth' => ['user' => auth()->user()],
        ]);
    })->name('settings');
    // ====================================

    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'read'])->name('notifications.read');
    Route::post('/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'readAll'])->name('notifications.readAll');

    Route::get('/cv', [ProfileController::class, 'cv'])->name('cv');
    Route::post('/profile/resume', [ProfileController::class, 'storeResume'])->name('profile.resume.store');
    Route::delete('/profile/resume/{id}', [ProfileController::class, 'destroyResume'])->name('profile.resume.destroy');

    Route::get('/profile/edit', [ProfileController::class, 'editExtendedProfile'])->name('profile.editExtended');
    Route::patch('/profile/extended', [ProfileController::class, 'updateExtendedProfile'])->name('profile.updateExtended');

    Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar'])->middleware('auth')->name('profile.avatar.upload');
    Route::delete('/profile/avatar', [ProfileController::class, 'removeAvatar'])->middleware('auth')->name('profile.avatar.remove');

    Route::post('/profile/skills', [ProfileController::class, 'addSkill'])->name('profile.skills.add');
    Route::delete('/profile/skills/{skillId}', [ProfileController::class, 'removeSkill'])->name('profile.skills.remove');

    Route::post('/profile/experiences', [ProfileController::class, 'addExperience'])->name('profile.experiences.add');
    Route::put('/profile/experiences/{experience}', [ProfileController::class, 'updateExperience'])->name('profile.experiences.update');
    Route::delete('/profile/experiences/{experience}', [ProfileController::class, 'deleteExperience'])->name('profile.experiences.delete');

    // Saved Jobs Routes
    Route::get('/saved-jobs', [\App\Http\Controllers\Api\SavedJobController::class, 'index'])->name('saved-jobs.index');
    Route::post('/saved-jobs/{jobId}', [\App\Http\Controllers\Api\SavedJobController::class, 'store'])->name('saved-jobs.store');
    Route::delete('/saved-jobs/{jobId}', [\App\Http\Controllers\Api\SavedJobController::class, 'destroy'])->name('saved-jobs.destroy');
    Route::get('/saved-jobs/check/{jobId}', [\App\Http\Controllers\Api\SavedJobController::class, 'check'])->name('saved-jobs.check');
    Route::get('/saved-jobs/count', [\App\Http\Controllers\Api\SavedJobController::class, 'count'])->name('saved-jobs.count');

    // Job Preferences Routes
    Route::get('/user/job-preferences', [ProfileController::class, 'getJobPreferences'])->name('user.job-preferences.get');
    Route::put('/user/job-preferences', [ProfileController::class, 'updateJobPreferences'])->name('user.job-preferences.update');
    
    // Privacy Settings Routes
    Route::get('/user/privacy-settings', [PrivacySettingsController::class, 'getSettings'])->name('user.privacy-settings.get');
    Route::put('/user/privacy-settings', [PrivacySettingsController::class, 'updateSettings'])->name('user.privacy-settings.update');
});

// Admin Routes - Protected by IsAdmin middleware
Route::middleware(['auth', 'admin'])->prefix('Admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::get('/jobs', [AdminController::class, 'jobs'])->name('jobs');
    Route::get('/jobs/create', [AdminController::class, 'createJob'])->name('jobs.create');
    Route::post('/jobs', [AdminController::class, 'storeJob'])->name('jobs.store');

    // Notification Routes
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications');
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllRead');
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
    Route::get('/analytics', [AdminController::class, 'analytics'])->name('analytics');

    // Messages Routes
    Route::get('/messages', [AdminController::class, 'messages'])->name('messages');
    Route::post('/messages/{id}/reply', [AdminController::class, 'replyMessage'])->name('messages.reply');
    Route::delete('/messages/{id}', [AdminController::class, 'deleteMessage'])->name('messages.delete');
    Route::patch('/messages/{id}/read', [AdminController::class, 'markAsRead'])->name('messages.read');

    Route::get('/settings', [AdminController::class, 'settings'])->name('settings');

    Route::patch('/profile', [AdminController::class, 'updateProfile'])->name('profile.update');
    Route::put('/password', [AdminController::class, 'updatePassword'])->name('password.update');

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