<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Experience;
use App\Models\Profile;
use App\Models\Resume;
use App\Models\Skill;
use Inertia\Response as InertiaResponse;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Http\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    /**
     * Display the user's profile.
     */
    public function show(Request $request): InertiaResponse
    {
        $user = $request->user()->loadMissing([
            'profile',
            'skills',
            'experiences',
            'resumes'
        ]);

        if (!$user->profile) {
            $profile = Profile::firstOrCreate(['user_id' => $user->id]);
            $user->setRelation('profile', $profile);
        }

        return Inertia::render('userProfile', [
            'user' => $user,
            'availableSkills' => Skill::where('is_active', true)->get(),
        ]);
    }

    /**
     * Display the profile edit form.
     */
    public function editExtendedProfile(Request $request): InertiaResponse
    {
        $user = $request->user()->loadMissing(['profile', 'skills', 'experiences', 'resumes']);

        return Inertia::render('userProfile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'user' => $user,
            'availableSkills' => Skill::where('is_active', true)->get(),
        ]);
    }

    /**
     * Update the user's basic profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.editExtended');
    }

    /**
     * Update extended profile information.
     */
    public function updateExtendedProfile(Request $request): RedirectResponse
    {
        try {
            Log::info('Profile update started', ['user_id' => $request->user()->id, 'data' => $request->all()]);

            $user = $request->user();
            $profile = $user->profile;

            // Create profile if it doesn't exist
            if (!$profile) {
                $profile = Profile::create(['user_id' => $user->id]);
                $user->setRelation('profile', $profile);
            }

            // Validate all fields including profile_image
            $validated = $request->validate([
                'first_name' => 'nullable|string|max:100',
                'last_name' => 'nullable|string|max:100',
                'email' => 'nullable|email|max:255|unique:users,email,' . $user->id,
                'phone' => 'nullable|string|max:20',
                'position' => 'nullable|string|max:100',
                'title' => 'nullable|string|max:100',
                'company' => 'nullable|string|max:100',
                'education' => 'nullable|string|max:100',
                'bio' => 'nullable|string|max:1000',
                'address' => 'nullable|string|max:255',
                'city' => 'nullable|string|max:100',
                'country' => 'nullable|string|max:100',
                'linkedin_url' => 'nullable|string|max:255',
                'github_url' => 'nullable|string|max:255',
                'portfolio_url' => 'nullable|string|max:255',
                'profile_image' => 'nullable|string', // Base64 image string
                'employment_type' => 'nullable|string|max:255',
                'start_date' => 'nullable|string',
                'availability_status' => 'nullable|string|max:255',
            ]);

            // Update user email if changed
            if (isset($validated['email']) && $validated['email'] !== $user->email) {
                $user->email = $validated['email'];
                $user->email_verified_at = null;
                $user->save();
            }

            // Handle base64 profile image if present
            $avatarUpdated = false;

            if (array_key_exists('profile_image', $validated)) {
                $base64Image = $validated['profile_image'];
                
                // Check if it's an empty string (remove avatar)
                if ($base64Image === '') {
                    $profile->profile_image_base64 = null;
                    $avatarUpdated = true;
                    Log::info('Profile image removed');
                }
                // Check if it's a valid base64 string (upload new image)
                elseif ($base64Image && preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
                    // Store the base64 string directly in the database
                    $profile->profile_image_base64 = $base64Image;
                    $avatarUpdated = true;
                    Log::info('Profile image saved as base64');
                }
            }

            // Update user basic info
            $userUpdated = false;
            if (isset($validated['first_name']) || isset($validated['last_name'])) {
                $currentFirstName = explode(' ', $user->name)[0] ?? '';
                $currentLastName = explode(' ', $user->name, 2)[1] ?? '';
                
                $firstName = $validated['first_name'] ?? $currentFirstName;
                $lastName = $validated['last_name'] ?? $currentLastName;
                
                $newName = trim($firstName . ' ' . $lastName);
                if ($user->name !== $newName) {
                    $user->name = $newName;
                    $userUpdated = true;
                }
            }
            
            // Update title in users table
            if (isset($validated['title'])) {
                $user->title = $validated['title'];
                $userUpdated = true;
            }
            
            // Update company in users table
            if (isset($validated['company'])) {
                $user->company = $validated['company'];
                $userUpdated = true;
            }
            
            if ($userUpdated) {
                $user->save();
                Log::info('User updated with title/company/name');
            }

            // Prepare profile data - remove user fields and profile_image
            $profileData = Arr::except($validated, ['first_name', 'last_name', 'email', 'profile_image', 'title', 'company']);
            
            // Filter out empty values to preserve existing data
            $filteredProfileData = [];
            foreach ($profileData as $key => $value) {
                // Only update if the value is not null and not empty string
                if ($value !== null && $value !== '') {
                    $filteredProfileData[$key] = $value;
                    Log::info("Will update {$key}: '{$value}'");
                }
            }
            
            // Update the existing profile
            if (!empty($filteredProfileData)) {
                foreach ($filteredProfileData as $key => $value) {
                    $profile->$key = $value;
                }
                $profile->save();
                Log::info('Profile updated with fields:', $filteredProfileData);
            } elseif ($avatarUpdated) {
                // Save profile if only avatar was updated
                $profile->save();
                Log::info('Profile saved with avatar update only');
            }

            // CRITICAL: Refresh the user and profile to get the latest data
            $user->refresh();
            $user->load('profile');
            
            Log::info('=== PROFILE UPDATE COMPLETED ===');
            Log::info('Final avatar base64: ' . ($profile->profile_image_base64 ? 'Yes' : 'No'));

            // Update profile completion percentage
            if (method_exists($user, 'updateProfileCompletion')) {
                $user->updateProfileCompletion();
            }

            // Store success message in flash
            session()->flash('success', 'Profile updated successfully!');
            
            // IMPORTANT: Redirect to dashboard instead of profile edit page
            // This ensures the dashboard shows the updated profile
            return Redirect::route('dashboard');
            
        } catch (\Exception $e) {
            Log::error('Profile update error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            session()->flash('error', 'An error occurred while updating profile: ' . $e->getMessage());
            return Redirect::route('profile.editExtended')->withErrors(['error' => 'Update failed: ' . $e->getMessage()]);
        }
    }

    /**
     * Update user profile (for settings page) - UPDATED to save to users table directly
     */
    public function uploadAvatar(Request $request): RedirectResponse
    {
        try {
            $user = Auth::user();
            
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $user->id,
                'title' => 'nullable|string|max:255',
                'company' => 'nullable|string|max:255',
                'position' => 'nullable|string|max:255',
                'bio' => 'nullable|string|max:500',
                'phone' => 'nullable|string|max:20',
                'location' => 'nullable|string|max:255',
                'availability_status' => 'nullable|string|max:255',
                'employment_type' => 'nullable|string|max:255',
                'start_date' => 'nullable|date',
                'portfolio_url' => 'nullable|url|max:255',
                'github_url' => 'nullable|url|max:255',
                'linkedin_url' => 'nullable|url|max:255',
                'twitter_url' => 'nullable|url|max:255',
                'skills' => 'nullable|array',
            ]);
            
            // Update user directly in users table
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'title' => $validated['title'] ?? $user->title,
                'company' => $validated['company'] ?? $user->company,
                'position' => $validated['position'] ?? $user->position,
                'bio' => $validated['bio'] ?? $user->bio,
                'phone' => $validated['phone'] ?? $user->phone,
                'location' => $validated['location'] ?? $user->location,
                'availability_status' => $validated['availability_status'] ?? $user->availability_status,
                'employment_type' => $validated['employment_type'] ?? $user->employment_type,
                'start_date' => $validated['start_date'] ?? $user->start_date,
                'portfolio_url' => $validated['portfolio_url'] ?? $user->portfolio_url,
                'github_url' => $validated['github_url'] ?? $user->github_url,
                'linkedin_url' => $validated['linkedin_url'] ?? $user->linkedin_url,
                'twitter_url' => $validated['twitter_url'] ?? $user->twitter_url,
            ]);
            
            // Handle skills if provided (store as JSON in users table)
            if ($request->has('skills') && is_array($request->skills)) {
                $user->skills = json_encode($request->skills);
                $user->save();
            }
            
            // Handle avatar upload if file exists
            if ($request->hasFile('avatar')) {
                $file = $request->file('avatar');
                $filename = $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
                
                Storage::disk('public')->putFileAs('avatars', $file, $filename);
                
                $profile = Profile::where('user_id', $user->id)->first();
                if ($profile) {
                    $profile->update(['avatar' => 'avatars/' . $filename]);
                }
            }
            
            // Update profile completion percentage using the new method
            if (method_exists($user, 'updateProfileCompletion')) {
                $user->updateProfileCompletion();
            }
            
            // Refresh user
            $user->refresh();
            
            // For Inertia form submission, redirect back with success
            return Redirect::back()->with('success', 'Profile updated successfully!');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return Redirect::back()->withErrors($e->errors());
        } catch (\Exception $e) {
            Log::error('Profile update error (settings):', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return Redirect::back()->withErrors(['error' => 'Failed to update profile: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove user avatar.
     */
    public function removeAvatar(Request $request)
    {
        try {
            $user = Auth::user();
            $profile = Profile::where('user_id', $user->id)->first();

            if ($profile) {
                // Clear the base64 image (this is the main one)
                $profile->profile_image_base64 = null;
                
                // Also clear the old file storage if exists (for backward compatibility)
                if ($profile->avatar && Storage::disk('public')->exists($profile->avatar)) {
                    Storage::disk('public')->delete($profile->avatar);
                    $profile->avatar = null;
                }
                
                $profile->save();
            }

            return response()->json([
                'success' => true,
                'message' => 'Profile picture removed successfully'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error removing avatar:', [
                'message' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove profile picture'
            ], 500);
        }
    }
    
    /**
     * Get user job preferences
     */
    public function getJobPreferences(Request $request)
    {
        try {
            $user = Auth::user();
            
            // Get preferences from database or return defaults
            $preferences = $user->job_preferences ?? [
                'job_types' => [],
                'employment_types' => [],
                'locations' => [],
                'remote_only' => false,
                'max_commute_distance' => 50,
                'salary_min' => '',
                'salary_max' => '',
                'salary_currency' => 'USD',
                'job_alerts_enabled' => true,
                'alert_frequency' => 'daily',
                'alert_email' => $user->email,
                'experience_level' => '',
                'industries' => [],
                'minimum_match_score' => 60,
                'show_remote_jobs' => true,
                'show_urgent_jobs' => true,
            ];
            
            return response()->json([
                'success' => true,
                'preferences' => $preferences
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error fetching job preferences:', [
                'message' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch job preferences'
            ], 500);
        }
    }

    /**
     * Update user job preferences
     */
    public function updateJobPreferences(Request $request)
    {
        try {
            $user = Auth::user();
            
            $validated = $request->validate([
                'job_types' => 'nullable|array',
                'employment_types' => 'nullable|array',
                'locations' => 'nullable|array',
                'remote_only' => 'boolean',
                'max_commute_distance' => 'nullable|integer|min:0|max:500',
                'salary_min' => 'nullable|string',
                'salary_max' => 'nullable|string',
                'salary_currency' => 'nullable|string|size:3',
                'job_alerts_enabled' => 'boolean',
                'alert_frequency' => 'nullable|in:instant,daily,weekly',
                'alert_email' => 'nullable|email',
                'experience_level' => 'nullable|string',
                'industries' => 'nullable|array',
                'minimum_match_score' => 'nullable|integer|min:0|max:100',
                'show_remote_jobs' => 'boolean',
                'show_urgent_jobs' => 'boolean',
            ]);
            
            // Save preferences to user
            $user->job_preferences = $validated;
            $user->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Job preferences saved successfully!',
                'preferences' => $validated
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error saving job preferences:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to save preferences: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user notification preferences
     */
    public function getNotificationPreferences(Request $request)
    {
        try {
            $user = Auth::user();
            
            // Default notification preferences
            $defaultPreferences = [
                // Email Notifications
                'email_job_alerts' => true,
                'email_application_updates' => true,
                'email_message_notifications' => true,
                'email_marketing' => false,
                'email_newsletter' => false,
                
                // In-App Notifications
                'in_app_job_alerts' => true,
                'in_app_application_updates' => true,
                'in_app_messages' => true,
                
                // Push Notifications
                'push_enabled' => false,
                'push_job_alerts' => true,
                'push_messages' => true,
                
                // Frequency
                'digest_frequency' => 'daily',
                'quiet_hours_enabled' => false,
                'quiet_hours_start' => '22:00',
                'quiet_hours_end' => '08:00',
                
                // Desktop Notifications
                'desktop_enabled' => true,
                
                // Sound
                'sound_enabled' => true,
            ];
            
            // Get saved preferences or return defaults
            $preferences = $user->notification_preferences ?? $defaultPreferences;
            
            return response()->json([
                'success' => true,
                'preferences' => $preferences
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error fetching notification preferences:', [
                'message' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch notification preferences'
            ], 500);
        }
    }

    /**
     * Update user notification preferences
     */
    public function updateNotificationPreferences(Request $request)
    {
        try {
            $user = Auth::user();
            
            $validated = $request->validate([
                'email_job_alerts' => 'boolean',
                'email_application_updates' => 'boolean',
                'email_message_notifications' => 'boolean',
                'email_marketing' => 'boolean',
                'email_newsletter' => 'boolean',
                'in_app_job_alerts' => 'boolean',
                'in_app_application_updates' => 'boolean',
                'in_app_messages' => 'boolean',
                'push_enabled' => 'boolean',
                'push_job_alerts' => 'boolean',
                'push_messages' => 'boolean',
                'digest_frequency' => 'nullable|in:instant,daily,weekly',
                'quiet_hours_enabled' => 'boolean',
                'quiet_hours_start' => 'nullable|string',
                'quiet_hours_end' => 'nullable|string',
                'desktop_enabled' => 'boolean',
                'sound_enabled' => 'boolean',
            ]);
            
            // Save preferences to user
            $user->notification_preferences = $validated;
            $user->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Notification preferences saved successfully!',
                'preferences' => $validated
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error saving notification preferences:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to save notification preferences: ' . $e->getMessage()
            ], 500);
        }
    }
}