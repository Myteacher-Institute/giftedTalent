import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'GiftedTalents';

// Wait for DOM to be fully loaded before mounting
document.addEventListener('DOMContentLoaded', () => {
    // Create app element if it doesn't exist
    let appElement = document.getElementById('app');
    if (!appElement) {
        appElement = document.createElement('div');
        appElement.id = 'app';
        document.body.appendChild(appElement);
        console.log('Created app element');
    }

    createInertiaApp({
        title: (title) => `${title} - ${appName}`,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.jsx`,
                import.meta.glob('./Pages/**/*.jsx'),
            ),
        setup({ el, App, props }) {
            // Use the app element
            const mountEl = document.getElementById('app');
            
            if (!mountEl) {
                console.error('Mounting element not found!');
                return;
            }
            
            const root = createRoot(mountEl);
            root.render(<App {...props} />);
        },
        progress: {
            color: '#4B5563',
        },
    });
});