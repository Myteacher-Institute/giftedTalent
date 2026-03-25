<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $messages = Message::where('user_id', Auth::id())
            ->with('admin')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }

    public function unreadCount()
    {
        $count = Message::where('user_id', Auth::id())
            ->where('is_read', false)
            ->count();

        return response()->json([
            'success' => true,
            'count' => $count
        ]);
    }

    public function markAsRead($id)
    {
        $message = Message::where('user_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();

        $message->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Message marked as read'
        ]);
    }

    public function markAllAsRead()
    {
        Message::where('user_id', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'All messages marked as read'
        ]);
    }
}