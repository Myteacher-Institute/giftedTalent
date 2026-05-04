<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MessageController extends Controller
{
    /**
     * Send a message (user-to-user or user-to-admin)
     */
    public function send(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string|max:1000',
        ]);

        // Prevent self-messaging
        if (Auth::id() == $request->receiver_id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot send a message to yourself'
            ], 422);
        }

        $messageData = [
            'sender_id' => Auth::id(),
            'receiver_id' => $request->receiver_id,
            'user_id' => $request->receiver_id,
            'message' => $request->message,
            'is_read' => false,
            'admin_id' => null,
        ];

        $message = Message::create($messageData);

        if ($request->header('X-Inertia')) {
            return back(303)->with('success', 'Message sent successfully');
        }

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
            'data' => $message
        ]);
    }

    /**
     * Admin sends message to user
     */
    public function adminSend(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'message' => 'required|string|max:1000',
        ]);

        $message = Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $request->user_id,
            'user_id' => $request->user_id,
            'admin_id' => Auth::id(),
            'message' => $request->message,
            'is_read' => false,
        ]);

        if ($request->header('X-Inertia')) {
            return back(303)->with('success', 'Admin message sent successfully');
        }

        return response()->json([
            'success' => true,
            'message' => 'Admin message sent successfully',
            'data' => $message
        ]);
    }

    /**
     * Get user's conversations (both user-to-user and admin messages)
     */
    public function getConversations()
    {
        $userId = Auth::id();
        
        // Get all users that the current user has exchanged messages with
        $conversationUsers = Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->get()
            ->flatMap(function ($message) use ($userId) {
                if ($message->sender_id == $userId) {
                    return [$message->receiver_id];
                } else {
                    return [$message->sender_id];
                }
            })
            ->unique()
            ->values();
        
        // Build conversation data for each user
        $conversations = [];
        foreach ($conversationUsers as $otherUserId) {
            $otherUser = \App\Models\User::find($otherUserId);
            if (!$otherUser) continue;
            
            // Get last message between users
            $lastMessage = Message::where(function($query) use ($userId, $otherUserId) {
                    $query->where('sender_id', $userId)->where('receiver_id', $otherUserId);
                })->orWhere(function($query) use ($userId, $otherUserId) {
                    $query->where('sender_id', $otherUserId)->where('receiver_id', $userId);
                })->latest()->first();
            
            // Count unread messages
            $unreadCount = Message::where('sender_id', $otherUserId)
                ->where('receiver_id', $userId)
                ->where('is_read', 0)
                ->count();
            
            $conversations[] = [
                'user_id' => $otherUserId,
                'name' => $otherUser->name,
                'avatar' => $otherUser->profile->profile_image_base64 ?? null,
                'last_message' => $lastMessage ? $lastMessage->message : '',
                'last_message_time' => $lastMessage ? $lastMessage->created_at : null,
                'unread_count' => $unreadCount,
            ];
        }
        
        // Sort by last message time
        usort($conversations, function($a, $b) {
            return strtotime($b['last_message_time']) - strtotime($a['last_message_time']);
        });
        
        return response()->json([
            'success' => true,
            'data' => $conversations
        ]);
    }

    /**
     * Display the messages page with conversations
     */
    public function index()
    {
        $userId = Auth::id();
        
        // Get all unique users that current user has messaged with
        $sentTo = Message::where('sender_id', $userId)->pluck('receiver_id')->toArray();
        $receivedFrom = Message::where('receiver_id', $userId)->pluck('sender_id')->toArray();
        $conversationUserIds = array_unique(array_merge($sentTo, $receivedFrom));
        
        $conversations = [];
        foreach ($conversationUserIds as $otherUserId) {
            $otherUser = \App\Models\User::find($otherUserId);
            if ($otherUser) {
                $lastMessage = Message::where(function($q) use ($userId, $otherUserId) {
                    $q->where('sender_id', $userId)->where('receiver_id', $otherUserId);
                })->orWhere(function($q) use ($userId, $otherUserId) {
                    $q->where('sender_id', $otherUserId)->where('receiver_id', $userId);
                })->latest()->first();
                
                $conversations[] = [
                    'user_id' => $otherUserId,
                    'name' => $otherUser->name,
                    'last_message' => $lastMessage ? $lastMessage->message : '',
                ];
            }
        }
        
        return Inertia::render('Messages/Index', [
            'conversations' => $conversations,
            'auth' => ['user' => Auth::user()],
        ]);
    }

    /**
     * Display chat with a specific user
     */
    public function show($userId)
    {
        $currentUserId = Auth::id();
        $otherUser = \App\Models\User::find($userId);
        
        if (!$otherUser) {
            return redirect()->route('messages.index')->with('error', 'User not found');
        }
        
        // Get messages between users
        $messages = Message::where(function($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $currentUserId)->where('receiver_id', $userId);
        })->orWhere(function($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $userId)->where('receiver_id', $currentUserId);
        })->orderBy('created_at', 'asc')->get();
        
        // Mark messages as read
        Message::where('sender_id', $userId)
            ->where('receiver_id', $currentUserId)
            ->where('is_read', 0)
            ->update(['is_read' => 1]);
        
        return Inertia::render('Messages/Show', [
            'messages' => $messages,
            'otherUser' => $otherUser,
            'auth' => ['user' => Auth::user()],
        ]);
    }

    /**
     * Get unread message count for authenticated user
     */
    public function getUnreadCount()
    {
        $count = Message::where('receiver_id', Auth::id())
            ->where('is_read', 0)
            ->count();
        
        return response()->json(['count' => $count]);
    }

    /**
     * Get all messages for a specific user
     */
    public function getUserMessages($userId)
    {
        $currentUserId = Auth::id();
        
        // Get messages between current user and the specified user
        $messages = Message::where(function($query) use ($currentUserId, $userId) {
                $query->where('sender_id', $currentUserId)->where('receiver_id', $userId);
            })->orWhere(function($query) use ($currentUserId, $userId) {
                $query->where('sender_id', $userId)->where('receiver_id', $currentUserId);
            })
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function($message) {
                $sender = \App\Models\User::find($message->sender_id);
                return [
                    'id' => $message->id,
                    'sender_id' => $message->sender_id,
                    'sender_name' => $sender ? $sender->name : 'Unknown',
                    'message' => $message->message,
                    'is_read' => $message->is_read,
                    'created_at' => $message->created_at,
                ];
            });
        
        // Mark messages as read
        Message::where('sender_id', $userId)
            ->where('receiver_id', $currentUserId)
            ->where('is_read', 0)
            ->update(['is_read' => 1]);
        
        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }

    /**
     * Mark a single message as read
     */
    public function markAsRead($messageId)
    {
        $message = Message::findOrFail($messageId);
        
        // Only the receiver can mark as read
        if ($message->receiver_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $message->update(['is_read' => 1]);
        
        return response()->json(['success' => true]);
    }

    /**
     * Delete a single message
     */
    public function destroy($messageId)
    {
        $message = Message::findOrFail($messageId);
        
        // Only the receiver can delete
        if ($message->receiver_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $message->delete();
        
        return response()->json(['success' => true]);
    }


    
}