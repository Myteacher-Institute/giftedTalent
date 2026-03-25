import '../../css/search-job.css';
import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function SearchJob({ auth, initialJobs = [], savedJobs: initialSavedJobs = [] }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [jobs, setJobs] = useState(initialJobs);
    const [filteredJobs, setFilteredJobs] = useState(initialJobs);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [savedJobs, setSavedJobs] = useState(initialSavedJobs);
    const [visibleCounts, setVisibleCounts] = useState({
        topPicks: 5,
        explore: 4
    });
    const [notificationCount, setNotificationCount] = useState(0);

    // Filter jobs when search term changes
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredJobs(jobs);
        } else {
            const filtered = jobs.filter(job => 
                job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredJobs(filtered);
        }
    }, [searchTerm, jobs]);

    const fetchNotificationCount = async () => {
        try {
            const response = await axios.get('/api/notifications/count');
            setNotificationCount(response.data.count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSaveJob = async (jobId) => {
        try {
            if (savedJobs.includes(jobId)) {
                // Unsave job
                await axios.delete(`/api/jobs/${jobId}/save`);
                const updated = savedJobs.filter(id => id !== jobId);
                setSavedJobs(updated);
                alert('Job removed from saved');
            } else {
                // Save job
                await axios.post(`/api/jobs/${jobId}/save`);
                const updated = [...savedJobs, jobId];
                setSavedJobs(updated);
                alert('Job saved successfully!');
            }
        } catch (error) {
            console.error('Error saving job:', error);
            alert('Failed to save job. Please try again.');
        }
    };

    const handleEasyApply = async (job) => {
        try {
            const response = await axios.post(`/api/jobs/${job.id}/apply`, {
                job_id: job.id,
                user_id: auth.user.id
            });
            
            if (response.data.success) {
                alert(`Successfully applied to ${job.title} at ${job.company}!`);
            }
        } catch (error) {
            console.error('Error applying to job:', error);
            alert('Failed to apply. Please try again.');
        }
    };

    const handleDismissJob = (jobId) => {
        const updatedJobs = filteredJobs.filter(job => job.id !== jobId);
        setFilteredJobs(updatedJobs);
    };

    const handleShowMore = (section) => {
        if (section === 'topPicks') {
            setVisibleCounts(prev => ({
                ...prev,
                topPicks: prev.topPicks + 5
            }));
        } else {
            setVisibleCounts(prev => ({
                ...prev,
                explore: prev.explore + 4
            }));
        }
    };

    const handleMenuClick = (route) => {
        router.visit(route);
    };

    const handleJobClick = (jobId) => {
        router.visit(`/jobs/${jobId}`);
    };

    const handleAvatarClick = () => {
        router.visit('/profile');
    };

    const handleNotificationClick = () => {
        router.visit('/notifications');
    };

    const handleMessageClick = () => {
        router.visit('/messages');
    };

    const handleLogoClick = () => {
        router.visit('/dashboard');
    };

    const handleNavClick = (page) => {
        if (page === 'Home') router.visit('/dashboard');
        if (page === 'Jobs') router.visit('/search-job');
        if (page === 'Explore') router.visit('/explore');
        if (page === 'Hire') router.visit('/hire');
    };

    // Split jobs into two sections (you can customize this logic)
    const topPicksJobs = filteredJobs.slice(0, visibleCounts.topPicks);
    const exploreJobs = filteredJobs.slice(visibleCounts.topPicks, visibleCounts.topPicks + visibleCounts.explore);

    // Loading skeleton
    const LoadingSkeleton = () => (
        <>
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="job" style={{ opacity: 1 }}>
                    <div className="job-company-icon" style={{ background: '#e2e8f0' }}></div>
                    <div className="job-info" style={{ flex: 1 }}>
                        <div style={{ height: '24px', background: '#e2e8f0', width: '60%', marginBottom: '12px', borderRadius: '4px' }}></div>
                        <div style={{ height: '20px', background: '#e2e8f0', width: '40%', marginBottom: '8px', borderRadius: '4px' }}></div>
                        <div style={{ height: '16px', background: '#e2e8f0', width: '80%', borderRadius: '4px' }}></div>
                    </div>
                </div>
            ))}
        </>
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Search Jobs" />

            {/* NAVBAR */}
            <nav className="navbar">
                <div className="logo" onClick={handleLogoClick}>
                    <span className="bold">GiftedTalents</span><span className="blue">.online</span>
                </div>

                <button 
                    className="hamburger md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    ☰
                </button>

                <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    <li onClick={() => handleNavClick('Home')}>Home</li>
                    <li className="active" onClick={() => handleNavClick('Jobs')}>Jobs</li>
                    <li onClick={() => handleNavClick('Explore')}>Explore</li>
                    <li onClick={() => handleNavClick('Hire')}>Hire</li>
                </ul>

                <div className="nav-right">
                    <div className="search-container">
                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.601 10.601z" />
                        </svg>
                        <input 
                            className="search" 
                            placeholder="Search for jobs..." 
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    <div className="icon-group">
                        <i 
                            className="fa-solid fa-envelope message-icon text-gray-600 hover:text-blue-600 text-xl"
                            onClick={handleMessageClick}
                            style={{ cursor: 'pointer' }}
                        ></i>

                        <i 
                            className="fa-solid fa-bell notification-icon relative"
                            onClick={handleNotificationClick}
                            style={{ cursor: 'pointer', position: 'relative' }}
                        >
                            {notificationCount > 0 && (
                                <div className="notification-badge" style={{ 
                                    position: 'absolute', 
                                    top: '-5px', 
                                    right: '-5px',
                                    background: '#ef4444',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    fontSize: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {notificationCount}
                                </div>
                            )}
                        </i>
                    </div>

                    <img 
                        src={auth.user?.avatar || "https://i.pravatar.cc/40"} 
                        alt="User avatar" 
                        className="avatar" 
                        onClick={handleAvatarClick}
                    />
                </div>
            </nav>

            <div className="container">
                {/* LEFT SIDEBAR */}
                <div className="left">
                    {/* PROFILE CARD */}
                    <div className="profile-card">
                        <div className="cover"></div>
                        <img 
                            src={auth.user?.avatar || "https://i.pravatar.cc/100"} 
                            alt="profile" 
                            className="profile-img" 
                        />
                        <div className="profile-info">
                            <h3>{auth.user?.name?.toUpperCase() || 'USER NAME'}</h3>
                            <p>{auth.user?.headline || 'Software Engineer'}</p>
                            <span>{auth.user?.location || 'Location not set'}</span>
                        </div>
                    </div>

                    {/* MENU */}
                    <div className="menu-card">
                        <div className="menu-item" onClick={() => handleMenuClick('/references')}>
                            <i className="fa-solid fa-file-lines"></i> References
                        </div>
                        <div className="menu-item" onClick={() => handleMenuClick('/job-tracker')}>
                            <i className="fa-solid fa-bookmark"></i> Job Tracker
                        </div>
                        <div className="menu-item" onClick={() => handleMenuClick('/career-insight')}>
                            <i className="fa-solid fa-chart-line"></i> Career Insight
                        </div>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="right">
                    {/* JOB PICKS */}
                    <div className="card">
                        <div className="card-header">
                            <h3>Top Jobs picks for you</h3>
                            <p>Based on your profile, preferences, and activity like applies and saves</p>
                        </div>

                        {loading ? (
                            <LoadingSkeleton />
                        ) : topPicksJobs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                No jobs found. Try adjusting your search.
                            </div>
                        ) : (
                            topPicksJobs.map((job, index) => (
                                <div className="job" key={job.id} style={{ cursor: 'pointer' }}>
                                    <i className="fa-solid fa-building job-company-icon" title="Company"></i>
                                    <div className="job-info" onClick={() => handleJobClick(job.id)}>
                                        <h4>{job.title}</h4>
                                        <p>{job.company}. {job.location}</p>
                                        <span>{job.tags?.join(' • ') || job.job_type}</span>
                                        <div className="job-meta">
                                            <span>{job.posted_at}</span>
                                            {job.easy_apply && (
                                                <span 
                                                    className="easy-apply-span" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEasyApply(job);
                                                    }}
                                                >
                                                    Easy Apply <i className="fa-solid fa-paper-plane ml-1"></i>
                                                </span>
                                            )}
                                            <span 
                                                className={`save-job-span ${savedJobs.includes(job.id) ? 'saved' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSaveJob(job.id);
                                                }}
                                            >
                                                {savedJobs.includes(job.id) ? 'Saved' : 'Save Job'} 
                                                <i className="fa-solid fa-bookmark ml-1"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <i 
                                        className="fa-solid fa-times-circle close" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDismissJob(job.id);
                                        }}
                                    ></i>
                                </div>
                            ))
                        )}

                        {!loading && filteredJobs.length > visibleCounts.topPicks && (
                            <div className="show" onClick={() => handleShowMore('topPicks')}>
                                <i className="fa-solid fa-arrow-down mr-2"></i>Show All
                            </div>
                        )}
                    </div>

                    {/* JOB COLLECTION */}
                    <div className="card">
                        <div className="card-header">
                            <h3>Explore with job collections</h3>
                            <p>Designer | Easy Apply | Remote</p>
                        </div>

                        {loading ? (
                            <LoadingSkeleton />
                        ) : exploreJobs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                No more jobs to explore.
                            </div>
                        ) : (
                            exploreJobs.map((job) => (
                                <div className="job" key={job.id} style={{ cursor: 'pointer' }}>
                                    <i className="fa-solid fa-building job-company-icon" title="Company"></i>
                                    <div className="job-info" onClick={() => handleJobClick(job.id)}>
                                        <h4>{job.title}</h4>
                                        <p>{job.company}. {job.location}</p>
                                        <span>{job.tags?.join(' • ') || job.job_type}</span>
                                        <div className="job-meta">
                                            <span>{job.posted_at}</span>
                                            {job.easy_apply && (
                                                <span 
                                                    className="easy-apply-span"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEasyApply(job);
                                                    }}
                                                >
                                                    Easy Apply <i className="fa-solid fa-paper-plane ml-1"></i>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <i 
                                        className="fa-solid fa-times-circle close"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDismissJob(job.id);
                                        }}
                                    ></i>
                                </div>
                            ))
                        )}

                        {!loading && filteredJobs.length > visibleCounts.topPicks + visibleCounts.explore && (
                            <div className="show" onClick={() => handleShowMore('explore')}>
                                <i className="fa-solid fa-arrow-down mr-2"></i>Show All
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}