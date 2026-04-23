import { Head, Link, router } from '@inertiajs/react';
<<<<<<< HEAD
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
=======
import { useState, useEffect } from 'react';
import '../../css/explore.css';
import '../../css/nav.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ApplicationLogo from '@/Components/ApplicationLogo';

// Nav Component
function Nav() {
    const [isActive, setIsActive] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <a className="logo">
                <ApplicationLogo className="w-20 h-10 mr-2" />
            </a>
            <ul className={`nav-links ${isActive ? 'active' : ''}`}>
                <li><Link href="/" className="nav-link">Home</Link></li>
                <li><Link href="/jobs" className="nav-link">Find Jobs</Link></li>
                <li><Link href="/find-talents" className="nav-link">Find Talents</Link></li>
                <li><Link href="/how-it-works" className="nav-link">How It Works</Link></li>
                <li><Link href="/about" className="nav-link">About</Link></li>
                <li><Link href="/contact" className="nav-link">Contact</Link></li>
            </ul>
            <div className="nav-right">
                <div className="auth-links">
                    <Link href={route('login')} className="nav-auth-link">Sign In</Link>
                    <Link href={route('register')} className="get-started">Get Started</Link>
                </div>
                <div className={`hamburger ${isActive ? 'active' : ''}`} onClick={() => setIsActive(!isActive)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    );
}

