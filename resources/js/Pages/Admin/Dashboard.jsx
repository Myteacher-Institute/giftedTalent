import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import '/resources/css/admindashboard.css';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function AdminDashboard({ jobStats, recentJobs: initialJobs, filters: initialFilters, auth, unreadNotifications }) {
    console.log('Initial Jobs from server:', initialJobs);
    console.log('Job Stats from server:', jobStats);
    console.log('Initial Filters from server:', initialFilters);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [filteredJobs, setFilteredJobs] = useState(initialJobs || []);

    // Add logout function
    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            router.post('/logout');
        }
    }
    // Filter state
    const [filters, setFilters] = useState({
        jobType: '',
        location: '',
        salary: '',
        experience: '',
        datePosted: '',
        status: ''
    });

    // Update filtered jobs when filters change or initialJobs change
    useEffect(() => {
        applyLocalFilters();
    }, [filters, initialJobs]);

    // Apply filters LOCALLY (no navigation)
    const applyLocalFilters = () => {
        let filtered = initialJobs || [];

        // Filter by Job Type
        if (filters.jobType) {
            filtered = filtered.filter(job =>
                job.job_type?.toLowerCase() === filters.jobType.toLowerCase()
            );
        }

        // Filter by Location
        if (filters.location) {
            filtered = filtered.filter(job =>
                job.location?.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        // Filter by Salary Range
        if (filters.salary) {
            filtered = filtered.filter(job => {
                const salary = parseInt(job.salary?.replace(/[^0-9]/g, '') || '0');
                switch (filters.salary) {
                    case '0-100k': return salary <= 100000;
                    case '100k-200k': return salary >= 100000 && salary <= 200000;
                    case '200k-300k': return salary >= 200000 && salary <= 300000;
                    case '300k+': return salary >= 300000;
                    default: return true;
                }
            });
        }

        // Filter by Experience
        if (filters.experience) {
            filtered = filtered.filter(job =>
                job.experience_level?.toLowerCase() === filters.experience.toLowerCase()
            );
        }

        // Filter by Date Posted
        if (filters.datePosted) {
            const now = new Date();
            filtered = filtered.filter(job => {
                const jobDate = new Date(job.created_at);
                switch (filters.datePosted) {
                    case 'today':
                        return jobDate.toDateString() === now.toDateString();
                    case 'week':
                        const weekAgo = new Date(now.setDate(now.getDate() - 7));
                        return jobDate >= weekAgo;
                    case 'month':
                        return jobDate.getMonth() === now.getMonth() &&
                            jobDate.getFullYear() === now.getFullYear();
                    default: return true;
                }
            });
        }

        // Filter by Status
        if (filters.status) {
            filtered = filtered.filter(job =>
                job.status?.toLowerCase() === filters.status.toLowerCase()
            );
        }

        setFilteredJobs(filtered);
        console.log('Filtered jobs:', filtered);
    };

    // Handle filter changes
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            jobType: '',
            location: '',
            salary: '',
            experience: '',
            datePosted: '',
            status: ''
        });
        setFilteredJobs(initialJobs || []);
    };

    // Apply filters button click
    const applyFilters = () => {
        applyLocalFilters();
    };

    // Navigate function
    const navigateTo = (path) => {
        router.get(path);
    };

    return (
        <>
            <Head title="Dashboard - GiftedTalents" />

            <div className="dashboard-container">
                {/* Sidebar */}
                <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                    {/* Close button for mobile */}
                    <button
                        className="sidebar-close-btn"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close sidebar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>

                    <a className="logo">
                        <ApplicationLogo className="w-20 h-10 mr-2" />
                    </a>

                    <nav className="sidebar-nav">
                        <div>
                            <img src="/assets/svg/01f7c576-04bb-4d9e-b318-158c701bfeda 1.jpg" alt="" className="side-bar-img" />
                            <h2>MyTeacher Institute</h2>
                            <p>Port Harcourt, Innovation Institute</p>
                        </div>
                        <ul>
                            <li>
                                <a href="/Admin/dashboard" onClick={(e) => { e.preventDefault(); navigateTo('/Admin/dashboard'); }}>
                                    <img src="/assets/svg/column.svg" alt="" className="column-icon" />Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="/jobs" onClick={(e) => { e.preventDefault(); navigateTo('/jobs'); }}>
                                    <img src="/assets/svg/tag.svg" alt="" className="tag-icon" />Manage Jobs
                                </a>
                            </li>
                            <li>
                                <a href="candidates" onClick={(e) => { e.preventDefault(); navigateTo('/Admin/candidates'); }}>
                                    <img src="/assets/svg/forward-out.svg" alt="" className="forward-out-icon" />Candidates
                                </a>
                            </li>
                            <li>
                                <a href="/messages" onClick={(e) => { e.preventDefault(); navigateTo('/Admin/messages'); }}>
                                    <img src="/assets/svg/message.svg" alt="" className="message-icon" />Messages
                                </a>
                            </li>
                            <li>
                                <a href="/setting" onClick={(e) => { e.preventDefault(); navigateTo('/Admin/settings'); }}>
                                    <img src="/assets/svg/setting.svg" alt="" className="setting-icon" />Settings
                                </a>
                            </li>
                            <li className="logout-item">
                                <a href="/" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                                    <svg className="logout-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                        <path fill="currentColor" d="M160 96C142.3 96 128 110.3 128 128V512C128 529.7 142.3 544 160 544H352C369.7 544 384 529.7 384 512V416C384 398.3 398.3 384 416 384C433.7 384 448 398.3 448 416V512C448 565 405 608 352 608H160C106.1 608 64 565 64 512V128C64 74.1 106.1 32 160 32H352C405 32 448 74.1 448 128V224C448 241.7 433.7 256 416 256C398.3 256 384 241.7 384 224V128C384 110.3 369.7 96 352 96H160zM432.1 201L552.1 321C563.3 331.3 563.3 348.7 552.1 359L432.1 479C421.8 490.3 404.3 490.3 393 479C381.8 467.7 381.8 450.3 393 439L473 359H224C207.4 359 194 345.6 194 329C194 312.4 207.4 299 224 299H473L393 219C381.8 207.7 381.8 190.3 393 179C404.3 167.8 421.8 167.8 432.1 179L552.1 299L432.1 419V201z" />
                                    </svg>
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="main-content">
                    {/* Top Navigation */}
                    <header className="top-nav">
                        <div className="nav-left">
                            <div className="menu-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                    <path fill="rgb(116, 192, 252)" d="M96 160C96 142.3 110.3 128 128 128L512 128C529.7 128 544 142.3 544 160C544 177.7 529.7 192 512 192L128 192C110.3 192 96 177.7 96 160zM96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320zM544 480C544 497.7 529.7 512 512 512L128 512C110.3 512 96 497.7 96 480C96 462.3 110.3 448 128 448L512 448C529.7 448 544 462.3 544 480z" />
                                </svg>
                            </div>
                            <div className="nav-links">
                                <a href="/" className='home' onClick={(e) => { e.preventDefault(); navigateTo('/'); }}>Home</a>
                                <a href="/jobs" onClick={(e) => { e.preventDefault(); navigateTo('/jobs'); }}>Jobs</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/explore'); }}>Explore</a>
                                <div>
                                    <a href="#" className='hire' onClick={(e) => { e.preventDefault(); navigateTo('/hire'); }}>Hire</a>
                                    <img src="/assets/svg/arrow-down.svg" alt="" className="arrow-down-icon" />
                                </div>
                            </div>
                        </div>

                        {/* Simple search */}
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Quick search..."
                                onKeyUp={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                        router.get('/admin/jobs', { search: e.target.value });
                                    }
                                }}
                            />
                            <button className="search-btn">
                                <img src="/assets/svg/search.svg" alt="" className="search-icon" />
                            </button>
                        </div>

                        <div className="top-nav-img">
                            <div className="icon-wrapper" onClick={() => navigateTo('/Admin/messages')} style={{ cursor: 'pointer' }}>
                                <img src="/assets/svg/chats.svg" alt="" className="chats-icon" />
                            </div>

                            <div className="icon-wrapper" onClick={() => navigateTo('/Admin/notifications')} style={{ cursor: 'pointer' }}>
                                <img src="/assets/svg/notification.svg" alt="" className="notification-icon" />
                                {unreadNotifications > 0 && (
                                    <span className="notification-badge">{unreadNotifications}</span>
                                )}
                            </div>

                            <div className="user-profile" onClick={() => navigateTo('/admin/profile')} style={{ cursor: 'pointer' }}>
                                <div className="avatar">
                                    {auth?.user?.avatar ? (
                                        <img
                                            src={auth.user.avatar}
                                            alt={auth.user.name}
                                            className="avatar-img"
                                        />
                                    ) : (
                                        <svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                            <path fill="#4B5563" d="M463 448.2C440.9 409.8 399.4 384 352 384L288 384C240.6 384 199.1 409.8 177 448.2C212.2 487.4 263.2 512 320 512C376.8 512 427.8 487.3 463 448.2zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320zM320 336C359.8 336 392 303.8 392 264C392 224.2 359.8 192 320 192C280.2 192 248 224.2 248 264C248 303.8 280.2 336 320 336z" />
                                        </svg>
                                    )}
                                </div>
                                <span className="user-name">{auth?.user?.name || 'Admin'}</span>
                            </div>
                        </div>
                    </header>

                    {/* Stats Cards */}
                    <section className="stats-grid">
                        <div className="stat-card">
                            <h3>Your Job Posts</h3>
                            <div className="stat-numbers">
                                <div id='stat-item-1' className="stat-item">
                                    <span className="stat-value">{jobStats?.active || 0}</span>
                                    <span className="stat-label">Active Jobs</span>
                                </div>
                                <div id='stat-item-2' className="stat-item">
                                    <span className="stat-value">{jobStats?.passed || 0}</span>
                                    <span className="stat-label">Passed</span>
                                </div>
                                <div id='stat-item-3' className="stat-item">
                                    <span className="stat-value">{jobStats?.under_review || 0}</span>
                                    <span className="stat-label">Under Review</span>
                                </div>
                                <div id='stat-item-4' className="stat-item">
                                    <span className="stat-value">{jobStats?.hired || 0}</span>
                                    <span className="stat-label">Hired</span>
                                </div>
                            </div>
                        </div>

                        {/* Post new job button */}
                        <div className="stat-card-post-job">
                            <h3>Post a new Job</h3>
                            <img src="/assets/svg/hero-image.jpg" alt="" className="hero-image" />
                            <button className="post-job-btn" onClick={() => window.location.href = '/Admin/jobs/create'}>
                                + Create New Job Post
                            </button>
                        </div>
                    </section>

                    {/* FILTER SECTION */}
                    <section className="filters-section">
                        <div className="filters-header">
                            <h3>Filter Jobs ({filteredJobs.length} results)</h3>
                            <button className="clear-filters" onClick={clearFilters}>
                                Clear All Filters
                            </button>
                        </div>

                        <div className="filters-grid">
                            {/* Job Type Filter */}
                            <div className="filter-item">
                                <select
                                    value={filters.jobType}
                                    onChange={(e) => handleFilterChange('jobType', e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">Job Type</option>
                                    <option value="fulltime">Full Time</option>
                                    <option value="parttime">Part Time</option>
                                    <option value="contract">Contract</option>
                                    <option value="remote">Remote</option>
                                    <option value="internship">Internship</option>
                                </select>
                                <svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                    <path d="M300.3 440.8C312.9 451 331.4 450.3 343.1 438.6L471.1 310.6C480.3 301.4 483 287.7 478 275.7C473 263.7 461.4 256 448.5 256L192.5 256C179.6 256 167.9 263.8 162.9 275.8C157.9 287.8 160.7 301.5 169.9 310.6L297.9 438.6L300.3 440.8z" />
                                </svg>
                            </div>

                            {/* Salary Range Filter */}
                            <div className="filter-item">
                                <select
                                    value={filters.salary}
                                    onChange={(e) => handleFilterChange('salary', e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">Salary Range</option>
                                    <option value="0-100k">₦0 - ₦100k</option>
                                    <option value="100k-200k">₦100k - ₦200k</option>
                                    <option value="200k-300k">₦200k - ₦300k</option>
                                    <option value="300k+">₦300k+</option>
                                </select>
                                <svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                    <path d="M300.3 440.8C312.9 451 331.4 450.3 343.1 438.6L471.1 310.6C480.3 301.4 483 287.7 478 275.7C473 263.7 461.4 256 448.5 256L192.5 256C179.6 256 167.9 263.8 162.9 275.8C157.9 287.8 160.7 301.5 169.9 310.6L297.9 438.6L300.3 440.8z" />
                                </svg>
                            </div>

                            {/* Date Posted Filter */}
                            <div className="filter-item">
                                <select
                                    value={filters.datePosted}
                                    onChange={(e) => handleFilterChange('datePosted', e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">Date Posted</option>
                                    <option value="today">Today</option>
                                    <option value="week">This Week</option>
                                    <option value="month">This Month</option>
                                </select>
                                <svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                    <path d="M300.3 440.8C312.9 451 331.4 450.3 343.1 438.6L471.1 310.6C480.3 301.4 483 287.7 478 275.7C473 263.7 461.4 256 448.5 256L192.5 256C179.6 256 167.9 263.8 162.9 275.8C157.9 287.8 160.7 301.5 169.9 310.6L297.9 438.6L300.3 440.8z" />
                                </svg>
                            </div>

                            {/* Status Filter */}
                            <div className="filter-item">
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">Status</option>
                                    <option value="active">Active</option>
                                    <option value="review">Under Review</option>
                                    <option value="closed">Closed</option>
                                    <option value="draft">Draft</option>
                                </select>
                                <svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                    <path d="M300.3 440.8C312.9 451 331.4 450.3 343.1 438.6L471.1 310.6C480.3 301.4 483 287.7 478 275.7C473 263.7 461.4 256 448.5 256L192.5 256C179.6 256 167.9 263.8 162.9 275.8C157.9 287.8 160.7 301.5 169.9 310.6L297.9 438.6L300.3 440.8z" />
                                </svg>
                            </div>
                        </div>

                        {/* Apply Filters Button */}
                        <div className="filter-actions">
                            <button className="apply-filters" onClick={applyFilters}>
                                Apply Filters
                            </button>
                        </div>
                    </section>

                    {/* Recent Jobs with filtered data */}
                    <section className="recent-jobs">
                        <div className="section-header">
                            <h3>Recent Job Posts ({filteredJobs.length})</h3>
                        </div>

                        <div className="jobs-list">
                            {filteredJobs.length > 0 ? (
                                filteredJobs.map((job) => (
                                    <div key={job.id} className="job-card">
                                        <div className="job-card-header">
                                            <div className="company-info">
                                                <div className="user-profile">
                                                    <div className="avatar">
                                                        {job.company_logo_url ? (
                                                            <img
                                                                src={job.company_logo_url}
                                                                alt={`${job.company_name} logo`}
                                                                className="company-logo"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    const parent = e.target.parentElement;
                                                                    if (parent) {
                                                                        parent.innerHTML = `<div class="company-initial">${job.company_name?.charAt(0)?.toUpperCase() || 'C'}</div>`;
                                                                    }
                                                                }}
                                                            />
                                                        ) : (
                                                            <svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                                                <path fill="#4B5563" d="M463 448.2C440.9 409.8 399.4 384 352 384L288 384C240.6 384 199.1 409.8 177 448.2C212.2 487.4 263.2 512 320 512C376.8 512 427.8 487.3 463 448.2zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320zM320 336C359.8 336 392 303.8 392 264C392 224.2 359.8 192 320 192C280.2 192 248 224.2 248 264C248 303.8 280.2 336 320 336z" />
                                                            </svg>
                                                        )}


                                                    </div>
                                                </div>
                                                <div className="company-info-header">
                                                    <h3>{job.company_name}</h3>
                                                    <div className='location'>
                                                        <img src="/assets/svg/location.svg" alt="" className="location-icon" />
                                                        <p className="company-location">{job.location}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='job-details'>
                                                <div className='jobs-info'>
                                                    <div>
                                                        <h4 className="job-type">{job.job_type}</h4>
                                                        <p className="job-salary">| {job.salary}</p>
                                                    </div>
                                                    <div className="job-meta">
                                                        <div className='job-details-container'>
                                                            <p className="time">{new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                                            <div className="applicants">
                                                                <img src="/assets/svg/message.svg" alt="" className="message-icon" />
                                                                <p>{job.applicants || 0}</p>
                                                            </div>
                                                            <button className="view-applicants">View Applicants</button>
                                                            <img src="/assets/svg/menu.svg" alt="" id="menu-icon" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="job-description">{job.description}</p>
                                                <hr />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-results">
                                    <p>No jobs match your filters.</p>
                                    <button onClick={clearFilters} className="clear-filters-link">Clear filters</button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* FOOTER */}
                    <footer>
                        <div className="footer-top">
                            <div className="footer-left">
                                <a href="/" className="brand" onClick={(e) => { e.preventDefault(); navigateTo('/'); }}>
                                    <ApplicationLogo className="logo" />
                                </a>
                            </div>

                            <div className="footer-right">
                                <a href="/about">About</a>
                                <a href="/contact">Contact</a>
                                <a href="/privacy">Privacy Policy</a>
                                <a href="/guidelines">Community Guideline</a>
                            </div>
                        </div>

                        <div className="footer-bottom">
                            <div className='copyright'>
                                <p>©</p>
                                <span>2026</span>
                            </div>

                            <p>
                                <span>Powered by:</span> MyTeacher Institute. All rights reserved.
                            </p>
                        </div>

                    </footer>
                </main>
            </div>
        </>
    );
}