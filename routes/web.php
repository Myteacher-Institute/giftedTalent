<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ResumeController;
use App\Models\Job;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Routes
Route::get('/', function () {
    $jobs = Job::latest()->take(6)->get();
    $featuredTalents = User::where('profile_completed', true)
                            ->inRandomOrder()
                            ->take(3)
                            ->get();
     
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'jobs' => $jobs,
        'featuredTalents' => $featuredTalents,
    ]);
})->name('home');

// Navigation Pages
Route::get('/jobs', [PageController::class, 'findJobs'])->name('pages.findJobs');
Route::get('/find-talents', [PageController::class, 'findTalents'])->name('pages.findTalents');
Route::get('/how-it-works', [PageController::class, 'howItWorks'])->name('pages.howItWorks');
Route::get('/about', [PageController::class, 'about'])->name('pages.about');
Route::get('/talent/{id}', [PageController::class, 'showTalent'])->name('talent.show');
Route::get('/easy-apply-job', [PageController::class, 'easyApplyJob'])->middleware(['auth', 'verified'])->name('pages.easyApplyJob');

// Search Jobs Page - Updated route
Route::get('/search-jobs', [PageController::class, 'searchJobs'])->middleware(['auth', 'verified'])->name('pages.searchJobs');

// Jobs listing page (if different from search-jobs)
Route::get('/job-listings', [PageController::class, 'jobs'])->name('jobs');

// Dashboard
Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'not_admin'])
    ->name('dashboard');

// Settings Page - Fixed with lowercase URL
Route::get('/settings', function () {
    $user = auth()->user();
    $profile = $user->profile ?? null;
    
    return Inertia::render('Settings', [
        'user' => $user,
        'profile' => $profile,
        'auth' => [
            'user' => $user,
        ],
    ]);
})->middleware(['auth'])->name('settings');

// Authenticated User Routes
Route::middleware(['auth', 'not_admin'])->group(function () {
    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'read'])->name('notifications.read');
    Route::get('/user/applied-jobs', [\App\Http\Controllers\DashboardController::class, 'appliedJobs'])->name('user.applied-jobs');
    Route::post('/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'readAll'])->name('notifications.readAll');
    // Notification Preferences Routes
Route::get('/user/notification-preferences', [ProfileController::class, 'getNotificationPreferences'])->name('user.notification-preferences.get');
Route::put('/user/notification-preferences', [ProfileController::class, 'updateNotificationPreferences'])->name('user.notification-preferences.update');
    
    // CV Management - Using dedicated ResumeController
    Route::get('/cv', [ResumeController::class, 'index'])->name('cv');
    Route::post('/profile/resume', [ResumeController::class, 'store'])->name('profile.resume.store');
    Route::delete('/profile/resume/{id}', [ResumeController::class, 'destroy'])->name('profile.resume.destroy');
    Route::get('/profile/resume/{id}/download', [ResumeController::class, 'download'])->name('profile.resume.download');
    Route::get('/profile/resume/{id}/view', [ResumeController::class, 'view'])->name('profile.resume.view');
    
    // User Profile Routes
    Route::get('/user-profile', [ProfileController::class, 'show'])->name('pages.userProfile');
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [ProfileController::class, 'editExtendedProfile'])->name('profile.editExtended');
    Route::patch('/profile/extended', [ProfileController::class, 'updateExtendedProfile'])->name('profile.updateExtended');
    
    // Profile Management Routes for Settings
    Route::put('/user/profile', [ProfileController::class, 'updateProfile'])->name('user.profile.update');
    Route::get('/user/skills', [ProfileController::class, 'getSkills'])->name('user.skills.get');
    Route::post('/user/skills', [ProfileController::class, 'addSkill'])->name('user.skills.add');
    Route::delete('/user/skills/{skill}', [ProfileController::class, 'removeSkill'])->name('user.skills.remove');
    Route::post('/user/upload-avatar', [ProfileController::class, 'uploadAvatar'])->name('user.avatar.upload');
    Route::delete('/user/remove-avatar', [ProfileController::class, 'removeAvatar'])->name('user.avatar.remove');
    
    
    // Avatar Upload Routes (keeping for compatibility)
    Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar'])->name('profile.avatar.upload');
    Route::delete('/profile/avatar', [ProfileController::class, 'removeAvatar'])->name('profile.avatar.remove');

    // Skills Routes (keeping for compatibility)
    Route::post('/profile/skills', [ProfileController::class, 'addSkill'])->name('profile.skills.add');
    Route::delete('/profile/skills/{skillId}', [ProfileController::class, 'removeSkill'])->name('profile.skills.remove');

    // Experience Routes
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
});

// Admin Routes - Protected by IsAdmin middleware
Route::middleware(['auth', 'admin'])->prefix('Admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/jobs/create', [AdminController::class, 'createJob'])->name('jobs.create');
    Route::post('/jobs', [AdminController::class, 'storeJob'])->name('jobs.store');
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::get('/jobs', [AdminController::class, 'jobs'])->name('jobs');
    Route::get('/analytics', [AdminController::class, 'analytics'])->name('analytics');

    // CV Review Routes - Using Admin\CvReviewController
    Route::resource('cv-review', \App\Http\Controllers\Admin\CvReviewController::class)
        ->only(['index', 'show']);
    Route::patch('cv-review/{resume}', [\App\Http\Controllers\Admin\CvReviewController::class, 'update'])
        ->name('cv-review.update');
    Route::get('cv-review/{resume}/download', [\App\Http\Controllers\Admin\CvReviewController::class, 'download'])
        ->name('cv-review.download');
    Route::delete('cv-review/{resume}', [\App\Http\Controllers\Admin\CvReviewController::class, 'destroy'])
        ->name('cv-review.destroy');

    // Application Management Routes
    Route::get('/pending-applications', [AdminController::class, 'getPendingApplications'])->name('pending.applications');
    Route::post('/update-application-status/{id}', [AdminController::class, 'updateApplicationStatus'])->name('update.application.status');
});

// Google Authentication Routes
Route::get('/auth/google', [GoogleController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('google.callback');

require __DIR__ . '/auth.php';