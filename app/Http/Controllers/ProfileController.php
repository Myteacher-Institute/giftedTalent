<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Education;
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
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile.
     */
    public function show(Request $request): Response
    {
        $user = $request->user()->load(['profile', 'skills', 'experiences', 'educations', 'resumes']);
        
        return Inertia::render('Profile', [
            'user' => $user,
        ]);
    }

    /**
     * Display the user's profile form for editing.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user()->load(['profile', 'skills', 'experiences', 'educations', 'resumes']);
        
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
     * Update the user's extended profile.
     */
    public function updateExtendedProfile(Request $request): RedirectResponse
    {
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
            ['user_id' => $request->user()->id],
            $validated
        );

        return Redirect::route('profile.edit')->with('success', 'Profile updated successfully.');
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
     * Add education.
     */
    public function addEducation(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'institution' => 'required|string|max:255',
            'degree' => 'required|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'is_current' => 'boolean',
            'description' => 'nullable|string|max:2000',
        ]);

        $request->user()->educations()->create($validated);

        return Redirect::route('profile.edit')->with('success', 'Education added successfully.');
    }

    /**
     * Update education.
     */
    public function updateEducation(Request $request, Education $education): RedirectResponse
    {
        if (!$education->isOwnedBy($request->user())) {
            return Redirect::back()->with('error', 'Unauthorized action.');
        }

        $validated = $request->validate([
            'institution' => 'required|string|max:255',
            'degree' => 'required|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'is_current' => 'boolean',
            'description' => 'nullable|string|max:2000',
        ]);

        $education->update($validated);

        return Redirect::route('profile.edit')->with('success', 'Education updated successfully.');
    }

    /**
     * Delete education.
     */
    public function deleteEducation(Request $request, Education $education): RedirectResponse
    {
        if (!$education->isOwnedBy($request->user())) {
            return Redirect::back()->with('error', 'Unauthorized action.');
        }

        $education->delete();

        return Redirect::route('profile.edit')->with('success', 'Education deleted successfully.');
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

