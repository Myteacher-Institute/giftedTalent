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
        Log::info('Profile update started', ['user_id' => $request->user()->id, 'data' => $request->all()]);

        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|max:255',
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
        ]);

        Log::info('Profile data validated', ['validated' => $validated]);

        $user = $request->user();
        $user->forceFill([
            'name' => trim($validated['first_name'] . ' ' . $validated['last_name']),
            'email' => $validated['email'],
        ])->save();

        Profile::updateOrCreate(
            ['user_id' => $user->id],
            Arr::except($validated, ['first_name', 'last_name', 'email'])
        );

        Log::info('Profile updated successfully', ['user_id' => $user->id]);

        return Redirect::route('pages.userProfile')->with('success', 'Profile updated successfully!');
    }

    /**
     * Upload user avatar image.
     */
    public function uploadAvatar(Request $request): RedirectResponse
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();
        $profile = $user->profile ?? Profile::firstOrCreate(['user_id' => $user->id]);

        // Delete old avatar if exists
        if ($profile->avatar && Storage::disk('public')->exists($profile->avatar)) {
            Storage::disk('public')->delete($profile->avatar);
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
    public function removeAvatar(Request $request): RedirectResponse
    {
        $user = $request->user();
        $profile = $user->profile;

        if ($profile && $profile->avatar && Storage::disk('public')->exists($profile->avatar)) {
            Storage::disk('public')->delete($profile->avatar);
            $profile->update(['avatar' => null]);
        }

        return Redirect::route('pages.userProfile')->with('success', 'Avatar removed successfully.');
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

        return Redirect::route('profile.editExtended')->with('success', 'Skill added successfully.');
    }

    /**
     * Remove a skill from the user's profile.
     */
    public function removeSkill(Request $request, int $skillI
    ): RedirectResponse
    {
        $request->user()->skills()->detach($skillId);

        return Redirect::route('profile.editExtended')->with('success', 'Skill removed successfully.');
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

        return Redirect::route('profile.editExtended')->with('success', 'Experience added successfully.');
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

        return Redirect::route('profile.editExtended')->with('success', 'Experience updated successfully.');
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

        return Redirect::route('profile.editExtended')->with('success', 'Experience deleted successfully.');
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

    /**
     * CV Upload Page
     */
    public function cv(Request $request)
    {
        $user = $request->user()->loadMissing(['profile', 'resumes']);
        return Inertia::render('cv', [
            'user' => $user,
            'resumes' => $user->resumes ?? [],
        ]);
    }

    /**
     * Store CV upload
     */
    public function storeResume(Request $request): RedirectResponse
    {
        $request->validate([
            'cv' => 'required|file|mimes:pdf,doc,docx|max:2048',
            'title' => 'nullable|string|max:255',
            'is_primary' => 'boolean',
        ]);

        $user = $request->user();
        
        $file = $request->file('cv');
        $title = $request->title ?: $file->getClientOriginalName();
        $filename = $user->id . '_' . time() . '_' . $file->getClientOriginalName();
        
        $path = $file->storeAs('resumes', $filename, 'public');
        
        // Demote other resumes if this is primary
        if ($request->boolean('is_primary')) {
            $user->resumes()->update(['is_primary' => false]);
        }
        
        $user->resumes()->create([
            'title' => $title,
            'file_path' => $path,
            'file_name' => $filename,
            'file_size' => $file->getSize(),
            'is_primary' => $request->boolean('is_primary', false),
            'status' => 'pending',
        ]);

        return back()->with('success', 'CV uploaded successfully');
    }

    /**
     * Delete CV
     */
    public function destroyResume(Request $request, $id): RedirectResponse
    {
        $user = $request->user();
        $resume = $user->resumes()->findOrFail($id);
        
        Storage::disk('public')->delete($resume->file_path);
        $resume->delete();

        return back()->with('success', 'CV deleted');
    }
}

