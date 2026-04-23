<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Inertia\Inertia;

class PageController extends Controller
{
    public function jobs()
    {
        // Get all jobs from database
        $jobs = Job::latest()->get();
        
        return Inertia::render('Jobs', [
            'jobs' => $jobs
        ]);
    }
}