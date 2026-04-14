<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProfileController;
use App\Models\Job;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $jobs = Job::latest()->take(10)->get();

    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
        'jobs'           => $jobs,
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

// Explore Route
Route::get('/explore', function () {
    $jobs = App\Models\Job::where('status', 'active')->latest()->get();
    return Inertia::render('Explore', ['jobs' => $jobs]);
})->name('explore');

// User Dashboard (non-admin)
Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'not_admin'])
    ->name('dashboard');

// Authenticated User Routes
Route::middleware(['auth', 'not_admin'])->group(function () {
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
});

// Admin Routes - Protected by IsAdmin middleware
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
