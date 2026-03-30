<<<<<<< HEAD
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import '../../css/jobs.css';

export default function Jobs({ jobs = [], auth }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState({
        type: [],
        location: [],
        company: [],
        remote: false,
        experience: []
    });
=======
import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppNavbar from '../Components/AppNavbar';
import '../../css/Dashboard.css';

export default function DashboardLayout({ children, user, newJobsCount = 0, profile, profileComplete, profileStatus, stats }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
>>>>>>> a71b3eb (just finished my privacy page and integrated it to backend and database)

    // Get unique values from jobs for dynamic filters
    const uniqueTypes = [...new Set(jobs.map(job => job.job_type).filter(Boolean))];
    const uniqueLocations = [...new Set(jobs.map(job => job.company_location).filter(Boolean))];
    const uniqueCompanies = [...new Set(jobs.map(job => job.company_name).filter(Boolean))];
    const experienceLevels = ['Entry Level', 'Mid Level', 'Senior', 'Lead'];

    // Handle search
    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.get('/jobs', {
                search: searchQuery,
                ...activeFilters
            });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Handle filter changes
    const handleFilterChange = (filterType, value, isChecked) => {
        setActiveFilters(prev => {
            const updated = { ...prev };
            if (filterType === 'remote') {
                updated.remote = isChecked;
            } else {
                if (isChecked) {
                    updated[filterType] = [...updated[filterType], value];
                } else {
                    updated[filterType] = updated[filterType].filter(v => v !== value);
                }
            }
            return updated;
        });
    };

    // Apply all filters
    const applyFilters = () => {
        const filterParams = {};

        if (activeFilters.type.length > 0) filterParams.type = activeFilters.type;
        if (activeFilters.location.length > 0) filterParams.location = activeFilters.location;
        if (activeFilters.company.length > 0) filterParams.company = activeFilters.company;
        if (activeFilters.remote) filterParams.remote = true;
        if (activeFilters.experience.length > 0) filterParams.experience = activeFilters.experience;
        if (searchQuery.trim()) filterParams.search = searchQuery;

        router.get('/jobs', filterParams);
    };

    // Clear all filters
    const clearFilters = () => {
        setActiveFilters({
            type: [],
            location: [],
            company: [],
            remote: false,
            experience: []
        });
        setSearchQuery('');
        router.get('/jobs');
    };

    return (
        <>
            <Head title="Jobs - GiftedTalents" />

            <div className="jobs-page">
                <header>
                    <nav>
                        <div className='logo-search'>
                            <div className="logo">
                                <Link href="/" className="brand">GiftedTalents<span>.online</span></Link>
                            </div>

                            <div className="search-bar">
                                <svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                    <path d="M300.3 440.8C312.9 451 331.4 450.3 343.1 438.6L471.1 310.6C480.3 301.4 483 287.7 478 275.7C473 263.7 461.4 256 448.5 256L192.5 256C179.6 256 167.9 263.8 162.9 275.8C157.9 287.8 160.7 301.5 169.9 310.6L297.9 438.6L300.3 440.8z" />
                                </svg>

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

                {/* FILTER SECTION - Dynamic Dropdowns */}
                <section className="filters-section">
                    <div className="filters-header">
                        <h3>Filter Jobs</h3>
                        <button onClick={clearFilters} className="clear-filters-btn">Clear All</button>
                    </div>

                    <div className="filters-grid">
                        {/* Job Type Filter */}
                        <div className="filter-dropdown">
                            <button className="filter-btn">Job Type ▼</button>
                            <div className="dropdown-content">
                                {uniqueTypes.map(type => (
                                    <label key={type}>
                                        <input
                                            type="checkbox"
                                            value={type}
                                            checked={activeFilters.type.includes(type)}
                                            onChange={(e) => handleFilterChange('type', type, e.target.checked)}
                                        /> {type}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Location Filter */}
                        <div className="filter-dropdown">
                            <button className="filter-btn">Location ▼</button>
                            <div className="dropdown-content">
                                {uniqueLocations.map(location => (
                                    <label key={location}>
                                        <input
                                            type="checkbox"
                                            value={location}
                                            checked={activeFilters.location.includes(location)}
                                            onChange={(e) => handleFilterChange('location', location, e.target.checked)}
                                        /> {location}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Company Filter */}
                        <div className="filter-dropdown">
                            <button className="filter-btn">Company ▼</button>
                            <div className="dropdown-content">
                                {uniqueCompanies.map(company => (
                                    <label key={company}>
                                        <input
                                            type="checkbox"
                                            value={company}
                                            checked={activeFilters.company.includes(company)}
                                            onChange={(e) => handleFilterChange('company', company, e.target.checked)}
                                        /> {company}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Remote Filter */}
                        <div className="filter-dropdown">
                            <button className="filter-btn">Remote ▼</button>
                            <div className="dropdown-content">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={activeFilters.remote}
                                        onChange={(e) => handleFilterChange('remote', true, e.target.checked)}
                                    /> Remote Only
                                </label>
                            </div>
                        </div>

                        {/* Experience Level Filter */}
                        <div className="filter-dropdown">
                            <button className="filter-btn">Experience Level ▼</button>
                            <div className="dropdown-content">
                                {experienceLevels.map(level => (
                                    <label key={level}>
                                        <input
                                            type="checkbox"
                                            value={level}
                                            checked={activeFilters.experience.includes(level)}
                                            onChange={(e) => handleFilterChange('experience', level, e.target.checked)}
                                        /> {level}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="filter-actions">
                        <button onClick={applyFilters} className="apply-filters-btn">Apply Filters</button>
                    </div>
                </section>

                {/* Job Results Count */}
                <div className="job-results">
                    <p>Showing {jobs.length} jobs</p>
                </div>

                {/* HERO SECTION */}
                <section className="hero">
                    <h1>Find the best creative Jobs,<br /> Curated by GiftedTalents</h1>
                    <button className="find-job-btn">Find a job</button>
                </section>

                {/* JOB SECTION */}
                <section className="jobs-section">
                    <div className="jobs-header">
                        <h3>Full-Time or Contract Jobs ({jobs.length})</h3>
                        <div>
                            <svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" /></svg>

                            <input type="text" placeholder="Search Jobs" />
                        </div>
                    </div>

                    {/* JOB GRID - ONLY REAL DATA */}
                    <div className="job-grid">
                        {jobs.map((job) => {
                            // Determine job type color
                            const getJobTypeColor = () => {
                                const type = job.job_type?.toLowerCase() || '';
                                if (type === 'contract' || type === 'part-time') {
                                    return { color: '#2563EB' };
                                }
                                if (type === 'full-time' || type === 'remote') {
                                    return { color: '#15803D' };
                                }
                                return { color: '#4B5563' };
                            };

                            return (
                                <div key={job.id} className="job-card">
                                    <div className="company">
                                        {job.company_logo_url ? (
                                            <img
                                                src={job.company_logo_url}
                                                alt={`${job.company_name} logo`}
                                                className="company-logo"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
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
                                            <p
                                                className="job-type"
                                                style={getJobTypeColor()}
                                            >
                                                {job.job_type}
                                            </p>
                                        </div>
                                    </div>
                                    <h3>{job.job_title}</h3>
                                    <p className='job-description'>{job.description}</p>
                                    <div className="job-footer">
                                        <div className="job-footer-left">
                                            <span className="job-salary">{job.salary_range || job.salary}</span>
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
                            );
                        })}

                        {jobs.length === 0 && (
                            <div className="no-jobs-message">
                                <p>No jobs available at the moment. Check back later!</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* FOOTER */}
                <footer>
                    <div className="footer-left">
                        <a href="/" className="brand">GiftedTalents<span>.online</span></a>
                        <span>© 2026</span>
                    </div>

                    <div className="footer-right">
                        <a href="/about">About</a>
                        <a href="/contact">Contact</a>
                        <a href="/privacy">Privacy Policy</a>
                        <a href="/guidelines">Community Guideline</a>
                    </div>

                </footer>
            </div>
        </>
    );
}