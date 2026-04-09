<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class TalentController extends Controller
{
    /**
     * Display the specified talent profile.
     */
    public function show($id)
    {
        $user = User::with('profile')->findOrFail($id);
        
        // Get user's skills - Try multiple sources
        $skills = [];
        
        // Method 1: From the user's skills column (JSON string or array)
        if ($user->skills) {
            if (is_array($user->skills)) {
                $skills = $user->skills;
            } elseif (is_string($user->skills)) {
                // Try to decode JSON
                $decoded = json_decode($user->skills, true);
                if (is_array($decoded)) {
                    $skills = $decoded;
                } else {
                    // If not JSON, try splitting by comma
                    $skills = explode(',', $user->skills);
                }
            }
        }
        
        // Method 2: From profile's skills column
        if (empty($skills) && $user->profile && $user->profile->skills) {
            if (is_array($user->profile->skills)) {
                $skills = $user->profile->skills;
            } elseif (is_string($user->profile->skills)) {
                $decoded = json_decode($user->profile->skills, true);
                if (is_array($decoded)) {
                    $skills = $decoded;
                } else {
                    $skills = explode(',', $user->profile->skills);
                }
            }
        }
        
        // Method 3: From user_skills table via DB query
        if (empty($skills)) {
            $userSkills = DB::table('user_skills')
                ->join('skills', 'user_skills.skill_id', '=', 'skills.id')
                ->where('user_skills.user_id', $user->id)
                ->pluck('skills.name')
                ->toArray();
            
            if (!empty($userSkills)) {
                $skills = $userSkills;
            }
        }
        
        // Clean up skills - remove empty values and trim
        $skills = array_filter(array_map('trim', $skills));
        $skills = array_values($skills); // Reset array keys
        
        if (empty($skills)) {
            $skills = ['Available for work'];
        }
        
        // Get profile image
        $avatar = null;
        if ($user->profile && $user->profile->profile_image_base64) {
            $avatar = $user->profile->profile_image_base64;
        } elseif ($user->profile && $user->profile->avatar_url) {
            $avatar = $user->profile->avatar_url;
        }
        
        // Get user's title/position
        $title = $user->title;
        if (!$title && $user->profile) {
            $title = $user->profile->position ?? $user->profile->title ?? 'Professional';
        }
        
        // Get user's location
        $location = null;
        if ($user->profile) {
            $location = $user->profile->city ?? $user->profile->address ?? null;
        }
        
        // Get user's phone number
        $phone = null;
        if ($user->profile) {
            $phone = $user->profile->phone ?? $user->phone ?? null;
        }
        
        // Get user's company
        $company = null;
        if ($user->profile) {
            $company = $user->profile->company ?? $user->company ?? null;
        }
        
        // Get experiences
        $experiences = [];
        if ($user->profile && $user->profile->experiences) {
            $experiences = is_string($user->profile->experiences) 
                ? json_decode($user->profile->experiences, true) 
                : $user->profile->experiences;
        }
        if (!is_array($experiences)) {
            $experiences = [];
        }
        
        // Get education
        $education = [];
        if ($user->profile && $user->profile->education) {
            $education = is_string($user->profile->education) 
                ? json_decode($user->profile->education, true) 
                : $user->profile->education;
        }
        if (!is_array($education)) {
            $education = [];
        }
        
        // Get years of experience
        $yearsExperience = 0;
        if ($user->profile && $user->profile->years_experience) {
            $yearsExperience = $user->profile->years_experience;
        }
        
        // Get expected salary
        $expectedSalary = null;
        $currency = '$';
        if ($user->profile) {
            $expectedSalary = $user->profile->expected_salary ?? null;
            $currency = $user->profile->currency ?? '$';
        }
        
        // Get availability status
        $availabilityStatus = null;
        $employmentType = null;
        $startDate = null;
        if ($user->profile) {
            $availabilityStatus = $user->profile->availability_status ?? 'Open to work';
            $employmentType = $user->profile->employment_type ?? 'Full-Time, Remote';
            $startDate = $user->profile->start_date ?? 'Available Immediately';
        }
        
        // Get social links
        $linkedinUrl = null;
        $githubUrl = null;
        $portfolioUrl = null;
        if ($user->profile) {
            $linkedinUrl = $user->profile->linkedin_url ?? null;
            $githubUrl = $user->profile->github_url ?? null;
            $portfolioUrl = $user->profile->portfolio_url ?? null;
        }
        
        // Get resume URL
        $resumeUrl = null;
        if ($user->profile && $user->profile->resume_path) {
            $resumeUrl = asset('storage/' . $user->profile->resume_path);
        }
        
        // Calculate rating based on profile completion
        $rating = 4.0;
        if ($user->profile_completed >= 90) $rating = 5.0;
        elseif ($user->profile_completed >= 80) $rating = 4.8;
        elseif ($user->profile_completed >= 70) $rating = 4.5;
        elseif ($user->profile_completed >= 60) $rating = 4.2;
        elseif ($user->profile_completed >= 50) $rating = 4.0;
        
        $talentData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $phone,
            'title' => $title,
            'location' => $location,
            'company' => $company,
            'bio' => $user->profile->bio ?? $user->bio ?? null,
            'skills' => $skills,
            'experiences' => $experiences,
            'education' => $education,
            'avatar' => $avatar,
            'avatar_url' => $avatar,
            'profile_image_base64' => $avatar,
            'profile_completed' => $user->profile_completed ?? 0,
            'years_experience' => $yearsExperience,
            'expected_salary' => $expectedSalary,
            'currency' => $currency,
            'availability_status' => $availabilityStatus,
            'employment_type' => $employmentType,
            'start_date' => $startDate,
            'linkedin_url' => $linkedinUrl,
            'github_url' => $githubUrl,
            'portfolio_url' => $portfolioUrl,
            'resume_url' => $resumeUrl,
            'rating' => $rating,
            'member_since' => $user->created_at ? $user->created_at->format('M Y') : '2024',
        ];
        
        return Inertia::render('TalentProfile', [
            'talent' => $talentData,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }
}