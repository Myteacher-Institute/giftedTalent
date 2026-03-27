import '../../css/search-job.css';
import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppNavbar from '../Components/AppNavbar'; // Remove AuthenticatedLayout import
import axios from 'axios';
import '../../css/DashboardNav.css';

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
    const [activeFilter, setActiveFilter] = useState('all');
    const [jobTypes] = useState(['Full-time', 'Remote', 'Contract', 'Part-time']);
    
    // Improvement 1: Match Percentage State
    const [matchPercentages, setMatchPercentages] = useState({});
    
    // Improvement 2: Salary Range Filter
    const [salaryRange, setSalaryRange] = useState([0, 200000]);
    const [showSalaryFilter, setShowSalaryFilter] = useState(false);
    
    // Improvement 3: Quick Apply Modal
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [selectedResume, setSelectedResume] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    
    // Improvement 4: Job Alert Modal
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertSettings, setAlertSettings] = useState({
        daily: false,
        weekly: false,
        instant: false
    });
    
    // Toast notification state
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Auto-hide toast after 3 seconds
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ ...toast, show: false });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    // Show toast function
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    // Calculate match percentage for each job based on user skills
    useEffect(() => {
        if (auth.user?.skills && jobs.length > 0) {
            const percentages = {};
            const userSkills = auth.user.skills.map(s => s.toLowerCase());
            
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
    }, [jobs, auth.user?.skills]);

    // Filter jobs when search term, filter, or salary range changes
    useEffect(() => {
        let filtered = jobs;
        
        // Search filter
        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(job => 
                job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        
        // Job type filter
        if (activeFilter !== 'all') {
            filtered = filtered.filter(job => 
                job.job_type === activeFilter || 
                job.tags?.includes(activeFilter)
            );
        }
        
        // Salary range filter
        filtered = filtered.filter(job => {
            const salary = job.salary_range || job.salary;
            if (!salary) return true;
            const numericSalary = parseInt(salary.replace(/[^0-9]/g, ''));
            return numericSalary >= salaryRange[0] && numericSalary <= salaryRange[1];
        });
        
        setFilteredJobs(filtered);
    }, [searchTerm, jobs, activeFilter, salaryRange]);

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
                await axios.delete(`/api/jobs/${jobId}/save`);
                const updated = savedJobs.filter(id => id !== jobId);
                setSavedJobs(updated);
                showToast('Job removed from saved', 'info');
            } else {
                await axios.post(`/api/jobs/${jobId}/save`);
                const updated = [...savedJobs, jobId];
                setSavedJobs(updated);
                showToast('Job saved successfully!', 'success');
            }
        } catch (error) {
            console.error('Error saving job:', error);
            showToast('Failed to save job. Please try again.', 'error');
        }
    };

    // Improvement 3: Enhanced Easy Apply with Modal
    const handleEasyApply = (job) => {
        setSelectedJob(job);
        setShowApplyModal(true);
    };

    // Submit application
    const handleSubmitApplication = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const formData = new FormData();
            formData.append('job_id', selectedJob.id);
            formData.append('cover_letter', coverLetter);
            if (selectedResume) {
                formData.append('resume', selectedResume);
            }
            
            const response = await axios.post(`/api/jobs/${selectedJob.id}/apply`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (response.data.success) {
                showToast(`Successfully applied to ${selectedJob.title}!`, 'success');
                setShowApplyModal(false);
                setCoverLetter('');
                setSelectedResume(null);
            }
        } catch (error) {
            console.error('Error applying to job:', error);
            showToast('Failed to apply. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
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

    // Improvement 4: Subscribe to Job Alerts
    const handleSubscribeAlerts = async () => {
        try {
            await axios.post('/api/job-alerts/subscribe', {
                settings: alertSettings,
                search_criteria: { searchTerm, activeFilter, salaryRange }
            });
            showToast('Successfully subscribed to job alerts!', 'success');
            setShowAlertModal(false);
            setAlertSettings({ daily: false, weekly: false, instant: false });
        } catch (error) {
            console.error('Error subscribing to alerts:', error);
            showToast('Failed to subscribe. Please try again.', 'error');
        }
    };

    // Clear all search filters
    const handleClearSearch = () => {
        setSearchTerm('');
        setActiveFilter('all');
        setSalaryRange([0, 200000]);
    };

    const handleMenuClick = (route) => {
        router.visit(route);
    };

    const handleJobClick = (jobId) => {
        router.visit(`/jobs/${jobId}`);
    };

    // Get match color based on percentage
    const getMatchColor = (percentage) => {
        if (percentage >= 70) return '#10b981';
        if (percentage >= 40) return '#f59e0b';
        return '#ef4444';
    };

    // Split jobs into two sections
    const topPicksJobs = filteredJobs.slice(0, visibleCounts.topPicks);
    const exploreJobs = filteredJobs.slice(visibleCounts.topPicks, visibleCounts.topPicks + visibleCounts.explore);

    // Loading skeleton
    const LoadingSkeleton = () => (
        <div className="loading-skeleton">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="skeleton-job-item">
                    <div className="skeleton-icon"></div>
                    <div className="skeleton-content">
                        <div className="skeleton-title"></div>
                        <div className="skeleton-subtitle"></div>
                        <div className="skeleton-text"></div>
                        <div className="skeleton-meta" style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                            <div style={{ width: '80px', height: '30px', background: '#e2e8f0', borderRadius: '20px' }}></div>
                            <div style={{ width: '100px', height: '30px', background: '#e2e8f0', borderRadius: '20px' }}></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    // Get current user data for AppNavbar
    const currentUser = auth.user;

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

            {/* AppNavbar - only one navbar now */}
            <AppNavbar user={currentUser} newJobsCount={notificationCount} />

            {/* Improvement 3: Quick Apply Modal */}
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
                                        placeholder="Why are you a good fit for this position? What makes you the ideal candidate?"
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

            {/* Improvement 4: Job Alert Modal */}
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
                                    <span>Daily Digest - Get a daily summary of new jobs</span>
                                </label>
                                <label className="alert-option">
                                    <input 
                                        type="checkbox" 
                                        checked={alertSettings.weekly}
                                        onChange={(e) => setAlertSettings({...alertSettings, weekly: e.target.checked})}
                                    />
                                    <span>Weekly Roundup - Weekly job recommendations</span>
                                </label>
                                <label className="alert-option">
                                    <input 
                                        type="checkbox" 
                                        checked={alertSettings.instant}
                                        onChange={(e) => setAlertSettings({...alertSettings, instant: e.target.checked})}
                                    />
                                    <span>Instant Alerts - Get notified immediately when matching jobs are posted</span>
                                </label>
                            </div>
                            <div className="alert-criteria">
                                <p><strong>Your current search criteria:</strong></p>
                                <div className="criteria-tags">
                                    {searchTerm && <span className="criteria-tag">Search: {searchTerm}</span>}
                                    {activeFilter !== 'all' && <span className="criteria-tag">Type: {activeFilter}</span>}
                                    <span className="criteria-tag">Salary: ₦{salaryRange[0].toLocaleString()} - ₦{salaryRange[1].toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowAlertModal(false)}>
                                    Maybe Later
                                </button>
                                <button type="button" className="btn-subscribe" onClick={handleSubscribeAlerts}>
                                    Subscribe to Alerts
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="container">
                {/* LEFT SIDEBAR */}
                <div className="left">
                    {/* PROFILE CARD */}
                    <div className="profile-card">
                        <div className="cover"></div>
                        <img 
                            src={auth.user?.avatar || "https://ui-avatars.com/api/?background=667eea&color=fff&size=100&name=" + (auth.user?.name || 'User')} 
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
                        <div className="menu-item alert-item" onClick={() => setShowAlertModal(true)}>
                            <i className="fa-solid fa-bell"></i> Job Alerts
                        </div>
                    </div>

                    {/* Improvement 2: Salary Range Filter */}
                    <div className="filter-card">
                        <div className="filter-header" onClick={() => setShowSalaryFilter(!showSalaryFilter)}>
                            <h4>Salary Range</h4>
                            <i className={`fas fa-chevron-${showSalaryFilter ? 'up' : 'down'}`}></i>
                        </div>
                        {showSalaryFilter && (
                            <div className="filter-content">
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
                        )}
                    </div>
                </div>

                {/* RIGHT CONTENT - Keep all your existing content */}
                <div className="right">
                    {/* Filter Bar */}
                    <div className="filter-bar">
                        <button 
                            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('all')}
                        >
                            All Jobs
                        </button>
                        {jobTypes.map(type => (
                            <button 
                                key={type}
                                className={`filter-btn ${activeFilter === type ? 'active' : ''}`}
                                onClick={() => setActiveFilter(type)}
                            >
                                {type}
                            </button>
                        ))}
                        {(searchTerm || activeFilter !== 'all' || salaryRange[0] > 0 || salaryRange[1] < 200000) && (
                            <button className="filter-btn clear-filter" onClick={handleClearSearch}>
                                Clear Filters
                            </button>
                        )}
                    </div>

                    {/* JOB PICKS */}
                    <div className="card">
                        <div className="card-header">
                            <h3>Top Jobs picks for you</h3>
                            <p>Based on your profile, preferences, and activity like applies and saves</p>
                        </div>

                        {loading ? (
                            <LoadingSkeleton />
                        ) : topPicksJobs.length === 0 ? (
                            <div className="empty-state-enhanced">
                                <i className="fas fa-search"></i>
                                <h4>No jobs found</h4>
                                <p>We couldn't find any jobs matching your criteria</p>
                                <button className="clear-search-btn" onClick={handleClearSearch}>
                                    Clear Search
                                </button>
                                <div className="suggestions">
                                    <p>Try searching for:</p>
                                    <div className="suggestion-tags">
                                        <span onClick={() => setSearchTerm('Remote')}>Remote</span>
                                        <span onClick={() => setSearchTerm('Developer')}>Developer</span>
                                        <span onClick={() => setSearchTerm('Designer')}>Designer</span>
                                        <span onClick={() => setSearchTerm('Full-time')}>Full-time</span>
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
                                );
                            })
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
                            <div className="empty-state-enhanced">
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
                                );
                            })
                        )}

                        {!loading && filteredJobs.length > visibleCounts.topPicks + visibleCounts.explore && (
                            <div className="show" onClick={() => handleShowMore('explore')}>
                                <i className="fa-solid fa-arrow-down mr-2"></i>Show All
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}