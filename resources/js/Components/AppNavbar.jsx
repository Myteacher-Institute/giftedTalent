import { Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import Notification from './Notification';
import '../css/exploreNav.css';

const AppNavbar = ({ user, newJobsCount, onMenuToggle, isMenuOpen }) => {
    const [scrolled, setScrolled] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownRef = useRef(null);

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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleMenu = () => {
        if (onMenuToggle) {
            onMenuToggle();
        }
    };

    const toggleDropdown = (dropdownName, e) => {
        e.stopPropagation();
        setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
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

    // Dropdown menu items
    const exploreMenuItems = {
        jobs: {
            title: 'Jobs',
            icon: 'fa-briefcase',
            items: [
                { name: 'Browse All Jobs', icon: 'fa-search', link: '/search-jobs' },
                { name: 'Featured Jobs', icon: 'fa-star', link: '/featured-jobs' },
                { name: 'Remote Jobs', icon: 'fa-globe', link: '/remote-jobs' },
                { name: 'Part-Time Jobs', icon: 'fa-clock', link: '/part-time-jobs' }
            ]
        },
        talents: {
            title: 'Talents',
            icon: 'fa-users',
            items: [
                { name: 'Professional Talents', icon: 'fa-user-tie', link: '/find-talents' },
                { name: 'Featured Talents', icon: 'fa-crown', link: '/featured-talents' },
                { name: 'Top Rated', icon: 'fa-chart-line', link: '/top-rated' },
                { name: 'Recently Joined', icon: 'fa-user-plus', link: '/recent-talents' }
            ]
        },
        companies: {
            title: 'Companies',
            icon: 'fa-building',
            items: [
                { name: 'All Companies', icon: 'fa-building', link: '/companies' },
                { name: 'Top Employers', icon: 'fa-trophy', link: '/top-employers' },
                { name: 'Hiring Now', icon: 'fa-clock', link: '/hiring-now' },
                { name: 'Remote Friendly', icon: 'fa-globe', link: '/remote-companies' }
            ]
        },
        categories: {
            title: 'Categories',
            icon: 'fa-tags',
            items: [
                { name: 'Technology', icon: 'fa-code', link: '/category/technology' },
                { name: 'Design', icon: 'fa-pen-ruler', link: '/category/design' },
                { name: 'Marketing', icon: 'fa-chart-line', link: '/category/marketing' },
                { name: 'Business', icon: 'fa-briefcase', link: '/category/business' }
            ]
        }
    };

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <Link href="/" className="logo">
                    <span className="blue">GiftedTalents</span>.Online
                </Link>

                {/* Desktop Navigation */}
                <div className="nav-links">
                    <Link href="/">Home</Link>
                    <Link href="/search-jobs">Jobs</Link>
                    
                    {/* Explore Dropdown - Desktop */}
                    <div className="dropdown-container desktop-dropdown" ref={dropdownRef}>
                        <button 
                            className={`nav-link dropdown-trigger ${openDropdown === 'explore' ? 'active' : ''}`}
                            onClick={(e) => toggleDropdown('explore', e)}
                        >
                            Explore <i className="fas fa-chevron-down"></i>
                        </button>
                        {openDropdown === 'explore' && (
                            <div className="dropdown-menu desktop-dropdown-menu">
                                {Object.values(exploreMenuItems).map((section, idx) => (
                                    <div key={idx}>
                                        <div className="dropdown-section">
                                            <div className="dropdown-header">
                                                <i className={`fas ${section.icon}`}></i>
                                                <span>{section.title}</span>
                                            </div>
                                            {section.items.map((item, itemIdx) => (
                                                <Link 
                                                    key={itemIdx}
                                                    href={item.link} 
                                                    className="dropdown-item"
                                                    onClick={() => setOpenDropdown(null)}
                                                >
                                                    <i className={`fas ${item.icon}`}></i>
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                        {idx < Object.values(exploreMenuItems).length - 1 && <div className="dropdown-divider"></div>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <Link href="/hire">Hire</Link>
                </div>

                <div className="search">
                    <input type="text" placeholder="Search for jobs..." />
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

                {/* Hamburger Menu Button */}
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

            {/* Mobile Dropdown Menu - Fullscreen overlay */}
            {openDropdown === 'explore' && (
                <div className="mobile-dropdown-overlay" onClick={() => setOpenDropdown(null)}>
                    <div className="mobile-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                        <div className="mobile-dropdown-header">
                            <h3>Explore</h3>
                            <button className="mobile-dropdown-close" onClick={() => setOpenDropdown(null)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="mobile-dropdown-content">
                            {Object.values(exploreMenuItems).map((section, idx) => (
                                <div key={idx} className="mobile-dropdown-section">
                                    <div className="mobile-dropdown-section-header">
                                        <i className={`fas ${section.icon}`}></i>
                                        <span>{section.title}</span>
                                    </div>
                                    {section.items.map((item, itemIdx) => (
                                        <Link 
                                            key={itemIdx}
                                            href={item.link} 
                                            className="mobile-dropdown-item"
                                            onClick={() => setOpenDropdown(null)}
                                        >
                                            <i className={`fas ${item.icon}`}></i>
                                            {item.name}
                                            <i className="fas fa-chevron-right"></i>
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AppNavbar;