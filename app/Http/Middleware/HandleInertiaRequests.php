<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Models\Message;
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
                'user' => $request->user()?->loadMissing(['profile', 'skills', 'resumes']),
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
                            'title' => $n->title ?? 'Notification',
                            'message' => $n->message ?? '',
                            'time' => $n->created_at->diffForHumans(),
                        ]),
                ]
                : ['unread_count' => 0, 'recent_unread' => []],
            // Add this line below 👇
            'unreadMessagesCount' => $request->user()
                ? Message::where('receiver_id', $request->user()->id)
                    ->where('is_read', 0)
                    ->count()
                : 0,
        ];
    }
}