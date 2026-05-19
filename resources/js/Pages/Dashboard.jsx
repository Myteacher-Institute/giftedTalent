import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import '../../css/Dashboard.css';
import Notification from '../Components/Notification';
import AppNavbar from '../Components/AppNavbar';


window.alertify = window.alertify || alertify;

// Job Card Component - Professional Design with View More Toggle
function JobCard({ job, onSave, onUnsave, onApply, isSaved = false }) {
    const [showMenu, setShowMenu] = useState(null);
    const [saved, setSaved] = useState(isSaved);
    const [applying, setApplying] = useState(false);
    const [expanded, setExpanded] = useState(false);

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

    const handleApplyClick = async () => {
        setApplying(true);
        await onApply(job.id);
        setApplying(false);
    };

    // Get company logo with fallback
    const getCompanyLogo = () => {
        if (job.company_logo_url) {
            return job.company_logo_url;
        }
        if (job.image) {
            return job.image;
        }
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company_name || job.company || 'Company')}&background=4F46E5&color=fff&size=80&bold=true`;
    };

    // Format salary range
    const formatSalary = (salary) => {
        if (!salary) return null;
        if (typeof salary === 'string') return salary;
        return null;
    };

    const getMatchColor = (score) => {
        if (score >= 80) return '#10B981';
        if (score >= 60) return '#3B82F6';
        if (score >= 40) return '#F59E0B';
        return '#6B7280';
    };

    const salaryDisplay = formatSalary(job.salary_range);
    const matchScore = job.match_score || 0;

    return (
        <div className={`professional-job-card ${matchScore >= 60 ? 'premium-job' : ''}`}>
            {/* Card Top Section - Logo, Company, Match Score */}
            <div className="job-card-top">
                <div className="job-company-logo">
                    <img
                        src={getCompanyLogo()}
                        alt={job.company_name || job.company}
                        onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company_name || job.company || 'Company')}&background=4F46E5&color=fff&size=80&bold=true`;
                        }}
                    />
                </div>
                <div className="job-company-info">
                    <h3 className="job-company-name">{job.company_name || job.company}</h3>
                    <h4 className="job-position-title">{job.job_title || job.title}</h4>
                </div>
                {matchScore > 0 && (
                    <div className="job-match-score" style={{ backgroundColor: getMatchColor(matchScore) }}>
                        <i className="fas fa-chart-line"></i> {matchScore}%
                    </div>
                )}
            </div>

            {/* Card Middle Section - Key Details (Always Visible) */}
            <div className="job-card-details">
                <div className="job-detail-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{job.company_location || job.location || 'Remote'}</span>
                </div>
                <div className="job-detail-item">
                    <i className="fas fa-briefcase"></i>
                    <span>{job.job_type || 'Full-time'}</span>
                </div>
                {salaryDisplay && (
                    <div className="job-detail-item">
                        <i className="fas fa-dollar-sign"></i>
                        <span>{salaryDisplay}</span>
                    </div>
                )}
                <div className="job-detail-item">
                    <i className="far fa-clock"></i>
                    <span>{job.posted_at || 'Recently'}</span>
                </div>
                {job.applicants_count > 0 && (
                    <div className="job-detail-item">
                        <i className="fas fa-users"></i>
                        <span>{job.applicants_count} applicants</span>
                    </div>
                )}
            </div>

            {/* Expandable Section - View More Toggle */}
            {expanded && (
                <div className="job-expanded-content">
                    {job.description && (
                        <div className="job-description-section">
                            <h5>About this position:</h5>
                            <p>{job.description}</p>
                        </div>
                    )}
                    {job.tags && typeof job.tags === 'string' && job.tags !== job.job_type && (
                        <div className="job-skills-section">
                            <h5>Required Skills:</h5>
                            <div className="job-skills-tags">
                                {job.tags.split(' • ').map((tag, idx) => (
                                    <span key={idx} className="skill-tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Card Footer - View More & Action Buttons */}
            <div className="job-card-footer">
                <button
                    className="view-more-btn"
                    onClick={() => setExpanded(!expanded)}
                >
                    <i className={`fas ${expanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                    {expanded ? 'View Less' : 'View More'}
                </button>
                <div className="job-action-buttons">
                    <button
                        className={`easy-apply-btn ${job.easy_apply ? 'premium-easy' : ''}`}
                        onClick={handleApplyClick}
                        disabled={applying}
                    >
                        <i className="fas fa-paper-plane"></i>
                        {applying ? 'Applying...' : (job.easy_apply ? 'Easy Apply' : 'Apply Now')}
                    </button>
                    <div className="job-menu-trigger" onClick={() => toggleMenu(job.id)}>
                        <i className="fas fa-ellipsis-v"></i>
                    </div>
                    {showMenu === job.id && (
                        <div className="job-dropdown-menu">
                            <button onClick={handleApplyClick} disabled={applying}>
                                <i className="fas fa-paper-plane"></i> Apply Now
                            </button>
                            <button onClick={handleSaveClick}>
                                <i className={`fas ${saved ? 'fa-bookmark' : 'fa-bookmark'}`} style={{ color: saved ? '#4F46E5' : '' }}></i>
                                {saved ? 'Saved' : 'Save Job'}
                            </button>
                            <button onClick={() => setExpanded(true)}>
                                <i className="fas fa-info-circle"></i> View Details
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Dashboard({
    auth,
    profileComplete = 0,
    profileStatus = {},
    stats = { applied: 0, review: 0, interview: 0, rejected: 0 },
    jobs = [],
    jobTypes = [],
    searchParams = {},
    profile,
    flash,
    profileLevel = { message: 'Keep going!' },
    recommendedJobs = [],
    savedJobs = []
}) {
    const [searchQuery, setSearchQuery] = useState(searchParams.q || '');
    const [selectedJobType, setSelectedJobType] = useState(searchParams.job_type || '');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newJobsCount, setNewJobsCount] = useState(0);
    const [localSavedJobs, setLocalSavedJobs] = useState(savedJobs);
    const [savedJobsCount, setSavedJobsCount] = useState(savedJobs.length);
    const [showSavedJobs, setShowSavedJobs] = useState(false);
    const [loadingSaved, setLoadingSaved] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const currentUser = auth?.user;

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        if (flash?.success) {
            alertify.success(flash.success);
        }
        if (flash?.error) {
            alertify.error(flash.error);
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
        // Check for base64 in profile
        if (profile?.profile_image_base64 && typeof profile.profile_image_base64 === 'string') {
            return profile.profile_image_base64;
        }
        // Check for avatar_url in user's profile
        if (currentUser?.profile?.avatar_url && typeof currentUser.profile.avatar_url === 'string') {
            if (currentUser.profile.avatar_url.startsWith('http')) {
                return currentUser.profile.avatar_url;
            }
            return `/storage/${currentUser.profile.avatar_url.replace(/^\/+/, '')}`;
        }
        // Check for avatar path
        if (currentUser?.profile?.avatar && typeof currentUser.profile.avatar === 'string') {
            const avatarPath = currentUser.profile.avatar;
            if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
                return avatarPath;
            }
            if (avatarPath.startsWith('data:image')) {
                return avatarPath;
            }
            const cleanPath = avatarPath.replace(/^\/+/, '');
            return `/storage/${cleanPath}`;
        }
        // Check for profile avatar_url
        if (profile?.avatar_url && typeof profile.avatar_url === 'string') {
            return profile.avatar_url;
        }
        // Default avatar
        const userName = currentUser?.name || 'User';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=150&bold=true`;
    };

    const handleSearch = (e) => {
        e.preventDefault();

        if (!searchQuery || searchQuery.trim().length === 0) {
            return;
        }

        router.visit('/search', {
            preserveState: true,
            preserveScroll: true,
            data: { q: searchQuery.trim() },
        });
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

    const handleShowAllJobs = () => {
        setShowSavedJobs(false);
    };

    const handleShowSavedJobs = () => {
        setShowSavedJobs(true);
    };

    const handleSaveJob = async (jobId) => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(`/saved-jobs/${jobId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            if (response.ok) {
                const jobToAdd = [...jobs, ...recommendedJobs].find(job => job.id === jobId);
                if (jobToAdd) {
                    setLocalSavedJobs([...localSavedJobs, jobToAdd]);
                    setSavedJobsCount(savedJobsCount + 1);
                }
                alertify.success('Job saved successfully!');
            } else {
                alertify.error('Failed to save job');
            }
        } catch (error) {
            console.error('Error saving job:', error);
            alertify.error('Network error. Please try again.');
        }
    };

    const handleUnsaveJob = async (jobId) => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(`/saved-jobs/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            if (response.ok) {
                const updated = localSavedJobs.filter(job => job.id !== jobId);
                setLocalSavedJobs(updated);
                setSavedJobsCount(updated.length);
                alertify.success('Job removed from saved');
            } else {
                alertify.error('Failed to remove job');
            }
        } catch (error) {
            console.error('Error removing saved job:', error);
            alertify.error('Network error. Please try again.');
        }
    };

    const handleApplyJob = async (jobId) => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch(`/jobs/${jobId}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            const data = await response.json();

            if (response.ok) {
                alertify.success(data.message || 'Application submitted successfully!');
            } else {
                alertify.error(data.message || 'Failed to apply for job');
            }
        } catch (error) {
            console.error('Error applying for job:', error);
            alertify.error('Network error. Please try again.');
        }
    };

    useEffect(() => {
        const hasShown = localStorage.getItem('profileCompleteShown');
        if (profileComplete === 100 && !hasShown) {
            alertify.success('Congratulations! Your profile is 100% complete!', 3);
            localStorage.setItem('profileCompleteShown', 'true');
        }
    }, [profileComplete]);

    const isFieldCompleted = (fieldName) => {
        if (profileStatus.status && profileStatus.status[fieldName]) {
            return true;
        }
        switch (fieldName) {
            case 'first_name':
                return !!(currentUser?.name?.split(' ')[0] || profile?.first_name);
            case 'last_name':
                return !!(currentUser?.name?.split(' ').slice(1).join(' ') || profile?.last_name);
            case 'email':
                return !!(currentUser?.email || profile?.email);
            case 'phone':
                return !!(currentUser?.phone || profile?.phone || currentUser?.profile?.phone);
            case 'position':
                return !!(currentUser?.profile?.position || profile?.position);
            case 'education':
                return !!(currentUser?.profile?.education || profile?.education);
            case 'bio':
                return !!(currentUser?.profile?.bio || profile?.bio);
            case 'location':
                return !!(currentUser?.profile?.city || profile?.city || currentUser?.profile?.address || profile?.address);
            case 'linkedin':
                return !!(currentUser?.profile?.linkedin_url || profile?.linkedin_url);
            case 'github':
                return !!(currentUser?.profile?.github_url || profile?.github_url);
            case 'portfolio':
                return !!(currentUser?.profile?.portfolio_url || profile?.portfolio_url);
            case 'employment_type':
                return !!(currentUser?.profile?.employment_type || profile?.employment_type);
            case 'company':
                return !!(currentUser?.profile?.company || profile?.company);
            case 'cv_uploaded':
                return !!(currentUser?.resumes?.length > 0 || profile?.resumes?.length > 0);
            default:
                return false;
        }
    };

    const otherJobs = jobs.filter(job => !job.match_score || job.match_score < 60);
    const hasCV = currentUser?.resumes?.length > 0;
    const cvCount = currentUser?.resumes?.length || 0;

    return (
        <>
            <Head title="Dashboard" />

            <AppNavbar
                user={currentUser}
                newJobsCount={newJobsCount}
                onMenuToggle={toggleSidebar}
                isMenuOpen={sidebarOpen}
                searchTerm={searchQuery}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
                onSearchSubmit={handleSearch}
            />

            {sidebarOpen && <div className="mobile-overlay" onClick={toggleSidebar}></div>}

            <div className="container">
                <aside className={`sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
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
                        <p>{profile?.position || currentUser?.profile?.position || 'Add position'}</p>
                        <button>
                            <Link href="/profile/edit" className="profile-button">Edit Profile</Link>
                        </button>
                    </div>

                    <ul className="menu">
                        <li className={!showSavedJobs ? 'active' : ''} onClick={handleShowAllJobs}>
                            <i className="fa-solid fa-table"></i>Dashboard
                        </li>
                        <li><Link href="/search-jobs"><i className="fa-solid fa-magnifying-glass"></i> Search Job</Link></li>
                        <li>
                            <Link href="/Explore">
                                <i className="fas fa-compass"></i> Explore
                            </Link>
                        </li>
                        <li>
                            <Link href="/my-applications">
                                <i className="fa-solid fa-file"></i> My Applications
                            </Link>
                        </li>
                        <li>
                            <Link href="/messages">
                                <i className="fa-regular fa-envelope"></i> Messages
                            </Link>
                        </li>
                        <li onClick={handleShowSavedJobs} style={{ position: 'relative' }}>
                            <i className="fa-regular fa-bookmark"></i> Save Jobs
                            {savedJobsCount > 0 && (
                                <span className="saved-jobs-badge">
                                    {savedJobsCount > 99 ? '99+' : savedJobsCount}
                                </span>
                            )}
                        </li>
                        <li onClick={() => router.visit('/settings')}>
                            <i className="fa-solid fa-gear"></i> Settings
                        </li>
                        <li className="logout-item">
                            <a href="/" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                                <i className="fa-solid fa-right-from-bracket logout-icon"></i>
                                Logout
                            </a>
                        </li>
                    </ul>
                </aside>

                <main className="main">
                    {showSavedJobs ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h1>Saved Jobs</h1>
                                <button onClick={handleShowAllJobs} className="back-button">
                                    ← Back to Dashboard
                                </button>
                            </div>
                            {localSavedJobs.length > 0 ? (
                                <div className="jobs">
                                    {localSavedJobs.map((job) => (
                                        <JobCard
                                            key={job.id}
                                            job={job}
                                            onSave={handleSaveJob}
                                            onUnsave={handleUnsaveJob}
                                            onApply={handleApplyJob}
                                            isSaved={true}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <i className="fa-regular fa-bookmark"></i>
                                    <h3>No Saved Jobs Yet</h3>
                                    <p>Save jobs you're interested in to review them later!</p>
                                    <button onClick={handleShowAllJobs} className="btn-primary">Browse Jobs</button>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <h1>Welcome back, {currentUser?.name?.split(' ')[0] || 'User'}</h1>

                            <div className="status-bar">
                                <span className={hasCV ? 'success' : 'warning'}>
                                    {hasCV ? `CV Uploaded (${cvCount})` : 'Upload CV'}
                                </span>
                                <button>
                                    <Link href="/cv" className="status-button">
                                        {hasCV ? 'Manage CVs' : 'Upload Your CV'}
                                    </Link>
                                </button>
                            </div>

                            {/* Professional Alert System */}
                            <div className="alerts-container">
                                {profileComplete === 100 ? (
                                    <div className="alert alert-success">
                                        <div className="alert-icon">
                                            <i className="fas fa-trophy"></i>
                                        </div>
                                        <div className="alert-content">
                                            <h4>Profile Complete! 🎉</h4>
                                            <p>Your profile is 100% complete. You're getting the best job matches!</p>
                                        </div>
                                        <button className="alert-close" onClick={() => { }}>
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                ) : profileComplete > 0 && profileComplete < 100 ? (
                                    <div className="alert alert-warning">
                                        <div className="alert-icon">
                                            <i className="fas fa-chart-line"></i>
                                        </div>
                                        <div className="alert-content">
                                            <h4>Complete Your Profile</h4>
                                            <p>Your profile is {profileComplete}% complete. Add more details to get better job matches.</p>
                                            <Link href="/profile/edit" className="alert-action">
                                                Update Now <i className="fas fa-arrow-right"></i>
                                            </Link>
                                        </div>
                                        <button className="alert-close" onClick={() => { }}>
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                ) : null}

                                {!hasCV && (
                                    <div className="alert alert-info">
                                        <div className="alert-icon">
                                            <i className="fas fa-file-upload"></i>
                                        </div>
                                        <div className="alert-content">
                                            <h4>Upload Your CV</h4>
                                            <p>Employers are more likely to notice you when you have a CV uploaded.</p>
                                            <Link href="/cv" className="alert-action">
                                                Upload CV <i className="fas fa-arrow-right"></i>
                                            </Link>
                                        </div>
                                        <button className="alert-close" onClick={() => { }}>
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Recommended Jobs Section */}
                            {recommendedJobs && recommendedJobs.length > 0 && (
                                <div className="jobs-section">
                                    <div className="section-header">
                                        <h2><i className="fa-solid fa-bullseye"></i> Recommended for You</h2>
                                        <span>Based on your profile and skills</span>
                                    </div>
                                    <div className="jobs">
                                        {recommendedJobs.map((job) => (
                                            <JobCard
                                                key={job.id}
                                                job={job}
                                                onSave={handleSaveJob}
                                                onUnsave={handleUnsaveJob}
                                                onApply={handleApplyJob}
                                                isSaved={localSavedJobs.some(saved => saved.id === job.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Other Jobs Section */}
                            {otherJobs.length > 0 && (
                                <div className="jobs-section">
                                    <h2>{searchQuery ? `Search Results for "${searchQuery}"` : 'Other Available Jobs'}</h2>
                                    <div className="jobs">
                                        {otherJobs.map((job) => (
                                            <JobCard
                                                key={job.id}
                                                job={job}
                                                onSave={handleSaveJob}
                                                onUnsave={handleUnsaveJob}
                                                onApply={handleApplyJob}
                                                isSaved={localSavedJobs.some(saved => saved.id === job.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No Results State */}
                            {recommendedJobs.length === 0 && otherJobs.length === 0 && !loading && jobs.length === 0 && (
                                <div className="empty-state">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                    <h3>Sorry, no matching jobs</h3>
                                    <p>No jobs match your criteria. Complete your profile for better recommendations!</p>
                                    <Link href="/profile/edit" className="btn-primary">Complete Your Profile</Link>
                                </div>
                            )}

                            {loading && (
                                <div className="loading-spinner">
                                    <div className="spinner"></div>
                                </div>
                            )}
                        </>
                    )}
                </main>

                <aside className="right-panel">
                    <div className="progress-card">
                        <h3>Complete Your Profile</h3>
                        <div className="progress-container">
                            <div className="progress-circle" data-progress={Math.floor(profileComplete / 10)} style={{ '--progress': `${profileComplete}` }}>
                                <div className="progress-percent">
                                    <h2>{profileComplete}%</h2>
                                    <span>Complete</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-sm text-gray-600 mt-3 mb-4">
                            <i className="fas fa-info-circle mr-1 text-indigo-500"></i>
                            {profileLevel.message || 'Keep going!'}
                        </p>

                        <div className="progress-steps mt-4">
                            <div className="flex justify-between text-xs text-gray-500 mb-2">
                                <span>Starter</span>
                                <span>Beginner</span>
                                <span>Intermediate</span>
                                <span>Advanced</span>
                                <span>Expert</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${profileComplete}%` }}
                                ></div>
                            </div>
                        </div>

                        <ul className="profile-checklist mt-6">
                            <li className={isFieldCompleted('first_name') && isFieldCompleted('last_name') ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                <i className={`fas ${isFieldCompleted('first_name') && isFieldCompleted('last_name') ? 'fa-check-circle' : 'fa-plus-circle'}`}></i>
                                Full Name
                            </li>
                            <li className={isFieldCompleted('email') ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                <i className={`fas ${isFieldCompleted('email') ? 'fa-check-circle' : 'fa-plus-circle'}`}></i>
                                Email Address
                            </li>
                            <li className={isFieldCompleted('phone') ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                <i className={`fas ${isFieldCompleted('phone') ? 'fa-check-circle' : 'fa-plus-circle'}`}></i>
                                Phone Number
                            </li>
                            <li className={isFieldCompleted('employment_type') ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                <i className={`fas ${isFieldCompleted('employment_type') ? 'fa-check-circle' : 'fa-plus-circle'}`}></i>
                                Employment Type
                            </li>
                            <li className={isFieldCompleted('position') ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                <i className={`fas ${isFieldCompleted('position') ? 'fa-check-circle' : 'fa-plus-circle'}`}></i>
                                Job Title / Position
                            </li>
                            <li className={isFieldCompleted('company') ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                <i className={`fas ${isFieldCompleted('company') ? 'fa-check-circle' : 'fa-plus-circle'}`}></i>
                                Company
                            </li>
                            <li className={isFieldCompleted('education') ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                <i className={`fas ${isFieldCompleted('education') ? 'fa-check-circle' : 'fa-plus-circle'}`}></i>
                                Education
                            </li>
                            <li className={isFieldCompleted('bio') ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                <i className={`fas ${isFieldCompleted('bio') ? 'fa-check-circle' : 'fa-plus-circle'}`}></i>
                                Professional Bio
                            </li>
                            <li className={isFieldCompleted('location') ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                <i className={`fas ${isFieldCompleted('location') ? 'fa-check-circle' : 'fa-plus-circle'}`}></i>
                                Location (City/Address)
                            </li>
                            <li className={isFieldCompleted('linkedin') ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                <i className={`fas ${isFieldCompleted('linkedin') ? 'fa-check-circle' : 'fa-plus-circle'}`}></i>
                                LinkedIn Profile
                            </li>
                            <li className={isFieldCompleted('github') ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                <i className={`fas ${isFieldCompleted('github') ? 'fa-check-circle' : 'fa-plus-circle'}`}></i>
                                GitHub Profile
                            </li>
                            <li className={isFieldCompleted('portfolio') ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                <i className={`fas ${isFieldCompleted('portfolio') ? 'fa-check-circle' : 'fa-plus-circle'}`}></i>
                                Portfolio / Website
                            </li>
                            <li className={hasCV ? 'done' : ''} onClick={() => router.visit('/cv')}>
                                <i className={`fas ${hasCV ? 'fa-check-circle' : 'fa-plus-circle'}`}></i>
                                CV / Resume Uploaded
                            </li>
                        </ul>
                    </div>

                    <div className="tracker">
                        <h3>
                            <i className="fas fa-chart-line"></i>
                            Application Tracker
                        </h3>
                        <div className="tracker-grid">
                            <div className="tracker-box blue">
                                <i className="fas fa-file-alt"></i>
                                <h2>{stats.applied || 0}</h2>
                                <p>Applied</p>
                            </div>
                            <div className="tracker-box orange">
                                <i className="fas fa-clock"></i>
                                <h2>{stats.review || 0}</h2>
                                <p>Under Review</p>
                            </div>
                            <div className="tracker-box green">
                                <i className="fas fa-calendar-check"></i>
                                <h2>{stats.interview || 0}</h2>
                                <p>Interview</p>
                            </div>
                            <div className="tracker-box red">
                                <i className="fas fa-times-circle"></i>
                                <h2>{stats.rejected || 0}</h2>
                                <p>Rejected</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </>
    );
}