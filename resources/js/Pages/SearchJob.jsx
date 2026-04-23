import '../../css/Dashboard.css';
import '../../css/search-job.css';
import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

<<<<<<< HEAD:resources/js/Pages/SearchJob.jsx
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
        console.log('6. recommendedJobs count:', recommendedJobs.length);
        console.log('7. exploreJobs count:', exploreJobs.length);
        console.log('8. savedJobs count:', initialSavedJobs.length);
    }, [profile, userProfile, recommendedJobs, exploreJobs, initialSavedJobs]);

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

    // Use recommendedJobs as top picks and exploreJobs as explore section
    const topPicksJobs = recommendedJobs.slice(0, visibleCounts.topPicks);
    const exploreJobsList = exploreJobs.slice(0, visibleCounts.explore);
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
=======
export default function SearchJob({ auth }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
>>>>>>> 570c33df8fcdd2af22d99b895072e53c9f9a6954:resources/js/Pages/search-job.jsx

    return (
        <AuthenticatedLayout
            user={auth.user}
            // header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Search Jobs</h2>}
        >
            <Head title="Search Jobs" />

            {/* NAVBAR */}
            <nav className="navbar">
                <div className="logo">
                    <span className="bold">GiftedTalents</span><span className="blue">.online</span>
                </div>

                <button 
                    className="hamburger md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    ☰
                </button>

                <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    <li>Home</li>
                    <li className="active">Jobs</li>
                    <li>Explore</li>
                    <li>Hire</li>
                </ul>

                <div className="nav-right">
                    <div className="search-container">
                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.601 10.601z" />
                        </svg>
                        <input className="search" placeholder="Search for jobs..." />
                    </div>

<div className="icon-group">
                        {/* Message Icon - Professional Envelope */}
<i className="fa-solid fa-envelope message-icon text-gray-600 hover:text-blue-600 text-xl"></i>

                        {/* Notification Icon - Professional Bell */}
<i className="fa-solid fa-bell notification-icon relative">
                            <div className="notification-badge"></div>
                          </i>
                    </div>

                    <img src="https://i.pravatar.cc/40" alt="User avatar" className="avatar" />
                </div>
            </nav>

            <div className="container">
                {/* LEFT SIDEBAR */}
                <div className="left">
                    {/* PROFILE CARD */}
                    <div className="profile-card">
                        <div className="cover"></div>
                        <img src="https://i.pravatar.cc/100" alt="profile" className="profile-img" />
                        <div className="profile-info">
                            <h3>KELVIN NNAJI</h3>
                            <p>Software Engineer MyTeacher Institute...</p>
                            <span>Port Harcourt, Rivers State</span>
                        </div>
                    </div>

                    {/* MENU */}
                    <div className="menu-card">
                        <div className="menu-item">
                            <i className="fa-solid fa-file-lines"></i> References
                        </div>
                        <div className="menu-item">
                            <i className="fa-solid fa-bookmark"></i> Job Tracker
                        </div>
                        <div className="menu-item">
                            <i className="fa-solid fa-chart-line"></i> Carrier Insight
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

<<<<<<< HEAD:resources/js/Pages/SearchJob.jsx
                        {loading ? (
                            <LoadingSkeleton />
                        ) : topPicksJobs.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-search"></i>
                                <h4>No recommended jobs found</h4>
                                <p>We couldn't find any jobs matching your skills</p>
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

                        {!loading && recommendedJobs.length > visibleCounts.topPicks && (
                            <div className="show" onClick={() => handleShowMore('topPicks')}>
                                <i className="fa-solid fa-arrow-down"></i> Show All
=======
                        <div className="job" key="1">
                            <i className="fa-solid fa-building job-company-icon" title="Company"></i>
                            <div className="job-info">
                                <h4>UI/UX Designer</h4>
                                <p>Brand Hive. Port Harcourt. (Remote)</p>
                                <span>Senior Software Engineer. Full Stack. JS</span>
                                <div className="job-meta">
                                    <span>1 day ago</span>
                                    <span className="easy-apply-span">Easy Apply <i className="fa-solid fa-paper-plane ml-1"></i></span>
                                    <span className="save-job-span">Save Job <i className="fa-solid fa-bookmark ml-1"></i></span>
                                </div>
                            </div>
                            <i className="fa-solid fa-times-circle close"></i>
                        </div>

                        <div className="job" key="2">
                            <i className="fa-solid fa-building job-company-icon" title="Company"></i>
                            <div className="job-info">
                                <h4>UI/UX Designer</h4>
                                <p>Brand Hive. Port Harcourt. (Remote)</p>
                                <span>Senior Software Engineer. Full Stack. JS</span>
                                <div className="job-meta">
                                    <span>4 day ago</span>
                                    <span className="easy-apply-span">Easy Apply <i className="fa-solid fa-paper-plane ml-1"></i></span>
                                    <span className="save-job-span">Save Job <i className="fa-solid fa-bookmark ml-1"></i></span>
                                </div>
>>>>>>> 570c33df8fcdd2af22d99b895072e53c9f9a6954:resources/js/Pages/search-job.jsx
                            </div>
                            <i className="fa-solid fa-times-circle close"></i>
                        </div>

                        <div className="job" key="3">
                            <i className="fa-solid fa-building job-company-icon" title="Company"></i>
                            <div className="job-info">
                                <h4>UI/UX Designer</h4>
                                <p>Brand Hive. Port Harcourt. (Remote)</p>
                                <span>Senior Software Engineer. Full Stack. JS</span>
                                <div className="job-meta">
                                    <span>3 day ago</span>
                                    <span className="easy-apply-span">Easy Apply <i className="fa-solid fa-paper-plane ml-1"></i></span>
                                    <span className="save-job-span">Save Job <i className="fa-solid fa-bookmark ml-1"></i></span>
                                </div>
                            </div>
                            <i className="fa-solid fa-times-circle close"></i>
                        </div>

                        <div className="job" key="3">
                            <i className="fa-solid fa-building job-company-icon" title="Company"></i>
                            <div className="job-info">
                                <h4>UI/UX Designer</h4>
                                <p>Brand Hive. Port Harcourt. (Remote)</p>
                                <span>Senior Software Engineer. Full Stack. JS</span>
                                <div className="job-meta">
                                    <span>2 day ago</span>
                                    <span className="easy-apply-span">Easy Apply <i className="fa-solid fa-paper-plane ml-1"></i></span>
                                    <span className="save-job-span">Save Job <i className="fa-solid fa-bookmark ml-1"></i></span>
                                </div>
                            </div>
                            <i className="fa-solid fa-times-circle close"></i>
                        </div>

                        <div className="job" key="3">
                            <i className="fa-solid fa-building job-company-icon" title="Company"></i>
                            <div className="job-info">
                                <h4>UI/UX Designer</h4>
                                <p>Brand Hive. Port Harcourt. (Remote)</p>
                                <span>Senior Software Engineer. Full Stack. JS</span>
                                <div className="job-meta">
                                    <span>last week</span>
                                    <span className="easy-apply-span">Easy Apply <i className="fa-solid fa-paper-plane ml-1"></i></span>
                                    <span className="save-job-span">Save Job <i className="fa-solid fa-bookmark ml-1"></i></span>
                                </div>
                            </div>
                            <i className="fa-solid fa-times-circle close"></i>
                        </div>

                        <div className="show">
                            <i className="fa-solid fa-arrow-down mr-2"></i>Show All
                        </div>
                    </div>

                    {/* JOB COLLECTION */}
                    <div className="card">
                        <div className="card-header">
                            <h3>Explore with job collections</h3>
                            <p>Designer | Easy Apply | Remote</p>
                        </div>

<<<<<<< HEAD:resources/js/Pages/SearchJob.jsx
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

                        {!loading && exploreJobs.length > visibleCounts.explore && (
                            <div className="show" onClick={() => handleShowMore('explore')}>
                                <i className="fa-solid fa-arrow-down"></i> Show All
=======
                        <div className="job" key="4">
                            <i className="fa-solid fa-building job-company-icon" title="Company"></i>
                            <div className="job-info">
                                <h4>UI/UX Designer</h4>
                                <p>Brand Hive. Port Harcourt. (Remote)</p>
                                <span>Senior Software Engineer. Full Stack. JS</span>
                                <div className="job-meta">
                                    <span>2 day ago</span>
                                    <span className="easy-apply-span">Easy Apply <i className="fa-solid fa-paper-plane ml-1"></i></span>
                                </div>
                            </div>
                            <i className="fa-solid fa-times-circle close"></i>
                        </div>

                        <div className="job" key="5">
                            <i className="fa-solid fa-building job-company-icon" title="Company"></i>
                            <div className="job-info">
                                <h4>UI/UX Designer</h4>
                                <p>Brand Hive. Port Harcourt. (Remote)</p>
                                <span>Senior Software Engineer. Full Stack. JS</span>
                                <div className="job-meta">
                                    <span>4 day ago</span>
                                    <span className="easy-apply-span">Easy Apply <i className="fa-solid fa-paper-plane ml-1"></i></span>
                                </div>
>>>>>>> 570c33df8fcdd2af22d99b895072e53c9f9a6954:resources/js/Pages/search-job.jsx
                            </div>
                            <i className="fa-solid fa-times-circle close"></i>
                        </div>

                         <div className="job" key="5">
                            <i className="fa-solid fa-building job-company-icon" title="Company"></i>
                            <div className="job-info">
                                <h4>UI/UX Designer</h4>
                                <p>Brand Hive. Port Harcourt. (Remote)</p>
                                <span>Senior Software Engineer. Full Stack. JS</span>
                                <div className="job-meta">
                                    <span>5 day ago</span>
                                    <span className="easy-apply-span">Easy Apply <i className="fa-solid fa-paper-plane ml-1"></i></span>
                                </div>
                            </div>
                            <i className="fa-solid fa-times-circle close"></i>
                        </div>

                         <div className="job" key="5">
                            <i className="fa-solid fa-building job-company-icon" title="Company"></i>
                            <div className="job-info">
                                <h4>UI/UX Designer</h4>
                                <p>Brand Hive. Port Harcourt. (Remote)</p>
                                <span>Senior Software Engineer. Full Stack. JS</span>
                                <div className="job-meta">
                                    <span>6 day ago</span>
                                    <span className="easy-apply-span">Easy Apply <i className="fa-solid fa-paper-plane ml-1"></i></span>
                                </div>
                            </div>
                            <i className="fa-solid fa-times-circle close"></i>
                        </div>

                        <div className="show">
                            <i className="fa-solid fa-arrow-down mr-2"></i>Show All
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

