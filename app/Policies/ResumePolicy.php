<?php

namespace App\Policies;

use App\Models\Resume;
use App\Models\User;

class ResumePolicy
{
    /**
     * Determine whether the user can view any resumes.
     */
    public function viewAny(User $user)
    {
        return $user->is_admin;
    }

    /**
     * Determine whether the user can view the resume.
     */
    public function view(User $user, Resume $resume)
    {
        return $user->is_admin || $user->id === $resume->user_id;
    }

    /**
     * Determine whether the user can update the resume.
     */
    public function update(User $user, Resume $resume)
    {
        return $user->is_admin;
    }

    /**
     * Determine whether the user can delete the resume.
     */
    public function delete(User $user, Resume $resume)
    {
        return $user->is_admin;
    }
}
