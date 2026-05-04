<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PageController extends Controller
{
    public function jobs()
    {
        // Get all jobs from database
         $user = Auth::user();
        $jobs = Job::latest()->get();
        
        return Inertia::render('Jobs', [
            'user' => $user,
            'jobs' => $jobs
        ]);
    }
}