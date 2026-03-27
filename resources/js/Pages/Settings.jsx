import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import AppNavbar from '../Components/AppNavbar';
import ProfileSettings from '../Components/Settings/ProfileSettings';
import AccountSecurity from '../Components/Settings/AccountSecurity';
import JobPreferences from '../Components/Settings/JobPreferences';
import NotificationSettings from '../Components/Settings/NotificationSettings';

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
    
    const tabs = [
        { id: 'profile', label: 'Profile Settings', icon: 'fa-user', description: 'Manage your personal information and profile picture' },
        { id: 'account', label: 'Account & Security', icon: 'fa-lock', description: 'Update your password and security preferences' },
        { id: 'job-preferences', label: 'Job Preferences', icon: 'fa-briefcase', description: 'Customize your job search and alert preferences' },
        { id: 'notifications', label: 'Notifications', icon: 'fa-bell', description: 'Choose how and when to receive notifications' },
        { id: 'privacy', label: 'Privacy', icon: 'fa-shield-alt', description: 'Control your privacy settings and data sharing' },
        { id: 'appearance', label: 'Appearance', icon: 'fa-palette', description: 'Customize the look and feel of your dashboard' },
    ];
    
    const handleProfileUpdate = (updatedProfile) => {
        setProfileData(updatedProfile);
        setSuccessMessage('Profile updated successfully!');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
        router.reload({ only: ['profile'] });
    };
    
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setIsMobileMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const currentTab = tabs.find(tab => tab.id === activeTab);
    
    // Styles object
    const styles = {
        container: {
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '24px'
        },
        header: {
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '16px'
        },
        title: {
            fontSize: '28px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        subtitle: {
            color: '#6b7280',
            fontSize: '16px'
        },
        content: {
            display: 'flex',
            gap: '32px',
            minHeight: '600px'
        },
        sidebar: {
            width: '320px',
            flexShrink: '0',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: '100px',
            height: 'fit-content'
        },
        sidebarHeader: {
            padding: '24px',
            borderBottom: '1px solid #f3f4f6'
        },
        sidebarHeaderH3: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '4px'
        },
        sidebarHeaderP: {
            fontSize: '13px',
            color: '#6b7280'
        },
        nav: {
            padding: '16px 12px'
        },
        navItem: (isActive) => ({
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '12px 16px',
            background: isActive ? 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)' : 'transparent',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            textAlign: 'left',
            marginBottom: '4px',
            transition: 'all 0.2s'
        }),
        navIcon: (isActive) => ({
            width: '40px',
            height: '40px',
            background: isActive ? '#4F46E5' : '#f3f4f6',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }),
        navIconI: (isActive) => ({
            fontSize: '18px',
            color: isActive ? 'white' : '#6b7280'
        }),
        navLabel: {
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#1f2937'
        },
        navDesc: {
            display: 'block',
            fontSize: '12px',
            color: '#6b7280',
            lineHeight: '1.4'
        },
        main: {
            flex: '1',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden'
        },
        mainHeader: {
            padding: '24px 32px',
            borderBottom: '1px solid #f3f4f6'
        },
        mainHeaderH2: {
            fontSize: '24px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '8px'
        },
        mainHeaderP: {
            fontSize: '14px',
            color: '#6b7280'
        },
        mainContent: {
            padding: '32px'
        },
        toast: {
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 1000,
            background: '#10b981',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        },
        toastContent: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 20px'
        },
        comingSoon: {
            textAlign: 'center',
            padding: '60px 20px',
            background: '#f9fafb',
            borderRadius: '12px'
        },
        comingSoonIcon: {
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
        },
        help: {
            margin: '24px 16px',
            padding: '20px',
            background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
            borderRadius: '12px',
            display: 'flex',
            gap: '12px'
        }
    };
    
    return (
        <AuthenticatedLayout user={currentUser}>
            <Head title="Settings - GiftedTalent" />
            <AppNavbar user={currentUser} />
            
            {showSuccessToast && (
                <div style={styles.toast}>
                    <div style={styles.toastContent}>
                        <i className="fas fa-check-circle"></i>
                        <span>{successMessage}</span>
                        <button onClick={() => setShowSuccessToast(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: '12px' }}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            )}
            
            <div style={styles.container}>
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>
                            <i className="fas fa-sliders-h" style={{ color: '#4F46E5' }}></i>
                            Settings
                        </h1>
                        <p style={styles.subtitle}>Manage your account settings and set your preferences</p>
                    </div>
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        style={{
                            display: 'none',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                        className="mobile-toggle"
                    >
                        <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                        <span>{currentTab?.label}</span>
                    </button>
                </div>
                
                <div style={styles.content}>
                    <aside style={styles.sidebar}>
                        <div style={styles.sidebarHeader}>
                            <h3 style={styles.sidebarHeaderH3}>Settings Menu</h3>
                            <p style={styles.sidebarHeaderP}>Customize your experience</p>
                        </div>
                        <nav style={styles.nav}>
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    style={styles.navItem(activeTab === tab.id)}
                                >
                                    <div style={styles.navIcon(activeTab === tab.id)}>
                                        <i className={`fas ${tab.icon}`} style={styles.navIconI(activeTab === tab.id)}></i>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <span style={styles.navLabel}>{tab.label}</span>
                                        <span style={styles.navDesc}>{tab.description}</span>
                                    </div>
                                    {activeTab === tab.id && (
                                        <div style={{ width: '3px', height: '20px', background: '#4F46E5', borderRadius: '3px' }}></div>
                                    )}
                                </button>
                            ))}
                        </nav>
                        
                        <div style={styles.help}>
                            <i className="fas fa-headset" style={{ fontSize: '24px', color: '#4F46E5' }}></i>
                            <div>
                                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Need Help?</h4>
                                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>Contact our support team for assistance with your account settings.</p>
                                <Link href="/contact" style={{ fontSize: '12px', color: '#4F46E5', textDecoration: 'none' }}>
                                    Contact Support <i className="fas fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                    </aside>
                    
                    <main style={styles.main}>
                        <div style={styles.mainHeader}>
                            <h2 style={styles.mainHeaderH2}>{currentTab?.label}</h2>
                            <p style={styles.mainHeaderP}>{currentTab?.description}</p>
                        </div>
                        
                        <div style={styles.mainContent}>
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
                                <div style={styles.comingSoon}>
                                    <div style={styles.comingSoonIcon}>
                                        <i className="fas fa-shield-alt" style={{ fontSize: '32px', color: 'white' }}></i>
                                    </div>
                                    <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Privacy Settings</h3>
                                    <p style={{ color: '#6b7280' }}>Coming soon! Control your privacy preferences.</p>
                                </div>
                            )}
                            {activeTab === 'appearance' && (
                                <div style={styles.comingSoon}>
                                    <div style={styles.comingSoonIcon}>
                                        <i className="fas fa-palette" style={{ fontSize: '32px', color: 'white' }}></i>
                                    </div>
                                    <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Appearance Settings</h3>
                                    <p style={{ color: '#6b7280' }}>Coming soon! Customize the dashboard theme.</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
            
            <style>{`
                @media (max-width: 768px) {
                    .mobile-toggle {
                        display: flex !important;
                    }
                    .settings-sidebar-mobile {
                        position: fixed;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100vh;
                        z-index: 1000;
                        transition: left 0.3s ease;
                    }
                    .settings-sidebar-mobile.open {
                        left: 0;
                    }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}