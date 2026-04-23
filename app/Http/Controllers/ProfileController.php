<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Experience;
use App\Models\Profile;
use App\Models\Resume;
use App\Models\Skill;
use Inertia\Response as InertiaResponse;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Http\Response;
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

        Profile::updateOrCreate(
            ['user_id' => $user->id],
            Arr::except($validated, ['first_name', 'last_name', 'email'])
        );

            if (array_key_exists('profile_image', $validated)) {
                $base64Image = $validated['profile_image'];
                
                if ($base64Image === '') {
                    $profile->profile_image_base64 = null;
                    $avatarUpdated = true;
                } elseif ($base64Image && preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
                    $profile->profile_image_base64 = $base64Image;
                    $avatarUpdated = true;
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
                $profile->save();
            } elseif ($avatarUpdated) {
                $profile->save();
            }

            // Refresh the user and profile
            $user->refresh();
            $user->load('profile');

            // Update profile completion percentage
            if (method_exists($user, 'updateProfileCompletion')) {
                $user->updateProfileCompletion();
            }

            session()->flash('success', 'Profile updated successfully!');
            
            return Redirect::route('dashboard');
            
        } catch (\Exception $e) {
            session()->flash('error', 'An error occurred while updating profile.');
            return Redirect::route('profile.editExtended')->withErrors(['error' => 'Update failed. Please try again.']);
        }
    }

    /**
     * Update user profile (for settings page)
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
            
            // Handle skills if provided
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
            
            // Update profile completion percentage
            if (method_exists($user, 'updateProfileCompletion')) {
                $user->updateProfileCompletion();
            }
            
            $user->refresh();
            
            return Redirect::back()->with('success', 'Profile updated successfully!');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return Redirect::back()->withErrors($e->errors());
        } catch (\Exception $e) {
            return Redirect::back()->withErrors(['error' => 'Failed to update profile. Please try again.']);
        }

        $file = $request->file('avatar');
        $filename = $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
        
        Storage::disk('public')->putFileAs('avatars', $file, $filename);
        
$profile->update(['avatar' => 'avatars/' . $filename]);

        return Redirect::route('profile.editExtended')->with('success', 'Avatar uploaded successfully.');
    }

    /**
     * Remove user avatar.
     */
    public function removeAvatar(Request $request): JsonResponse
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

            return response()->json([
                'success' => true,
                'message' => 'Profile picture removed successfully'
            ]);
            
        } catch (\Exception $e) {
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
     * Add a skill to the user's profile.
     */
    public function addSkill(Request $request): JsonResponse
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
                'message' => 'Failed to save preferences'
            ], 500);
        }
    }

    /**
     * Remove a skill from the user's profile.
     */
    public function removeSkill(Request $request, int $skillId): RedirectResponse
    {
        try {
            $user = Auth::user();
            
            // Detach the skill from the user
            $user->skills()->detach($skillId);
            
            return redirect()->back()
                ->with('success', 'Skill removed successfully!');
            
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to remove skill. Please try again.');
        }
    }

    /**
     * Add work experience.
     */
    public function addExperience(Request $request): JsonResponse
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
            
            $user->notification_preferences = $validated;
            $user->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Notification preferences saved successfully!',
                'preferences' => $validated
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save notification preferences'
            ], 500);
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
                'status' => 'pending',
            ]);

            // Update profile completion
            if (method_exists($user, 'updateProfileCompletion')) {
                $user->updateProfileCompletion();
            }

            return redirect()->back()->with('success', 'CV uploaded successfully! It will be reviewed by admin.');
            
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to upload CV. Please try again.']);
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
            return redirect()->back()->withErrors(['error' => 'Failed to delete CV. Please try again.']);
        }
    }
}
