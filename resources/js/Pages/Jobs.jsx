import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import '../../css/jobs.css';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Jobs({ jobs = [], auth }) {
    // Get category from URL props
    const { category } = usePage().props;

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredJobs, setFilteredJobs] = useState(jobs);
    const [selectedCategory, setSelectedCategory] = useState(category || null);

    const categoryTitles = {
        technology: 'Technology',
        design: 'Design',
        marketing: 'Marketing',
        finance: 'Finance',
        sales: 'Sales',
        support: 'Customer Support',
        other: 'Other Opportunities'
    };

    // Filter state
    const [filters, setFilters] = useState({
        jobType: '',
        location: '',
        salary: '',
        experience: '',
        datePosted: '',
        status: ''
    });

    // Get unique values for dropdowns
    const uniqueTypes = [...new Set(jobs.map(job => job.job_type).filter(Boolean))];
    const uniqueLocations = [...new Set(jobs.map(job => job.company_location).filter(Boolean))];

    const salaryRanges = [
        { value: '', label: 'Any Salary' },
        { value: '0-100k', label: '₦0 - ₦100k' },
        { value: '100k-200k', label: '₦100k - ₦200k' },
        { value: '200k-300k', label: '₦200k - ₦300k' },
        { value: '300k+', label: '₦300k+' }
    ];

    const experienceLevels = [
        { value: '', label: 'Any Level' },
        { value: 'entry', label: 'Entry Level' },
        { value: 'mid', label: 'Mid Level' },
        { value: 'senior', label: 'Senior Level' },
        { value: 'lead', label: 'Lead / Manager' }
    ];

    const dateOptions = [
        { value: '', label: 'Any Time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' }
    ];

    // Apply filters
    useEffect(() => {
        applyLocalFilters();
    }, [filters, jobs, searchQuery, selectedCategory]);

    const applyLocalFilters = () => {
        let filtered = [...jobs];

        // Filter by Category from URL
        if (selectedCategory) {
            const categoryKeywords = {
                technology: ['developer', 'engineer', 'programmer', 'software', 'full-stack', 'frontend', 'backend', 'php', 'javascript', 'react', 'laravel', 'web developer'],
                design: ['designer', 'ui', 'ux', 'graphic', 'creative', 'figma', 'web designer'],
                marketing: ['marketing', 'seo', 'social media', 'digital marketing', 'content', 'digital marketer'],
                finance: ['finance', 'accounting', 'banking', 'financial', 'audit'],
                sales: ['sales', 'business development', 'account manager', 'client relations'],
                support: ['support', 'customer service', 'help desk', 'customer care'],
                other: ['administrative', 'operations', 'coordinator', 'assistant', 'hr', 'project manager']
            };

            const keywords = categoryKeywords[selectedCategory] || [];
            if (keywords.length > 0) {
                filtered = filtered.filter(job => {
                    const jobTitle = (job.job_title || '').toLowerCase();
                    const jobDesc = (job.description || '').toLowerCase();
                    return keywords.some(keyword =>
                        jobTitle.includes(keyword) || jobDesc.includes(keyword)
                    );
                });
            }
        }

        // Filter by Search Query
        if (searchQuery) {
            filtered = filtered.filter(job =>
                job.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company_location?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by Job Type
        if (filters.jobType) {
            filtered = filtered.filter(job =>
                job.job_type?.toLowerCase() === filters.jobType.toLowerCase()
            );
        }

        // Filter by Location
        if (filters.location) {
            filtered = filtered.filter(job =>
                job.company_location?.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        // Filter by Salary Range
        if (filters.salary) {
            filtered = filtered.filter(job => {
                const salaryStr = job.salary_range || job.salary || '';
                const salaryMatch = salaryStr.match(/\d+/g);
                const salaryNum = salaryMatch ? parseInt(salaryMatch.join('')) : 0;

                switch (filters.salary) {
                    case '0-100k': return salaryNum <= 100000;
                    case '100k-200k': return salaryNum >= 100000 && salaryNum <= 200000;
                    case '200k-300k': return salaryNum >= 200000 && salaryNum <= 300000;
                    case '300k+': return salaryNum >= 300000;
                    default: return true;
                }
            });
        }

        setFilteredJobs(filtered);
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const clearFilters = () => {
        setFilters({
            jobType: '',
            location: '',
            salary: '',
            experience: '',
            datePosted: '',
            status: ''
        });
        setSearchQuery('');
        setSelectedCategory(null);
        router.get('/jobs');
    };

    const applyFilters = () => {
        applyLocalFilters();
    };

    const handleSearch = () => {
        applyLocalFilters();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const navigateTo = (path) => {
        router.get(path);
    };

    const getJobTypeColor = (type) => {
        const jobType = type?.toLowerCase() || '';
        if (jobType === 'contract' || jobType === 'part-time') {
            return { color: '#2563EB' };
        }
        if (jobType === 'full-time' || jobType === 'remote') {
            return { color: '#15803D' };
        }
        return { color: '#4B5563' };
    };

    return (
        <>
            <Head title="Jobs - GiftedTalents" />

            <div className="jobs-page">
                <header>
                    <nav>
                        <div className='logo-search'>
                            <div className="logo">
                                <a>
                                    <ApplicationLogo className="w-20 h-10 mt-6 mr-2" />
                                </a>
                            </div>

                            <div className="search-bar">
                                <input
                                    type="text"
                                    placeholder="Search job titles, companies, locations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                                <svg
                                    className='svg'
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 640 640"
                                    onClick={handleSearch}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" />
                                </svg>
                            </div>
                        </div>

                        <div className="nav-buttons">
                            {auth?.user ? (
                                <>
                                    <Link href="/dashboard" className="dashboard-btn">Dashboard</Link>
                                    <button onClick={() => router.post('/logout')} className="logout-btn">Logout</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => router.get('/login')} className="signin-btn">Sign in</button>
                                    <button onClick={() => router.get('/register')} className="join-btn">Join now</button>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Category Banner */}
                {selectedCategory && categoryTitles[selectedCategory] && (
                    <div className="category-banner">
                        <h2>{categoryTitles[selectedCategory]} Jobs</h2>
                        <button onClick={clearFilters} className="clear-category-btn">View All Jobs</button>
                    </div>
                )}

                {/* FILTER SECTION */}
                <section className="filters-section">
                    <div className="filters-header">
                        <h3>Filter Jobs</h3>
                        <div className="filter-actions-group">
                            <button onClick={clearFilters} className="clear-filters-btn">Clear All</button>
                            <button onClick={applyFilters} className="apply-filters-btn">Apply Filters</button>
                        </div>
                    </div>

                    <div className="filters-grid">
                        <div className="filter-item">
                            <select
                                value={filters.jobType}
                                onChange={(e) => handleFilterChange('jobType', e.target.value)}
                                className="filter-select"
                            >
                                <option value="">Job Type</option>
                                {uniqueTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-item">
                            <select
                                value={filters.location}
                                onChange={(e) => handleFilterChange('location', e.target.value)}
                                className="filter-select"
                            >
                                <option value="">Location</option>
                                {uniqueLocations.map(location => (
                                    <option key={location} value={location}>{location}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-item">
                            <select
                                value={filters.salary}
                                onChange={(e) => handleFilterChange('salary', e.target.value)}
                                className="filter-select"
                            >
                                {salaryRanges.map(range => (
                                    <option key={range.value} value={range.value}>{range.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-item">
                            <select
                                value={filters.experience}
                                onChange={(e) => handleFilterChange('experience', e.target.value)}
                                className="filter-select"
                            >
                                {experienceLevels.map(level => (
                                    <option key={level.value} value={level.value}>{level.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-item">
                            <select
                                value={filters.datePosted}
                                onChange={(e) => handleFilterChange('datePosted', e.target.value)}
                                className="filter-select"
                            >
                                {dateOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-item">
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="review">Under Review</option>
                                <option value="closed">Closed</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                    </div>
                </section>

                <div className="job-results">
                    <p>Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}</p>
                </div>

                <section className="hero">
                    <h1>Find the best creative Jobs,<br /> Curated by GiftedTalents</h1>
                </section>

                <section className="jobs-section">
                    <div className="jobs-header">
                        <h3>Available Jobs ({filteredJobs.length})</h3>
                        <div>
                            <svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search Jobs"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                    </div>

                    <div className="job-grid">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <div key={job.id} className="job-card">
                                    <div className="company">
                                        {job.company_logo_url ? (
                                            <img
                                                src={job.company_logo_url}
                                                alt={`${job.company_name} logo`}
                                                className="company-logo"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="company-initial">
                                                {job.company_name?.charAt(0) || 'C'}
                                            </div>
                                        )}
                                        <div className="company-header-info">
                                            <div className="company-header">
                                                <h2>{job.company_name}</h2>
                                                <div>
                                                    <img src="/assets/svg/location.svg" alt="" className="location-icon" />
                                                    <p>{job.company_location}</p>
                                                </div>
                                            </div>
                                            <p className="job-type" style={getJobTypeColor(job.job_type)}>
                                                {job.job_type}
                                            </p>
                                        </div>
                                    </div>
                                    <h3>{job.job_title}</h3>
                                    <p className='job-description'>{job.description?.substring(0, 120)}...</p>

                                    {job.tags && job.tags.length > 0 && (
                                        <div className="job-tags">
                                            {job.tags.slice(0, 3).map((tag, index) => (
                                                <span key={index} className="job-tag">{tag}</span>
                                            ))}
                                            {job.tags.length > 3 && (
                                                <span className="job-tag-more">+{job.tags.length - 3}</span>
                                            )}
                                        </div>
                                    )}

                                    <div className="job-footer">
                                        <div className="job-footer-left">
                                            <span className="job-salary">{job.salary_range || job.salary}</span>

                                            <Link href={`/jobs/${job.id}`} className="job-details-link">View Details
                                                <svg className="details-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="5" y1="12" x2="19" y2="12" />
                                                    <polyline points="12 5 19 12 12 19" />
                                                </svg></Link>
                                        </div>
                                        <div className="job-footer-right">
                                            <span className="job-date">{new Date(job.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</span>
                                            <button
                                                className="apply-btn"
                                                onClick={() => window.open(job.application_link, '_blank')}
                                            >
                                                Apply now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-jobs-message">
                                <p>No jobs found matching your criteria.</p>
                                <button onClick={clearFilters} className="clear-filters-link">Clear all filters</button>
                            </div>
                        )}
                    </div>
                </section>

                <footer>
                    <div className="footer-top">
                        <div className="footer-left">
                            <a href="#" className="brand" onClick={(e) => { e.preventDefault(); navigateTo('/'); }}>
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
            </div>
        </>
    );
}