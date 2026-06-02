<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <link rel="stylesheet" href="{{ asset('resources/css/alertify-mobile.css') }}">
        
        <!-- Font Awesome -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

        <link rel="shortcut icon" href="{{ asset('assets/img/gifted_talent_logo.png') }}" type="image/x-icon">

        <!-- Alertify CSS -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/alertify.min.css"/>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/themes/default.min.css"/>

        <!-- Alertify Mobile Responsive Fix -->
        <style>
            /* Force Alertify to be mobile responsive */
            @media (max-width: 768px) {
                .alertify-notifier {
                    position: fixed !important;
                    bottom: 20px !important;
                    top: auto !important;
                    left: 0 !important;
                    right: 0 !important;
                    width: 100% !important;
                    display: flex !important;
                    justify-content: center !important;
                    z-index: 99999 !important;
                    pointer-events: none !important;
                }
                
                .alertify-notifier .ajs-message {
                    width: 90% !important;
                    max-width: 320px !important;
                    margin: 0 auto 12px auto !important;
                    padding: 14px 18px !important;
                    border-radius: 16px !important;
                    font-size: 14px !important;
                    text-align: center !important;
                    pointer-events: auto !important;
                    position: relative !important;
                    right: auto !important;
                    left: auto !important;
                    transform: none !important;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.15) !important;
                }
                
                .alertify-notifier.ajs-right {
                    right: auto !important;
                    left: auto !important;
                }
                
                .alertify-notifier.ajs-right .ajs-message {
                    right: auto !important;
                    left: auto !important;
                }
            }
            
            /* Small phones */
            @media (max-width: 480px) {
                .alertify-notifier .ajs-message {
                    width: 85% !important;
                    padding: 12px 16px !important;
                    font-size: 13px !important;
                    border-radius: 14px !important;
                }
            }
        </style>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        <script>
            window.csrfToken = "{{ csrf_token() }}";
        </script>
        
        <div id="app">
            @inertia
        </div>
        
        <!-- Alertify JS -->
        <script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/alertify.min.js"></script>
    </body>
</html>