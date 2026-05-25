import { Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Notification from './Notification';
import ApplicationLogo from './ApplicationLogo';
import '../../css/nav.css';

const AppNavbar = ({ user, newJobsCount, onMenuToggle, isMenuOpen, searchTerm, onSearchChange, onSearchSubmit }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState(searchTerm || '');
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

    useEffect(() => {
        if (typeof searchTerm === 'string') {
            setSearchValue(searchTerm);
        }
    }, [searchTerm]);

    const effectiveSearchValue = onSearchChange ? searchTerm : searchValue;

    const handleSearchChange = (e) => {
        if (onSearchChange) {
            onSearchChange(e);
            return;
        }

        setSearchValue(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        if (onSearchSubmit) {
            onSearchSubmit(e);
            return;
        }

        if (!effectiveSearchValue || effectiveSearchValue.trim().length === 0) {
            return;
        }

        router.visit('/search', {
            preserveState: true,
            preserveScroll: true,
            data: { q: effectiveSearchValue.trim() },
        });
    };

    const toggleMenu = () => {
        if (mobileSearchOpen) {
            setMobileSearchOpen(false);
        }

        if (onMenuToggle) {
            onMenuToggle();
        } else {
            setMobileNavOpen(!mobileNavOpen);
        }
    };

    const handleNavClick = () => {
        setMobileNavOpen(false);
        setMobileSearchOpen(false);
    };

    const isHamburgerActive = onMenuToggle ? isMenuOpen : mobileNavOpen;

    const hasSearch = true;

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
                <div className="logo">
                    <ApplicationLogo className="w-20 h-10" />
                </div>

                <div className={`nav-links ${mobileNavOpen ? 'mobile-open' : ''}`}>
                    <Link href="/" onClick={handleNavClick}>Home</Link>
                    <Link href="/dashboard" onClick={handleNavClick}>Dashboard</Link>
                    <Link href="/search-jobs" onClick={handleNavClick}>Jobs</Link>
                    <Link href="/explore" onClick={handleNavClick}>Explore</Link>
                </div>

                {/* ONLY ONE SEARCH INPUT - Desktop */}
                <div className="search">
                    <input
                        type="text"
                        placeholder="Search jobs, talents, companies..."
                        value={effectiveSearchValue || ''}
                        onChange={handleSearchChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearchSubmit(e);
                            }
                        }}
                    />
                </div>

                <div className="nav-icons">
                    {hasSearch && (
                        <button
                            type="button"
                            className="mobile-search-button"
                            aria-label="Open search"
                            onClick={() => setMobileSearchOpen(prev => !prev)}
                        >
                            <i className="fas fa-search"></i>
                        </button>
                    )}
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
                    
                    {/* <img 
                        src={getProfileImageUrl()} 
                        alt={user?.name || 'Profile'} 
                        className="navbar-profile-image"
                        onClick={() => router.visit('/profile/edit')}
                        onError={(e) => {
                            const userName = user?.name || 'User';
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=40&bold=true`;
                        }}
                    /> */}
                </div>

                <div className="hamburger-container">
                    <button
                        className={`hamburger ${isHamburgerActive ? 'active' : ''}`}
                        onClick={toggleMenu}
                        type="button"
                        aria-label="Toggle navigation menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                {/* MOBILE SEARCH - Only show on mobile */}
                <div className={`mobile-search-container ${mobileSearchOpen ? 'open' : ''}`}>
                    <input
                        type="text"
                        placeholder="Search jobs, talents, companies..."
                        value={effectiveSearchValue || ''}
                        onChange={handleSearchChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearchSubmit(e);
                            }
                        }}
                    />
                </div>
            </nav>
            {!onMenuToggle && mobileNavOpen && (
                <div className="mobile-nav-overlay active" onClick={() => setMobileNavOpen(false)}></div>
            )}
        </>
    );
};

export default AppNavbar;