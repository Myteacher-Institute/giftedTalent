import '../../css/search-job.css';
import { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AppNavbar from '../Components/AppNavbar';

export default function SearchJob({ auth, profile, initialJobs = [], savedJobs: initialSavedJobs = [] }) {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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
    const [showSalaryFilter, setShowSalaryFilter] = useState(false);
    
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

    // Debug: Log profile data
    useEffect(() => {
        console.log('=== SEARCH JOBS PROFILE DEBUG ===');
        console.log('1. profile object:', profile);
        console.log('2. userProfile:', userProfile);
        console.log('3. profile_image_base64:', profile?.profile_image_base64);
        console.log('4. position:', userProfile?.position);
        console.log('5. city:', userProfile?.city);
    }, [profile, userProfile]);

    // Get profile image URL with base64 support
    const getProfileImageUrl = () => {
        // FIRST: Check for base64 in the profile prop
        if (profile?.profile_image_base64) {
            return profile.profile_image_base64;
        }
        
        // SECOND: Check for base64 in user's profile
        if (currentUser?.profile?.profile_image_base64) {
            return currentUser.profile.profile_image_base64;
        }
        
        // THIRD: Check for avatar_url
        if (currentUser?.profile?.avatar_url) {
            return currentUser.profile.avatar_url;
        }
        
        // FOURTH: Check for avatar path
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
        
        // FIFTH: Default avatar
        const userName = currentUser?.name || 'User';
        return `https://ui-avatars.com/api/?background=667eea&color=fff&size=100&name=${encodeURIComponent(userName)}`;
    };

    // Get user display name
    const getDisplayName = () => {
        return currentUser?.name?.toUpperCase() || 'USER NAME';
    };

    // Get user position/title
    const getUserPosition = () => {
        // Check various possible locations for position data
        return userProfile?.position || 
               userProfile?.title || 
               currentUser?.headline || 
               currentUser?.position || 
               'Software Engineer';
    };

    // Get user location
    const getUserLocation = () => {
        // Check various possible locations for location data
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
            if (mobileSidebarOpen && !e.target.closest('.left') && !e.target.closest('.mobile-menu-toggle')) {
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
            const userSkills = currentUser.skills.map(s => s.toLowerCase());
            
            jobs.forEach(job => {
                const jobSkills = job.tags?.map(t => t.toLowerCase()) || [];
                const matchingSkills = jobSkills.filter(skill => userSkills.includes(skill));
                const percentage = jobSkills.length > 0 
                    ? Math.round((matchingSkills.length / jobSkills.length) * 100)
                    : 0;
                percentages[job.id] = percentage;
            });
            
            setMatchPercentages(percentages);
        }
    }, [jobs, currentUser?.skills]);

    // Filter and Sort jobs
    useEffect(() => {
        let filtered = [...jobs];
        
        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(job => 
                job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        
        if (activeFilter !== 'all' && activeFilter !== 'All') {
            filtered = filtered.filter(job => 
                job.job_type === activeFilter || 
                job.tags?.includes(activeFilter)
            );
        }
        
        if (quickFilters.remoteOnly) {
            filtered = filtered.filter(job => 
                job.location?.toLowerCase().includes('remote') ||
                job.job_type === 'Remote'
            );
        }
        
        if (quickFilters.easyApply) {
            filtered = filtered.filter(job => job.easy_apply === true);
        }
        
        if (quickFilters.urgentFeatured) {
            filtered = filtered.filter(job => job.urgent === true || job.featured === true);
        }
        
        if (experienceLevel !== 'all' && experienceLevel !== 'All') {
            filtered = filtered.filter(job => 
                job.experience_level === experienceLevel
            );
        }
        
        filtered = filtered.filter(job => {
            const salary = job.salary_range || job.salary;
            if (!salary) return true;
            const numericSalary = parseInt(salary.replace(/[^0-9]/g, ''));
            return numericSalary >= salaryRange[0] && numericSalary <= salaryRange[1];
        });
        
        if (sortBy === 'newest') {
            filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (sortBy === 'highest_salary') {
            filtered.sort((a, b) => {
                const salaryA = parseInt((a.salary_range || a.salary || '0').replace(/[^0-9]/g, ''));
                const salaryB = parseInt((b.salary_range || b.salary || '0').replace(/[^0-9]/g, ''));
                return salaryB - salaryA;
            });
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
        setSelectedJob(job);
        setShowApplyModal(true);
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

    const handleMenuClick = (route) => {
        router.visit(route);
        setMobileSidebarOpen(false);
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

    const topPicksJobs = filteredJobs.slice(0, visibleCounts.topPicks);
    const exploreJobs = filteredJobs.slice(visibleCounts.topPicks, visibleCounts.topPicks + visibleCounts.explore);
    const jobsCount = filteredJobs.length;

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

            {/* Toast Notification */}
            {toast.show && (
                <div className={`toast-notification toast-${toast.type}`}>
                    <div className="toast-content">
                        {toast.type === 'success' && <i className="fas fa-check-circle"></i>}
                        {toast.type === 'error' && <i className="fas fa-exclamation-circle"></i>}
                        {toast.type === 'info' && <i className="fas fa-info-circle"></i>}
                        <span>{toast.message}</span>
                        <button onClick={() => setToast({ ...toast, show: false })} className="toast-close">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* AppNavbar */}
            <AppNavbar user={currentUser} newJobsCount={notificationCount} />

            {/* Quick Apply Modal */}
            {showApplyModal && selectedJob && (
                <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
                    <div className="apply-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Apply for {selectedJob.title}</h3>
                            <button className="modal-close" onClick={() => setShowApplyModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="job-summary">
                                <p><strong>{selectedJob.company}</strong> • {selectedJob.location}</p>
                                <p className="job-salary">{selectedJob.salary_range || selectedJob.salary || 'Salary not specified'}</p>
                            </div>
                            <form onSubmit={handleSubmitApplication}>
                                <div className="form-group">
                                    <label>Cover Letter</label>
                                    <textarea 
                                        rows="6" 
                                        placeholder="Why are you a good fit for this position?"
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Resume/CV</label>
                                    <input 
                                        type="file" 
                                        accept=".pdf,.doc,.docx" 
                                        onChange={(e) => setSelectedResume(e.target.files[0])}
                                        required
                                    />
                                    <small>Accepted formats: PDF, DOC, DOCX (Max 5MB)</small>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-cancel" onClick={() => setShowApplyModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-submit" disabled={submitting}>
                                        {submitting ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Job Alert Modal */}
            {showAlertModal && (
                <div className="modal-overlay" onClick={() => setShowAlertModal(false)}>
                    <div className="alert-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3><i className="fas fa-bell"></i> Job Alerts</h3>
                            <button className="modal-close" onClick={() => setShowAlertModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Get notified when new jobs match your criteria</p>
                            <div className="alert-options">
                                <label className="alert-option">
                                    <input 
                                        type="checkbox" 
                                        checked={alertSettings.daily}
                                        onChange={(e) => setAlertSettings({...alertSettings, daily: e.target.checked})}
                                    />
                                    <span>Daily Digest</span>
                                </label>
                                <label className="alert-option">
                                    <input 
                                        type="checkbox" 
                                        checked={alertSettings.weekly}
                                        onChange={(e) => setAlertSettings({...alertSettings, weekly: e.target.checked})}
                                    />
                                    <span>Weekly Roundup</span>
                                </label>
                                <label className="alert-option">
                                    <input 
                                        type="checkbox" 
                                        checked={alertSettings.instant}
                                        onChange={(e) => setAlertSettings({...alertSettings, instant: e.target.checked})}
                                    />
                                    <span>Instant Alerts</span>
                                </label>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowAlertModal(false)}>
                                    Cancel
                                </button>
                                <button type="button" className="btn-subscribe" onClick={handleSubscribeAlerts}>
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="container">
                {/* LEFT SIDEBAR */}
                <div className={`left ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
                    <div className="sidebar-card">
                        <button className="sidebar-close" onClick={toggleMobileSidebar}>
                            <i className="fas fa-times"></i>
                        </button>

                        {/* Profile Section - Using the same profile data as dashboard */}
                        <div className="profile-section">
                            <div className="profile-image-wrapper">
                                <img 
                                    src={getProfileImageUrl()} 
                                    alt={currentUser?.name || 'Profile'} 
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

                        {/* Mobile Navigation Links */}
                        <div className="mobile-nav-section">
                            <div className="mobile-nav-item" onClick={() => handleMenuClick('/dashboard')}>
                                <i className="fas fa-home"></i> Home
                            </div>
                            <div className="mobile-nav-item active" onClick={() => handleMenuClick('/search-jobs')}>
                                <i className="fas fa-search"></i> Jobs
                            </div>
                            <div className="mobile-nav-item" onClick={() => handleMenuClick('/explore')}>
                                <i className="fas fa-compass"></i> Explore
                            </div>
                            <div className="mobile-nav-item" onClick={() => handleMenuClick('/hire')}>
                                <i className="fas fa-user-tie"></i> Hire
                            </div>
                        </div>

                        {/* Filters Container */}
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
                                    <div className="salary-header" onClick={() => setShowSalaryFilter(!showSalaryFilter)}>
                                        <span><i className="fas fa-dollar-sign"></i> Salary Range</span>
                                        <i className={`fas fa-chevron-${showSalaryFilter ? 'up' : 'down'}`}></i>
                                    </div>
                                    {showSalaryFilter && (
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
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="menu-items">
                            <div className="menu-item" onClick={() => handleMenuClick('/references')}>
                                <i className="fa-solid fa-file-lines"></i> References
                            </div>
                            <div className="menu-item" onClick={() => handleMenuClick('/job-tracker')}>
                                <i className="fa-solid fa-bookmark"></i> Job Tracker
                            </div>
                            <div className="menu-item" onClick={() => handleMenuClick('/career-insight')}>
                                <i className="fa-solid fa-chart-line"></i> Career Insight
                            </div>
                            <div className="menu-item" onClick={() => setShowAlertModal(true)}>
                                <i className="fa-solid fa-bell"></i> Job Alerts
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Sidebar Overlay */}
                {mobileSidebarOpen && <div className="mobile-sidebar-overlay active" onClick={toggleMobileSidebar}></div>}

                {/* Mobile Menu Toggle Button */}
                <button className="mobile-menu-toggle" onClick={toggleMobileSidebar}>
                    <i className="fas fa-sliders-h"></i>
                </button>

                {/* RIGHT CONTENT */}
                <div className="right">
                    {/* Search Bar */}
                    <div className="search-bar-container">
                        <form onSubmit={handleSearchSubmit} className="search-form">
                            <div className="search-input-group">
                                <i className="fas fa-search search-input-icon"></i>
                                <input 
                                    type="text" 
                                    placeholder="Search for jobs by title, company, or keywords..." 
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="search-input-field"
                                />
                                {searchTerm && (
                                    <button 
                                        type="button" 
                                        className="clear-search-btn-field"
                                        onClick={() => setSearchTerm('')}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                )}
                                <button type="submit" className="search-submit-btn">
                                    <i className="fas fa-search"></i> Search
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Sort Bar */}
                    <div className="sort-bar">
                        <div className="sort-wrapper">
                            <label className="sort-label">Sort by:</label>
                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value)}
                                className="sort-select"
                            >
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Jobs Count */}
                    <div className="jobs-count">
                        <span>Found <strong>{jobsCount}</strong> jobs</span>
                        {(searchTerm || activeFilter !== 'all' || quickFilters.remoteOnly || quickFilters.easyApply || quickFilters.urgentFeatured || experienceLevel !== 'all') && (
                            <button className="clear-all-btn" onClick={handleClearSearch}>
                                Clear All Filters
                            </button>
                        )}
                    </div>

                    {/* TOP PICKS SECTION */}
                    <div className="card">
                        <div className="card-header">
                            <h3>Top Jobs picks for you</h3>
                            <p>Based on your profile, preferences, and activity</p>
                        </div>

                        {loading ? (
                            <LoadingSkeleton />
                        ) : topPicksJobs.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-search"></i>
                                <h4>No jobs found</h4>
                                <p>We couldn't find any jobs matching your criteria</p>
                                <button className="clear-search-btn" onClick={handleClearSearch}>
                                    Clear All Filters
                                </button>
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
                                const matchPercentage = matchPercentages[job.id] || 0;
                                return (
                                    <div className="job" key={job.id}>
                                        <div className="job-company-icon">
                                            <i className="fa-solid fa-building"></i>
                                        </div>
                                        <div className="job-info" onClick={() => handleJobClick(job.id)}>
                                            <div className="job-header">
                                                <h4>{job.title}</h4>
                                                {matchPercentage > 0 && (
                                                    <div className="match-badge" style={{ 
                                                        background: `linear-gradient(135deg, ${getMatchColor(matchPercentage)} 0%, ${getMatchColor(matchPercentage - 10)} 100%)`
                                                    }}>
                                                        <i className="fas fa-chart-line"></i> {matchPercentage}% Match
                                                    </div>
                                                )}
                                            </div>
                                            <p>{job.company} • {job.location}</p>
                                            <span className="job-tags">{job.tags?.join(' • ') || job.job_type}</span>
                                            {job.experience_level && (
                                                <span className="experience-tag">{job.experience_level}</span>
                                            )}
                                            <div className="job-meta">
                                                <span>{job.posted_at}</span>
                                                {job.salary_range && (
                                                    <span className="salary-tag">{job.salary_range}</span>
                                                )}
                                                {job.easy_apply && (
                                                    <span 
                                                        className="easy-apply-span" 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEasyApply(job);
                                                        }}
                                                    >
                                                        Easy Apply <i className="fa-solid fa-paper-plane"></i>
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
                                                    <i className="fa-regular fa-bookmark"></i>
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
                                );
                            })
                        )}

                        {!loading && filteredJobs.length > visibleCounts.topPicks && (
                            <div className="show" onClick={() => handleShowMore('topPicks')}>
                                <i className="fa-solid fa-arrow-down"></i> Show All
                            </div>
                        )}
                    </div>

                    {/* EXPLORE SECTION */}
                    <div className="card">
                        <div className="card-header">
                            <h3>Explore with job collections</h3>
                            <p>Designer | Easy Apply | Remote</p>
                        </div>

                        {loading ? (
                            <LoadingSkeleton />
                        ) : exploreJobs.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-briefcase"></i>
                                <h4>No more jobs to explore</h4>
                                <p>Check back later for new opportunities</p>
                            </div>
                        ) : (
                            exploreJobs.map((job) => {
                                const matchPercentage = matchPercentages[job.id] || 0;
                                return (
                                    <div className="job" key={job.id}>
                                        <div className="job-company-icon">
                                            <i className="fa-solid fa-building"></i>
                                        </div>
                                        <div className="job-info" onClick={() => handleJobClick(job.id)}>
                                            <div className="job-header">
                                                <h4>{job.title}</h4>
                                                {matchPercentage > 0 && (
                                                    <div className="match-badge" style={{ 
                                                        background: `linear-gradient(135deg, ${getMatchColor(matchPercentage)} 0%, ${getMatchColor(matchPercentage - 10)} 100%)`
                                                    }}>
                                                        <i className="fas fa-chart-line"></i> {matchPercentage}% Match
                                                    </div>
                                                )}
                                            </div>
                                            <p>{job.company} • {job.location}</p>
                                            <span className="job-tags">{job.tags?.join(' • ') || job.job_type}</span>
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
                                                        Easy Apply <i className="fa-solid fa-paper-plane"></i>
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
                                );
                            })
                        )}

                        {!loading && filteredJobs.length > visibleCounts.topPicks + visibleCounts.explore && (
                            <div className="show" onClick={() => handleShowMore('explore')}>
                                <i className="fa-solid fa-arrow-down"></i> Show All
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}