<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Job;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->get('q', '');
        $user = Auth::user();
        
        // Search for jobs
        $jobs = Job::where('status', 'active')
            ->where(function($q) use ($query) {
                $q->where('job_title', 'like', "%{$query}%")
                  ->orWhere('company_name', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%")
                  ->orWhere('tags', 'like', "%{$query}%");
            })
            ->limit(20)
            ->get()
            ->map(function($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->job_title,
                    'company' => $job->company_name,
                    'description' => $job->description,
                    'tags' => is_array($job->tags) ? $job->tags : json_decode($job->tags, true) ?? [],
                    'created_at' => $job->created_at,
                    'type' => 'job',
                ];
            });
        
        // Search for talents (users with profiles)
        $talents = User::where('profile_completed', '>=', 35)
            ->where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhereHas('profile', function($profile) use ($query) {
                      $profile->where('position', 'like', "%{$query}%")
                              ->orWhere('bio', 'like', "%{$query}%");
                  });
            })
            ->with('profile', 'skills')
            ->limit(20)
            ->get()
            ->map(function($user) {
                $skills = [];
                if ($user->skills) {
                    $skills = $user->skills->pluck('name')->toArray();
                }
                
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'title' => $user->profile?->position ?? $user->profile?->title,
                    'bio' => $user->profile?->bio,
                    'skills' => $skills,
                    'avatar' => $user->profile?->avatar_url ?? null,
                    'profile_image_base64' => $user->profile?->profile_image_base64 ?? null,
                    'created_at' => $user->created_at,
                    'type' => 'talent',
                ];
            });
        
        return Inertia::render('SearchResults', [
            'auth' => ['user' => $user],
            'jobs' => $jobs,
            'talents' => $talents,
            'searchQuery' => $query,
        ]);
    }
}