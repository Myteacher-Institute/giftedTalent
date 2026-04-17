import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AppNavbar from '../Components/AppNavbar';
import '../../css/explore.css';

export default function Explore({ auth, trendingIndustries = [], featuredCompanies = [], topSkills = [], stats = {}, recentJobs = [] }) {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [selectedJobType, setSelectedJobType] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [animatedStats, setAnimatedStats] = useState({
        total_jobs: 0,
        total_companies: 0,
        total_talents: 0,
        success_rate: 0
    });
    
    const currentUser = auth?.user;

    // Animate stats on load
    useEffect(() => {
        const animateStats = () => {
            const targets = {
                total_jobs: stats.total_jobs || 0,
                total_companies: stats.total_companies || 0,
                total_talents: stats.total_talents || 500,
                success_rate: stats.success_rate || 98
            };
            
            const duration = 2000;
            const step = 20;
            const increments = {};
            
            for (let key in targets) {
                increments[key] = targets[key] / (duration / step);
            }
            
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= duration) {
                    setAnimatedStats(targets);
                    clearInterval(timer);
                } else {
                    setAnimatedStats({
                        total_jobs: Math.min(Math.floor(increments.total_jobs * (current / step)), targets.total_jobs),
                        total_companies: Math.min(Math.floor(increments.total_companies * (current / step)), targets.total_companies),
                        total_talents: Math.min(Math.floor(increments.total_talents * (current / step)), targets.total_talents),
                        success_rate: Math.min(Math.floor(increments.success_rate * (current / step)), targets.success_rate)
                    });
                }
            }, step);
        };
        
        animateStats();
    }, [stats]);

    // Get unique locations from companies
    const locations = ['all', ...new Set(featuredCompanies?.map(c => c.location).filter(Boolean) || [])];
    
    // Filter companies
    const filteredCompanies = featuredCompanies?.filter(company => {
        const matchesSearch = company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             company.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             company.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = selectedLocation === 'all' || company.location === selectedLocation;
        return matchesSearch && matchesLocation;
    }) || [];

    // Filter industries
    const filteredIndustries = trendingIndustries?.filter(industry => {
        return industry.name?.toLowerCase().includes(searchTerm.toLowerCase());
    }) || [];

    // Filter skills
    const filteredSkills = topSkills?.filter(skill => {
        return skill.name?.toLowerCase().includes(searchTerm.toLowerCase());
    }) || [];

    const toggleMobileSidebar = () => {
        setMobileSidebarOpen(!mobileSidebarOpen);
    };

    const getRandomGradient = (index) => {
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        ];
        return gradients[index % gradients.length];
    };

    const handleCompanyClick = (companyName) => {
        router.visit(`/find-jobs?company=${encodeURIComponent(companyName)}`);
    };

    const handleIndustryClick = (industryType) => {
        router.visit(`/find-jobs?job_type=${encodeURIComponent(industryType)}`);
    };

    const handleSkillClick = (skillName) => {
        router.visit(`/find-jobs?skill=${encodeURIComponent(skillName)}`);
    };

    const handleViewAllJobs = () => {
        let url = '/find-jobs';
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedLocation !== 'all') params.append('location', selectedLocation);
        if (selectedJobType !== 'all') params.append('job_type', selectedJobType);
        if (params.toString()) url += '?' + params.toString();
        router.visit(url);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedLocation('all');
        setSelectedJobType('all');
    };

    return (
        <>
            <Head title="Explore - GiftedTalents" />
            
            <AppNavbar 
                user={currentUser} 
                onMenuToggle={toggleMobileSidebar}
                isMenuOpen={mobileSidebarOpen}
            />

            <div className="explore-page">
                {/* Hero Section */}
                <div className="explore-hero">
                    <div className="explore-hero-content">
                        <span className="hero-badge animate-slide-up">✨ Explore Opportunities</span>
                        <h1 className="animate-slide-up delay-1">Discover Your Next <span className="gradient-text">Chapter</span></h1>
                        <p className="animate-slide-up delay-2">Explore industries, trending skills, and companies looking for talents like you.</p>
                        
                        {/* Search Bar - NEW */}
                        <div className="hero-search animate-slide-up delay-3">
                            <div className="search-input-wrapper">
                                <i className="fas fa-search"></i>
                                <input 
                                    type="text" 
                                    placeholder="Search companies, industries, or skills..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button className="clear-search" onClick={() => setSearchTerm('')}>
                                        <i className="fas fa-times"></i>
                                    </button>
                                )}
                            </div>
                            <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
                                <i className="fas fa-sliders-h"></i> Filters
                            </button>
                            <button className="search-btn" onClick={handleViewAllJobs}>
                                <i className="fas fa-arrow-right"></i>
                            </button>
                        </div>

                        {/* Advanced Filters - NEW */}
                        {showFilters && (
                            <div className="advanced-filters animate-fade-in">
                                <div className="filter-group">
                                    <label>Location</label>
                                    <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                                        <option value="all">All Locations</option>
                                        {locations.filter(l => l !== 'all').map(location => (
                                            <option key={location} value={location}>{location}</option>
                                        ))}
                                        <option value="Remote">Remote</option>
                                    </select>
                                </div>
                                <div className="filter-group">
                                    <label>Job Type</label>
                                    <select value={selectedJobType} onChange={(e) => setSelectedJobType(e.target.value)}>
                                        <option value="all">All Types</option>
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Contract">Contract</option>
                                    </select>
                                </div>
                                {(searchTerm || selectedLocation !== 'all' || selectedJobType !== 'all') && (
                                    <button className="clear-filters-btn" onClick={clearFilters}>
                                        <i className="fas fa-times-circle"></i> Clear Filters
                                    </button>
                                )}
                            </div>
                        )}
                        
                        {/* Stats Section - Enhanced */}
                        <div className="hero-stats animate-slide-up delay-4">
                            <div className="stat">
                                <span className="stat-number">{animatedStats.total_jobs}+</span>
                                <span className="stat-label">Open Positions</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">{animatedStats.total_companies}+</span>
                                <span className="stat-label">Companies</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">{animatedStats.total_talents}+</span>
                                <span className="stat-label">Active Talents</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">{animatedStats.success_rate}%</span>
                                <span className="stat-label">Success Rate</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="explore-container">
                    {/* Trending Industries Section */}
                    <div className="section">
                        <div className="section-header">
                            <div className="section-header-left">
                                <span className="section-badge">Industries</span>
                                <h2>Trending <span className="gradient-text">Industries</span></h2>
                                <p>Most in-demand sectors right now</p>
                            </div>
                            <Link href="/find-jobs" className="view-all-link">
                                View All Jobs <i className="fas fa-arrow-right"></i>
                            </Link>
                        </div>
                        
                        {filteredIndustries.length === 0 && searchTerm ? (
                            <div className="empty-state">
                                <i className="fas fa-search"></i>
                                <p>No industries found matching "{searchTerm}"</p>
                                <button onClick={() => setSearchTerm('')} className="clear-search-btn">Clear Search</button>
                            </div>
                        ) : (
                            <div className="industries-grid">
                                {filteredIndustries.length === 0 ? (
                                    <div className="empty-state">No industries found. Add jobs to see them here.</div>
                                ) : (
                                    filteredIndustries.map((industry, index) => (
                                        <div 
                                            key={index} 
                                            className="industry-card"
                                            style={{ background: getRandomGradient(index) }}
                                            onClick={() => handleIndustryClick(industry.name)}
                                        >
                                            <div className="industry-icon">
                                                <i className={`fas ${industry.icon || 'fa-briefcase'}`}></i>
                                            </div>
                                            <h3>{industry.name}</h3>
                                            <p>{industry.count}+ Open Positions</p>
                                            <div className="card-hover-effect"></div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Featured Companies Section */}
                    <div className="section">
                        <div className="section-header">
                            <div className="section-header-left">
                                <span className="section-badge">Companies</span>
                                <h2>Featured <span className="gradient-text">Companies</span></h2>
                                <p>Top employers hiring now</p>
                            </div>
                            <Link href="/find-jobs" className="view-all-link">
                                View All <i className="fas fa-arrow-right"></i>
                            </Link>
                        </div>
                        
                        {filteredCompanies.length === 0 && searchTerm ? (
                            <div className="empty-state">
                                <i className="fas fa-building"></i>
                                <p>No companies found matching "{searchTerm}"</p>
                                <button onClick={() => setSearchTerm('')} className="clear-search-btn">Clear Search</button>
                            </div>
                        ) : (
                            <div className="companies-grid">
                                {filteredCompanies.length === 0 ? (
                                    <div className="empty-state">No companies found. Jobs will appear here when added.</div>
                                ) : (
                                    filteredCompanies.map((company, index) => (
                                        <div key={index} className="company-card" onClick={() => handleCompanyClick(company.name)}>
                                            <div className="company-logo">
                                                {company.logo ? (
                                                    <img src={company.logo} alt={company.name} />
                                                ) : (
                                                    <div className="company-logo-placeholder" style={{ background: getRandomGradient(index) }}>
                                                        {company.name?.charAt(0)?.toUpperCase() || 'C'}
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="company-name">{company.name}</h3>
                                            <p className="company-desc">{company.description || 'Innovative Solutions Provider'}</p>
                                            <div className="company-location">
                                                <i className="fas fa-map-marker-alt"></i>
                                                {company.location}
                                            </div>
                                            <div className="company-stats">
                                                <span className="job-count-badge">
                                                    <i className="fas fa-briefcase"></i> {company.job_count} Open Positions
                                                </span>
                                            </div>
                                            <button className="view-jobs-btn">View Openings →</button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Top Skills Section */}
                    <div className="section">
                        <div className="section-header">
                            <div className="section-header-left">
                                <span className="section-badge">Skills</span>
                                <h2>Top Skills <span className="gradient-text">in Demand</span></h2>
                                <p>Most requested skills by employers</p>
                            </div>
                        </div>
                        
                        {filteredSkills.length === 0 && searchTerm ? (
                            <div className="empty-state">
                                <i className="fas fa-code"></i>
                                <p>No skills found matching "{searchTerm}"</p>
                                <button onClick={() => setSearchTerm('')} className="clear-search-btn">Clear Search</button>
                            </div>
                        ) : (
                            <div className="skills-grid">
                                {filteredSkills.length === 0 ? (
                                    <div className="empty-state">No skills found. Add jobs with required skills.</div>
                                ) : (
                                    filteredSkills.map((skill, index) => (
                                        <div key={index} className="skill-card" onClick={() => handleSkillClick(skill.name)}>
                                            <div className="skill-icon" style={{ background: skill.color || getRandomGradient(index) }}>
                                                <i className="fas fa-code"></i>
                                            </div>
                                            <div className="skill-info">
                                                <h3>{skill.name}</h3>
                                                <p>{skill.count}+ job openings</p>
                                            </div>
                                            <div className="skill-demand-bar">
                                                <div className="demand-fill" style={{ width: `${skill.demand_percentage || 70}%` }}></div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Recent Jobs Section - NEW */}
                    {recentJobs && recentJobs.length > 0 && (
                        <div className="section">
                            <div className="section-header">
                                <div className="section-header-left">
                                    <span className="section-badge">Latest</span>
                                    <h2>Recent <span className="gradient-text">Jobs</span></h2>
                                    <p>New opportunities posted recently</p>
                                </div>
                                <Link href="/find-jobs" className="view-all-link">
                                    View All Jobs <i className="fas fa-arrow-right"></i>
                                </Link>
                            </div>
                            
                            <div className="recent-jobs-list">
                                {recentJobs.map((job, index) => (
                                    <div key={index} className="recent-job-card" onClick={() => router.visit(`/jobs/${job.id}`)}>
                                        <div className="job-card-left">
                                            <div className="job-company-logo">
                                                {job.logo ? (
                                                    <img src={job.logo} alt={job.company} />
                                                ) : (
                                                    <div className="mini-logo-placeholder">
                                                        {job.company?.charAt(0)?.toUpperCase() || 'C'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="job-card-middle">
                                            <h4>{job.title}</h4>
                                            <p className="job-company">{job.company}</p>
                                            <div className="job-meta">
                                                <span><i className="fas fa-map-marker-alt"></i> {job.location}</span>
                                                <span><i className="fas fa-clock"></i> {job.job_type}</span>
                                                <span><i className="fas fa-calendar"></i> {job.posted_at || 'Recently'}</span>
                                            </div>
                                        </div>
                                        <div className="job-card-right">
                                            <button className="quick-apply-btn">Apply Now →</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Newsletter Section - NEW */}
                    <div className="newsletter-section">
                        <div className="newsletter-content">
                            <div className="newsletter-icon">
                                <i className="fas fa-envelope-open-text"></i>
                            </div>
                            <h3>Get Job Alerts</h3>
                            <p>Subscribe to receive personalized job recommendations straight to your inbox</p>
                            <form className="newsletter-form" onSubmit={(e) => {
                                e.preventDefault();
                                alertify.success('Subscribed successfully!');
                            }}>
                                <input type="email" placeholder="Enter your email address" required />
                                <button type="submit">Subscribe</button>
                            </form>
                            <p className="newsletter-note">We respect your privacy. Unsubscribe anytime.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}