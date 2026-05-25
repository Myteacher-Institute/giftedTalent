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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Arr;

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
            $user = $request->user();
            $profile = $user->profile;

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
                'profile_image' => 'nullable|string',
                'employment_type' => 'nullable|string|max:255',
                'start_date' => 'nullable|string',
                'availability_status' => 'nullable|string|max:255',
            ]);

            Log::info('Profile data validated', ['validated' => $validated]);

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
            
            if (isset($validated['email']) && $user->email !== $validated['email']) {
                $user->email = $validated['email'];
                $user->email_verified_at = null;
                $userUpdated = true;
            }
            
            if ($userUpdated) {
                $user->save();
            }

            // Prepare profile data
            $profileData = Arr::except($validated, ['first_name', 'last_name', 'email', 'profile_image']);
            
            $filteredProfileData = [];
            foreach ($profileData as $key => $value) {
                if ($value !== null && $value !== '') {
                    $filteredProfileData[$key] = $value;
                }
            }
            
            // Update the existing profile
            if (!empty($filteredProfileData)) {
                foreach ($filteredProfileData as $key => $value) {
                    $profile->$key = $value;
                }
            }

            // Handle profile image
            if (array_key_exists('profile_image', $validated)) {
                $base64Image = $validated['profile_image'];
                
                if ($base64Image === '') {
                    $profile->profile_image_base64 = null;
                } elseif ($base64Image && preg_match('/^data:image\/(\w+);base64,/', $base64Image)) {
                    $profile->profile_image_base64 = $base64Image;
                }
            }
            
            $profile->save();

            // Refresh the user and profile
            $user->refresh();
            $user->load('profile');

            // Update profile completion percentage
            if (method_exists($user, 'updateProfileCompletion')) {
                $user->updateProfileCompletion();
            }

            // Flash success message for Inertia
            session()->flash('success', 'Profile updated successfully!');
            
            // Return redirect for Inertia requests
            return Redirect::route('profile.editExtended');
            
        } catch (\Exception $e) {
            Log::error('Profile update failed', ['error' => $e->getMessage()]);
            session()->flash('error', 'An error occurred while updating profile.');
            return Redirect::route('profile.editExtended')->withErrors(['error' => 'Update failed. Please try again.']);
        }
    }

    /**
     * Update profile settings from the settings page.
     */
    public function updateProfileSettings(Request $request): \Illuminate\Http\JsonResponse
    {
        $user = $request->user();
        $profile = $user->profile ?? Profile::firstOrCreate(['user_id' => $user->id]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'position' => 'nullable|string|max:100',
            'bio' => 'nullable|string|max:1000',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'portfolio_url' => 'nullable|url|max:255',
            'github_url' => 'nullable|url|max:255',
            'linkedin_url' => 'nullable|url|max:255',
            'twitter_url' => 'nullable|url|max:255',
        ]);

        if ($user->name !== $validated['name']) {
            $user->name = $validated['name'];
        }

        if ($user->email !== $validated['email']) {
            $user->email = $validated['email'];
            $user->email_verified_at = null;
        }

        if ($user->isDirty()) {
            $user->save();
        }

        $profile->position = $validated['position'] ?? null;
        $profile->bio = $validated['bio'] ?? null;
        $profile->phone = $validated['phone'] ?? null;
        $profile->location = $validated['location'] ?? null;
        $profile->portfolio_url = $validated['portfolio_url'] ?? null;
        $profile->github_url = $validated['github_url'] ?? null;
        $profile->linkedin_url = $validated['linkedin_url'] ?? null;
        $profile->twitter_url = $validated['twitter_url'] ?? null;
        $profile->save();

        if (method_exists($user, 'updateProfileCompletion')) {
            $user->updateProfileCompletion();
        }

        return response()->json([
            'success' => true,
            'user' => $user->fresh('profile'),
            'profile' => $profile,
        ]);
    }

    public function getNotificationPreferences(Request $request): \Illuminate\Http\JsonResponse
    {
        $user = $request->user();
        $preferences = $user->notification_preferences ?? [
            'email_job_alerts' => true,
            'email_application_updates' => true,
            'email_message_notifications' => true,
            'email_marketing' => false,
            'email_newsletter' => false,
            'in_app_job_alerts' => true,
            'in_app_application_updates' => true,
            'in_app_messages' => true,
            'push_enabled' => false,
            'push_job_alerts' => true,
            'push_messages' => true,
            'digest_frequency' => 'daily',
            'quiet_hours_enabled' => false,
            'quiet_hours_start' => '22:00',
            'quiet_hours_end' => '08:00',
            'desktop_enabled' => true,
            'sound_enabled' => true,
        ];

        return response()->json([
            'success' => true,
            'preferences' => $preferences,
        ]);
    }

    public function updateNotificationPreferences(Request $request): \Illuminate\Http\JsonResponse
    {
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
            'quiet_hours_start' => 'nullable|date_format:H:i',
            'quiet_hours_end' => 'nullable|date_format:H:i',
            'desktop_enabled' => 'boolean',
            'sound_enabled' => 'boolean',
        ]);

        $user = $request->user();
        $user->notification_preferences = $validated;
        $user->save();

        return response()->json([
            'success' => true,
            'preferences' => $validated,
        ]);
    }

    /**
     * Upload user avatar
     */
    public function uploadAvatar(Request $request): RedirectResponse
    {
        try {
            $user = Auth::user();
            $profile = $user->profile;
            
            if (!$profile) {
                $profile = Profile::create(['user_id' => $user->id]);
            }
            
            if ($request->hasFile('avatar')) {
                $file = $request->file('avatar');
                $filename = $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
                
                Storage::disk('public')->putFileAs('avatars', $file, $filename);
                
                $profile->avatar = 'avatars/' . $filename;
                $profile->save();
            }
            
            // Update profile completion percentage
            if (method_exists($user, 'updateProfileCompletion')) {
                $user->updateProfileCompletion();
            }
            
            return Redirect::route('profile.editExtended')->with('success', 'Avatar uploaded successfully.');
            
        } catch (\Exception $e) {
            return Redirect::back()->withErrors(['error' => 'Failed to upload avatar. Please try again.']);
        }
    }

    /**
     * Remove user avatar.
     */
    public function removeAvatar(Request $request): RedirectResponse
    {
        try {
            $user = $request->user();
            $profile = $user->profile;

            if ($profile) {
                $profile->profile_image_base64 = null;
                
                if ($profile->avatar && Storage::disk('public')->exists($profile->avatar)) {
                    Storage::disk('public')->delete($profile->avatar);
                    $profile->avatar = null;
                }
                
                $profile->save();
            }

            return redirect()->back()->with('success', 'Profile picture removed successfully');
            
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to remove profile picture');
        }
    }
    
    /**
     * Get user job preferences
     */
    public function getJobPreferences(Request $request)
    {
        try {
            $user = Auth::user();
            
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
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch job preferences'
            ], 500);
        }
    }

    /**
     * Update job preferences
     */
    public function updateJobPreferences(Request $request): \Illuminate\Http\JsonResponse
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
            
            $user->job_preferences = $validated;
            $user->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Job preferences saved successfully!',
                'preferences' => $validated
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save preferences: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get appearance settings.
     */
    public function getAppearanceSettings(Request $request): \Illuminate\Http\JsonResponse
    {
        $user = Auth::user();

        $settings = $user->appearance_settings ?? [
            'theme_mode' => 'system',
            'accent_color' => 'indigo',
            'density' => 'comfortable',
            'sidebar_style' => 'modern',
            'font_size' => 'normal',
        ];

        return response()->json([
            'success' => true,
            'settings' => $settings,
        ]);
    }

    /**
     * Update appearance settings.
     */
    public function updateAppearanceSettings(Request $request): \Illuminate\Http\JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'theme_mode' => 'nullable|in:light,dark,system',
            'accent_color' => 'nullable|in:indigo,emerald,rose,amber,sky',
            'density' => 'nullable|in:comfortable,compact',
            'sidebar_style' => 'nullable|in:modern,classic',
            'font_size' => 'nullable|in:normal,large',
        ]);

        $user->appearance_settings = array_merge([
            'theme_mode' => 'system',
            'accent_color' => 'indigo',
            'density' => 'comfortable',
            'sidebar_style' => 'modern',
            'font_size' => 'normal',
        ], $validated);

        $user->save();

        return response()->json([
            'success' => true,
            'settings' => $user->appearance_settings,
        ]);
    }

    /**
     * Add a skill to the user's profile.
     */
    public function addSkill(Request $request): RedirectResponse
    {
        try {
            $user = Auth::user();
            
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'proficiency_level' => 'nullable|string|in:beginner,intermediate,advanced,expert',
                'years_experience' => 'nullable|integer|min:0|max:50',
            ]);
            
            // Create or get existing skill
            $skill = Skill::firstOrCreate([
                'name' => $validated['name']
            ], [
                'is_active' => true
            ]);
            
            // Attach skill to user with pivot data
            $user->skills()->attach($skill->id, [
                'proficiency_level' => $validated['proficiency_level'] ?? 'intermediate',
                'years_experience' => $validated['years_experience'] ?? 0
            ]);
            
            // Update profile completion
            if (method_exists($user, 'updateProfileCompletion')) {
                $user->updateProfileCompletion();
            }
            
            return redirect()->back()->with('success', 'Skill added successfully!');
            
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to add skill: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove a skill from the user's profile.
     */
    public function removeSkill(Request $request, int $skillId): RedirectResponse
    {
        try {
            $user = Auth::user();
            
            // Detach the skill from user
            $user->skills()->detach($skillId);
            
            // Update profile completion
            if (method_exists($user, 'updateProfileCompletion')) {
                $user->updateProfileCompletion();
            }
            
            return redirect()->back()->with('success', 'Skill removed successfully!');
            
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to remove skill']);
        }
    }

    /**
     * Add work experience.
     */
    public function addExperience(Request $request): RedirectResponse
    {
        try {
            $user = Auth::user();
            
            $validated = $request->validate([
                'company' => 'required|string|max:255',
                'position' => 'required|string|max:255',
                'location' => 'nullable|string|max:255',
                'start_date' => 'required|date',
                'end_date' => 'nullable|date|after:start_date',
                'is_current' => 'boolean',
                'description' => 'nullable|string',
            ]);
            
            Experience::create([
                'user_id' => $user->id,
                'company' => $validated['company'],
                'position' => $validated['position'],
                'location' => $validated['location'] ?? null,
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'] ?? null,
                'is_current' => $validated['is_current'] ?? false,
                'description' => $validated['description'] ?? null,
            ]);
            
            // Update profile completion
            if (method_exists($user, 'updateProfileCompletion')) {
                $user->updateProfileCompletion();
            }
            
            return redirect()->back()->with('success', 'Experience added successfully!');
            
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to add experience: ' . $e->getMessage()]);
        }
    }

    /**
     * Update work experience.
     */
    public function updateExperience(Request $request, Experience $experience): RedirectResponse
    {
        try {
            // Check ownership
            if ($experience->user_id !== Auth::id()) {
                return redirect()->back()->withErrors(['error' => 'Unauthorized action']);
            }
            
            $validated = $request->validate([
                'company' => 'required|string|max:255',
                'position' => 'required|string|max:255',
                'location' => 'nullable|string|max:255',
                'start_date' => 'required|date',
                'end_date' => 'nullable|date|after:start_date',
                'is_current' => 'boolean',
                'description' => 'nullable|string',
            ]);
            
            $experience->update($validated);
            
            return redirect()->back()->with('success', 'Experience updated successfully!');
            
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to update experience']);
        }
    }

    /**
     * Delete work experience.
     */
    public function deleteExperience(Experience $experience): RedirectResponse
    {
        try {
            // Check ownership
            if ($experience->user_id !== Auth::id()) {
                return redirect()->back()->withErrors(['error' => 'Unauthorized action']);
            }
            
            $experience->delete();
            
            // Update profile completion
            $user = Auth::user();
            if (method_exists($user, 'updateProfileCompletion')) {
                $user->updateProfileCompletion();
            }
            
            return redirect()->back()->with('success', 'Experience deleted successfully!');
            
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to delete experience']);
        }
    }

    /**
     * Display the CV page.
     */
    public function cv()
    {
        $user = Auth::user();
        $resumes = $user->resumes()->latest()->get();
        
        return Inertia::render('cv', [
            'resumes' => $resumes,
            'auth' => ['user' => $user],
        ]);
    }

    /**
     * Store a newly uploaded resume.
     */
    public function storeResume(Request $request)
    {
        try {
            $request->validate([
                'cv' => 'required|file|mimes:pdf,doc,docx|max:2048',
                'title' => 'nullable|string|max:255',
            ]);

            $user = Auth::user();
            $file = $request->file('cv');
            
            // Generate unique filename
            $filename = time() . '_' . $user->id . '_' . preg_replace('/[^a-zA-Z0-9]/', '_', $file->getClientOriginalName());
            $path = $file->storeAs('resumes', $filename, 'public');
            
            // Create resume record
            $resume = Resume::create([
                'user_id' => $user->id,
                'title' => $request->title ?? $file->getClientOriginalName(),
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'file_size' => $file->getSize(),
                'file_mime_type' => $file->getMimeType(),
                'is_primary' => $user->resumes()->count() === 0,
                'status' => 'pending', // Should be pending review
            ]);

            // Update profile completion
            if (method_exists($user, 'updateProfileCompletion')) {
                $user->updateProfileCompletion();
            }

            return redirect()->back()->with('success', 'CV uploaded successfully! It will be reviewed by admin.');
            
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to upload CV: ' . $e->getMessage()]);
        }
    }

    /**
     * Delete a resume.
     */
    public function destroyResume($id)
    {
        try {
            $resume = Resume::where('user_id', Auth::id())->findOrFail($id);
            
            // Delete file from storage
            if ($resume->file_path && Storage::disk('public')->exists($resume->file_path)) {
                Storage::disk('public')->delete($resume->file_path);
            }
            
            $resume->delete();
            
            // Update profile completion
            $user = Auth::user();
            if (method_exists($user, 'updateProfileCompletion')) {
                $user->updateProfileCompletion();
            }
            
            return redirect()->back()->with('success', 'CV deleted successfully!');
            
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to delete CV']);
        }
    }
}