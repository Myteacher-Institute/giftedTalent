<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class GoogleController extends Controller
{
    /**
     * Redirect to Google authentication page.
     */
    public function redirect(): \Symfony\Component\HttpFoundation\RedirectResponse
    {
        // Check if Google credentials are configured
        if (!config('services.google.client_id') || !config('services.google.client_secret')) {
            return redirect()->route('login')
                ->with('error', 'Google authentication not properly configured.');
        }

        $googleUrl = 'https://accounts.google.com/o/oauth2/auth?';
        $params = [
            'client_id' => config('services.google.client_id'),
            'redirect_uri' => route('google.callback'),
            'response_type' => 'code',
            'scope' => 'email profile',
            'access_type' => 'offline',
            'prompt' => 'consent',
        ];

        return redirect($googleUrl . http_build_query($params));
    }

    /**
     * Handle Google callback.
     */
    public function callback(Request $request): \Illuminate\Http\RedirectResponse
    {
        try {
            $token = $request->get('code');
            
            if (!$token) {
                return redirect()->route('login')
                    ->with('error', 'Google authentication failed: No authorization code received.');
            }


            // Check Google credentials
            $clientId = config('services.google.client_id');
            $clientSecret = config('services.google.client_secret');
            $redirectUri = route('google.callback');
            
            if (!$clientId || !$clientSecret) {
                return redirect()->route('login')
                    ->with('error', 'Google authentication not properly configured.');
            }

            $response = \Illuminate\Support\Facades\Http::asForm()->post('https://oauth2.googleapis.com/token', [
                'client_id' => config('services.google.client_id'),
                'client_secret' => config('services.google.client_secret'),
                'redirect_uri' => route('google.callback'),
                'grant_type' => 'authorization_code',
                'code' => $token,
            ]);

            $data = $response->json();

            if (!isset($data['access_token'])) {
                return redirect()->route('login')
                    ->with('error', 'Failed to get access token from Google.');
            }

            $userResponse = \Illuminate\Support\Facades\Http::withToken($data['access_token'])->get('https://www.googleapis.com/oauth2/v2/userinfo');

            $googleUser = $userResponse->json();

            $user = User::where('email', $googleUser['email'])->first();

            if (!$user) {
                $user = User::create([
                    'name' => $googleUser['name'],
                    'email' => $googleUser['email'],
                    'password' => Hash::make(Str::random(40)), // Random password
                    'email_verified_at' => now(),
                    'google_id' => $googleUser['id'],
                    'walletAmount' => 0, // Default wallet amount
                ]);
            } elseif ($user->google_id !== $googleUser['id']) {
                $user->update(['google_id' => $googleUser['id']]);
            }

            Auth::login($user);
            $request->session()->regenerate();

            // Mark user as email verified if they came from Google
            if (!$user->hasVerifiedEmail()) {
                $user->markEmailAsVerified();
            }



            // Check admin status after authentication
            $user = Auth::user();
            $isAdmin = $user && $user->is_admin;

            $redirectRoute = $isAdmin ? 'admin.dashboard' : 'dashboard';
            return redirect()->intended(route($redirectRoute, absolute: false));

        } catch (\Exception $e) {
            return redirect()->route('login')
                ->with('error', 'Google authentication failed. Please try again.');
        }
    }
}
