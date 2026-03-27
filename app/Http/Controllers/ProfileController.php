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
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    /**
     * Display the profile edit form.
     */
    public function editExtendedProfile(Request $request): InertiaResponse
    {
        $user = $request->user()->loadMissing(['profile', 'skills', 'experiences', 'resumes']);

        // Get existing profile or create only if absolutely necessary
        $profile = Profile::where('user_id', $user->id)->first();
        
        if (!$profile) {
            $profile = Profile::create(['user_id' => $user->id]);
            $user->setRelation('profile', $profile);
            Log::info('Created new profile for user: ' . $user->id);
        } else {
            $user->setRelation('profile', $profile);
            Log::info('Found existing profile ID: ' . $profile->id . ' for user: ' . $user->id);
        }

        // Make sure avatar_url is set
        $avatarUrl = null;
        if ($profile->avatar) {
            $avatarUrl = Storage::disk('public')->url($profile->avatar);
            // Store avatar_url in profile object for easier access
            $profile->avatar_url = $avatarUrl;
        }

        return Inertia::render('userProfile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'user' => $user,
            'profile' => $profile,
            'flash' => [
                'success' => session('success')
            ],
            'availableSkills' => Skill::where('is_active', true)->get(),
        ]);
    }

    /**
     * Update extended profile information - UPDATED to support base64 image
     */
    public function updateExtendedProfile(Request $request): RedirectResponse
    {
        try {
            $user = $request->user();
            
            // Get the existing profile
            $profile = Profile::where('user_id', $user->id)->first();
            
            // If no profile exists, create one (first time only)
            if (!$profile) {
                $profile = new Profile();
                $profile->user_id = $user->id;
                $profile->save();
                Log::info('Created FIRST profile for user: ' . $user->id);
            } else {
                Log::info('Updating EXISTING profile ID: ' . $profile->id . ' for user: ' . $user->id);
            }

            Log::info('=== PROFILE UPDATE STARTED ===');
            Log::info('User ID: ' . $user->id);
            Log::info('Profile ID being updated: ' . $profile->id);
            Log::info('Request data:', $request->all());

            // Validate all fields including profile_image
            $validated = $request->validate([
                'first_name' => 'nullable|string|max:100',
                'last_name' => 'nullable|string|max:100',
                'email' => 'nullable|email|max:255|unique:users,email,' . $user->id,
                'phone' => 'nullable|string|max:20',
                'position' => 'nullable|string|max:100',
                'education' => 'nullable|string|max:100',
                'bio' => 'nullable|string|max:1000',
                'address' => 'nullable|string|max:255',
                'city' => 'nullable|string|max:100',
                'country' => 'nullable|string|max:100',
                'linkedin_url' => 'nullable|string|max:255',
                'github_url' => 'nullable|string|max:255',
                'portfolio_url' => 'nullable|string|max:255',
                'profile_image' => 'nullable|string', // Base64 image string
            ]);

            Log::info('Validated data:', $validated);

            // Handle base64 profile image if present
            $avatarUpdated = false;
            $newAvatarPath = null;
            
            if (array_key_exists('profile_image', $validated)) {
                $base64Image = $validated['profile_image'];
                
                // Check if it's an empty string (remove avatar)
                if ($base64Image === '') {
                    if ($profile->avatar && Storage::disk('public')->exists($profile->avatar)) {
                        Storage::disk('public')->delete($profile->avatar);
                    }
                    $profile->avatar = null;
                    $avatarUpdated = true;
                    Log::info('Profile image removed');
                }
                // Check if it's a valid base64 string (upload new image)
                elseif ($base64Image && preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
                    $imageData = substr($base64Image, strpos($base64Image, ',') + 1);
                    $imageData = base64_decode($imageData);
                    
                    if ($imageData !== false) {
                        $imageType = strtolower($type[1]); // jpg, png, gif
                        
                        // Validate image type
                        if (!in_array($imageType, ['jpg', 'jpeg', 'png', 'gif'])) {
                            throw new \Exception('Invalid image type. Only JPG, PNG, and GIF are allowed.');
                        }
                        
                        // Generate unique filename
                        $filename = 'profile_' . $user->id . '_' . time() . '.' . $imageType;
                        $path = 'avatars/' . $filename;
                        
                        // Save file to storage
                        Storage::disk('public')->put($path, $imageData);
                        
                        // Delete old avatar if exists
                        if ($profile->avatar && Storage::disk('public')->exists($profile->avatar)) {
                            Storage::disk('public')->delete($profile->avatar);
                        }
                        
                        // Save the path to profile
                        $profile->avatar = $path;
                        $newAvatarPath = $path;
                        $avatarUpdated = true;
                        Log::info('Profile image saved to: ' . $path);
                        Log::info('Full URL: ' . Storage::disk('public')->url($path));
                    }
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
            
            if (isset($validated['email']) && $validated['email'] !== $user->email) {
                $user->email = $validated['email'];
                $user->email_verified_at = null;
                $userUpdated = true;
            }
            
            if ($userUpdated) {
                $user->save();
                Log::info('User updated');
            }

            // Prepare profile data - remove user fields and profile_image
            $profileData = Arr::except($validated, ['first_name', 'last_name', 'email', 'profile_image']);
            
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
            
            // Set the avatar_url on the profile for frontend use
            if ($profile->avatar) {
                $avatarUrl = Storage::disk('public')->url($profile->avatar);
                $user->profile->avatar_url = $avatarUrl;
                Log::info('Setting avatar_url: ' . $avatarUrl);
            } else {
                $user->profile->avatar_url = null;
            }
            
            Log::info('=== PROFILE UPDATE COMPLETED ===');
            Log::info('Final avatar path: ' . $profile->avatar);
            Log::info('Final avatar URL: ' . ($profile->avatar ? Storage::disk('public')->url($profile->avatar) : 'none'));

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
     * Update user profile (for settings page) - Updated for Inertia form handling
     */
    public function updateProfile(Request $request)
    {
        try {
            $user = Auth::user();
            $profile = $user->profile ?? new Profile(['user_id' => $user->id]);
            
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $user->id,
                'position' => 'nullable|string|max:255',
                'bio' => 'nullable|string|max:500',
                'phone' => 'nullable|string|max:20',
                'location' => 'nullable|string|max:255',
                'portfolio_url' => 'nullable|url|max:255',
                'github_url' => 'nullable|url|max:255',
                'linkedin_url' => 'nullable|url|max:255',
                'twitter_url' => 'nullable|url|max:255',
                'skills' => 'nullable|array',
            ]);
            
            // Update user basic info
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);
            
            // Update or create profile
            $profile->fill([
                'position' => $validated['position'],
                'bio' => $validated['bio'],
                'phone' => $validated['phone'],
                'location' => $validated['location'],
                'portfolio_url' => $validated['portfolio_url'],
                'github_url' => $validated['github_url'],
                'linkedin_url' => $validated['linkedin_url'],
                'twitter_url' => $validated['twitter_url'],
            ]);
            $profile->save();
            
            // Handle skills if provided
            if ($request->has('skills')) {
                $this->syncSkills($user, $request->skills);
            }
            
            // Update profile completion
            $this->updateProfileCompletion($user);
            
            // Refresh user with profile and skills
            $user->refresh();
            $user->load('profile', 'skills');
            
            // Set avatar URL if exists
            if ($profile->avatar) {
                $user->profile->avatar_url = Storage::disk('public')->url($profile->avatar);
            }
            
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
     * Get user skills
     */
    public function getSkills(Request $request)
    {
        try {
            $user = Auth::user();
            $skills = $user->skills()->get();
            
            return response()->json([
                'skills' => $skills
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching skills:', [
                'message' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch skills'
            ], 500);
        }
    }
    
    /**
     * Add a skill
     */
    public function addSkill(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:100',
                'proficiency' => 'required|in:beginner,intermediate,advanced,expert',
            ]);
            
            $user = Auth::user();
            
            // Check if skill already exists
            $existingSkill = Skill::where('user_id', $user->id)
                ->where('name', $request->name)
                ->first();
                
            if ($existingSkill) {
                return response()->json([
                    'success' => false,
                    'message' => 'Skill already exists'
                ], 422);
            }
            
            $skill = Skill::create([
                'user_id' => $user->id,
                'name' => $request->name,
                'proficiency' => $request->proficiency,
                'is_active' => true
            ]);
            
            return response()->json([
                'success' => true,
                'skill' => $skill
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error adding skill:', [
                'message' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to add skill'
            ], 500);
        }
    }
    
    /**
     * Remove a skill
     */
    public function removeSkill($skillId)
    {
        try {
            $user = Auth::user();
            $skill = Skill::where('user_id', $user->id)->where('id', $skillId)->first();
            
            if (!$skill) {
                return response()->json([
                    'success' => false,
                    'message' => 'Skill not found'
                ], 404);
            }
            
            $skill->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Skill removed successfully'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error removing skill:', [
                'message' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove skill'
            ], 500);
        }
    }
    
    /**
     * Sync skills for user
     */
    private function syncSkills($user, $skills)
    {
        $skillIds = [];
        
        foreach ($skills as $skillData) {
            if (isset($skillData['id']) && !str_starts_with($skillData['id'], 'temp_')) {
                // Update existing skill
                $skill = Skill::find($skillData['id']);
                if ($skill && $skill->user_id === $user->id) {
                    $skill->update([
                        'name' => $skillData['name'],
                        'proficiency' => $skillData['proficiency'],
                    ]);
                    $skillIds[] = $skill->id;
                }
            } else {
                // Create new skill
                $skill = Skill::create([
                    'user_id' => $user->id,
                    'name' => $skillData['name'],
                    'proficiency' => $skillData['proficiency'],
                    'is_active' => true
                ]);
                $skillIds[] = $skill->id;
            }
        }
        
        // Remove skills that weren't in the list
        Skill::where('user_id', $user->id)
            ->whereNotIn('id', $skillIds)
            ->delete();
    }
    
    /**
     * Upload user avatar image (AJAX version for settings page)
     */
    public function uploadAvatar(Request $request)
    {
        try {
            $request->validate([
                'avatar' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            ]);

            $user = Auth::user();
            
            $profile = Profile::where('user_id', $user->id)->first();
            if (!$profile) {
                $profile = new Profile();
                $profile->user_id = $user->id;
                $profile->save();
            }

            // Delete old avatar if exists
            if ($profile->avatar && Storage::disk('public')->exists($profile->avatar)) {
                Storage::disk('public')->delete($profile->avatar);
            }

            // Store new avatar
            $file = $request->file('avatar');
            $filename = 'profile_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('avatars', $filename, 'public');
            
            $profile->avatar = $path;
            $profile->save();

            // Refresh user with profile
            $user->refresh();
            $user->load('profile');
            
            return response()->json([
                'success' => true,
                'message' => 'Profile picture updated successfully',
                'path' => Storage::disk('public')->url($path)
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error uploading avatar:', [
                'message' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload profile picture: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove user avatar (AJAX version for settings page)
     */
    public function removeAvatar(Request $request)
    {
        try {
            $user = Auth::user();
            $profile = Profile::where('user_id', $user->id)->first();

            if ($profile && $profile->avatar && Storage::disk('public')->exists($profile->avatar)) {
                Storage::disk('public')->delete($profile->avatar);
                $profile->avatar = null;
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
     * Update profile completion percentage
     */
    private function updateProfileCompletion($user)
    {
        $profile = $user->profile;
        if (!$profile) {
            $user->profile_completed = 0;
            $user->save();
            return;
        }
        
        $completionScore = 0;
        $totalFields = 7;
        
        if ($profile->position) $completionScore++;
        if ($profile->bio) $completionScore++;
        if ($profile->phone) $completionScore++;
        if ($profile->location) $completionScore++;
        if ($profile->portfolio_url) $completionScore++;
        if ($user->skills()->count() > 0) $completionScore++;
        if ($user->resumes()->count() > 0) $completionScore++;
        
        $percentage = round(($completionScore / $totalFields) * 100);
        $user->profile_completed = $percentage;
        $user->save();
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