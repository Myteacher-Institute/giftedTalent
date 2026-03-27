import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppNavbar from '../Components/AppNavbar';
import '../../css/Dashboard.css';

export default function AppLayout({ children, user, newJobsCount = 0, profile, profileComplete, profileStatus, stats }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        console.log('Toggle menu clicked in AppLayout, current state:', isMobileMenuOpen);
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const getProfileLevel = () => {
        if (profileComplete === 100) return { label: 'Expert', color: '#10b981', icon: 'fa-crown', message: 'Your profile is fully optimized!' };
        if (profileComplete >= 75) return { label: 'Advanced', color: '#3b82f6', icon: 'fa-rocket', message: 'Great progress! Almost there!' };
        if (profileComplete >= 50) return { label: 'Intermediate', color: '#f59e0b', icon: 'fa-chart-line', message: 'Good progress! Keep going!' };
        if (profileComplete >= 25) return { label: 'Beginner', color: '#8b5cf6', icon: 'fa-seedling', message: 'Getting started! Add more details.' };
        return { label: 'Starter', color: '#6b7280', icon: 'fa-flag-checkered', message: 'Start building your profile!' };
    };

    const profileLevel = getProfileLevel();
    const currentUser = user;
    const hasStats = stats && (stats.applied > 0 || stats.review > 0 || stats.interview > 0 || stats.rejected > 0);

    return (
        <>
            <AppNavbar user={currentUser} newJobsCount={newJobsCount} onMenuToggle={toggleMobileMenu} />

            <div className="container">
                <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                    {/* Profile Section */}
                    <div className="profile">
                        <div className="profile-image-wrapper">
                            <img 
                                src={currentUser?.profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=4F46E5&color=fff&size=150&bold=true`} 
                                alt={currentUser?.name || 'Profile'} 
                                className="profile-image"
                            />
                            <div className="verified-overlay">
                                <i className="fa-solid fa-check-circle"></i>
                            </div>
                        </div>
                        <h3>{currentUser?.name || 'User'}</h3>
                        <p>{profile?.title || profile?.position || 'Add position'}</p>
                        <button>
                            <Link href="/profile/edit" className="profile-button">Edit Profile</Link>
                        </button>
                    </div>

                    {/* Navigation Menu */}
                    <ul className="menu">
                        <li><Link href="/" onClick={() => setIsMobileMenuOpen(false)}><i className="fa-solid fa-house"></i> Home</Link></li>
                        <li><Link href="/search-jobs" onClick={() => setIsMobileMenuOpen(false)}><i className="fa-solid fa-magnifying-glass"></i> Jobs</Link></li>
                        <li><Link href="#" onClick={() => setIsMobileMenuOpen(false)}><i className="fa-solid fa-compass"></i> Explore</Link></li>
                        <li><Link href="#" onClick={() => setIsMobileMenuOpen(false)}><i className="fa-solid fa-user-plus"></i> Hire</Link></li>
                        
                        <li style={{ borderTop: '1px solid #e5e7eb', margin: '8px 0', padding: 0 }}></li>
                        
                        <li><Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}><i className="fa-solid fa-table"></i> Dashboard</Link></li>
                        <li><Link href="/search-jobs" onClick={() => setIsMobileMenuOpen(false)}><i className="fa-solid fa-magnifying-glass"></i> Search Job</Link></li>
                        <li><Link href="/applications" onClick={() => setIsMobileMenuOpen(false)}><i className="fa-solid fa-file"></i> My Applications</Link></li>
                        <li><Link href="/messages" onClick={() => setIsMobileMenuOpen(false)}><i className="fa-regular fa-envelope"></i> Message</Link></li>
                        <li><Link href="/saved-jobs" onClick={() => setIsMobileMenuOpen(false)}><i className="fa-regular fa-bookmark"></i> Save Jobs</Link></li>
                        <li><Link href="/settings" onClick={() => setIsMobileMenuOpen(false)}><i className="fa-solid fa-gear"></i> Settings</Link></li>
                        <li className="logout-item">
                            <a href="/" onClick={(e) => { e.preventDefault(); router.post('/logout'); setIsMobileMenuOpen(false); }}>
                                <i className="fa-solid fa-right-from-bracket logout-icon"></i> Logout
                            </a>
                        </li>
                    </ul>

                    {profileComplete > 0 && (
                        <div className="progress-card">
                            <div className="flex items-center justify-between mb-4">
                                <h3>Profile Strength</h3>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: profileLevel.color }}>
                                    <i className={`fas ${profileLevel.icon} mr-1`}></i>
                                    {profileLevel.label}
                                </span>
                            </div>
                            <div className="progress-circle" style={{ '--progress': `${profileComplete / 100}` }}>
                                <div className="flex flex-col items-center">
                                    <h2>{profileComplete}%</h2>
                                    <span>Complete</span>
                                </div>
                            </div>
                            <p className="text-center text-sm text-gray-600 mt-3 mb-4">{profileLevel.message}</p>
                            {profileComplete < 100 && (
                                <button onClick={() => router.visit('/profile/edit')} className="mt-6 w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg">
                                    Complete Your Profile
                                </button>
                            )}
                        </div>
                    )}
                </aside>

                <main className="main">
                    {children}
                </main>

                {hasStats && (
                    <aside className="right-panel">
                        <div className="tracker">
                            <h3>Application Tracker</h3>
                            <div className="grid">
                                <div className="box blue"><h2>{stats.applied || 0}</h2><p>Applied</p></div>
                                <div className="box orange"><h2>{stats.review || 0}</h2><p>Under Review</p></div>
                                <div className="box green"><h2>{stats.interview || 0}</h2><p>Interview</p></div>
                                <div className="box red"><h2>{stats.rejected || 0}</h2><p>Rejected</p></div>
                            </div>
                        </div>
                    </aside>
                )}
            </div>

            <div className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}></div>
        </>
    );
}