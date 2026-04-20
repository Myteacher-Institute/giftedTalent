import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppNavbar from '../Components/AppNavbar';
import '../../css/Dashboard.css';
import Notification from '../Components/Notification';


window.alertify = window.alertify || alertify;

// Job Card Component
function JobCard({ job, onSave, onUnsave, onApply, isSaved = false }) {
    const [showMenu, setShowMenu] = useState(null);
    const [saved, setSaved] = useState(isSaved);
    const [applying, setApplying] = useState(false);

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

    return (
        <div className={`job-card ${job.match_score >= 60 ? 'recommended-job' : ''}`}>
            <div className="job-left">
                <img src={job.image || job.company_logo_url} alt="" />
            </div>
            <div className="job-right">
                <h3>{job.company_name || job.company}</h3>
                <p>{job.job_title || job.title}</p>
                <span>{job.tags || job.job_type}</span>
                <p className="time">{job.time || job.posted_at}</p>
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
                <button 
                    className="apply desktop-only" 
                    onClick={handleApplyClick}
                    disabled={applying}
                >
                    {applying ? 'Applying...' : 'Apply Now'}
                </button>
                <div className="menu-trigger" onClick={() => toggleMenu(job.id)}>
                    <i className="fa-solid fa-ellipsis"></i>
                </div>
                {showMenu === job.id && (
                    <div className="dropdown-menu">
                        <button onClick={() => setShowMenu(null)}>
                            <i className="fa-regular fa-eye-slash"></i> Hide Job
                        </button>
                        <button onClick={handleApplyClick} disabled={applying}>
                            <i className="fa-regular fa-paper-plane"></i> {applying ? 'Applying...' : 'Apply Now'}
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
    const [showAppliedJobs, setShowAppliedJobs] = useState(false);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loadingApplied, setLoadingApplied] = useState(false);
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
        if (profile?.profile_image_base64) {
            return profile.profile_image_base64;
        }
        if (currentUser?.profile?.profile_image_base64) {
            return currentUser.profile.profile_image_base64;
        }
        if (currentUser?.profile?.avatar_url) {
            return currentUser.profile.avatar_url;
        }
        if (currentUser?.profile?.avatar) {
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
        if (profile?.avatar_url) {
            return profile.avatar_url;
        }
        if (profile?.avatar) {
            if (profile.avatar.startsWith('data:image')) {
                return profile.avatar;
            }
            return `/storage/${profile.avatar}`;
        }
        if (currentUser?.avatar) {
            if (currentUser.avatar.startsWith('data:image')) {
                return currentUser.avatar;
            }
            return currentUser.avatar;
        }
        const userName = currentUser?.name || 'User';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=150&bold=true`;
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
            const response = await fetch('/my-applications');
            const data = await response.json();
            if (data.success) {
                setAppliedJobs(data.data);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
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

    const handleShowSavedJobs = () => {
        setShowAppliedJobs(false);
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
                        <li className={!showAppliedJobs && !showSavedJobs ? 'active' : ''} onClick={handleShowAllJobs}>
                            <i className="fa-solid fa-table"></i>Dashboard
                        </li>
                        <li><Link href="/search-jobs"><i className="fa-solid fa-magnifying-glass"></i> Search Job</Link></li>
                        <li className={showAppliedJobs ? 'active' : ''} onClick={handleShowAppliedJobs}>
                            <i className="fa-solid fa-file"></i> My Applications
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
                        <li>
                            <Link href="/settings"><i className="fa-solid fa-gear"></i> Settings</Link>
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
                    ) : showAppliedJobs ? (
                        <>
                            <h1>My Applications</h1>
                            {loadingApplied ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                </div>
                            ) : appliedJobs.length > 0 ? (
                                <div className="jobs">
                                    {appliedJobs.map((job) => (
                                        <JobCard key={job.id} job={job} onSave={handleSaveJob} onUnsave={handleUnsaveJob} onApply={handleApplyJob} isSaved={false} />
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <i className="fa-solid fa-file"></i>
                                    <h3>No Applications Yet</h3>
                                    <p>You haven't applied to any jobs yet. Start browsing and apply to your first job!</p>
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

                            {profileComplete === 100 ? (
                                <div className="alert-success">
                                    <i className="fa-solid fa-check-circle"></i>
                                    <p>Your profile is 100% complete! <i className="fa-solid fa-party-horn"></i></p>
                                </div>
                            ) : profileComplete > 0 && profileComplete < 100 ? (
                                <div className="alert-warning">
                                    <i className="fa-solid fa-exclamation-triangle"></i>
                                    <p>Complete your profile to get better job recommendations! ({profileComplete}% complete)
                                        <Link href="/profile/edit" className="alert-link">Update Profile →</Link>
                                    </p>
                                </div>
                            ) : null}

                            <div className="search-bar">
                                <form onSubmit={handleSearch}>
                                    <input
                                        type="text"
                                        placeholder="Search for jobs..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <select
                                        value={selectedJobType}
                                        onChange={(e) => setSelectedJobType(e.target.value)}
                                    >
                                        <option value="">All Types</option>
                                        {jobTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                    <button type="button" onClick={toggleAdvanced} className="btn-advanced">
                                        Advanced
                                    </button>
                                    <button type="submit" disabled={loading} className="btn-search">
                                        {loading ? 'Searching...' : 'Search'}
                                    </button>
                                    {(searchQuery || selectedJobType) && (
                                        <button type="button" onClick={clearSearch} className="btn-clear">
                                            Clear
                                        </button>
                                    )}
                                </form>
                            </div>

                            {showAdvanced && (
                                <div className="advanced-filter-modal">
                                    <div className="advanced-filter-content">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3>Advanced Filter</h3>
                                            <button onClick={toggleAdvanced} className="close-btn">×</button>
                                        </div>
                                        <select className="filter-select">
                                            <option>Location</option>
                                        </select>
                                        <input type="range" min="0" max="200" className="w-full" />
                                        <span>$0 - $200k</span>
                                    </div>
                                </div>
                            )}

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
                        <div className="progress-circle" style={{ '--progress': `${profileComplete}` }}>
                            <div className="progress-percent">
                                <h2>{profileComplete}%</h2>
                                <span>Complete</span>
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
                        <h3>Application Tracker</h3>
                        <div className="tracker-grid">
                            <div className="tracker-box blue">
                                <h2>{stats.applied || 0}</h2>
                                <p>Applied</p>
                            </div>
                            <div className="tracker-box orange">
                                <h2>{stats.review || 0}</h2>
                                <p>Under Review</p>
                            </div>
                            <div className="tracker-box green">
                                <h2>{stats.interview || 0}</h2>
                                <p>Interview</p>
                            </div>
                            <div className="tracker-box red">
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