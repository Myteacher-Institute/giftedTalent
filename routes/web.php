<?php

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

// Navigation Pages
Route::get('/find-jobs', [PageController::class, 'findJobs'])->name('pages.findJobs');
Route::get('/find-talents', [PageController::class, 'findTalents'])->name('pages.findTalents');
Route::get('/how-it-works', [PageController::class, 'howItWorks'])->name('pages.howItWorks');
Route::get('/about', [PageController::class, 'about'])->name('pages.about');
Route::get('/user-profile', [ProfileController::class, 'show'])->middleware('auth')->name('pages.userProfile');
Route::get('/easy-apply-job', [PageController::class, 'easyApplyJob'])->middleware(['auth', 'verified'])->name('pages.easyApplyJob');

Route::get('/search-jobs', [PageController::class, 'searchJobs'])->middleware(['auth', 'verified'])->name('pages.searchJobs');

Route::get('/jobs', function () {
    return Inertia::render('Jobs');
})->name('jobs');

Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->middleware(['auth', 'verified', 'not_admin'])->name('dashboard');

Route::middleware(['auth', 'not_admin'])->group(function () {
    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'read'])->name('notifications.read');
    Route::post('/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'readAll'])->name('notifications.readAll');
    
    Route::get('/cv', [ProfileController::class, 'cv'])->name('cv');
    Route::post('/profile/resume', [ProfileController::class, 'storeResume'])->name('profile.resume.store');
    Route::delete('/profile/resume/{id}', [ProfileController::class, 'destroyResume'])->name('profile.resume.destroy');
    // Basic Profile Routes
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Extended Profile Routes
    Route::patch('/profile/extended', [ProfileController::class, 'updateExtendedProfile'])->name('profile.updateExtended');
    
    // Avatar Upload Route
    Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar'])->middleware('auth')->name('profile.avatar.upload');
    Route::delete('/profile/avatar', [ProfileController::class, 'removeAvatar'])->middleware('auth')->name('profile.avatar.remove');

    // Skills Routes
    Route::post('/profile/skills', [ProfileController::class, 'addSkill'])->name('profile.skills.add');
    Route::delete('/profile/skills/{skillId}', [ProfileController::class, 'removeSkill'])->name('profile.skills.remove');

    // Experience Routes
    Route::post('/profile/experiences', [ProfileController::class, 'addExperience'])->name('profile.experiences.add');
    Route::put('/profile/experiences/{experience}', [ProfileController::class, 'updateExperience'])->name('profile.experiences.update');
    Route::delete('/profile/experiences/{experience}', [ProfileController::class, 'deleteExperience'])->name('profile.experiences.delete');
});

// Admin Routes - Protected by IsAdmin middleware
Route::middleware(['auth', 'admin'])->prefix('Admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');

    Route::get('/users', [AdminController::class, 'users'])->name('users');

    Route::get('/jobs', [AdminController::class, 'jobs'])->name('jobs');

    Route::get('/analytics', [AdminController::class, 'analytics'])->name('analytics');

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
