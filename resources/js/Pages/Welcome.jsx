import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import '../../css/nav.css';
import '../../css/hero.css';
import '../../css/feature.css';
import '../../css/welcome.css';
import '../../css/feature_talent_section.css';

import starIcon from '../../assets/svg/star.svg';
import halfStarIcon from '../../assets/svg/half-star.svg';
import heroImage from '../../assets/img/giftedtalentimage.png';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Footer from '@/Components/Footer';
import Faq from '@/Components/Faq';

// Counter Component
function Counter({ target, suffix = "", duration = 2000 }) {
    const [count, setCount] = useState(0);
    const containerRef = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    // Parse target number (remove +, %, etc)
    const targetNumber = parseInt(target.toString().replace(/[^0-9]/g, ''));
    const isPercentage = target.toString().includes('%');
    const isPlus = target.toString().includes('+');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    let start = 0;
                    const increment = targetNumber / (duration / 16);

                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= targetNumber) {
                            setCount(targetNumber);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(start));
                        }
                    }, 16);

                    return () => clearInterval(timer);
                } else if (!entries[0].isIntersecting && hasAnimated) {
                    // Reset when leaving view
                    setHasAnimated(false);
                    setCount(0);
                }
            },
            { threshold: 0.3 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [targetNumber, duration, hasAnimated]);

    let displayValue = count;
    if (isPercentage) {
        displayValue = count + '%';
    } else if (isPlus) {
        displayValue = count + '+';
    } else {
        displayValue = count;
    }

    return (
        <div ref={containerRef} className="counter-container">
            <span className="stat-number">{displayValue}{suffix}</span>
        </div>
    );
}

