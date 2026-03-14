<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Display the Find Jobs page.
     */
    public function findJobs(): Response
    {
        return Inertia::render('FindJobs');
    }

    /**
     * Display the Find Talents page.
     */
    public function findTalents(): Response
    {
        return Inertia::render('FindTalents');
    }

    /**
     * Display the How It Works page.
     */
    public function howItWorks(): Response
    {
        return Inertia::render('HowItWorks');
    }

    /**
     * Display the About page.
     */
    public function about(): Response
    {
        return Inertia::render('About');
    }

    /**
     * Display the User Profile page.
     */
    public function userProfile(): Response
    {
        return Inertia::render('userProfile');
    }

    /**
     * Display the Easy Apply Job page.
     */
    public function easyApplyJob(): Response
    {
        return Inertia::render('EasyApplyJob');
    }

    /**
     * Display the Search Jobs page.
     */
    public function searchJobs(): Response
    {
        return Inertia::render('search-job', [
            'auth' => ['user' => auth()->user()]
        ]);
    }

}

