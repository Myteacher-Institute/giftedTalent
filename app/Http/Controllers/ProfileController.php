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
            if (isset($validated['profile_image'])) {
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
                elseif (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
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
            
            Log::info('=== PROFILE UPDATE COMPLETED ===');
            Log::info('Final avatar path: ' . $profile->avatar);
            Log::info('Final avatar URL: ' . ($profile->avatar ? Storage::disk('public')->url($profile->avatar) : 'none'));

            // Store success message
            session()->flash('success', 'Profile updated successfully!');

            return Redirect::route('profile.editExtended');
            
        } catch (\Exception $e) {
            Log::error('Profile update error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            session()->flash('error', 'An error occurred while updating profile.');
            return Redirect::route('profile.editExtended')->withErrors(['error' => 'Update failed']);
        }
    }

    // ... keep all your other methods (cv, storeResume, destroyResume, etc.)
    
    /**
     * Upload user avatar image (keep for backward compatibility)
     */
    public function uploadAvatar(Request $request): RedirectResponse
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();
        
        $profile = Profile::where('user_id', $user->id)->first();
        if (!$profile) {
            $profile = new Profile();
            $profile->user_id = $user->id;
            $profile->save();
        }

        if ($profile->avatar && Storage::disk('public')->exists($profile->avatar)) {
            Storage::disk('public')->delete($profile->avatar);
        }

        $file = $request->file('avatar');
        $filename = $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('avatars', $filename, 'public');
        
        $profile->avatar = $path;
        $profile->save();

        session()->flash('success', 'Avatar uploaded successfully!');
        
        return Redirect::route('profile.editExtended');
    }

    /**
     * Remove user avatar.
     */
    public function removeAvatar(Request $request): RedirectResponse
    {
        $user = $request->user();
        $profile = Profile::where('user_id', $user->id)->first();

        if ($profile && $profile->avatar && Storage::disk('public')->exists($profile->avatar)) {
            Storage::disk('public')->delete($profile->avatar);
            $profile->avatar = null;
            $profile->save();
        }

        session()->flash('success', 'Avatar removed successfully!');
        
        return Redirect::route('profile.editExtended');
    }
}