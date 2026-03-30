import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
// import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import '../../css/Dashboard.css';
import Notification from '../Components/Notification';
import axios from 'axios';
import MessageModal from '../Components/MessageModal';
import AppNavbar from '../Components/AppNavbar';


window.alertify = window.alertify || alertify;

// Job Card Component
function JobCard({ job, onSave, onUnsave, isSaved = false }) {
    const [showMenu, setShowMenu] = useState(null);
    const [saved, setSaved] = useState(isSaved);

    const toggleMenu = (index) => {
        setShowMenu(showMenu === index ? null : index);
    };

    const handleSaveClick = () => {
        if (saved) {
            onUnsave(job.id);
            setSaved(false);
        } else {
            onSave(job.id);
            setSaved(true);
        }
        setShowMenu(null);
    };

    return (
        <div className={`job-card ${job.match_score >= 60 ? 'recommended-job' : ''}`}>
            <div className="job-left">
                <img src={job.image} alt="" />
            </div>
            <div className="job-right">
                <h3>{job.company}</h3>
                <p>{job.title}</p>
                <span>{job.tags}</span>
                <p className="time">{job.time}</p>
                {job.match_score && (
                    <div className="match-score mt-2">
                        <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${job.match_score}%` }}
                                ></div>
                            </div>
                            <span className="text-xs text-gray-600">
                                {job.match_score}% Match
                            </span>
                        </div>
                    </div>
                )}
                
            </div>

            <div className="job-actions">
                <button className="apply desktop-only">Apply Now</button>
                <div className="menu-trigger" onClick={() => toggleMenu(job.id)}>
                    <i className="fa-solid fa-ellipsis"></i>
                </div>
                {showMenu === job.id && (
                    <div className="dropdown-menu">
                        <button onClick={() => setShowMenu(null)}>
                            <i className="fa-regular fa-eye-slash"></i> Hide Job
                        </button>
                        <button onClick={() => setShowMenu(null)}>
                            <i className="fa-regular fa-paper-plane"></i> Apply Now
                        </button>
                        <button onClick={handleSaveClick}>
                            <i className={`fa-regular fa-bookmark`} style={{ color: saved ? '#4F46E5' : '' }}></i> 
                            {saved ? 'Saved' : 'Save Job'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Dashboard({ 
    user,
    auth, 
    profileComplete = 0, 
    profileStatus = {}, 
    stats = { applied: 0, review: 0, interview: 0, rejected: 0 }, 
    jobs = [], 
    jobTypes = [], 
    searchParams = {}, 
    notifications,
    profile,
    flash 
}) {
    const [searchQuery, setSearchQuery] = useState(searchParams.q || '');
    const [selectedJobType, setSelectedJobType] = useState(searchParams.job_type || '');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [showAppliedJobs, setShowAppliedJobs] = useState(false);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loadingApplied, setLoadingApplied] = useState(false);
    const [newJobsCount, setNewJobsCount] = useState(0);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [savedJobs, setSavedJobs] = useState([]);
    const [savedJobsCount, setSavedJobsCount] = useState(0);
    const [showSavedJobs, setShowSavedJobs] = useState(false);
    const [loadingSaved, setLoadingSaved] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const currentUser = user || auth?.user;

    useEffect(() => {
        if (flash?.success) {
            alertify.success(flash.success);
        }
    }, [flash]);

    useEffect(() => {
        const profileUpdated = sessionStorage.getItem('profileUpdated');
        const profileUpdateTime = sessionStorage.getItem('profileUpdateTime');
        
        if (profileUpdated === 'true') {
            const now = Date.now();
            const updateTime = parseInt(profileUpdateTime);
            
            if (updateTime && (now - updateTime) < 10000) {
                alertify.success('Profile updated successfully! Your changes have been saved.');
            }
            
            sessionStorage.removeItem('profileUpdated');
            sessionStorage.removeItem('profileUpdateTime');
        }
    }, []);

    const getProfileImageUrl = () => {
        // Priority 1: Base64 image from profile
        if (profile?.profile_image_base64) {
            return profile.profile_image_base64;
        }
        
        // Priority 2: Base64 image from currentUser's profile
        if (currentUser?.profile?.profile_image_base64) {
            return currentUser.profile.profile_image_base64;
        }
        
        // Priority 3: Avatar URL from profile
        if (profile?.avatar_url) {
            return profile.avatar_url;
        }
        
        // Priority 4: Avatar from profile storage
        if (profile?.avatar) {
            const avatarPath = profile.avatar;
            if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
                return avatarPath;
            }
            const cleanPath = avatarPath.replace(/^\/+/, '');
            const fullUrl = `/storage/${cleanPath}`;
            return fullUrl;
        }
        
        // Priority 5: Avatar from users table (backward compatibility)
        if (currentUser?.avatar) {
            const avatarPath = currentUser.avatar;
            if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
                return avatarPath;
            }
            const cleanPath = avatarPath.replace(/^\/+/, '');
            const fullUrl = `/storage/${cleanPath}`;
            return fullUrl;
        }

        // Fallback: Avatar from name
        const userName = currentUser?.name || 'User';
        const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=150&bold=true`;
        return fallbackUrl;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        router.get(
            '/dashboard',
            { q: searchQuery, job_type: selectedJobType },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => setLoading(false),
                onError: () => setLoading(false),
            }
        );
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSelectedJobType('');
        router.get('/dashboard', {}, { preserveState: true, preserveScroll: true });
    };

    const toggleAdvanced = () => setShowAdvanced(!showAdvanced);

    const handleLogout = () => {
        router.post('/logout');
    };

    const fetchAppliedJobs = async () => {
        setLoadingApplied(true);
        try {
            const response = await axios.get('/api/user/applied-jobs');
            setAppliedJobs(response.data);
        } catch (error) {
            console.error('Error fetching applied jobs:', error);
            alertify.error('Failed to load applied jobs');
        } finally {
            setLoadingApplied(false);
        }
    };

    const handleShowAppliedJobs = () => {
        setShowAppliedJobs(true);
        setShowSavedJobs(false);
        fetchAppliedJobs();
    };

    const handleShowAllJobs = () => {
        setShowAppliedJobs(false);
        setShowSavedJobs(false);
    };

    const fetchSavedJobs = async () => {
        setLoadingSaved(true);
        try {
            const response = await axios.get('/saved-jobs');
            setSavedJobs(response.data.data);
        } catch (error) {
            console.error('Error fetching saved jobs:', error);
            alertify.error('Failed to load saved jobs');
        } finally {
            setLoadingSaved(false);
        }
    };

    const handleShowSavedJobs = () => {
        setShowAppliedJobs(false);
        setShowSavedJobs(true);
        fetchSavedJobs();
    };

    const handleSaveJob = async (jobId) => {
        try {
            const response = await axios.post(`/saved-jobs/${jobId}`);
            if (response.data.success) {
                alertify.success('Job saved successfully');
                fetchSavedJobsCount();
            }
        } catch (error) {
            if (error.response?.data?.message === 'Job already saved') {
                alertify.warning('Job already saved');
            } else {
                alertify.error('Failed to save job');
            }
        }
    };

    const handleUnsaveJob = async (jobId) => {
        try {
            await axios.delete(`/saved-jobs/${jobId}`);
            alertify.success('Job removed from saved');
            if (showSavedJobs) {
                fetchSavedJobs();
            }
            fetchSavedJobsCount();
        } catch (error) {
            console.error('Error removing saved job:', error);
            alertify.error('Failed to remove job');
        }
    };

    const fetchSavedJobsCount = async () => {
        try {
            const response = await axios.get('/saved-jobs/count');
            setSavedJobsCount(response.data.count);
        } catch (error) {
            console.error('Error fetching saved jobs count:', error);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get('/api/messages/unread-count');
            setUnreadCount(response.data.count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const fetchMessages = async () => {
        setLoadingMessages(true);
        try {
            const response = await axios.get('/api/messages');
            setMessages(response.data.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleOpenMessages = async () => {
        setShowMessageModal(true);
        await fetchMessages();
        if (unreadCount > 0) {
            try {
                await axios.put('/api/messages/read-all');
                setUnreadCount(0);
            } catch (error) {
                console.error('Error marking all as read:', error);
            }
        }
    };

    const markMessageAsRead = async (messageId) => {
        try {
            await axios.put(`/api/messages/${messageId}/read`);
            setMessages(messages.map(msg =>
                msg.id === messageId ? { ...msg, is_read: true } : msg
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };

    useEffect(() => {
        const hasShown = localStorage.getItem('profileCompleteShown');
        if (profileComplete === 100 && !hasShown) {
            alertify.success('Congratulations! Your profile is 100% complete! 🎉', 3);
            localStorage.setItem('profileCompleteShown', 'true');
        }
    }, [profileComplete]);

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchSavedJobsCount();
    }, []);

    const recommendedJobs = jobs.filter(job => job.match_score && job.match_score >= 60);
    const otherJobs = jobs.filter(job => !job.match_score || job.match_score < 60);

    const cvCount = currentUser?.resumes?.length || 0;
    const hasCV = cvCount > 0;

    // Get profile status with professional levels
    const getProfileLevel = () => {
        if (profileComplete === 100) return { label: 'Expert', color: '#10b981', icon: 'fa-crown', message: 'Your profile is fully optimized!' };
        if (profileComplete >= 75) return { label: 'Advanced', color: '#3b82f6', icon: 'fa-rocket', message: 'Great progress! Almost there!' };
        if (profileComplete >= 50) return { label: 'Intermediate', color: '#f59e0b', icon: 'fa-chart-line', message: 'Good progress! Keep going!' };
        if (profileComplete >= 25) return { label: 'Beginner', color: '#8b5cf6', icon: 'fa-seedling', message: 'Getting started! Add more details.' };
        return { label: 'Starter', color: '#6b7280', icon: 'fa-flag-checkered', message: 'Start building your profile!' };
    };

    const profileLevel = getProfileLevel();

    return (
        <>
            <Head title="Dashboard" />

            <AppNavbar user={currentUser} newJobsCount={newJobsCount} onMenuToggle={toggleMobileMenu} />

            <div className="container">
                <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                    <div className="profile">
                        <div className="profile-image-wrapper">
                            <img 
                                src={getProfileImageUrl()} 
                                alt={currentUser?.name || 'Profile'} 
                                className="profile-image"
                                onError={(e) => {
                                    const userName = currentUser?.name || 'User';
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=150&bold=true`;
                                }}
                            />
                            <div className="verified-overlay">
                                <i className="fa-solid fa-check-circle"></i>
                            </div>
                        </div>

                        <h3>{currentUser?.name || 'User'}</h3>
                        {/* Show title from users table, fallback to profile table */}
                        <p>{currentUser?.title || profile?.title || profile?.position || 'Add position'}</p>
                        <button>
                            <Link href="/profile/edit" className="profile-button">Edit Profile</Link>
                        </button>
                    </div>

                    <ul className="menu">
                        {/* Navigation Links for Mobile */}
                        <li><Link href="/" onClick={() => setIsMobileMenuOpen(false)}><i className="fa-solid fa-house"></i> Home</Link></li>
                        <li><Link href="/search-jobs" onClick={() => setIsMobileMenuOpen(false)}><i className="fa-solid fa-magnifying-glass"></i> Jobs</Link></li>
                        <li><Link href="#" onClick={() => setIsMobileMenuOpen(false)}><i className="fa-solid fa-compass"></i> Explore</Link></li>
                        <li><Link href="#" onClick={() => setIsMobileMenuOpen(false)}><i className="fa-solid fa-user-plus"></i> Hire</Link></li>
                        
                        {/* Divider */}
                        <li style={{ borderTop: '1px solid #e5e7eb', margin: '8px 0', padding: 0 }}></li>
                        
                        {/* Dashboard Menu Items */}
                        <li className={!showAppliedJobs && !showSavedJobs ? 'active' : ''} onClick={() => { handleShowAllJobs(); setIsMobileMenuOpen(false); }} style={{ cursor: 'pointer' }}>
                            <i className="fa-solid fa-table"></i>Dashboard
                        </li>
                        <li><Link href="/search-jobs" onClick={() => setIsMobileMenuOpen(false)}><i className="fa-solid fa-magnifying-glass"></i> Search Job</Link></li>
                        <li className={showAppliedJobs ? 'active' : ''} onClick={() => { handleShowAppliedJobs(); setIsMobileMenuOpen(false); }} style={{ cursor: 'pointer' }}>
                            <i className="fa-solid fa-file"></i> My Applications
                        </li>
                        <li onClick={() => { handleOpenMessages(); setIsMobileMenuOpen(false); }} style={{ cursor: 'pointer', position: 'relative' }}>
                            <i className="fa-regular fa-envelope"></i> Message
                            {unreadCount > 0 && (
                                <span className="message-badge">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </li>
                        <li onClick={() => { handleShowSavedJobs(); setIsMobileMenuOpen(false); }} style={{ cursor: 'pointer', position: 'relative' }}>
                            <i className="fa-regular fa-bookmark"></i> Save Jobs
                            {savedJobsCount > 0 && (
                                <span className="saved-jobs-badge">
                                    {savedJobsCount > 99 ? '99+' : savedJobsCount}
                                </span>
                            )}
                        </li>
                        <li>
                            <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)}>
                                <i className="fa-solid fa-gear"></i> Settings
                            </Link>
                        </li>
                        <li className="logout-item">
                            <a href="/" onClick={(e) => { e.preventDefault(); handleLogout(); setIsMobileMenuOpen(false); }}>
                                <i className="fa-solid fa-right-from-bracket logout-icon"></i> Logout
                            </a>
                        </li>
                    </ul>
                </aside>

                <main className="main">
                    {/* Rest of your main content remains the same */}
                    {showSavedJobs ? (
                        <div className="flex justify-between items-center mb-4">
                            <h1>Saved Jobs</h1>
                            <button onClick={handleShowAllJobs} className="text-blue-500 hover:text-blue-700">
                                ← Back to Dashboard
                            </button>
                        </div>
                    ) : showAppliedJobs ? (
                        <h1>My Applications</h1>
                    ) : (
                        <>
                            <h1>Welcome back, {currentUser?.name?.split(' ')[0] || 'User'}</h1>

                            <div className="status-bar">
                                <span className={hasCV ? 'success' : 'warning'}>
                                    {hasCV ? `CV Uploaded (${cvCount})` : 'Upload CV'}
                                </span>
                                <button onClick={() => router.visit('/cv')}>
                                    <Link href="/cv" className="status-button">
                                        {hasCV ? 'Manage CVs' : 'Upload Your CV'}
                                    </Link>
                                </button>
                            </div>

                            {profileComplete === 100 ? (
                                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-lg">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <i className="fa-solid fa-check-circle text-green-400 text-lg"></i>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-green-700">
                                                Your profile is 100% complete! 🎉
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : profileComplete < 100 ? (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <i className="fa-solid fa-exclamation-triangle text-yellow-400"></i>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-yellow-700">
                                                Complete your profile to get better job recommendations! ({profileComplete}% complete)
                                                <Link href="/profile/edit" className="font-medium underline ml-2 hover:text-yellow-800">
                                                    Update Profile →
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            <div className="search-bar">
                                <form onSubmit={handleSearch} className="flex gap-2 w-full">
                                    <input 
                                        type="text" 
                                        placeholder="Search for jobs..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <select 
                                        value={selectedJobType} 
                                        onChange={(e) => setSelectedJobType(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="">All Types</option>
                                        {jobTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                    <button 
                                        type="button" 
                                        onClick={toggleAdvanced}
                                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md"
                                    >
                                        Advanced
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 shadow-md disabled:opacity-50"
                                    >
                                        {loading ? 'Searching...' : 'Search'}
                                    </button>
                                    {(searchQuery || selectedJobType) && (
                                        <button 
                                            type="button" 
                                            onClick={clearSearch}
                                            className="px-4 py-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-all"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </form>
                            </div>

                            {showAdvanced && (
                                <div className="advanced-filter-modal bg-white p-6 rounded-xl shadow-2xl border border-gray-200 max-w-md mx-auto mb-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-bold text-gray-800">Advanced Filter</h3>
                                        <button onClick={toggleAdvanced} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
                                    </div>
                                    <div className="space-y-4">
                                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                            <option>Location</option>
                                        </select>
                                        <input type="range" min="0" max="200" className="w-full" />
                                        <span>$0 - $200k</span>
                                    </div>
                                </div>
                            )}

                            {recommendedJobs.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            🎯 Recommended for You
                                        </h2>
                                        <span className="text-sm text-gray-500">
                                            Based on your profile and skills
                                        </span>
                                    </div>
                                    <div className="jobs">
                                        {recommendedJobs.map((job) => (
                                            <JobCard key={job.id} job={job} onSave={handleSaveJob} onUnsave={handleUnsaveJob} isSaved={false} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {otherJobs.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                        {searchQuery ? `Search Results for "${searchQuery}"` : 'Other Available Jobs'}
                                    </h2>
                                    <div className="jobs">
                                        {otherJobs.map((job) => (
                                            <JobCard key={job.id} job={job} onSave={handleSaveJob} onUnsave={handleUnsaveJob} isSaved={false} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {recommendedJobs.length === 0 && otherJobs.length === 0 && !loading && (
                                <div className="text-center py-16 px-8">
                                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl flex items-center justify-center">
                                        <i className="fa-solid fa-magnifying-glass text-3xl text-yellow-500"></i>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Sorry, no matching jobs</h3>
                                    <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
                                        No jobs match your criteria. Complete your profile for better recommendations!
                                    </p>
                                    <Link href="/profile/edit" className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg font-semibold">
                                        Complete Your Profile
                                    </Link>
                                </div>
                            )}

                            {loading && (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                        </>
                    )}
                </main>

                <aside className="right-panel">
                    <div className="progress-card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Profile Strength</h3>
                            <span 
                                className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                                style={{ backgroundColor: profileLevel.color }}
                            >
                                <i className={`fas ${profileLevel.icon} mr-1`}></i>
                                {profileLevel.label}
                            </span>
                        </div>
                        
                        <div className="progress-circle" style={{ '--progress': `${profileComplete / 100}` }}>
                            <div className="flex flex-col items-center">
                                <h2 className="text-3xl font-bold text-indigo-600 mb-1">{profileComplete}%</h2>
                                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Complete</span>
                            </div>
                        </div>
                        
                        <p className="text-center text-sm text-gray-600 mt-3 mb-4">
                            <i className="fas fa-info-circle mr-1 text-indigo-500"></i>
                            {profileLevel.message}
                        </p>
                        
                        <div className="progress-steps mt-4">
                            <div className="flex justify-between text-xs text-gray-500 mb-2">
                                <span>Starter</span>
                                <span>Beginner</span>
                                <span>Intermediate</span>
                                <span>Advanced</span>
                                <span>Expert</span>
                            </div>
                            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ 
                                        width: `${profileComplete}%`,
                                        background: `linear-gradient(90deg, #8b5cf6, ${profileComplete >= 50 ? '#f59e0b' : '#8b5cf6'}, ${profileComplete >= 75 ? '#3b82f6' : ''}, ${profileComplete === 100 ? '#10b981' : ''})`
                                    }}
                                ></div>
                            </div>
                        </div>
                        
                        {/* UPDATED CHECKLIST - Checking BOTH users table AND profiles table */}
                        <ul className="mt-6 space-y-2">
                            {/* Title - Check users table first, then profile table */}
                            <li className={(currentUser?.title || profile?.title || profile?.position) ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                <i className={`fas ${(currentUser?.title || profile?.title || profile?.position) ? 'fa-check-circle text-green-500' : 'fa-plus-circle text-gray-400'} mr-2`}></i>
                                Professional Title
                                {!(currentUser?.title || profile?.title || profile?.position) && <span className="text-xs text-gray-400 ml-2">(Add your job title)</span>}
                            </li>
                            
                            {/* Company - Check users table first, then profile table */}
                            <li className={(currentUser?.company || profile?.company) ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                <i className={`fas ${(currentUser?.company || profile?.company) ? 'fa-check-circle text-green-500' : 'fa-plus-circle text-gray-400'} mr-2`}></i>
                                Current Company
                                {!(currentUser?.company || profile?.company) && <span className="text-xs text-gray-400 ml-2">(Where do you work?)</span>}
                            </li>
                            
                            {/* Bio - Check users table first, then profile table */}
                            <li className={(currentUser?.bio || profile?.bio) ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                <i className={`fas ${(currentUser?.bio || profile?.bio) ? 'fa-check-circle text-green-500' : 'fa-plus-circle text-gray-400'} mr-2`}></i>
                                Professional Bio
                                {!(currentUser?.bio || profile?.bio) && <span className="text-xs text-gray-400 ml-2">(Tell employers about yourself)</span>}
                            </li>
                            
                            {/* Skills - Check profileStatus */}
                            <li className={profileStatus.status?.skills ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                <i className={`fas ${profileStatus.status?.skills ? 'fa-check-circle text-green-500' : 'fa-plus-circle text-gray-400'} mr-2`}></i>
                                Skills & Expertise
                                {!profileStatus.status?.skills && <span className="text-xs text-gray-400 ml-2">(Add your top skills)</span>}
                            </li>
                            
                            {/* Phone - Check users table first, then profile table */}
                            <li className={(currentUser?.phone || profile?.phone) ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                <i className={`fas ${(currentUser?.phone || profile?.phone) ? 'fa-check-circle text-green-500' : 'fa-plus-circle text-gray-400'} mr-2`}></i>
                                Contact Information
                                {!(currentUser?.phone || profile?.phone) && <span className="text-xs text-gray-400 ml-2">(Add phone number)</span>}
                            </li>
                            
                            {/* Location - Check users table, also check profile address/city */}
                            <li className={(currentUser?.location || profile?.address || profile?.city) ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                <i className={`fas ${(currentUser?.location || profile?.address || profile?.city) ? 'fa-check-circle text-green-500' : 'fa-plus-circle text-gray-400'} mr-2`}></i>
                                Location
                                {!(currentUser?.location || profile?.address || profile?.city) && <span className="text-xs text-gray-400 ml-2">(Where are you based?)</span>}
                            </li>
                            
                            {/* Portfolio - Check users table first, then profile table */}
                            <li className={(currentUser?.portfolio_url || profile?.portfolio_url) ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                <i className={`fas ${(currentUser?.portfolio_url || profile?.portfolio_url) ? 'fa-check-circle text-green-500' : 'fa-plus-circle text-gray-400'} mr-2`}></i>
                                Portfolio / Website
                                {!(currentUser?.portfolio_url || profile?.portfolio_url) && <span className="text-xs text-gray-400 ml-2">(Showcase your work)</span>}
                            </li>
                            
                            {/* CV / Resume */}
                            <li className={hasCV ? 'done' : ''} onClick={() => router.visit('/cv')}>
                                <i className={`fas ${hasCV ? 'fa-check-circle text-green-500' : 'fa-plus-circle text-gray-400'} mr-2`}></i>
                                CV / Resume
                                {!hasCV && <span className="text-xs text-gray-400 ml-2">(Upload your resume)</span>}
                            </li>
                        </ul>
                        
                        {profileComplete < 100 && (
                            <button 
                                onClick={() => router.visit('/profile/edit')}
                                className="mt-6 w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium"
                            >
                                <i className="fas fa-arrow-right mr-2"></i>
                                Complete Your Profile
                            </button>
                        )}
                    </div>

                    <div className="tracker">
                        <h3>Application Tracker</h3>

                        <div className="grid">
                            <div className="box blue">
                                <h2>{stats.applied || 0}</h2>
                                <p>Applied</p>
                            </div>

                            <div className="box orange">
                                <h2>{stats.review || 0}</h2>
                                <p>Under Review</p>
                            </div>

                            <div className="box green">
                                <h2>{stats.interview || 0}</h2>
                                <p>Interview</p>
                            </div>

                            <div className="box red">
                                <h2>{stats.rejected || 0}</h2>
                                <p>Rejected</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            <MessageModal
                isOpen={showMessageModal}
                onClose={() => setShowMessageModal(false)}
                messages={messages}
                loading={loadingMessages}
                onMarkAsRead={markMessageAsRead}
            />

            <div className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}></div>
        </>
    );
}