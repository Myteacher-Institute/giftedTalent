// resources/js/Components/AppNavbar.jsx
import { Link, router } from '@inertiajs/react';
import Notification from './Notification';
import { useState } from 'react';

const AppNavbar = ({ user, newJobsCount, onMenuToggle }) => {
    const getProfileImageUrl = () => {
        if (user?.profile?.avatar_url) {
            return user.profile.avatar_url;
        }
        
        if (user?.profile?.avatar) {
            const avatarPath = user.profile.avatar;
            if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
                return avatarPath;
            }
            const cleanPath = avatarPath.replace(/^\/+/, '');
            const fullUrl = `/storage/${cleanPath}`;
            return fullUrl;
        }
        
        const userName = user?.name || 'User';
        const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=150&bold=true`;
        return fallbackUrl;
    };

    return (
        <header className="navbar">
            <div className="logo">
                <span className="blue">GiftedTalents</span>.Online
            </div>

            {/* Desktop Navigation */}
            <nav>
                <Link href="/">Home</Link>
                <Link href="/search-jobs">Jobs</Link>
                <Link href="#">Explore</Link>
                <Link href="#">Hire</Link>
            </nav>

            {/* Single Hamburger Menu - Opens Sidebar on Mobile */}
            <button className="mobile-menu-toggle" onClick={onMenuToggle}>
                <i className="fas fa-bars"></i>
            </button>

            <div className="search">
                <input type="text" placeholder="search for jobs..." />
            </div>

            <div className="nav-icons">
                <i className="fa-regular fa-comment"></i>
                <div style={{ position: 'relative' }}>
                    <Notification />
                    {newJobsCount > 0 && (
                        <span className="notification-badge">{newJobsCount}</span>
                    )}
                </div>
                <img 
                    src={getProfileImageUrl()} 
                    alt={user?.name || 'Profile'} 
                    className="navbar-profile-image"
                    onClick={() => router.visit('/profile/edit')}
                    onError={(e) => {
                        const userName = user?.name || 'User';
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=40&bold=true`;
                    }}
                />
            </div>
        </header>
    );
};

export default AppNavbar;