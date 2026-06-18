import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AppNavbar from '../Components/AppNavbar';
import '../../css/explore.css';
import { getAvatarUrl } from '@/Utils/avatar';

export default function Explore({ 
    auth, 
    trendingIndustries = [], 
    featuredCompanies = [], 
    topTalents = [], 
    stats = {}, 
    recentJobs = [],
    featuredTalents = [],
    jobCategories = []
}) {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [selectedJobType, setSelectedJobType] = useState('all');
    const [selectedIndustry, setSelectedIndustry] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [filteredCompanies, setFilteredCompanies] = useState(featuredCompanies);
    const [filteredIndustries, setFilteredIndustries] = useState(trendingIndustries);
    const [filteredTalents, setFilteredTalents] = useState(topTalents);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [liveJobCount, setLiveJobCount] = useState(stats.total_jobs || 1250);
    const [animatedStats, setAnimatedStats] = useState({
        total_jobs: 0,
        total_companies: 0,
        total_talents: 0,
        success_rate: 0,
        total_placements: 0
    });
    
    const currentUser = auth?.user;

    const getProfileImageUrl = () => getAvatarUrl({ profile: currentUser?.profile || {}, currentUser, fallbackName: currentUser?.name || 'User', fallbackColor: '667eea' });

    const getDisplayName = () => {
        return currentUser?.name?.toUpperCase() || 'USER NAME';
    };

    const getUserPosition = () => {
        return currentUser?.profile?.position || currentUser?.headline || 'Professional';
    };

    const getUserLocation = () => {
        return currentUser?.profile?.city || currentUser?.location || 'Remote';
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    // Live counter - updates every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setLiveJobCount(prev => prev + Math.floor(Math.random() * 3) + 1);
        }, 30000);
        
        return () => clearInterval(interval);
    }, []);

    // Animate stats on load
    useEffect(() => {
        const animateStats = () => {
            const targets = {
                total_jobs: stats.total_jobs || 1250,
                total_companies: stats.total_companies || 380,
                total_talents: stats.total_talents || 2450,
                success_rate: stats.success_rate || 94,
                total_placements: stats.total_placements || 1870
            };
            
            const duration = 2000;
            const step = 20;
            let current = 0;
            const increments = {};
            
            for (let key in targets) {
                increments[key] = targets[key] / (duration / step);
            }
            
            const timer = setInterval(() => {
                current += step;
                if (current >= duration) {
                    setAnimatedStats(targets);
                    clearInterval(timer);
                } else {
                    setAnimatedStats(prev => ({
                        total_jobs: Math.min(Math.floor(increments.total_jobs * (current / step)), targets.total_jobs),
                        total_companies: Math.min(Math.floor(increments.total_companies * (current / step)), targets.total_companies),
                        total_talents: Math.min(Math.floor(increments.total_talents * (current / step)), targets.total_talents),
                        success_rate: Math.min(Math.floor(increments.success_rate * (current / step)), targets.success_rate),
                        total_placements: Math.min(Math.floor(increments.total_placements * (current / step)), targets.total_placements)
                    }));
                }
            }, step);
        };
        
        animateStats();
    }, [stats]);

    // Apply filters
    useEffect(() => {
        let companies = [...featuredCompanies];
        if (searchTerm) {
            companies = companies.filter(company => 
                company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                company.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                company.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (selectedLocation !== 'all') {
            companies = companies.filter(company => company.location === selectedLocation);
        }
        if (selectedIndustry !== 'all') {
            companies = companies.filter(company => company.industry === selectedIndustry);
        }
        setFilteredCompanies(companies);

        let industries = [...trendingIndustries];
        if (searchTerm) {
            industries = industries.filter(industry =>
                industry.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredIndustries(industries);

        // Filter talents
        let talents = [...topTalents];
        if (searchTerm) {
            talents = talents.filter(talent =>
                talent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                talent.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                talent.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        if (selectedLocation !== 'all') {
            talents = talents.filter(talent => talent.location === selectedLocation);
        }
        setFilteredTalents(talents);
        
        setCurrentPage(1);
    }, [searchTerm, selectedLocation, selectedIndustry, featuredCompanies, trendingIndustries, topTalents]);

    const locations = ['all', ...new Set(featuredCompanies?.map(c => c.location).filter(Boolean) || [])];
    const industries = ['all', ...new Set(trendingIndustries?.map(i => i.name).filter(Boolean) || [])];
    const jobTypes = ['all', 'Full-time', 'Part-time', 'Remote', 'Contract', 'Freelance', 'Internship'];

    // Pagination for talents
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTalents = filteredTalents.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTalents.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);

    const handleCompanyClick = (companyId, companyName) => {
        router.visit(`/search-jobs?company=${encodeURIComponent(companyName)}`);
    };

    const handleIndustryClick = (industryName) => {
        router.visit(`/search-jobs?industry=${encodeURIComponent(industryName)}`);
    };

    const handleTalentClick = (talentId) => {
        router.visit(`/talent/${talentId}`);
    };

    const handleViewAllJobs = () => {
        let url = '/search-jobs';
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedLocation !== 'all') params.append('location', selectedLocation);
        if (selectedJobType !== 'all') params.append('job_type', selectedJobType);
        if (selectedIndustry !== 'all') params.append('industry', selectedIndustry);
        if (params.toString()) url += '?' + params.toString();
        router.visit(url);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedLocation('all');
        setSelectedJobType('all');
        setSelectedIndustry('all');
    };

    const handleSubscribe = async (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        alert('Subscribed successfully!');
        e.target.reset();
    };

    return (
        <>
            <Head title="Explore - GiftedTalents" />
            
            <AppNavbar 
                user={currentUser} 
                onMenuToggle={toggleMobileSidebar}
                isMenuOpen={mobileSidebarOpen}
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
            />

            {mobileSidebarOpen && <div className="mobile-overlay" onClick={toggleMobileSidebar}></div>}

            <div className={`left ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-single-container">
                    <button className="sidebar-close" onClick={toggleMobileSidebar}>
                        <i className="fas fa-times"></i>
                    </button>

                    <div className="sidebar-profile">
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

                    <div className="sidebar-menu">
                        <div className="menu-item" onClick={() => router.visit('/') }>
                            <i className="fas fa-home"></i> Home
                        </div>
                        <div className="menu-item" onClick={() => router.visit('/dashboard')}>
                            <i className="fas fa-table"></i> Dashboard
                        </div>
                        <div className="menu-item" onClick={() => router.visit('/search-jobs')}>
                            <i className="fas fa-briefcase"></i> Jobs
                        </div>
                        <div className="menu-item active" onClick={() => router.visit('/explore')}>
                            <i className="fas fa-compass"></i> Explore
                        </div>
                        <div className="menu-item" onClick={() => router.visit('/messages')}>
                            <i className="fas fa-envelope"></i> Messages
                        </div>
                        <div className="menu-item" onClick={() => router.visit('/settings')}>
                            <i className="fas fa-gear"></i> Settings
                        </div>
                        <div className="menu-divider"></div>
                        <div className="menu-item" onClick={handleLogout}>
                            <i className="fas fa-right-from-bracket"></i> Logout
                        </div>
                    </div>
                </div>
            </div>

            <div className="explore-page">
                {/* Hero Section */}
                <div className="explore-hero">
                    <div className="explore-hero-content">
                        <span className="hero-badge">✨ Explore Opportunities</span>
                        <h1>Discover Your Next <span className="gradient-text">Chapter</span></h1>
                        <p>Explore industries, companies, and talented professionals ready to work with you.</p>
                        
                        {/* Live Counter Badge */}
                        <div className="live-counter">
                            <span className="live-dot"></span>
                            <span className="live-text">{liveJobCount}+ live jobs</span>
                            <span className="live-update">Updated just now</span>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="hero-search">
                            <div className="search-input-wrapper">
                                <i className="fas fa-search"></i>
                                <input 
                                    type="text" 
                                    placeholder="Search companies, industries, or talents..."
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
                                Explore Now <i className="fas fa-arrow-right"></i>
                            </button>
                        </div>

                        {/* Advanced Filters */}
                        {showFilters && (
                            <div className="advanced-filters">
                                <div className="filter-group">
                                    <label><i className="fas fa-map-marker-alt"></i> Location</label>
                                    <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                                        <option value="all">All Locations</option>
                                        {locations.filter(l => l !== 'all').map(location => (
                                            <option key={location} value={location}>{location}</option>
                                        ))}
                                        <option value="Remote">Remote</option>
                                    </select>
                                </div>
                                <div className="filter-group">
                                    <label><i className="fas fa-briefcase"></i> Job Type</label>
                                    <select value={selectedJobType} onChange={(e) => setSelectedJobType(e.target.value)}>
                                        {jobTypes.map(type => (
                                            <option key={type} value={type === 'all' ? 'all' : type}>
                                                {type === 'all' ? 'All Types' : type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="filter-group">
                                    <label><i className="fas fa-chart-line"></i> Industry</label>
                                    <select value={selectedIndustry} onChange={(e) => setSelectedIndustry(e.target.value)}>
                                        <option value="all">All Industries</option>
                                        {industries.filter(i => i !== 'all').map(industry => (
                                            <option key={industry} value={industry}>{industry}</option>
                                        ))}
                                    </select>
                                </div>
                                {(searchTerm || selectedLocation !== 'all' || selectedJobType !== 'all' || selectedIndustry !== 'all') && (
                                    <button className="clear-filters-btn" onClick={clearFilters}>
                                        <i className="fas fa-times-circle"></i> Clear All
                                    </button>
                                )}
                            </div>
                        )}
                        
                        {/* Stats Section */}
                        <div className="hero-stats">
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
                                <span className="stat-number">{animatedStats.total_placements}+</span>
                                <span className="stat-label">Placements</span>
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
                            <Link href="/search-jobs" className="view-all-link">
                                View All Jobs <i className="fas fa-arrow-right"></i>
                            </Link>
                        </div>
                        
                        {filteredIndustries.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-chart-line"></i>
                                <p>No industries found matching "{searchTerm}"</p>
                                <button onClick={() => setSearchTerm('')} className="clear-search-btn">Clear Search</button>
                            </div>
                        ) : (
                            <div className="industries-grid">
                                {filteredIndustries.map((industry, index) => (
                                    <div 
                                        key={industry.id || index} 
                                        className="industry-card"
                                        onClick={() => handleIndustryClick(industry.name)}
                                    >
                                        {industry.image ? (
                                            <img src={industry.image} alt={industry.name} className="industry-image" />
                                        ) : (
                                            <div className="industry-icon">
                                                <i className={`fas ${industry.icon || 'fa-briefcase'}`}></i>
                                            </div>
                                        )}
                                        <h3>{industry.name}</h3>
                                        <p>{industry.count || industry.job_count || 0}+ Open Positions</p>
                                        <div className="trend-up">
                                            <i className="fas fa-arrow-up"></i> +{industry.growth || 12}%
                                        </div>
                                    </div>
                                ))}
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
                            <Link href="/search-jobs" className="view-all-link">
                                View All <i className="fas fa-arrow-right"></i>
                            </Link>
                        </div>
                        
                        {filteredCompanies.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-building"></i>
                                <p>No companies found matching your criteria</p>
                                <button onClick={clearFilters} className="clear-search-btn">Clear Filters</button>
                            </div>
                        ) : (
                            <div className="companies-grid">
                                {filteredCompanies.map((company, index) => (
                                    <div key={company.id || index} className="company-card" onClick={() => handleCompanyClick(company.id, company.name)}>
                                        <div className="company-logo">
                                            {company.logo ? (
                                                <img src={company.logo} alt={company.name} className="company-logo-img" />
                                            ) : (
                                                <div className="company-logo-placeholder">
                                                    {company.name?.charAt(0)?.toUpperCase() || 'C'}
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="company-name">{company.name}</h3>
                                        <p className="company-desc">{company.description || 'Innovative Solutions Provider'}</p>
                                        <div className="company-location">
                                            <i className="fas fa-map-marker-alt"></i> {company.location || 'Remote Friendly'}
                                        </div>
                                        <div className="company-stats">
                                            <span className="job-count-badge">
                                                <i className="fas fa-briefcase"></i> {company.job_count || 0} Open Positions
                                            </span>
                                        </div>
                                        <button className="view-jobs-btn">View Openings →</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Top Talents Section - NEW (Replaces Skills) */}
                    <div className="section">
                        <div className="section-header">
                            <div className="section-header-left">
                                <span className="section-badge">Talents</span>
                                <h2>Top <span className="gradient-text">Talents</span></h2>
                                <p>Skilled professionals ready to work with you</p>
                            </div>
                        </div>
                        
                        {filteredTalents.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-users"></i>
                                <p>No talents found matching "{searchTerm}"</p>
                                <button onClick={() => setSearchTerm('')} className="clear-search-btn">Clear Search</button>
                            </div>
                        ) : (
                            <>
                                <div className="talents-grid">
                                    {currentTalents.map((talent, index) => {
                                        const url = getAvatarUrl({ profile: { profile_image_base64: talent.profile_image_base64, avatar_url: talent.avatar_url, avatar: talent.avatar }, fallbackName: talent.name, fallbackColor: '4F46E5' });
                                        return (
                                            <div key={talent.id || index} className="talent-card" onClick={() => handleTalentClick(talent.id)}>
                                                <div className="talent-avatar">
                                                    {url ? (
                                                        <img src={url} alt={talent.name} className="talent-avatar-img" onError={(e) => { e.target.style.display = 'none'; }} />
                                                    ) : (
                                                        <div className="talent-avatar-placeholder">{talent.name?.charAt(0)?.toUpperCase() || 'T'}</div>
                                                    )}
                                                    {talent.verified && (
                                                        <div className="verified-badge">
                                                            <i className="fas fa-check-circle"></i>
                                                        </div>
                                                    )}
                                                </div>
                                            <h3 className="talent-name">{talent.name}</h3>
                                            <p className="talent-title">{talent.title || 'Professional'}</p>
                                            <div className="talent-location">
                                                <i className="fas fa-map-marker-alt"></i> {talent.location || 'Remote'}
                                            </div>
                                            <div className="talent-skills">
                                                {(talent.skills || []).slice(0, 3).map((skill, i) => (
                                                    <span key={i} className="talent-skill-tag">{skill}</span>
                                                ))}
                                                {(talent.skills || []).length > 3 && (
                                                    <span className="talent-skill-tag more">+{talent.skills.length - 3}</span>
                                                )}
                                            </div>
                                            <div className="talent-rating">
                                                <i className="fas fa-star"></i>
                                                <span>{talent.rating || 4.5}</span>
                                                <span className="reviews">({talent.reviews || 0} reviews)</span>
                                            </div>
                                            <button className="view-talent-btn">View Profile →</button>
                                        </div>
                                    )}
                                )}
                                </div>
                                
                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="pagination">
                                        <button 
                                            onClick={() => paginate(currentPage - 1)} 
                                            disabled={currentPage === 1}
                                            className="page-btn"
                                        >
                                            <i className="fas fa-chevron-left"></i> Previous
                                        </button>
                                        <span className="page-info">Page {currentPage} of {totalPages}</span>
                                        <button 
                                            onClick={() => paginate(currentPage + 1)} 
                                            disabled={currentPage === totalPages}
                                            className="page-btn"
                                        >
                                            Next <i className="fas fa-chevron-right"></i>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Recent Jobs Section */}
                    {recentJobs && recentJobs.length > 0 && (
                        <div className="section">
                            <div className="section-header">
                                <div className="section-header-left">
                                    <span className="section-badge">Latest</span>
                                    <h2>Recent <span className="gradient-text">Jobs</span></h2>
                                    <p>New opportunities posted recently</p>
                                </div>
                                <Link href="/search-jobs" className="view-all-link">
                                    View All Jobs <i className="fas fa-arrow-right"></i>
                                </Link>
                            </div>
                            
                            <div className="recent-jobs-list">
                                {recentJobs.slice(0, 5).map((job, index) => (
                                    <div key={job.id || index} className="recent-job-card" onClick={() => router.visit(`/jobs/${job.id}`)}>
                                        <div className="job-card-left">
                                            <div className="job-company-logo">
                                                {job.company_logo ? (
                                                    <img src={job.company_logo} alt={job.company} />
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

                    {/* Newsletter Section */}
                    <div className="newsletter-section">
                        <div className="newsletter-content">
                            <div className="newsletter-icon">
                                <i className="fas fa-envelope-open-text"></i>
                            </div>
                            <h3>Get Job Alerts</h3>
                            <p>Subscribe to receive personalized job recommendations straight to your inbox</p>
                            <form className="newsletter-form" onSubmit={handleSubscribe}>
                                <input type="email" placeholder="Enter your email address" required />
                                <button type="submit">Subscribe <i className="fas fa-paper-plane"></i></button>
                            </form>
                            <p className="newsletter-note">We respect your privacy. Unsubscribe anytime.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}