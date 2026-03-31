<?php
namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('Contact');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $contact = Contact::create([
            'name'    => $request->name,
            'email'   => $request->email,
            'subject' => $request->subject,
            'message' => $request->message,
            'is_read' => false,
        ]);

        // Create notification - NO UUID needed, ID auto increments
        Notification::create([
            'type'    => 'new_message',
            'title'   => 'New Contact Message',
            'message' => "New message from {$request->name}: {$request->subject}",
            'link'            => '/Admin/messages',
            'read_at'         => null,
            'notifiable_type' => 'App\Models\User',
            'notifiable_id'   => 1,
            'data'            => json_encode([
                'type'    => 'new_message',
                'title'   => 'New Contact Message',
                'message' => "New message from {$request->name}: {$request->subject}",
                'link'            => '/Admin/messages',
            ]),
        ]);

        return redirect()->back()->with('success', 'Message sent successfully! We will get back to you soon.');
    }
}
