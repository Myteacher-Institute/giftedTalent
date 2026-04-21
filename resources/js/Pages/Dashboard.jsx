import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppNavbar from '../Components/AppNavbar';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
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
        <div className="job-card">
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
                        <button onClick={handleSaveClick}>
                            <i className="fa-regular fa-bookmark"></i> {saved ? 'Unsave Job' : 'Save Job'}
                        </button>
                        <button onClick={handleApplyClick} disabled={applying}>
                            <i className="fa-regular fa-paper-plane"></i> {applying ? 'Applying...' : 'Apply Now'}
                        </button>
                        <button onClick={() => setShowMenu(null)}>
                            <i className="fa-regular fa-eye-slash"></i> Hide Job
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
    const [clientFilteredJobs, setClientFilteredJobs] = useState([]);

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

    // Filter jobs client-side
    useEffect(() => {
        let filtered = [...jobs];
        
        if (searchQuery) {
            filtered = filtered.filter(job => 
                job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        if (selectedJobType) {
            filtered = filtered.filter(job => job.job_type === selectedJobType);
        }
        
        setClientFilteredJobs(filtered);
    }, [searchQuery, selectedJobType, jobs]);

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

    const noResults = clientFilteredJobs.length === 0 && jobs.length === 0 && recommendedJobs.length === 0;

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
                const allJobs = [...jobs, ...recommendedJobs];
                const jobToAdd = allJobs.find(job => job.id === jobId);
                if (jobToAdd && !localSavedJobs.some(saved => saved.id === jobId)) {
                    setLocalSavedJobs([...localSavedJobs, jobToAdd]);
                    setSavedJobsCount(savedJobsCount + 1);
                }
                alertify.success('Job saved successfully!');
            } else {
                const data = await response.json();
                alertify.error(data.message || 'Failed to save job');
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
        <AuthenticatedLayout user={auth.user}>
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
                        <img src={auth.user.profile?.avatar_url || `https://i.pravatar.cc/40?img=${auth.user.id}`} alt="" />
                        <h3>{auth.user.name}</h3>
                        <p>{auth.user.profile?.position || 'Add position'}</p>
                        <button>
                            <Link href="/profile" className="profile-button">Edit Profile</Link>
                        </button>
                    </div>

                    <ul className="menu">
                        <li className="active"><i className="fa-solid fa-table"></i>Dashboard</li>
                        <li><Link href="/search-jobs"><i className="fa-solid fa-magnifying-glass"></i> Search Job</Link></li>
                        <li className={showAppliedJobs ? 'active' : ''} onClick={handleShowAppliedJobs}>
                            <i className="fa-solid fa-file"></i> My Applications
                        </li>
                        <li>
                            <Link href="/messages">
                                <i className="fa-regular fa-envelope"></i> Messages
                            </Link>
                        </li>
                        <li onClick={handleShowSavedJobs} style={{ position: 'relative', cursor: 'pointer' }}>
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
                            <div className="flex justify-between items-center mb-4">
                                <h1>My Applications</h1>
                                <button onClick={handleShowAllJobs} className="back-button">
                                    ← Back to Dashboard
                                </button>
                            </div>
                            {loadingApplied ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                </div>
                            ) : appliedJobs.length > 0 ? (
                                <div className="jobs">
                                    {appliedJobs.map((job) => (
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
                                <span className={hasCV ? "success" : ""}>
                                    {hasCV ? '✓ CV Uploaded' : 'Upload CV'}
                                </span>
                                <span>Skills: {currentUser?.skills?.slice(0, 2).map(s => s.name).join(', ') || 'No skills added'}</span>
                                <span>Bio: {currentUser?.profile?.bio ? currentUser.profile.bio.substring(0, 50) + '...' : 'Add bio'}</span>
                                <button><Link href="/cv" className="status-button">Upload Your CV</Link></button>
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
                            {clientFilteredJobs.length > 0 && (
                                <div className="jobs-section">
                                    <h2>{searchQuery ? `Search Results for "${searchQuery}"` : 'Other Available Jobs'}</h2>
                                    <div className="jobs">
                                        {clientFilteredJobs.map((job) => (
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
                            {!loading && recommendedJobs.length === 0 && clientFilteredJobs.length === 0 && jobs.length === 0 && (
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

                        <div className="progress-circle">
                            <div className="flex flex-col items-center">
                                <h2 className="text-2xl font-bold text-indigo-600 mb-1">{profileComplete}%</h2>
                                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Complete</span>
                            </div>
                        </div>
                        <ul>
                            <li className={profileStatus.status?.portfolio ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                {profileStatus.status?.portfolio ? '✓ Portfolio Added' : '➤ Add Portfolio Link'}
                            </li>
                            <li className={profileStatus.status?.experience ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                {profileStatus.status?.experience ? '✓ Experience Added' : '➤ Update Experience'}
                            </li>
                            <li className={profileStatus.status?.email_verified ? 'done' : ''}>
                                {profileStatus.status?.email_verified ? '✓ Email Verified' : '➤ Verify Email'}
                            </li>
                            <li className={profileStatus.status?.skills ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                {profileStatus.status?.skills ? '✓ Skills Added' : '➤ Add Skills'}
                            </li>
                        </ul>
                    </div>

                    <div className="tracker">
                        <h3>Application Tracker</h3>

                        <div className="grid">
                            <div className="box blue">
                                <h2>{stats.applied}</h2>
                                <p>Applied</p>
                            </div>

                            <div className="box orange">
                                <h2>{stats.review}</h2>
                                <p>Under Review</p>
                            </div>

                            <div className="box green">
                                <h2>{stats.interview}</h2>
                                <p>Interview</p>
                            </div>

                            <div className="box red">
                                <h2>{stats.rejected}</h2>
                                <p>Rejected</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </AuthenticatedLayout>
    );
}