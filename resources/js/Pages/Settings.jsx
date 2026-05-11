import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppNavbar from '../Components/AppNavbar';
import ProfileSettings from '../Components/Settings/ProfileSettings';
import AccountSecurity from '../Components/Settings/AccountSecurity';
import JobPreferences from '../Components/Settings/JobPreferences';
import NotificationSettings from '../Components/Settings/NotificationSettings';
import PrivacySettings from '../Components/Settings/PrivacySettings';
import '../../css/Settings-Mobile.css';

export default function Settings({ auth, user, profile, flash }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState(profile);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const currentUser = user || auth?.user;

    useEffect(() => {
        if (flash?.success) {
            setSuccessMessage(flash.success);
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 3000);
        }
    }, [flash]);

    const getProfileImageUrl = () => {
        if (profile?.profile_image_base64) {
            return profile.profile_image_base64;
        }
        if (currentUser?.profile?.profile_image_base64) {
            return currentUser.profile.profile_image_base64;
        }
        if (profile?.avatar_url) {
            return profile.avatar_url;
        }
        if (profile?.avatar) {
            const avatarPath = profile.avatar;
            if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
                return avatarPath;
            }
            const cleanPath = avatarPath.replace(/^\/+/, '');
            return `/storage/${cleanPath}`;
        }
        if (currentUser?.avatar) {
            const avatarPath = currentUser.avatar;
            if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
                return avatarPath;
            }
            const cleanPath = avatarPath.replace(/^\/+/, '');
            return `/storage/${cleanPath}`;
        }
        const userName = currentUser?.name || 'User';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=150&bold=true`;
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const tabs = [
        { id: 'profile', label: 'Profile Settings', icon: 'fa-user', description: 'Manage your personal information and profile picture' },
        { id: 'account', label: 'Account & Security', icon: 'fa-lock', description: 'Update your password and security preferences' },
        { id: 'job-preferences', label: 'Job Preferences', icon: 'fa-briefcase', description: 'Customize your job search and alert preferences' },
        { id: 'notifications', label: 'Notifications', icon: 'fa-bell', description: 'Choose how and when to receive notifications' },
        { id: 'privacy', label: 'Privacy', icon: 'fa-shield-alt', description: 'Control your privacy settings and data sharing' },
        { id: 'appearance', label: 'Appearance', icon: 'fa-palette', description: 'Customize the look and feel of your dashboard' },
    ];

    // FIXED: Working navigation links (removed # and added actual routes)
    const mainNavItems = [
        { href: '/dashboard', icon: 'fa-house', label: 'Dashboard' },
        { href: '/search-jobs', icon: 'fa-magnifying-glass', label: 'Jobs' },
        { href: '/explore', icon: 'fa-compass', label: 'Explore' },
        { href: '/profile/edit', icon: 'fa-user-plus', label: 'Profile' },
    ];

    const handleProfileUpdate = (updatedProfile) => {
        setProfileData(updatedProfile);
        setSuccessMessage('Profile updated successfully!');
        setShowSuccessToast(true);

        // This reloads only the necessary data, not the entire page
        router.reload({
            only: ['profile', 'user'],
            preserveScroll: true  // Keeps your scroll position
        });

        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setIsMobileMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const currentTab = tabs.find(tab => tab.id === activeTab);

    return (
        <>
            <Head title="Settings - GiftedTalent" />
            <AppNavbar user={currentUser} onMenuToggle={toggleMobileMenu} />

            {showSuccessToast && (
                <div className="toast-notification success">
                    <div className="toast-content">
                        <i className="fas fa-check-circle"></i>
                        <span>{successMessage}</span>
                        <button onClick={() => setShowSuccessToast(false)} className="toast-close">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            )}

            <div className="settings-container">
                <div className="settings-content">
                    {/* Sidebar */}
                    <aside className={`settings-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                        <div className="settings-profile-section">
                            <img
                                src={getProfileImageUrl()}
                                alt={currentUser?.name || 'Profile'}
                                className="settings-profile-image"
                                onError={(e) => {
                                    const userName = currentUser?.name || 'User';
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=150&bold=true`;
                                }}
                            />
                            <div className="settings-profile-name">{currentUser?.name || 'User'}</div>
                            <p className="settings-profile-role">{currentUser?.title || profile?.title || profile?.position || 'Member'}</p>
                        </div>

                        {/* Main Navigation - FIXED with working links */}
                        <div className="settings-nav-top">
                            {mainNavItems.map((item, index) => (
                                <React.Fragment key={item.label}>
                                    <Link
                                        href={item.href}
                                        className="settings-nav-link"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <div className="settings-nav-icon">
                                            <i className={`fa-solid ${item.icon}`}></i>
                                        </div>
                                        <span>{item.label}</span>
                                    </Link>
                                    {index === 3 && <div className="settings-nav-divider"></div>}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Settings Section Header */}
                        <div className="settings-sidebar-header">
                            <h3>Settings</h3>
                            <p>Manage your preferences</p>
                        </div>

                        {/* Settings Navigation */}
                        <nav className="settings-nav">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                >
                                    <div className={`settings-nav-icon ${activeTab === tab.id ? 'active' : ''}`}>
                                        <i className={`fas ${tab.icon}`}></i>
                                    </div>
                                    <div className="settings-nav-text">
                                        <span className="settings-nav-label">{tab.label}</span>
                                        <span className="settings-nav-desc">{tab.description}</span>
                                    </div>
                                    {activeTab === tab.id && <div className="settings-nav-indicator"></div>}
                                </button>
                            ))}
                        </nav>

                        {/* Help Section */}
                        <div className="settings-help">
                            <div>
                                <i className="fas fa-headset"></i>
                                <h4>Need Help?</h4>
                                <p>Contact our support team for assistance.</p>
                                <Link href="/contact">Contact Support →</Link>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="settings-main">
                        <div className="settings-main-header">
                            <h2>{currentTab?.label}</h2>
                            <p>{currentTab?.description}</p>
                        </div>

                        <div className="settings-main-content">
                            {activeTab === 'profile' && (
                                <ProfileSettings
                                    user={currentUser}
                                    profile={profileData}
                                    onUpdate={handleProfileUpdate}
                                />
                            )}
                            {activeTab === 'account' && (
                                <AccountSecurity user={currentUser} />
                            )}
                            {activeTab === 'job-preferences' && (
                                <JobPreferences user={currentUser} />
                            )}
                            {activeTab === 'notifications' && (
                                <NotificationSettings user={currentUser} />
                            )}
                            {activeTab === 'privacy' && (
                                <PrivacySettings user={currentUser} />
                            )}

                            {activeTab === 'appearance' && (
                                <div className="settings-coming-soon">
                                    <div className="settings-coming-soon-icon">
                                        <i className="fas fa-palette"></i>
                                    </div>
                                    <h3>Appearance Settings</h3>
                                    <p>Coming soon! Customize the dashboard theme.</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {/* Mobile Overlay - ONLY, no extra hamburger button */}
            {isMobileMenuOpen && (
                <div
                    className="settings-mobile-overlay"
                    onClick={toggleMobileMenu}
                ></div>
            )}
        </>
    );
}