import React, { useState, useEffect } from 'react';
import AppNavbar from '../Components/AppNavbar';
import '../../css/Dashboard.css';
import '../../css/search-job.css';
import { Head, router } from '@inertiajs/react';

export default function SearchJob({ auth, profile, recommendedJobs = [], exploreJobs = [], savedJobs: initialSavedJobs = [] }) {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    // Combine all jobs for filtering
    const allJobs = [...recommendedJobs, ...exploreJobs];
    const [jobs, setJobs] = useState(allJobs);
    const [filteredJobs, setFilteredJobs] = useState(allJobs);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [savedJobs, setSavedJobs] = useState(initialSavedJobs);
    const [visibleCounts, setVisibleCounts] = useState({
        topPicks: 5,
        explore: 4
    });
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        setJobs([...recommendedJobs, ...exploreJobs]);
        setFilteredJobs([...recommendedJobs, ...exploreJobs]);
    }, [recommendedJobs, exploreJobs]);

    // Job Type Filter
    const [activeFilter, setActiveFilter] = useState('all');
    const [jobTypes] = useState(['All', 'Full-time', 'Remote', 'Contract', 'Part-time', 'Internship']);

    // Quick Filters
    const [quickFilters, setQuickFilters] = useState({
        remoteOnly: false,
        easyApply: false,
        urgentFeatured: false
    });

    // Experience Level
    const [experienceLevel, setExperienceLevel] = useState('all');
    const [experienceLevels] = useState(['All', 'Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Manager']);

    // Sorting
    const [sortBy, setSortBy] = useState('relevance');
    const [sortOptions] = useState([
        { value: 'relevance', label: 'Relevance' },
        { value: 'newest', label: 'Newest' },
        { value: 'highest_salary', label: 'Highest Salary' }
    ]);

    // Match Percentage State
    const [matchPercentages, setMatchPercentages] = useState({});

    // Salary Range Filter
    const [salaryRange, setSalaryRange] = useState([0, 200000]);

    // Quick Apply Modal
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [selectedResume, setSelectedResume] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Job Alert Modal
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertSettings, setAlertSettings] = useState({
        daily: false,
        weekly: false,
        instant: false
    });

    // Toast notification state
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const currentUser = auth?.user;

    // Get profile data - prioritize the passed profile prop
    const userProfile = profile || currentUser?.profile || {};

    // Get profile image URL with base64 support
    const getProfileImageUrl = () => {
        if (profile?.profile_image_base64 && typeof profile.profile_image_base64 === 'string') {
            return profile.profile_image_base64;
        }
        if (currentUser?.profile?.profile_image_base64 && typeof currentUser.profile.profile_image_base64 === 'string') {
            return currentUser.profile.profile_image_base64;
        }
        if (currentUser?.profile?.avatar_url && typeof currentUser.profile.avatar_url === 'string') {
            return currentUser.profile.avatar_url;
        }
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
        const userName = currentUser?.name || 'User';
        return `https://ui-avatars.com/api/?background=667eea&color=fff&size=100&name=${encodeURIComponent(userName)}`;
    };

    // Get user display name
    const getDisplayName = () => {
        return currentUser?.name?.toUpperCase() || 'USER NAME';
    };

    // Get user position/title
    const getUserPosition = () => {
        return userProfile?.position ||
            userProfile?.title ||
            currentUser?.headline ||
            currentUser?.position ||
            'Software Engineer';
    };

    // Get user location
    const getUserLocation = () => {
        return userProfile?.city ||
            userProfile?.address ||
            currentUser?.location ||
            'Location not set';
    };

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ ...toast, show: false });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    // Close mobile sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                mobileSidebarOpen &&
                !e.target.closest('.left') &&
                !e.target.closest('.mobile-menu-toggle') &&
                !e.target.closest('.hamburger') &&
                !e.target.closest('.hamburger-container')
            ) {
                setMobileSidebarOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [mobileSidebarOpen]);

    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        if (mobileSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileSidebarOpen]);

    const toggleMobileSidebar = () => {
        setMobileSidebarOpen(!mobileSidebarOpen);
    };

    // Calculate match percentage for each job based on user skills
    useEffect(() => {
        if (currentUser?.skills && jobs.length > 0) {
            const percentages = {};
            const userSkills = currentUser.skills.map(s => String(s).toLowerCase());

            jobs.forEach(job => {
                const jobSkills = (job.tags || []).map(t => String(t).toLowerCase());
                const matchingSkills = jobSkills.filter(skill => userSkills.includes(skill));
                const percentage = jobSkills.length > 0
                    ? Math.round((matchingSkills.length / jobSkills.length) * 100)
                    : job.match_score || 0;
                percentages[job.id] = percentage;
            });

            setMatchPercentages(percentages);
        }
    }, [jobs, currentUser?.skills]);

    // Filter and Sort jobs
    useEffect(() => {
        let filtered = [...jobs];

        if (searchTerm.trim() !== '') {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(job => {
                const title = job.title ? String(job.title).toLowerCase() : '';
                const company = job.company ? String(job.company).toLowerCase() : '';
                const location = job.location ? String(job.location).toLowerCase() : '';
                const tags = (job.tags || []).some(tag => String(tag).toLowerCase().includes(searchLower));
                
                return title.includes(searchLower) || 
                       company.includes(searchLower) || 
                       location.includes(searchLower) || 
                       tags;
            });
        }

        if (activeFilter !== 'all' && activeFilter !== 'All') {
            filtered = filtered.filter(job => {
                const jobType = job.job_type ? String(job.job_type) : '';
                const tags = (job.tags || []).some(tag => String(tag) === activeFilter);
                return jobType === activeFilter || tags;
            });
        }

        if (quickFilters.remoteOnly) {
            filtered = filtered.filter(job => {
                const location = job.location ? String(job.location).toLowerCase() : '';
                const jobType = job.job_type ? String(job.job_type) : '';
                return location.includes('remote') || jobType === 'Remote';
            });
        }

        if (quickFilters.easyApply) {
            filtered = filtered.filter(job => job.easy_apply === true);
        }

        if (quickFilters.urgentFeatured) {
            filtered = filtered.filter(job => job.urgent === true || job.featured === true);
        }

        if (experienceLevel !== 'all' && experienceLevel !== 'All') {
            filtered = filtered.filter(job => {
                const expLevel = job.experience_level ? String(job.experience_level) : '';
                return expLevel === experienceLevel;
            });
        }

        filtered = filtered.filter(job => {
            const salary = job.salary_range || job.salary;
            if (!salary) return true;
            const salaryStr = String(salary);
            const numericSalary = parseInt(salaryStr.replace(/[^0-9]/g, ''));
            return !isNaN(numericSalary) && numericSalary >= salaryRange[0] && numericSalary <= salaryRange[1];
        });

        if (sortBy === 'newest') {
            filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (sortBy === 'highest_salary') {
            filtered.sort((a, b) => {
                const salaryA = parseInt(String(a.salary_range || a.salary || '0').replace(/[^0-9]/g, ''));
                const salaryB = parseInt(String(b.salary_range || b.salary || '0').replace(/[^0-9]/g, ''));
                return salaryB - salaryA;
            });
        } else if (sortBy === 'relevance') {
            filtered.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
        }

        setFilteredJobs(filtered);
    }, [searchTerm, jobs, activeFilter, salaryRange, quickFilters, experienceLevel, sortBy]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            showToast(`Searching for "${searchTerm}"...`, 'info');
        }
    };

    const handleSaveJob = (jobId) => {
        if (savedJobs.includes(jobId)) {
            const updated = savedJobs.filter(id => id !== jobId);
            setSavedJobs(updated);
            showToast('Job removed from saved', 'info');
        } else {
            const updated = [...savedJobs, jobId];
            setSavedJobs(updated);
            showToast('Job saved successfully!', 'success');
        }
    };

    const handleEasyApply = (job) => {
        router.visit(`/easy-apply-job/${job.id}`);
    };

    const handleApplyNow = (job) => {
        if (job.application_link) {
            const url = job.application_link.startsWith('http')
                ? job.application_link
                : job.application_link.startsWith('/')
                    ? job.application_link
                    : `/${job.application_link}`;
            window.open(url, '_blank', 'noopener,noreferrer');
            return;
        }

        showToast('No external apply link available, opening job details instead.', 'info');
        router.visit(`/jobs/${job.id}`);
    };

    const handleSubmitApplication = (e) => {
        e.preventDefault();
        setSubmitting(true);

        setTimeout(() => {
            showToast(`Successfully applied to ${selectedJob.title}!`, 'success');
            setShowApplyModal(false);
            setCoverLetter('');
            setSelectedResume(null);
            setSubmitting(false);
        }, 1000);
    };

    const handleDismissJob = (jobId) => {
        const updatedJobs = filteredJobs.filter(job => job.id !== jobId);
        setFilteredJobs(updatedJobs);
        showToast('Job removed from list', 'info');
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

    const handleSubscribeAlerts = () => {
        showToast('Successfully subscribed to job alerts!', 'success');
        setShowAlertModal(false);
        setAlertSettings({ daily: false, weekly: false, instant: false });
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setActiveFilter('all');
        setSalaryRange([0, 200000]);
        setQuickFilters({ remoteOnly: false, easyApply: false, urgentFeatured: false });
        setExperienceLevel('all');
        setSortBy('relevance');
        showToast('All filters cleared', 'info');
    };

    const handleJobClick = (jobId) => {
        router.visit(`/jobs/${jobId}`);
    };

    const handleQuickFilterChange = (filterName) => {
        setQuickFilters(prev => ({
            ...prev,
            [filterName]: !prev[filterName]
        }));
    };

    const getMatchColor = (percentage) => {
        if (percentage >= 70) return '#10b981';
        if (percentage >= 40) return '#f59e0b';
        return '#ef4444';
    };

    // Use recommendedJobs as top picks and all jobs as the explore section
    const filteredRecommendedJobs = recommendedJobs;
    const filteredExploreJobs = exploreJobs;
    const topPicksJobs = filteredRecommendedJobs.slice(0, visibleCounts.topPicks);
    const exploreJobsList = filteredExploreJobs.slice(0, visibleCounts.explore);

    const LoadingSkeleton = () => (
        <div className="loading-skeleton">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="skeleton-job-item">
                    <div className="skeleton-icon"></div>
                    <div className="skeleton-content">
                        <div className="skeleton-title"></div>
                        <div className="skeleton-subtitle"></div>
                        <div className="skeleton-text"></div>
                        <div className="skeleton-meta">
                            <div className="skeleton-badge"></div>
                            <div className="skeleton-badge"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <>
            <Head title="Search Jobs" />

            <AppNavbar
                user={currentUser}
                newJobsCount={notificationCount}
                onMenuToggle={toggleMobileSidebar}
                isMenuOpen={mobileSidebarOpen}
            />

            <div className="container">
                {/* LEFT SIDEBAR */}
                <div className={`left ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
                    <div className="sidebar-single-container">
                        <button className="sidebar-close" onClick={toggleMobileSidebar}>
                            <i className="fas fa-times"></i>
                        </button>

                        {/* Profile Section */}
                        <div className="sidebar-profile">
                            <div className="profile-image-wrapper">
                                <img
                                    src={getProfileImageUrl()}
                                    alt="Profile"
                                    className="profile-img"
                                    onError={(e) => {
                                        const userName = currentUser?.name || 'User';
                                        e.target.src = `https://ui-avatars.com/api/?background=667eea&color=fff&size=100&name=${encodeURIComponent(userName)}`;
                                    }}
                                />
                                <div className="verified-badge">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                            </div>
                            <h3 className="profile-name">{getDisplayName()}</h3>
                            <p className="profile-title">{getUserPosition()}</p>
                            <p className="profile-location">
                                <i className="fas fa-map-marker-alt"></i> {getUserLocation()}
                            </p>
                            <button className="edit-profile-btn" onClick={() => router.visit('/profile/edit')}>
                                Edit Profile
                            </button>
                        </div>

                        {/* Menu Items */}
                        <div className="sidebar-menu">
                            <div className="menu-item" onClick={() => router.visit('/')}>
                                <i className="fas fa-home"></i> Home
                            </div>
                            <div className="menu-item" onClick={() => router.visit('/dashboard')}>
                                <i className="fas fa-envelope"></i> Dashboard
                            </div>
                            <div className="menu-item active" onClick={() => router.visit('/jobs')}>
                                <i className="fas fa-briefcase"></i> Jobs
                            </div>
                            <div className="menu-item" onClick={() => router.visit('/explore')}>
                                <i className="fas fa-compass"></i> Explore
                            </div>
                            <div className="menu-item" onClick={() => router.visit('/settings')}>
                                <i className="fas fa-gear"></i> Settings
                            </div>
                            <div className="menu-divider"></div>
                        </div>

                        {/* Filter Section */}
                        <div className="filter-section">
                            <div className="filters-container">
                                <div className="filter-group">
                                    <h4 className="filter-title"><i className="fas fa-briefcase"></i> Job Type</h4>
                                    <div className="job-type-buttons">
                                        {jobTypes.map(type => (
                                            <button
                                                key={type}
                                                className={`job-type-btn ${activeFilter === type ? 'active' : ''}`}
                                                onClick={() => setActiveFilter(type === 'All' ? 'all' : type)}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="filter-group">
                                    <h4 className="filter-title"><i className="fas fa-filter"></i> Quick Filters</h4>
                                    <div className="quick-filters">
                                        <label className="checkbox-item">
                                            <input
                                                type="checkbox"
                                                checked={quickFilters.remoteOnly}
                                                onChange={() => handleQuickFilterChange('remoteOnly')}
                                            />
                                            <span>Remote Only</span>
                                        </label>
                                        <label className="checkbox-item">
                                            <input
                                                type="checkbox"
                                                checked={quickFilters.easyApply}
                                                onChange={() => handleQuickFilterChange('easyApply')}
                                            />
                                            <span>Easy Apply</span>
                                        </label>
                                        <label className="checkbox-item">
                                            <input
                                                type="checkbox"
                                                checked={quickFilters.urgentFeatured}
                                                onChange={() => handleQuickFilterChange('urgentFeatured')}
                                            />
                                            <span>Urgent/Featured</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="filter-group">
                                    <h4 className="filter-title"><i className="fas fa-chart-line"></i> Experience Level</h4>
                                    <div className="experience-buttons">
                                        {experienceLevels.map(level => (
                                            <button
                                                key={level}
                                                className={`experience-btn ${experienceLevel === level ? 'active' : ''}`}
                                                onClick={() => setExperienceLevel(level === 'All' ? 'all' : level)}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="filter-group">
                                    <div className="salary-range">
                                        <div className="salary-header">
                                            <span><i className="fas fa-dollar-sign"></i> Salary Range</span>
                                        </div>
                                        <div className="salary-slider">
                                            <input
                                                type="range"
                                                min="0"
                                                max="200000"
                                                step="5000"
                                                value={salaryRange[1]}
                                                onChange={(e) => setSalaryRange([0, parseInt(e.target.value)])}
                                            />
                                            <div className="salary-values">
                                                <span>₦{salaryRange[0].toLocaleString()}</span>
                                                <span>₦{salaryRange[1].toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Sidebar Overlay */}
                {mobileSidebarOpen && <div className="mobile-sidebar-overlay active" onClick={toggleMobileSidebar}></div>}

                {/* RIGHT CONTENT */}
                <div className="right">
                    <div className="card">
                        <div className="card-header">
                            <h3>Top Jobs picks for you</h3>
                            <p>Based on your profile, preferences, and activity like applies and saves</p>
                        </div>

                        {loading ? (
                            <LoadingSkeleton />
                        ) : topPicksJobs.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-search"></i>
                                <h4>No recommended jobs found</h4>
                                <p>We couldn't find any jobs matching your skills</p>
                                <button className="clear-search-btn" onClick={handleClearSearch}>Clear All Filters</button>
                                <div className="suggestions">
                                    <p>Try:</p>
                                    <div className="suggestion-tags">
                                        <span onClick={() => setSearchTerm('Remote')}>Remote</span>
                                        <span onClick={() => setSearchTerm('Developer')}>Developer</span>
                                        <span onClick={() => setSearchTerm('Designer')}>Designer</span>
                                        <span onClick={() => setActiveFilter('Full-time')}>Full-time</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            topPicksJobs.map((job) => {
                                const matchPercentage = job.match_score || matchPercentages[job.id] || 0;
                                return (
                                    <div className="job" key={job.id}>
                                        <div className="job-company-icon">
                                            <i className="fa-solid fa-building"></i>
                                        </div>
                                        <div className="job-info" onClick={() => handleJobClick(job.id)}>
                                            <div className="job-header">
                                                <h4>{job.title}</h4>
                                                {matchPercentage > 0 && (
                                                    <div className="match-badge" style={{ background: `linear-gradient(135deg, ${getMatchColor(matchPercentage)} 0%, ${getMatchColor(matchPercentage - 10)} 100%)` }}>
                                                        <i className="fas fa-chart-line"></i> {matchPercentage}% Match
                                                    </div>
                                                )}
                                            </div>
                                            <p>{job.company} • {job.location}</p>
                                            <span className="job-tags">{(job.tags || []).join(' • ') || job.job_type}</span>
                                            {job.experience_level && <span className="experience-tag">{job.experience_level}</span>}
                                            <div className="job-meta">
                                                <span>{job.posted_at}</span>
                                                {job.salary_range && <span className="salary-tag">{job.salary_range}</span>}
                                            </div>
                                            <span className={`save-job-span ${savedJobs.includes(job.id) ? 'saved' : ''}`} onClick={(e) => { e.stopPropagation(); handleSaveJob(job.id); }}>
                                                {savedJobs.includes(job.id) ? 'Saved' : 'Save Job'}
                                                <i className="fa-regular fa-bookmark"></i>
                                            </span>
                                        </div>
                                        <div className="job-actions-row">
                                            <button className="apply-now-btn" onClick={(e) => { e.stopPropagation(); handleApplyNow(job); }}>Apply Now</button>
                                            <button className="easy-apply-btn" onClick={(e) => { e.stopPropagation(); handleEasyApply(job); }}>Easy Apply <i className="fa-solid fa-paper-plane"></i></button>
                                        </div>
                                        <i className="fa-solid fa-times-circle close" onClick={(e) => { e.stopPropagation(); handleDismissJob(job.id); }}></i>
                                    </div>
                                );
                            })
                        )}

                        {!loading && recommendedJobs.length > visibleCounts.topPicks && (
                            <div className="show" onClick={() => handleShowMore('topPicks')}>
                                <i className="fa-solid fa-arrow-down"></i> Show All
                            </div>
                        )}
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h3>Explore with job collections</h3>
                            <p>Designer | Easy Apply | Remote</p>
                        </div>

                        {loading ? (
                            <LoadingSkeleton />
                        ) : exploreJobsList.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-briefcase"></i>
                                <h4>No more jobs to explore</h4>
                                <p>Check back later for new opportunities</p>
                            </div>
                        ) : (
                            exploreJobsList.map((job) => {
                                const matchPercentage = job.match_score || matchPercentages[job.id] || 0;
                                return (
                                    <div className="job" key={job.id}>
                                        <div className="job-company-icon">
                                            <i className="fa-solid fa-building"></i>
                                        </div>
                                        <div className="job-info" onClick={() => handleJobClick(job.id)}>
                                            <div className="job-header">
                                                <h4>{job.title}</h4>
                                                {matchPercentage > 0 && (
                                                    <div className="match-badge" style={{ background: `linear-gradient(135deg, ${getMatchColor(matchPercentage)} 0%, ${getMatchColor(matchPercentage - 10)} 100%)` }}>
                                                        <i className="fas fa-chart-line"></i> {matchPercentage}% Match
                                                    </div>
                                                )}
                                            </div>
                                            <p>{job.company} • {job.location}</p>
                                            <span className="job-tags">{(job.tags || []).join(' • ') || job.job_type}</span>
                                            <div className="job-meta">
                                                <span>{job.posted_at}</span>
                                            </div>
                                        </div>
                                        <div className="job-actions-row">
                                            <button className="apply-now-btn" onClick={(e) => { e.stopPropagation(); handleApplyNow(job); }}>Apply Now</button>
                                            <button className="easy-apply-btn" onClick={(e) => { e.stopPropagation(); handleEasyApply(job); }}>Easy Apply <i className="fa-solid fa-paper-plane"></i></button>
                                        </div>
                                        <i className="fa-solid fa-times-circle close" onClick={(e) => { e.stopPropagation(); handleDismissJob(job.id); }}></i>
                                    </div>
                                );
                            })
                        )}

                        {!loading && exploreJobs.length > visibleCounts.explore && (
                            <div className="show" onClick={() => handleShowMore('explore')}>
                                <i className="fa-solid fa-arrow-down"></i> Show All
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {toast.show && (
                <div className={`toast-notification ${toast.type}`}>
                    <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}`}></i>
                    <span>{toast.message}</span>
                </div>
            )}
        </>
    );
}