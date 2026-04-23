import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import '../../css/Dashboard.css';
import Notification from '../Components/Notification';


window.alertify = window.alertify || alertify;

// Job Card Component
function JobCard({ job }) {
    const [showMenu, setShowMenu] = useState(null);

    const toggleMenu = (index) => {
        setShowMenu(showMenu === index ? null : index);
    };

    return (
        <div className="job-card">
            <div className="job-left">
                <img src={job.image} alt="" />
            </div>
            <div className="job-right">
                <h3>{job.company}</h3>
                <p>{job.title}</p>
                <span>{job.tags}</span>
                <p className="time">{job.time}</p>
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
                        <button onClick={() => setShowMenu(null)}>
                            <i className="fa-regular fa-bookmark"></i> Save Job
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

<<<<<<< HEAD
// Message Modal Component
function MessageModal({ isOpen, onClose, messages, loading, onMarkAsRead }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="message-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Messages</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    {loading ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No messages</div>
                    ) : (
                        messages.map(msg => (
                            <div key={msg.id} className="message-item" onClick={() => onMarkAsRead(msg.id)}>
                                <p><strong>{msg.sender}</strong></p>
                                <p className="text-sm text-gray-600">{msg.message}</p>
                            </div>
                        ))
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
    savedJobs = []  // <-- Now receives full job objects from controller
}) {
=======
export default function Dashboard({ auth, profileComplete = 75, profileStatus = {}, stats = { applied: 8, review: 3, interview: 1, rejected: 2 }, jobs = [], jobTypes = [], searchParams = {}, notifications }) {
    const [activeMenu, setActiveMenu] = useState(null);
>>>>>>> 570c33df8fcdd2af22d99b895072e53c9f9a6954
    const [searchQuery, setSearchQuery] = useState(searchParams.q || '');
    const [selectedJobType, setSelectedJobType] = useState(searchParams.job_type || '');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [loading, setLoading] = useState(false);
<<<<<<< HEAD
    const [showAppliedJobs, setShowAppliedJobs] = useState(false);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loadingApplied, setLoadingApplied] = useState(false);
    const [newJobsCount, setNewJobsCount] = useState(0);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [localSavedJobs, setLocalSavedJobs] = useState(savedJobs);  // <-- Use props directly
    const [savedJobsCount, setSavedJobsCount] = useState(savedJobs.length);  // <-- Use prop length
    const [showSavedJobs, setShowSavedJobs] = useState(false);
    const [loadingSaved, setLoadingSaved] = useState(false);
    
    // State for sidebar toggle
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const currentUser = auth?.user;

    // Function to toggle sidebar
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Flash message effect
=======
    const [clientFilteredJobs, setClientFilteredJobs] = useState(jobs);

    // Debounce search
>>>>>>> 570c33df8fcdd2af22d99b895072e53c9f9a6954
    useEffect(() => {
        const timer = setTimeout(() => {
            let filtered = jobs;
            if (searchQuery) {
                filtered = filtered.filter(job => 
                    job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    job.tags?.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            if (selectedJobType) {
                filtered = filtered.filter(job => job.type === selectedJobType);
            }
            setClientFilteredJobs(filtered);
        }, 300);
        return () => clearTimeout(timer);
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
<<<<<<< HEAD
=======

    const handleJobTypeClick = () => {
        console.log('Job Type clicked');
    };
>>>>>>> 570c33df8fcdd2af22d99b895072e53c9f9a6954

    const noResults = clientFilteredJobs.length === 0 && jobs.length === 0;

    const handleLogout = () => {
        router.post('/logout');
    };

<<<<<<< HEAD
    const fetchAppliedJobs = () => {
        setLoadingApplied(true);
        setTimeout(() => {
            setAppliedJobs([]);
            setLoadingApplied(false);
        }, 500);
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

    // <-- SIMPLIFIED: Save job to database
    const handleSaveJob = async (jobId) => {
        try {
            const response = await fetch(`/saved-jobs/${jobId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
            });
            
            if (response.ok) {
                // Find the job from existing lists to add to saved
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

    // <-- SIMPLIFIED: Unsave job from database
    const handleUnsaveJob = async (jobId) => {
        try {
            const response = await fetch(`/saved-jobs/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
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

    const fetchUnreadCount = () => {
        setUnreadCount(0);
    };

    const fetchMessages = () => {
        setLoadingMessages(true);
        setTimeout(() => {
            setMessages([]);
            setLoadingMessages(false);
        }, 500);
    };

    const handleOpenMessages = () => {
        setShowMessageModal(true);
        fetchMessages();
    };

    const markMessageAsRead = (messageId) => {
        console.log('Mark message as read:', messageId);
    };

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

=======
>>>>>>> 570c33df8fcdd2af22d99b895072e53c9f9a6954
    useEffect(() => {
        const hasShown = localStorage.getItem('profileCompleteShown');
        if (profileComplete === 100 && !hasShown) {
            alertify.success('Congratulations! Your profile is 100% complete!', 3);
            localStorage.setItem('profileCompleteShown', 'true');
        }
    }, [profileComplete]);

<<<<<<< HEAD
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

    // Other jobs (regular jobs from the jobs array)
    const otherJobs = jobs.filter(job => !job.match_score || job.match_score < 60);
    const hasCV = currentUser?.resumes?.length > 0;
    const cvCount = currentUser?.resumes?.length || 0;

=======
>>>>>>> 570c33df8fcdd2af22d99b895072e53c9f9a6954
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

<<<<<<< HEAD
            {/* AppNavbar Component - With sidebar toggle props */}
            <AppNavbar 
                user={currentUser} 
                newJobsCount={newJobsCount}
                onMenuToggle={toggleSidebar}
                isMenuOpen={sidebarOpen}
            />

            {/* Mobile Overlay - Shows when sidebar is open on mobile */}
            {sidebarOpen && <div className="mobile-overlay" onClick={toggleSidebar}></div>}

            <div className="container">
                {/* Sidebar - Add mobile-open class for mobile toggle */}
                <aside className={`sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
=======
            <header className="navbar">
                <div className="logo">
                    <span className="blue">GiftedTalents</span>.Online
                </div>

                <nav>
                    <Link href="/">Home</Link>
                    <Link href="/search-jobs">Jobs</Link>
                    <Link href="#">Explore</Link>
                    <Link href="#">Hire</Link>
                </nav>

                <div className="search">
                    <input type="text" placeholder="search for jobs..." />
                </div>

                <div className="nav-icons">
                    <i className="fa-regular fa-comment"></i>
                    <Notification />
                    <img src={auth.user.profile?.avatar_url || `https://i.pravatar.cc/40?img=${auth.user.id}`} alt="" />
                </div>
            </header>

            <div className="container">
                <aside className="sidebar">
>>>>>>> 570c33df8fcdd2af22d99b895072e53c9f9a6954
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
                        <li><i className="fa-solid fa-file"></i> Application</li>
                        <li><i className="fa-regular fa-envelope"></i> Message</li>
                        <li><i className="fa-regular fa-bookmark"></i> Save Jobs</li>
                        <li><i className="fa-solid fa-gear"></i> Settings</li>
                        <li className="logout-item">
                            <a href="/" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                                <i className="fa-solid fa-right-from-bracket logout-icon"></i>
                                Logout
                            </a>
                        </li>

                        
                    </ul>
                </aside>

                <main className="main">
<<<<<<< HEAD
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
                                        <JobCard key={job.id} job={job} onSave={handleSaveJob} onUnsave={handleUnsaveJob} isSaved={false} />
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
=======
                    <h1>Welcome back, {auth.user.name.split(' ')[0]}</h1>
>>>>>>> 570c33df8fcdd2af22d99b895072e53c9f9a6954

                    <div className="status-bar">
                        <span className="success">{auth.user.resumes?.length > 0 ? 'CV Uploaded' : 'Upload CV'}</span>
                        <span>Skills: {auth.user.skills?.slice(0, 2).map(s => s.name).join(', ') || 'No skills added'}</span>
                        <span>Bio: {auth.user.profile?.bio ? auth.user.profile.bio.substring(0, 50) + '...' : 'Add bio'}</span>
                        <button><Link href="/cv" className="status-button">Upload Your CV</Link></button>
                    </div>

<<<<<<< HEAD
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
=======
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
                            {searchQuery || selectedJobType ? (
                                <button 
                                    type="button" 
                                    onClick={clearSearch}
                                    className="px-4 py-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-all"
                                >
                                    Clear
                                </button>
>>>>>>> 570c33df8fcdd2af22d99b895072e53c9f9a6954
                            ) : null}
                        </form>
                    </div>

                    {showAdvanced && (
                        <div className="advanced-filter-modal bg-white p-6 rounded-xl shadow-2xl border border-gray-200 max-w-md mx-auto mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Advanced Filter</h3>
                                <button onClick={toggleAdvanced} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
                            </div>
<<<<<<< HEAD

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
=======
                            <div className="space-y-4">
                                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <option>Location</option>
                                </select>
                                <input type="range" min="0" max="200" className="w-full" />
                                <span>$0 - $200k</span>
                            </div>
                        </div>
>>>>>>> 570c33df8fcdd2af22d99b895072e53c9f9a6954
                    )}

                    <h2>{searchQuery ? `Search Results for "${searchQuery}"` : 'Recommended Jobs'}</h2>

                    <div className="jobs">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                            </div>
                        ) : noResults ? (
                            <div className="text-center py-16 px-8">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl flex items-center justify-center">
                                    <i className="fa-solid fa-magnifying-glass text-3xl text-yellow-500"></i>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Sorry, no matching jobs</h3>
                                <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
                                    No admin-posted jobs match your search. We'll notify you when available. Thanks for your patience!
                                </p>
                                <button 
                                    onClick={clearSearch}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg font-semibold"
                                >
                                    Browse All Jobs
                                </button>
                            </div>
                        ) : (
                            clientFilteredJobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))
                        )}
                    </div>
                </main>

                <aside className="right-panel">
                    <div className="progress-card">
                        <h3>Complete Your Profile</h3>

                        <div className="progress-circle" style={{ '--progress': `${profileComplete / 100}` }}>
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
<<<<<<< HEAD

            {/* Message Modal */}
            <MessageModal
                isOpen={showMessageModal}
                onClose={() => setShowMessageModal(false)}
                messages={messages}
                loading={loadingMessages}
                onMarkAsRead={markMessageAsRead}
            />
        </>
=======
        </AuthenticatedLayout>
>>>>>>> 570c33df8fcdd2af22d99b895072e53c9f9a6954
    );
}

