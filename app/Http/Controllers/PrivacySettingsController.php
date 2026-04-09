<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PrivacySettingsController extends Controller
{
    /**
     * Get user's privacy settings
     */
    public function getSettings()
    {
        $user = Auth::user();
        
        // Get settings from user's profile or create defaults
        $settings = $user->privacy_settings ?? [
            'profile_visibility' => 'public',
            'show_email' => true,
            'show_phone' => false,
            'show_experience' => true,
            'show_education' => true,
            'show_skills' => true,
            'show_rating' => true,
            'appear_in_search' => true,
            'appear_in_talent_listings' => true,
            'allow_download_resume' => true,
            'allow_contact_requests' => true,
            'show_read_receipts' => false,
            'show_last_active' => true,
            'share_analytics' => true,
            'share_for_recommendations' => true,
        ];
        
        return response()->json([
            'success' => true,
            'settings' => $settings
        ]);
    }
    
    /**
     * Update user's privacy settings
     */
    public function updateSettings(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'profile_visibility' => 'required|in:public,registered_only,private',
            'show_email' => 'boolean',
            'show_phone' => 'boolean',
            'show_experience' => 'boolean',
            'show_education' => 'boolean',
            'show_skills' => 'boolean',
            'show_rating' => 'boolean',
            'appear_in_search' => 'boolean',
            'appear_in_talent_listings' => 'boolean',
            'allow_download_resume' => 'boolean',
            'allow_contact_requests' => 'boolean',
            'show_read_receipts' => 'boolean',
            'show_last_active' => 'boolean',
            'share_analytics' => 'boolean',
            'share_for_recommendations' => 'boolean',
        ]);
        
        // Save settings to user's profile or a separate settings table
        // You may need to add a privacy_settings column to your users table
        $user->privacy_settings = $validated;
        $user->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Privacy settings updated successfully',
            'settings' => $validated
        ]);
    }
}