<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'notifications' => $request->user() 
                ? [
                    'unread_count' => $request->user()->unreadNotifications->count(),
                    'recent_unread' => $request->user()->notifications()
                        ->whereNull('read_at')
                        ->latest()
                        ->limit(5)
                        ->get()
                        ->map(fn($n) => [
                            'id' => $n->id,
                            'title' => $n->data['title'],
                            'message' => $n->data['message'],
                            'time' => $n->created_at->diffForHumans(),
                            'resume_id' => $n->data['resume_id'] ?? null,
                            'status' => $n->data['status'] ?? null,
                        ]),
                ] 
                : ['unread_count' => 0, 'recent_unread' => []],
        ];
    }
}