// Nav Component
function Nav({ auth }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="logo">
                    <ApplicationLogo className="w-20 h-10 mr-2" />
                </div>

                {/* Desktop Navigation */}
                <ul className="nav-links">
                    <li><Link href="/" className="nav-link">Home</Link></li>
                    <li><Link href="/jobs" className="nav-link">Find Jobs</Link></li>
                    <li><Link href="/find-talents" className="nav-link">Find Talents</Link></li>
                    <li><Link href="/how-it-works" className="nav-link">How It Works</Link></li>
                    <li><Link href="/about" className="nav-link">About</Link></li>
                    <li><Link href="/contact" className="nav-link">Contact</Link></li>
                </ul>

                <div className="nav-right">
                    <div className="auth-links">
                        {auth.user ? (
                            <Link href='/dashboard' className="nav-auth-link">Dashboard</Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="nav-auth-link">Sign In</Link>
                                <Link href={route('register')} className="get-started">Get Started</Link>
                            </>
                        )}
                    </div>

                    {/* Hamburger Menu Button */}
                    <div
                        className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
                        onClick={toggleMobileMenu}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="mobile-menu-overlay" onClick={closeMobileMenu}>
                    <div className="mobile-menu-container" onClick={(e) => e.stopPropagation()}>
                        <div className="mobile-menu-header">
                            <span className="mobile-menu-title">Menu</span>
                            <button className="mobile-menu-close" onClick={closeMobileMenu}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div className="mobile-menu-links">
                            <Link href="/" onClick={closeMobileMenu}>Home</Link>
                            <Link href="/jobs" onClick={closeMobileMenu}>Find Jobs</Link>
                            <Link href="/find-talents" onClick={closeMobileMenu}>Find Talents</Link>
                            <Link href="/how-it-works" onClick={closeMobileMenu}>How It Works</Link>
                            <Link href="/about" onClick={closeMobileMenu}>About</Link>
                            <Link href="/contact" onClick={closeMobileMenu}>Contact</Link>

                            {auth.user && (
                                <Link href='/dashboard' onClick={closeMobileMenu}>Dashboard</Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// Hero Component
function Hero() {
    return (
        <div className="hero">
            <div className="circle1"></div>
            <div className="circle2"></div>
            <div className="hero-left">
                <h1>Discover opportunities. <span>Showcase Your Talent.</span></h1>
                <p>Connect with top employers and talented professionals. <br></br> Your dream job or ideal candidate is just a click away.</p>
                <div className="hero-buttons">
                    <button
                        className="btn-primary"
                        onClick={() => window.location.href = '/jobs'}
                    >
                        Find Jobs
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => window.location.href = '/find-talents'}
                    >
                        Hire Talent
                    </button>
                </div>
            </div>
            <div className="hero-right">
                <img src={heroImage} alt="Hero" />
            </div>
        </div>
    );
}

export default function Welcome({ auth, laravelVersion, phpVersion, jobs = [], featuredTalents = [] }) {
    // State for search inputs
    const [searchInputs, setSearchInputs] = useState({
        keyword: '',
        skill: '',
        location: ''
    });

    // State for search results
    const [searchResults, setSearchResults] = useState([]);

    // State for loading and error
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Toast notification state
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: 'info'
    });

    // Auth Modal state
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [intendedAction, setIntendedAction] = useState(null);
    const [intendedData, setIntendedData] = useState(null);

    // Auto-hide toast after 3 seconds
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast(prev => ({ ...prev, show: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    // Swiper functionality for mobile horizontal scroll
    useEffect(() => {
        const container = document.querySelector('.talent-swiper-container');
        if (container) {
            let isDown = false;
            let startX;
            let scrollLeft;

            const handleMouseDown = (e) => {
                isDown = true;
                startX = e.pageX - container.offsetLeft;
                scrollLeft = container.scrollLeft;
            };

            const handleMouseLeave = () => {
                isDown = false;
            };

            const handleMouseUp = () => {
                isDown = false;
            };

            const handleMouseMove = (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - container.offsetLeft;
                const walk = (x - startX) * 2;
                container.scrollLeft = scrollLeft - walk;
            };

            container.addEventListener('mousedown', handleMouseDown);
            container.addEventListener('mouseleave', handleMouseLeave);
            container.addEventListener('mouseup', handleMouseUp);
            container.addEventListener('mousemove', handleMouseMove);

            return () => {
                container.removeEventListener('mousedown', handleMouseDown);
                container.removeEventListener('mouseleave', handleMouseLeave);
                container.removeEventListener('mouseup', handleMouseUp);
                container.removeEventListener('mousemove', handleMouseMove);
            };
        }
    }, [featuredTalents]);

    // Function to show toast messages
    const showToast = (message, type = 'info') => {
        setToast({
            show: true,
            message,
            type
        });
    };

    // Function to check if user is authenticated
    const isAuthenticated = () => {
        return auth && auth.user !== null;
    };

    // Function to handle protected actions with modal
    const requireAuthWithModal = (action, event, data = null) => {
        if (!isAuthenticated()) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            setIntendedAction(action);
            setIntendedData(data);
            setShowAuthModal(true);
            return false;
        }
        return true;
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchInputs(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle search - Redirect to search results page
    const handleSearch = () => {
        const hasSearchCriteria = searchInputs.keyword || searchInputs.skill || searchInputs.location;

        if (!hasSearchCriteria) {
            showToast('Please enter at least one search criteria', 'error');
            return;
        }

        // Build query parameters
        const params = new URLSearchParams();
        if (searchInputs.keyword) params.append('keyword', searchInputs.keyword);
        if (searchInputs.skill) params.append('skill', searchInputs.skill);
        if (searchInputs.location) params.append('location', searchInputs.location);
        
        // Redirect to search results page with query parameters
        router.visit(`/search-results?${params.toString()}`);
    };

    // Handle apply button click
    const handleApplyClick = (job, event) => {
        if (requireAuthWithModal('apply_job', event, job)) {
            router.visit(`/easy-apply-job/${job.id}`);
        }
    };

    // Handle view profile click
    const handleViewProfile = (talent, event) => {
        if (requireAuthWithModal('view_profile', event, talent)) {
            router.visit(`/talent/${talent.id}`);
        }
    };

    // Handle saved jobs
    const handleSaveJob = async (job, event) => {
        if (requireAuthWithModal('save_job', event, job)) {
            event.preventDefault();
            event.stopPropagation();

            try {
                const response = await fetch(`/saved-jobs/${job.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                        'Accept': 'application/json'
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    showToast(data.message || 'Job saved successfully!', 'success');
                } else {
                    showToast(data.message || 'Failed to save job', 'error');
                }
            } catch (error) {
                showToast('Network error. Please try again.', 'error');
                console.error('Save job error:', error);
            }
        }
    };

    // Get initials for avatar fallback
    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Get action data display
    const getActionDataDisplay = () => {
        if (!intendedData) return null;
        if (intendedAction === 'apply_job' || intendedAction === 'save_job') {
            return intendedData.job_title || intendedData.title || intendedData.role;
        }
        if (intendedAction === 'view_profile') {
            return intendedData.name;
        }
        return null;
    };

    // Safely get skills array from talent data - FIXED VERSION
    const getTalentSkills = (talent) => {
        let skillsArray = [];

        // Check if skills exists
        if (!talent.skills) {
            return skillsArray;
        }

        // If it's already an array
        if (Array.isArray(talent.skills)) {
            skillsArray = talent.skills;
        }
        // If it's a string
        else if (typeof talent.skills === 'string') {
            try {
                // Try to parse as JSON
                const parsed = JSON.parse(talent.skills);
                if (Array.isArray(parsed)) {
                    skillsArray = parsed;
                } else {
                    // If not JSON array, split by comma
                    skillsArray = talent.skills.split(',').map(s => s.trim());
                }
            } catch (e) {
                // If JSON parsing fails, split by comma
                skillsArray = talent.skills.split(',').map(s => s.trim());
            }
        }
        // If it's something else (like object)
        else if (typeof talent.skills === 'object') {
            skillsArray = Object.values(talent.skills);
        }

        // Filter out any non-string values and limit to 3
        return skillsArray.filter(skill => typeof skill === 'string' && skill.length > 0).slice(0, 3);
    };

    return (
        <>
            <Head title="GiftedTalents" />

            <div className="home-screen">
                <Nav auth={auth} />

                <Hero />

                {/* search bar */}
                <div className="search-container">
                    <div className="search-box">
                        <div className="search-inputs">
                            <div className="input-with-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                <input
                                    type="text"
                                    name="keyword"
                                    placeholder="Job title or Keyword"
                                    value={searchInputs.keyword}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="input-with-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                    <path d="M16 3H8v4h8V3z"></path>
                                </svg>
                                <input
                                    type="text"
                                    name="skill"
                                    placeholder="Skill"
                                    value={searchInputs.skill}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="input-with-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1118 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="Location"
                                    value={searchInputs.location}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <button onClick={handleSearch} className="search-button">Search Jobs</button>
                    </div>
                </div>

                <section className="about-story">
                    <div className="about-hero-content">
                        <h1>About GiftedTalents</h1>
                        <p>We're on a mission to transform the way talent meets opportunity.</p>
                    </div>
                    <div className="story-container">
                        <div className="story-image">
                            <img src="/assets/svg/hero-image.jpg" alt="Our Story" />
                        </div>
                        <div className="story-text">
                            <h2>Our Story</h2>
                            <p>GiftedTalents was born from a simple idea: connecting talented professionals with companies that need them shouldn't be complicated. Founded in 2026, we set out to create a platform that puts people first.</p>
                            <p>Today, we've helped thousands of professionals find meaningful work and hundreds of companies build exceptional teams. Our journey is just beginning, and we're excited to continue growing with our community.</p>
                            <div className="story-footer">
                                <Link href="/how-it-works" className="story-btn">Learn How It Works</Link>
                                <a
                                    href="https://wa.link/a7ft7n"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="whatsapp-icon-link"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.277-.582c.949.544 2.017.83 3.09.831 3.18 0 5.767-2.586 5.768-5.766.001-3.18-2.585-5.767-5.766-5.767zm-.001 10.285c-.893 0-1.77-.24-2.537-.692l-.18-.108-1.359.348.356-1.325-.117-.186c-.462-.742-.707-1.6-.707-2.477 0-2.553 2.077-4.63 4.63-4.63 2.553 0 4.63 2.077 4.63 4.63 0 2.553-2.077 4.63-4.63 4.63zm2.62-3.453c-.144-.072-.852-.42-.984-.468-.132-.048-.228-.072-.324.072-.096.144-.372.468-.456.564-.084.096-.168.108-.312.036-.144-.072-.608-.224-1.158-.714-.432-.384-.72-.858-.804-1.002-.084-.144-.012-.222.06-.294.064-.072.144-.168.216-.252.072-.084.096-.144.144-.24.048-.096.024-.18-.012-.252-.036-.072-.324-.78-.444-1.068-.12-.288-.24-.24-.324-.252-.084-.012-.18-.012-.276-.012-.096 0-.252.036-.384.18-.132.144-.504.492-.504 1.2 0 .708.516 1.392.588 1.488.072.096 1.008 1.548 2.448 2.172.348.144.612.228.828.288.348.108.672.084.924.048.276-.036.852-.348.972-.684.12-.336.12-.624.084-.684-.036-.06-.132-.096-.276-.168z" />
                                    </svg>
                                    <span>Chat on WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission Section with Counter */}
                <section className="about-mission">
                    <div className="mission-container">
                        <div className="mission-text">
                            <h2>Our Mission</h2>
                            <p>To empower professionals and employers by creating a seamless, transparent, and efficient platform where talent meets opportunity. We believe that everyone deserves to find work they love and companies deserve to find the talent they need.</p>
                            {/* <div className="mission-stats">
                                {stats.map((stat, index) => (
                                    <div key={index} className="stat-item">
                                        <Counter target={stat.number} duration={2000} />
                                        <span className="stat-label">{stat.label}</span>
                                    </div>
                                ))}
                            </div> */}
                        </div>
                        <div className="mission-image">
                            <img src="/assets/svg/01f7c576-04bb-4d9e-b318-158c701bfeda 1.jpg" alt="Our Mission" />
                        </div>
                    </div>
                </section>

                {/* christopher - Featured Jobs Section */}
                <div className="feature-jobs">

                    <div className="jobs-wrapper">
                        <div className="jobs-header">
                            <h2 className="jobs-title">Featured Jobs</h2>
                            <p className="jobs-subtitle">Top opportunities from verified employers</p>
                        </div>

                        <div className="jobs-grid">
                            {jobs.length > 0 ? (
                                jobs.map((job) => {
                                    // Determine job type styling
                                    const getJobTypeStyle = () => {
                                        const jobType = job.job_type || job.type || 'Full-time';
                                        const type = jobType.toLowerCase();

                                        if (type === 'contract' || type === 'part-time') {
                                            return { className: 'job-type job-type-blue', id: '' };
                                        }
                                        if (type === 'full-time' || type === 'remote') {
                                            return { className: 'job-type job-type-green', id: '' };
                                        }
                                        return { className: 'job-type', id: '' };
                                    };

                                    const jobTypeStyle = getJobTypeStyle();
                                    // Get tags array - default empty array if none
                                    const tags = job.tags || [];

                                    return (
                                        <div key={job.id} className="job-card">
                                            <div className="job-card-header">
                                                <div className='job-icon'>
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
                                                        <div className="company-initial">
                                                            {job.company_name?.charAt(0)?.toUpperCase() || 'C'}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className={jobTypeStyle.className} id={jobTypeStyle.id}>
                                                    {job.job_type || job.type || 'Full-time'}
                                                </span>
                                            </div>
                                            <h3 className="job-title">{job.job_title || job.title || 'Job Title'}</h3>
                                            <p className="job-company">{job.company_name || job.company || 'Company Name'}</p>


                                            <div className="job-details">
                                                <div className="job-location">
                                                    <img src="/assets/svg/location.svg" alt="" className="location-icon" />
                                                    <span>{job.company_location || job.location || 'Location'}</span>
                                                </div>
                                                <span className="job-salary">{job.salary_range || job.salary || 'Salary'}</span>
                                            </div>
                                            {/* Tags Section */}
                                            {tags.length > 0 && (
                                                <div className="job-tags">
                                                    {tags.slice(0, 3).map((tag, index) => (
                                                        <span key={index} className="job-tag">{tag}</span>
                                                    ))}
                                                    {tags.length > 3 && (
                                                        <span className="job-tag-more">+{tags.length - 3}</span>
                                                    )}
                                                </div>
                                            )}
                                            <div>
                                                <span className="job-date">{new Date(job.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}</span>
                                            </div>

                                            <button
                                                className="apply-btn"
                                                onClick={() => window.location.href = `/jobs/${job.id}`}
                                            >
                                                Apply Now
                                            </button>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="no-jobs-message">
                                    <p>No jobs posted yet. Check back soon!</p>
                                </div>
                            )}
                        </div>

                        <div className="view-all-container">
                            <Link href="/jobs" className="view-all-btn">View All Jobs</Link>
                        </div>
                    </div>
                </div>

                {/* Featured Talents Section - UPDATED WITH SWIPER */}
                <div className="featured-talents">

                    <div className="feature-talent-header">
                        <h3>Featured Talents</h3>
                        <p>Connect with skilled professionals ready to work</p>
                    </div>

                    <div className="feature-talent-content">
                        <div className="talent-swiper-container">
                            <div className="talent-swiper-wrapper">
                                {featuredTalents.length > 0 ? (
                                    featuredTalents.map((talent) => {
                                        const displaySkills = getTalentSkills(talent);

                                        return (
                                            <div key={talent.id} className="feature-talent-card">
                                                <div className="feature-talent-card-header">
                                                    {talent.profile_image_base64 || talent.avatar_url || talent.avatar ? (
                                                        <img
                                                            src={talent.profile_image_base64 || talent.avatar_url || talent.avatar}
                                                            alt={talent.name}
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.parentElement.innerHTML = `<div class="feature-talent-avatar-initials">${getInitials(talent.name)}</div>`;
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="feature-talent-avatar-initials">
                                                            {getInitials(talent.name)}
                                                        </div>
                                                    )}
                                                    <div className="talent-rating-badge">
                                                        <i className="fas fa-star"></i>
                                                        <span>{talent.rating || 4.0}</span>
                                                    </div>
                                                </div>

                                                <div className="feature-talent-card-body">
                                                    <h3>{talent.name}</h3>
                                                    <p>{talent.title || talent.role || 'Professional'}</p>
                                                </div>

                                                <div className="feature-talent-card-stars">
                                                    {[...Array(5)].map((_, starIndex) => {
                                                        const rating = talent.rating || 4.0;
                                                        const fullStars = Math.floor(rating);
                                                        const hasHalfStar = (rating - fullStars) >= 0.5;

                                                        if (starIndex < fullStars) {
                                                            return <i key={starIndex} className="fas fa-star"></i>;
                                                        } else if (starIndex === fullStars && hasHalfStar) {
                                                            return <i key={starIndex} className="fas fa-star-half-alt"></i>;
                                                        } else {
                                                            return <i key={starIndex} className="far fa-star"></i>;
                                                        }
                                                    })}
                                                    <span>({talent.rating || 4.0})</span>
                                                </div>

                                                <div className="feature-talent-card-roles">
                                                    {displaySkills.length > 0 ? (
                                                        displaySkills.map((skill, skillIndex) => (
                                                            <span key={skillIndex}>{skill}</span>
                                                        ))
                                                    ) : (
                                                        <span>Available for work</span>
                                                    )}
                                                </div>

                                                <div className="feature-talent-card-footer">
                                                    <Link
                                                        href={`/talent/${talent.id}`}
                                                        onClick={(e) => handleViewProfile(talent, e)}
                                                    >
                                                        View Profile
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="no-talents-message">
                                        <i className="fas fa-users"></i>
                                        <p>No featured talents yet. Check back soon!</p>
                                    </div>
                                )}
                            </div>

                            {/* Navigation Arrows for Desktop */}
                            <button className="talent-swiper-prev" aria-label="Previous">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </button>
                            <button className="talent-swiper-next" aria-label="Next">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <Link href="" className='browse-all-btn'>Browse All Talents</Link>
                </div>

                {/* Auth Modal */}
                {showAuthModal && (
                    <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
                        <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                            <button className="auth-modal-close" onClick={() => setShowAuthModal(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>

                            <div className="auth-modal-content">
                                <div className="auth-modal-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                        <circle cx="12" cy="12" r="4" />
                                    </svg>
                                </div>

                                <h2>Join GiftedTalent to Continue</h2>
                                <p>You need to be a member to apply for jobs and view talent profiles. It only takes a minute!</p>

                                {intendedData && (
                                    <div className="auth-modal-job">
                                        <p>You were about to {intendedAction === 'apply_job' ? 'apply for' : intendedAction === 'save_job' ? 'save' : 'view'}:</p>
                                        <strong>{getActionDataDisplay()}</strong>
                                    </div>
                                )}

                                <div className="auth-modal-buttons">
                                    <Link href={route('login')} className="auth-modal-btn auth-modal-btn-primary">
                                        Sign In
                                    </Link>
                                    <Link href={route('register')} className="auth-modal-btn auth-modal-btn-secondary">
                                        Create Account
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* FAQ Section */}
                <Faq />

                {/* FOOTER */}
                <Footer />

            </div>
        </>
    );
}