import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Welcome" />

            <div className="home-screen">
                {/* Henry */}
                <nav className="navbar">
                    
                </nav>

                <div className="hero">

                </div>
                

                {/* christopher */}
                <div className="feature-jobs">
                    
                </div>

                <div className="featured-talents">
                    
                </div>


            </div>
        </>
    );
}
