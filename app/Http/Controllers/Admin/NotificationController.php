<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::latest()->paginate(15);
        $unreadCount = Notification::unread()->count();

        return Inertia::render('Admin/Notifications', [
            'notifications' => $notifications,
            'unreadCount' => $unreadCount
        ]);
    }

    public function markAsRead($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['read_at' => now()]);

        return redirect()->back();
    }

    public function markAllAsRead()
    {
        Notification::whereNull('read_at')->update(['read_at' => now()]);

        return redirect()->back();
    }

    public function destroy($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->delete();

        return redirect()->back()->with('success', 'Notification deleted');
    }
}