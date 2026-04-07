import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import AppNavbar from '../Components/AppNavbar';
import '../../css/explore.css';

export default function Explore({ auth, featuredJobs = [], featuredTalents = [], popularCompanies = [], categories = [] }) {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showQuickView, setShowQuickView] = useState(false);
    
    const heroRef = useRef(null);
    const currentUser = auth?.user;

    // Helper function to safely get skills array
    const getSkillsArray = (skills) => {
        if (!skills) return [];
        if (Array.isArray(skills)) return skills;
        if (typeof skills === 'string') {
            try {
                const parsed = JSON.parse(skills);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                return skills.split(',').map(s => s.trim());
            }
        }
        return [];
    };

    // Categories for filtering
    const jobCategories = [
        { id: 'all', name: 'All', icon: 'fa-grid-2' },
        { id: 'technology', name: 'Technology', icon: 'fa-code', color: '#3b82f6' },
        { id: 'design', name: 'Design', icon: 'fa-pen-ruler', color: '#ec4899' },
        { id: 'marketing', name: 'Marketing', icon: 'fa-chart-line', color: '#f59e0b' },
        { id: 'business', name: 'Business', icon: 'fa-briefcase', color: '#10b981' },
        { id: 'remote', name: 'Remote', icon: 'fa-globe', color: '#8b5cf6' },
    ];

    // Filter jobs
    const filteredJobs = featuredJobs.filter(job => {
        if (searchQuery) {
            return job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   job.company?.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
    });

    const handleQuickView = (job, e) => {
        e.stopPropagation();
        setSelectedJob(job);
        setShowQuickView(true);
    };

    const formatDate = (date) => {
        if (!date) return 'Just posted';
        const d = new Date(date);
        const now = new Date();
        const diffTime = Math.abs(now - d);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getInitials = (name) => {
        return name?.charAt(0).toUpperCase() || '?';
    };

    return (
        <>
            <Head title="Explore - GiftedTalents" />
            
            <AppNavbar 
                user={currentUser} 
                onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                isMenuOpen={mobileSidebarOpen}
            />

            <div className="explore-page-premium">
                {/* Hero Section - Full Width with Parallax Effect */}
                <div className="premium-hero" ref={heroRef}>
                    <div className="premium-hero-overlay"></div>
                    <div className="premium-hero-content">
                        <div className="premium-hero-badge">
                            <span className="pulse-dot"></span>
                            Explore Opportunities
                        </div>
                        <h1 className="premium-hero-title">
                            Discover Your <span className="gradient-text-premium">Dream Career</span>
                        </h1>
                        <p className="premium-hero-subtitle">
                            Thousands of jobs, talents, and companies waiting for you
                        </p>
                        
                        {/* Premium Search Bar */}
                        <div className="premium-search-wrapper">
                            <div className="premium-search-bar">
                                <i className="fas fa-search"></i>
                                <input 
                                    type="text" 
                                    placeholder="Search for jobs, companies, or keywords..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button className="premium-search-btn">
                                    <i className="fas fa-arrow-right"></i>
                                    Search
                                </button>
                            </div>
                        </div>
                        
                        {/* Trending Tags */}
                        <div className="premium-trending">
                            <span className="trending-label">Trending:</span>
                            <div className="trending-tags">
                                <span>Remote Work</span>
                                <span>AI Engineering</span>
                                <span>UX Design</span>
                                <span>Data Science</span>
                                <span>Product Manager</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Floating Stats Cards */}
                    <div className="premium-stats-cards">
                        <div className="stat-card">
                            <div className="stat-icon"><i className="fas fa-briefcase"></i></div>
                            <div className="stat-info">
                                <span className="stat-number">2,500+</span>
                                <span className="stat-label">Live Jobs</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon"><i className="fas fa-users"></i></div>
                            <div className="stat-info">
                                <span className="stat-number">1,200+</span>
                                <span className="stat-label">Top Talents</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon"><i className="fas fa-building"></i></div>
                            <div className="stat-info">
                                <span className="stat-number">800+</span>
                                <span className="stat-label">Companies</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon"><i className="fas fa-trophy"></i></div>
                            <div className="stat-info">
                                <span className="stat-number">98%</span>
                                <span className="stat-label">Success Rate</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Showcase - Horizontal Scroll */}
                <div className="premium-categories">
                    <div className="section-container">
                        <div className="section-header-premium">
                            <div className="header-left">
                                <span className="section-badge">Categories</span>
                                <h2>Browse by <span className="gradient-text-premium">Field</span></h2>
                            </div>
                            <div className="category-nav">
                                <button className="cat-prev"><i className="fas fa-chevron-left"></i></button>
                                <button className="cat-next"><i className="fas fa-chevron-right"></i></button>
                            </div>
                        </div>
                        <div className="categories-scroll">
                            {jobCategories.map(cat => (
                                <div 
                                    key={cat.id} 
                                    className={`category-card ${activeCategory === cat.id ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(cat.id)}
                                    style={{ '--cat-color': cat.color }}
                                >
                                    <div className="category-icon">
                                        <i className={`fas ${cat.icon}`}></i>
                                    </div>
                                    <h4>{cat.name}</h4>
                                    <span className="category-count">{Math.floor(Math.random() * 200) + 50}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Featured Jobs - Premium Grid */}
                <div className="premium-jobs-section">
                    <div className="section-container">
                        <div className="section-header-premium">
                            <div className="header-left">
                                <span className="section-badge">Latest Opportunities</span>
                                <h2>Featured <span className="gradient-text-premium">Jobs</span></h2>
                                <p>Hand-picked opportunities from top companies</p>
                            </div>
                            <Link href="/search-jobs" className="view-all-premium">
                                View All Jobs <i className="fas fa-arrow-right"></i>
                            </Link>
                        </div>
                        
                        <div className="premium-jobs-grid">
                            {filteredJobs.slice(0, 6).map((job) => (
                                <div key={job.id} className="premium-job-card" onClick={() => router.visit(`/jobs/${job.id}`)}>
                                    <div className="job-card-badge">
                                        <span className="featured-badge">Featured</span>
                                        <span className="job-type-badge-premium">{job.job_type || 'Full-time'}</span>
                                    </div>
                                    <div className="job-card-company">
                                        <div className="company-logo-premium">
                                            {job.company_logo ? (
                                                <img src={job.company_logo} alt={job.company} />
                                            ) : (
                                                <div className="logo-placeholder">{getInitials(job.company)}</div>
                                            )}
                                        </div>
                                        <div className="company-info">
                                            <h4>{job.company}</h4>
                                            <div className="company-rating">
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star-half-alt"></i>
                                                <span>(4.8)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="job-title-premium">{job.title}</h3>
                                    <div className="job-details-premium">
                                        <div className="detail-item">
                                            <i className="fas fa-map-marker-alt"></i>
                                            <span>{job.location}</span>
                                        </div>
                                        {job.salary_range && (
                                            <div className="detail-item">
                                                <i className="fas fa-dollar-sign"></i>
                                                <span>{job.salary_range}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="job-footer-premium">
                                        <span className="job-time-premium">
                                            <i className="far fa-clock"></i> {formatDate(job.created_at)}
                                        </span>
                                        <button 
                                            className="quick-view-btn"
                                            onClick={(e) => handleQuickView(job, e)}
                                        >
                                            Quick View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Featured Talents - Premium Carousel - FIXED with safe skills handling */}
                <div className="premium-talents-section">
                    <div className="section-container">
                        <div className="section-header-premium">
                            <div className="header-left">
                                <span className="section-badge">Top Professionals</span>
                                <h2>Featured <span className="gradient-text-premium">Talents</span></h2>
                                <p>Connect with industry experts and rising stars</p>
                            </div>
                            <Link href="/find-talents" className="view-all-premium">
                                View All Talents <i className="fas fa-arrow-right"></i>
                            </Link>
                        </div>
                        
                        <div className="premium-talents-grid">
                            {featuredTalents.slice(0, 4).map((talent) => {
                                const talentSkills = getSkillsArray(talent.skills);
                                return (
                                    <div key={talent.id} className="premium-talent-card" onClick={() => router.visit(`/talent/${talent.id}`)}>
                                        <div className="talent-card-premium-header">
                                            <div className="talent-avatar-premium">
                                                {talent.avatar ? (
                                                    <img src={talent.avatar} alt={talent.name} />
                                                ) : (
                                                    <div className="avatar-premium-placeholder">{getInitials(talent.name)}</div>
                                                )}
                                            </div>
                                            <div className="talent-status-badge">
                                                <span className="status-dot"></span>
                                                Available
                                            </div>
                                        </div>
                                        <h3 className="talent-name-premium">{talent.name}</h3>
                                        <p className="talent-title-premium">{talent.title || 'Professional'}</p>
                                        <div className="talent-skills-premium">
                                            {talentSkills.slice(0, 3).map((skill, idx) => (
                                                <span key={idx} className="skill-premium-tag">{skill}</span>
                                            ))}
                                        </div>
                                        <div className="talent-footer-premium">
                                            <div className="talent-rating-premium">
                                                <i className="fas fa-star"></i>
                                                <span>{talent.rating || 4.5}</span>
                                            </div>
                                            <button className="connect-btn">Connect</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Companies Spotlight */}
                <div className="premium-companies-section">
                    <div className="section-container">
                        <div className="section-header-premium">
                            <div className="header-left">
                                <span className="section-badge">Top Employers</span>
                                <h2>Companies <span className="gradient-text-premium">Spotlight</span></h2>
                                <p>Join companies that are hiring now</p>
                            </div>
                        </div>
                        
                        <div className="premium-companies-grid">
                            {popularCompanies.slice(0, 8).map((company, idx) => (
                                <div key={idx} className="premium-company-card">
                                    <div className="company-logo-premium-circle">
                                        {company.logo ? (
                                            <img src={company.logo} alt={company.name} />
                                        ) : (
                                            <div className="logo-circle-placeholder">{getInitials(company.name)}</div>
                                        )}
                                    </div>
                                    <h4>{company.name}</h4>
                                    <p>{company.location || 'Global'}</p>
                                    <span className="job-count-badge">{company.job_count || 0} open positions</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="premium-cta-section">
                    <div className="cta-container">
                        <div className="cta-content">
                            <h2>Ready to take the next step?</h2>
                            <p>Join thousands of professionals who found their dream job through GiftedTalents</p>
                            <div className="cta-buttons">
                                {!currentUser ? (
                                    <>
                                        <Link href={route('register')} className="cta-btn-primary">
                                            Get Started Free <i className="fas fa-arrow-right"></i>
                                        </Link>
                                        <Link href={route('login')} className="cta-btn-secondary">
                                            Sign In
                                        </Link>
                                    </>
                                ) : (
                                    <Link href="/search-jobs" className="cta-btn-primary">
                                        Browse Jobs <i className="fas fa-arrow-right"></i>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick View Modal */}
                {showQuickView && selectedJob && (
                    <div className="quickview-modal" onClick={() => setShowQuickView(false)}>
                        <div className="quickview-content" onClick={(e) => e.stopPropagation()}>
                            <button className="quickview-close" onClick={() => setShowQuickView(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                            <div className="quickview-header">
                                <div className="quickview-company-logo">
                                    {selectedJob.company_logo ? (
                                        <img src={selectedJob.company_logo} alt={selectedJob.company} />
                                    ) : (
                                        <div className="logo-placeholder">{getInitials(selectedJob.company)}</div>
                                    )}
                                </div>
                                <div className="quickview-info">
                                    <h3>{selectedJob.title}</h3>
                                    <p>{selectedJob.company} • {selectedJob.location}</p>
                                </div>
                            </div>
                            <div className="quickview-body">
                                <div className="quickview-section">
                                    <h4>Job Type</h4>
                                    <span className="job-type-badge-premium">{selectedJob.job_type || 'Full-time'}</span>
                                </div>
                                {selectedJob.salary_range && (
                                    <div className="quickview-section">
                                        <h4>Salary Range</h4>
                                        <p>{selectedJob.salary_range}</p>
                                    </div>
                                )}
                                <div className="quickview-section">
                                    <h4>Posted Date</h4>
                                    <p>{formatDate(selectedJob.created_at)}</p>
                                </div>
                            </div>
                            <div className="quickview-footer">
                                <button 
                                    className="apply-now-btn"
                                    onClick={() => {
                                        setShowQuickView(false);
                                        router.visit(`/easy-apply-job?job_id=${selectedJob.id}`);
                                    }}
                                >
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}