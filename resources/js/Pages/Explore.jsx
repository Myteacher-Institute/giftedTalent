import { Head, Link, router } from '@inertiajs/react';
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
    };

    return (
        <>
            <Head title="Explore - GiftedTalents" />

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
            </div>
        </>
    );
}