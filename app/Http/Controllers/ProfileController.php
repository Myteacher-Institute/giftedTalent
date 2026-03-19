<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Experience;
use App\Models\Profile;
use App\Models\Resume;
use App\Models\Skill;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class ProfileController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return Inertia::render('Profile', [
            'user' => $user,
        ]);
    }

    /**
     * Display the user's profile.
     */
    public function show(Request $request)
    {
        $user = $request->user()->loadMissing([
            'profile',
            'skills',
            'experiences',
            'resumes'
        ]);

        if (!$user->profile) {
            $profile = \App\Models\Profile::firstOrCreate(['user_id' => $user->id]);
            $user->setRelation('profile', $profile);
        }

        return Inertia::render('userProfile', [
            'user' => $user,
            'availableSkills' => \App\Models\Skill::where('is_active', true)->get(),
        ]);
    }

    public function edit(Request $request): \Inertia\Response
    {
$user = $request->user()->loadMissing(['profile', 'skills', 'experiences', 'resumes']);

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'user' => $user,
            'availableSkills' => Skill::where('is_active', true)->get(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Upload user avatar image.
     */
    public function uploadAvatar(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();
        $profile = Profile::firstOrCreate(['user_id' => $user->id]);

        // Delete old avatar if exists
        if ($profile->avatar && \Illuminate\Support\Facades\Storage::disk('public')->exists($profile->avatar)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($profile->avatar);
        }

        $file = $request->file('avatar');
        $filename = $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
        
        \Illuminate\Support\Facades\Storage::disk('public')->putFileAs('avatars', $file, $filename);
        
        $profile->update(['avatar' => $filename]);

        return redirect()->route('profile.show')->with('success', 'Avatar uploaded successfully');
    }

    /**
     * Update the user's extended profile.
     */
    public function updateExtendedProfile(Request $request): RedirectResponse
    {
        $user = $request->user();

        $user->update([
            'name' => trim($request->first_name . ' ' . $request->last_name),
            'email' => $request->email,
        ]);

        $validated = $request->validate([
            'bio' => 'nullable|string|max:1000',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'avatar' => 'nullable|string|max:255',
            'cover_image' => 'nullable|string|max:255',
            'availability_status' => 'nullable|in:available,not_available,open_to_work',
            'availability_type' => 'nullable|in:full_time,part_time,contract,freelance,internship',
            'expected_salary' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|size:3',
            'years_experience' => 'nullable|integer|min:0',
            'linkedin_url' => 'nullable|url|max:255',
            'github_url' => 'nullable|url|max:255',
            'portfolio_url' => 'nullable|url|max:255',
        ]);

        $profile = Profile::updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        // Simple profile completion calculation (no load needed for count queries)
        $totalFields = 8;
        $filledFields = 0;
        if (!empty($profile->bio)) $filledFields++;
        if (!empty($profile->phone)) $filledFields++;
        if (!empty($profile->address)) $filledFields++;
        if ($request->user()->skills()->count() > 0) $filledFields++;
        if ($request->user()->experiences()->count() > 0) $filledFields++;
        if (!empty($profile->linkedin_url)) $filledFields++;
        if (!empty($profile->github_url)) $filledFields++;
        
        $completion = round(($filledFields / $totalFields) * 100);
        return Redirect::route('dashboard');


    }

    /**
     * Add a skill to the user's profile.
     */
    public function addSkill(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'skill_id' => 'required|exists:skills,id',
            'proficiency_level' => 'required|in:beginner,intermediate,advanced,expert',
            'years_experience' => 'nullable|integer|min:0',
        ]);

        $request->user()->skills()->syncWithoutDetaching([
            $validated['skill_id'] => [
                'proficiency_level' => $validated['proficiency_level'],
                'years_experience' => $validated['years_experience'] ?? 0,
            ]
        ]);

        return Redirect::route('profile.edit')->with('success', 'Skill added successfully.');
    }

    /**
     * Remove a skill from the user's profile.
     */
    public function removeSkill(Request $request, int $skillId): RedirectResponse
    {
        $request->user()->skills()->detach($skillId);

        return Redirect::route('profile.edit')->with('success', 'Skill removed successfully.');
    }

    /**
     * Add work experience.
     */
    public function addExperience(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'job_title' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_current' => 'boolean',
            'description' => 'nullable|string|max:2000',
        ]);

        $request->user()->experiences()->create($validated);

        return Redirect::route('profile.edit')->with('success', 'Experience added successfully.');
    }

    /**
     * Update work experience.
     */
    public function updateExperience(Request $request, Experience $experience): RedirectResponse
    {
        if (!$experience->isOwnedBy($request->user())) {
            return Redirect::back()->with('error', 'Unauthorized action.');
        }

        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'job_title' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_current' => 'boolean',
            'description' => 'nullable|string|max:2000',
        ]);

        $experience->update($validated);

        return Redirect::route('profile.edit')->with('success', 'Experience updated successfully.');
    }

    /**
     * Delete work experience.
     */
    public function deleteExperience(Request $request, Experience $experience): RedirectResponse
    {
        if (!$experience->isOwnedBy($request->user())) {
            return Redirect::back()->with('error', 'Unauthorized action.');
        }

        $experience->delete();

        return Redirect::route('profile.edit')->with('success', 'Experience deleted successfully.');
    }



    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
