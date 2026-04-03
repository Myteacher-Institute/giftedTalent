<?php
namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class PageController extends Controller
{
    /**
     * Display the Find Jobs page.
     */
    public function findJobs(): Response
    {
        return Inertia::render('FindJobs');
    }

    /**
     * Display the Find Talents page.
     */
    public function findTalents(): Response
    {
        return Inertia::render('FindTalents');
    }

    /**
     * Display the How It Works page.
     */
    public function howItWorks(): Response
    {
        return Inertia::render('HowItWorks');
    }

    /**
     * Display the About page.
     */
    public function about(): Response
    {
        return Inertia::render('About');
    }

    /**
     * Display the User Profile page.
     */
    public function userProfile(): Response
    {
        return Inertia::render('userProfile');
    }

    /**
     * Display the Easy Apply Job page.
     */
    public function easyApplyJob(): Response
    {
        return Inertia::render('EasyApplyJob');
    }

    /**
     * Display the Search Jobs page.
     */
    public function searchJobs(): Response
    {
        return Inertia::render('search-job', [
            'auth' => ['user' => Auth::user()],
        ]);
    }

    /**
     * Display all jobs.
     */
    public function jobs()
    {
        $jobs = Job::latest()->get();
        return Inertia::render('Jobs', [
            'jobs' => $jobs,
        ]);
    }

    /**
     * Display a single talent profile.
     */
    public function showTalent($id)
    {
        // Load user with profile relationship
        $user = User::with('profile')->findOrFail($id);
        $authUser = Auth::user();
        
        // Get user's privacy settings - decode if it's a string
        $privacySettings = $user->privacy_settings;
        
        // If it's a string, decode it; if null, use defaults
        if (is_string($privacySettings)) {
            $privacySettings = json_decode($privacySettings, true);
        }
        
        // Default settings if null or empty
        if (empty($privacySettings) || !is_array($privacySettings)) {
            $privacySettings = [
                'profile_visibility' => 'public',
                'show_email' => true,
                'show_phone' => false,
                'show_experience' => true,
                'show_education' => true,
                'show_skills' => true,
                'show_rating' => true,
                'appear_in_search' => true,
                'appear_in_talent_listings' => true,
                'allow_download_resume' => true,
                'allow_contact_requests' => true,
                'show_read_receipts' => false,
                'show_last_active' => true,
                'share_analytics' => true,
                'share_for_recommendations' => true,
            ];
        }
        
        // Check if user is admin
        $isAdmin = $authUser && ($authUser->is_admin == 1 || $authUser->role === 'admin');
        
        // Check profile visibility
        $canViewProfile = false;
        $isOwner = ($authUser && $authUser->id === $user->id);
        
        // Get profile visibility value safely
        $profileVisibility = $privacySettings['profile_visibility'] ?? 'public';
        
        // Admin can view any profile
        if ($isAdmin) {
            $canViewProfile = true;
        } elseif ($profileVisibility === 'public') {
            $canViewProfile = true;
        } elseif ($profileVisibility === 'registered_only') {
            $canViewProfile = $authUser !== null;
        } elseif ($profileVisibility === 'private') {
            // Only the profile owner can view
            $canViewProfile = $isOwner;
        } else {
            $canViewProfile = true; // Default to public
        }
        
        // If cannot view profile, show restricted view
        if (!$canViewProfile) {
            return Inertia::render('ProfileRestricted', [
                'user' => $user,
                'auth' => [
                    'user' => $authUser,
                ],
                'message' => 'This profile is private',
            ]);
        }
        
        // Get avatar from profile
        $avatar = null;
        if ($user->profile && $user->profile->avatar_url) {
            $avatar = $user->profile->avatar_url;
        } elseif ($user->profile && $user->profile->profile_image_base64) {
            $avatar = $user->profile->profile_image_base64;
        }
        
        // Get skills - respect privacy settings (admin can see everything)
        $skills = [];
        $showSkills = $privacySettings['show_skills'] ?? true;
        
        if ($showSkills || $isOwner || $isAdmin) {
            if ($user->skills) {
                $skills = is_string($user->skills) ? json_decode($user->skills, true) : $user->skills;
            }
            if (empty($skills) && $user->profile && $user->profile->skills) {
                $skills = is_string($user->profile->skills) ? json_decode($user->profile->skills, true) : $user->profile->skills;
            }
        }
        if (empty($skills)) {
            $skills = ($showSkills || $isAdmin) ? ['Available for work'] : ['Skills hidden'];
        }
        
        // Format the talent data with privacy applied (admin can see everything)
        $talent = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => (($privacySettings['show_email'] ?? true) || $isOwner || $isAdmin) ? ($user->email ?? ($user->profile->email ?? null)) : null,
            'phone' => (($privacySettings['show_phone'] ?? false) || $isOwner || $isAdmin) ? ($user->phone ?? ($user->profile->phone ?? null)) : null,
            'title' => $user->title ?? ($user->profile->title ?? 'Professional'),
            'bio' => $user->bio ?? ($user->profile->bio ?? null),
            'company' => $user->company ?? ($user->profile->company ?? null),
            'location' => $user->location ?? ($user->profile->city ?? null),
            'avatar' => $avatar,
            'skills' => $skills,
            'availability_status' => $user->availability_status ?? ($user->profile->availability_status ?? 'Open to work'),
            'employment_type' => $user->employment_type ?? ($user->profile->employment_type ?? 'Full-Time, Remote'),
            'start_date' => $user->start_date ?? ($user->profile->start_date ?? 'Available Immediately'),
            'resume_url' => null,
            'is_owner' => $isOwner,
            'is_admin' => $isAdmin,
            'can_contact' => ($privacySettings['allow_contact_requests'] ?? true) && $authUser && $authUser->id !== $user->id,
            'privacy' => $privacySettings,
        ];
        
        // DEBUG: Log what's being sent
        \Log::info('Talent Profile Data:', [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'is_admin' => $isAdmin,
            'privacy_settings' => $privacySettings,
            'show_email_setting' => $privacySettings['show_email'] ?? 'not set',
            'show_phone_setting' => $privacySettings['show_phone'] ?? 'not set',
            'email_sent' => $talent['email'],
            'phone_sent' => $talent['phone'],
            'is_owner' => $isOwner,
            'auth_user_id' => $authUser ? $authUser->id : 'not logged in',
        ]);
        
        return Inertia::render('TalentProfile', [
            'talent' => $talent,
            'auth' => [
                'user' => $authUser,
            ],
        ]);
    }
}