export default function Explore({ jobs = [] }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredJobs, setFilteredJobs] = useState([]);

    const categories = [
        {
            id: "technology",
            title: "Technology",
            description: "Software development, IT, and tech roles",
            icon: <i className="fas fa-laptop-code explore-icon-font"></i>,
            color: "#3B82F6",
            keywords: [
                "developer", "engineer", "programmer", "software", "tech", "it",
                "full-stack", "frontend", "backend", "php", "javascript", "react",
                "node.js", "python", "laravel", "vue", "angular", "wordpress",
                "devops", "cloud", "aws", "database", "sql", "api", "mobile",
                "android", "ios", "flutter", "react native", "web developer",
                "software engineer", "coding", "programming", "full stack"
            ]
        },
        {
            id: "design",
            title: "Design",
            description: "UI/UX, graphic design, creative roles",
            icon: <i className="fas fa-palette explore-icon-font"></i>,
            color: "#10B981",
            keywords: [
                "designer", "ui", "ux", "graphic", "creative", "figma", "adobe",
                "photoshop", "illustrator", "indesign", "xd", "sketch", "prototyping",
                "wireframe", "visual design", "product design", "web design",
                "branding", "logo", "typography", "motion design", "animation",
                "creative director", "art director", "multimedia"
            ]
        },
        {
            id: "marketing",
            title: "Marketing",
            description: "Digital marketing, SEO, content creation",
            icon: <i className="fas fa-bullhorn explore-icon-font"></i>,
            color: "#F59E0B",
            keywords: [
                "marketing", "seo", "content", "social media", "digital marketing",
                "brand", "analytics", "google ads", "facebook ads", "email marketing",
                "content writer", "copywriter", "blogger", "influencer", "ppc",
                "marketing manager", "growth hacker", "cmo", "market research",
                "product marketing", "brand manager", "campaign manager"
            ]
        },
        {
            id: "finance",
            title: "Finance",
            description: "Accounting, banking, financial analysis",
            icon: <i className="fas fa-chart-line explore-icon-font"></i>,
            color: "#EF4444",
            keywords: [
                "finance", "accounting", "banking", "analyst", "financial", "audit",
                "tax", "bookkeeping", "cpa", "accountant", "controller", "cfo",
                "investment", "wealth management", "financial planning", "budgeting",
                "forecasting", "risk management", "compliance", "payroll", "treasury"
            ]
        },
        {
            id: "sales",
            title: "Sales",
            description: "Business development, account management",
            icon: <i className="fas fa-handshake explore-icon-font"></i>,
            color: "#8B5CF6",
            keywords: [
                "sales", "business development", "account manager", "b2b",
                "client relations", "account executive", "sales representative",
                "sales manager", "business development manager", "bdm", "sdr",
                "sales development", "account management", "customer success",
                "territory manager", "regional sales", "inside sales", "outside sales"
            ]
        },
        {
            id: "support",
            title: "Customer Support",
            description: "Support, success, client relations",
            icon: <i className="fas fa-headset explore-icon-font"></i>,
            color: "#EC4899",
            keywords: [
                "support", "customer service", "client success", "help desk",
                "customer care", "technical support", "it support", "desktop support",
                "helpdesk", "service desk", "customer experience", "cx",
                "client support", "customer relations", "call center", "live chat",
                "ticket support", "customer satisfaction", "csat", "nps"
            ]
        },
        {
            id: "other",
            title: "Other Opportunities",
            description: "Administrative, operations, and general roles",
            icon: <i className="fas fa-briefcase explore-icon-font"></i>,
            color: "#6B7280",
            keywords: [
                "administrative", "operations", "general", "coordinator", "assistant",
                "office manager", "receptionist", "data entry", "clerk", "secretary",
                "hr", "human resources", "recruiter", "talent acquisition",
                "project manager", "product manager", "scrum master", "agile coach",
                "business analyst", "quality assurance", "qa", "tester"
            ]
        }
    ];

    const handleCategoryClick = (category) => {
        if (selectedCategory === category.id) {
            setSelectedCategory(null);
            setFilteredJobs([]);
        } else {
            setSelectedCategory(category.id);
            const filtered = jobs.filter(job => {
                const jobTitle = (job.job_title || '').toLowerCase();
                const jobDescription = (job.description || '').toLowerCase();
                const jobType = (job.job_type || '').toLowerCase();

                return category.keywords.some(keyword =>
                    jobTitle.includes(keyword) ||
                    jobDescription.includes(keyword) ||
                    jobType.includes(keyword)
                );
            });
            setFilteredJobs(filtered);
        }
    };

    const clearFilter = () => {
        setSelectedCategory(null);
        setFilteredJobs([]);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const navigateTo = (path) => {
        router.get(path);
>>>>>>> 570c33df8fcdd2af22d99b895072e53c9f9a6954
    };

    return (
        <>
            <Head title="Explore - GiftedTalents" />
<<<<<<< HEAD
            
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
=======

            <div className="explore-page">
                <Nav />

                <section className="explore-hero">
                    <div className="explore-hero-content">
                        <h1>Explore Opportunities</h1>
                        <p>Discover jobs across various industries and find your perfect match</p>
                    </div>
                </section>

                <section className="explore-categories">
                    <div className="explore-container">
                        <h2>Browse by Category</h2>
                        <div className="categories-grid">
                            {categories.map((category, index) => (
                                <div
                                    key={index}
                                    className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                                    onClick={() => handleCategoryClick(category)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="category-icon" style={{ background: category.color }}>
                                        {category.icon}
                                    </div>
                                    <h3>{category.title}</h3>
                                    <p>{category.description}</p>
                                    <span className="job-count">
                                        {jobs.filter(job => {
                                            const jobTitle = (job.job_title || '').toLowerCase();
                                            const jobDescription = (job.description || '').toLowerCase();
                                            return category.keywords.some(keyword =>
                                                jobTitle.includes(keyword) || jobDescription.includes(keyword)
                                            );
                                        }).length} jobs available
                                    </span>
                                    <Link
                                        href={`/jobs?category=${category.id}`}
                                        className="explore-btn"
                                    >
                                        Explore Jobs
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {selectedCategory && (
                    <section className="filtered-jobs">
                        <div className="explore-container">
                            <div className="filtered-header">
                                <h2>{categories.find(c => c.id === selectedCategory)?.title} Jobs</h2>
                                <button onClick={clearFilter} className="clear-filter-btn">Clear Filter</button>
                            </div>

                            {filteredJobs.length === 0 ? (
                                <div className="no-jobs">
                                    <p>No jobs found in this category yet.</p>
                                </div>
                            ) : (
                                <div className="jobs-list">
                                    {filteredJobs.map((job) => (
                                        <div key={job.id} className="job-item">
                                            <div className="job-item-header">
                                                <h3>{job.job_title}</h3>
                                                <span className="job-type">{job.job_type}</span>
                                            </div>
                                            <p className="company-name">{job.company_name}</p>
                                            <p className="job-location">{job.location}</p>
                                            <p className="job-salary">{job.salary_range}</p>
                                            <div className="job-footer">
                                                <span className="job-date">Posted {formatDate(job.created_at)}</span>
                                                <Link href={`/jobs/${job.id}`} className="view-job-btn">View Details</Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                )}

                <section className="explore-cta">
                    <div className="explore-container">
                        <h2>Ready to start your journey?</h2>
                        <p>Join thousands of professionals already using GiftedTalents</p>
                        <div className="cta-buttons">
                            <Link href="/register" className="btn-primary">Get Started</Link>
                            <Link href="/jobs" className="btn-secondary">Browse All Jobs</Link>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
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
>>>>>>> 570c33df8fcdd2af22d99b895072e53c9f9a6954
            </div>
        </>
    );
}