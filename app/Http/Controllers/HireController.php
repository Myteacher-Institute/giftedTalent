<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HireController extends Controller
{
    /**
     * Display the hire page with all talents (job seekers)
     */
    public function index()
    {
        // Get all users who are NOT admins (job seekers)
        $talents = User::where('is_admin', 0)
            ->where('profile_completed', '>=', 50)
            ->with('profile')
            ->orderBy('profile_completed', 'desc')
            ->get()
            ->map(function($user) {
                // Get user skills - ensure it's always an array
                $skills = [];
                if ($user->skills) {
                    $skills = is_string($user->skills) ? json_decode($user->skills, true) : $user->skills;
                }
                if (empty($skills) && $user->profile && $user->profile->skills) {
                    $skills = is_string($user->profile->skills) ? json_decode($user->profile->skills, true) : $user->profile->skills;
                }
                // Ensure skills is always an array
                if (!is_array($skills)) {
                    $skills = [];
                }
                
                // Get user title/position
                $title = $user->title;
                if (!$title && $user->profile && $user->profile->title) {
                    $title = $user->profile->title;
                }
                if (!$title && $user->profile && $user->profile->position) {
                    $title = $user->profile->position;
                }
                
                // Get user location
                $location = $user->location;
                if (!$location && $user->profile && $user->profile->city) {
                    $location = $user->profile->city;
                }
                if (!$location && $user->profile && $user->profile->address) {
                    $location = $user->profile->address;
                }
                
                // Get profile image
                $avatar = null;
                if ($user->profile && $user->profile->profile_image_base64) {
                    $avatar = $user->profile->profile_image_base64;
                } elseif ($user->profile && $user->profile->avatar_url) {
                    $avatar = $user->profile->avatar_url;
                }
                
                // Calculate rating based on profile completion
                $rating = 3.5;
                if ($user->profile_completed >= 90) $rating = 5.0;
                elseif ($user->profile_completed >= 80) $rating = 4.8;
                elseif ($user->profile_completed >= 70) $rating = 4.5;
                elseif ($user->profile_completed >= 60) $rating = 4.2;
                elseif ($user->profile_completed >= 50) $rating = 4.0;
                
                // Determine experience level
                $experienceLevel = 'entry';
                $yearsExperience = $user->profile->years_experience ?? 0;
                if ($yearsExperience >= 5) {
                    $experienceLevel = 'senior';
                } elseif ($yearsExperience >= 3) {
                    $experienceLevel = 'mid';
                }
                
                // Determine availability
                $availability = $user->availability_status ?? $user->profile->availability_status ?? 'Available';
                if ($availability === 'open to work') $availability = 'Immediate';
                if ($availability === 'available') $availability = 'Immediate';
                
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'title' => $title ?? 'Professional',
                    'rating' => $rating,
                    'skills' => $skills, // This is now guaranteed to be an array
                    'experience' => $yearsExperience > 0 ? $yearsExperience . ' years' : 'Entry level',
                    'experience_level' => $experienceLevel,
                    'location' => $location ?? 'Remote',
                    'availability' => $availability,
                    'expected_salary' => $user->profile->expected_salary ?? null,
                    'avatar' => $avatar,
                ];
            });
        
        // Calculate statistics
        $stats = [
            'total_talents' => User::where('is_admin', 0)->where('profile_completed', '>=', 50)->count(),
            'total_placements' => \DB::table('job_applications')->where('status', 'accepted')->count(),
            'total_companies' => \DB::table('job_posts')->distinct('company_name')->count('company_name'),
            'avg_response_time' => 24,
        ];
        
        // Get current user's profile
        $currentUser = Auth::user();
        $profile = $currentUser ? $currentUser->profile : null;
        
        return Inertia::render('Hire', [
            'auth' => ['user' => $currentUser],
            'profile' => $profile,
            'stats' => $stats,
            'featuredTalents' => $talents,
        ]);
    }
}