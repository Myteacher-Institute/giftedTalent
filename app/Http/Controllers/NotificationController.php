<?php

namespace App\Http\Controllers;

use App\Models\Notification as NotificationModel;
use App\Models\Resume;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display paginated user notifications.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $notifications = $user->notifications()
            ->with('notifiable') // For resume data if needed
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(function ($notification) {
                $data = $notification->data;
                $isCvReview = isset($data['resume_id']);

                return [
                    ...$notification->toArray(),
                    'title' => $data['title'] ?? 'Notification',
                    'message' => $data['message'] ?? 'No message',
                    'is_unread' => $notification->read_at === null,
                    'is_cv_review' => $isCvReview,
                    'resume_status' => $data['status'] ?? null,
                    // Resume preview if CV notification
                    'resume' => $isCvReview ? Resume::find($data['resume_id'])?->only(['id', 'title', 'status', 'feedback']) : null,
                ];
            });

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'unread_count' => $user->unreadNotifications->count(),
        ]);
    }

    /**
     * Mark notification as read.
     */
    public function read(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json(['success' => true]);
    }

    /**
     * Mark all notifications as read.
     */
    public function readAll(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json(['success' => true]);
    }
}
