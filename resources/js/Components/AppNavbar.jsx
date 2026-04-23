import { Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Notification from './Notification';

const AppNavbar = ({ user, newJobsCount, onMenuToggle, isMenuOpen }) => {
    const [scrolled, setScrolled] = useState(false);
    const { unreadMessagesCount } = usePage().props;

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        if (onMenuToggle) {
            onMenuToggle();
        }
    };

    const getProfileImageUrl = () => {
        if (user?.profile?.profile_image_base64) {
            return user.profile.profile_image_base64;
        }
        if (user?.profile?.avatar_url) {
            return user.profile.avatar_url;
        }
        if (user?.profile?.avatar) {
            const avatarPath = user.profile.avatar;
            if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
                return avatarPath;
            }
            const cleanPath = avatarPath.replace(/^\/+/, '');
            return `/storage/${cleanPath}`;
        }
        const userName = user?.name || 'User';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=40&bold=true`;
    };

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <Link href="/" className="logo">
                    <span className="blue">GiftedTalents</span>.Online
                </Link>

                <div className="nav-links">
                    <Link href="/">Home</Link>
                    <Link href="/search-jobs">Jobs</Link>
                    <Link href="/explore">Explore</Link>
                    {/* <Link href="/hire">Hire</Link> */}
                </div>

                <div className="search">
                    <input type="text" placeholder="Search for jobs..." />
                </div>

                <div className="nav-icons">
                    <Link href="/messages" style={{ position: 'relative', textDecoration: 'none', color: 'inherit' }}>
                        <i className="fa-regular fa-envelope"></i>
                        {unreadMessagesCount > 0 && (
                            <span className="message-badge">{unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}</span>
                        )}
                    </Link>
                    
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

                <div className="hamburger-container">
                    <div
                        className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                        onClick={toggleMenu}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default AppNavbar;