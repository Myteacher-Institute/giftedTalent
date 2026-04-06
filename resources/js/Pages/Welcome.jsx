import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import '../../css/nav.css';
import '../../css/hero.css';
import '../../css/feature.css';
import '../../css/welcome.css';
import '../../css/feature_talent_section.css';

import starIcon from '../../assets/svg/star.svg';
import halfStarIcon from '../../assets/svg/half-star.svg';
import heroImage from '../../assets/img/giftedtalentimage.png';
import ApplicationLogo from '@/Components/ApplicationLogo';

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
                <Link href="/" className="logo">
                    <ApplicationLogo className="w-10 h-10 mr-2" />
                </Link>
                
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
                <p>Connect with top employers and talented professionals. Your dream job or ideal candidate is just a click away.</p>
                <div className="hero-buttons">
                    <button className="btn-primary">Find Jobs</button>
                    <button className="btn-secondary">Hire Talent</button>
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

    // Handle search
    const handleSearch = () => {
        const hasSearchCriteria = searchInputs.keyword || searchInputs.skill || searchInputs.location;

        if (!hasSearchCriteria) {
            showToast('Please enter at least one search criteria', 'error');
            return;
        }

        setIsSearching(true);
        setSearchError('');
        showToast('Searching for jobs...', 'loading');

        setTimeout(() => {
            try {
                const filtered = jobs.filter(job => {
                    const keyword = searchInputs.keyword.toLowerCase().trim();
                    const skill = searchInputs.skill.toLowerCase().trim();
                    const location = searchInputs.location.toLowerCase().trim();

                    const jobTitle = (job.job_title || job.title || '').toLowerCase();
                    const jobSkills = (job.skills_required || job.skills || '').toLowerCase();
                    const jobLocation = (job.company_location || job.location || '').toLowerCase();

                    let matchesKeyword = true;
                    let matchesSkill = true;
                    let matchesLocation = true;

                    if (keyword) matchesKeyword = jobTitle.includes(keyword);
                    if (skill) matchesSkill = jobSkills.includes(skill);
                    if (location) matchesLocation = jobLocation.includes(location);

                    return matchesKeyword && matchesSkill && matchesLocation;
                });

                setSearchResults(filtered);

                if (filtered.length > 0) {
                    showToast(`Found ${filtered.length} job${filtered.length !== 1 ? 's' : ''} matching your criteria`, 'success');
                } else {
                    showToast('No jobs found matching your criteria. Try different keywords!', 'error');
                }

            } catch (err) {
                showToast('An error occurred while searching. Please try again.', 'error');
                console.error('Search error:', err);
            } finally {
                setIsSearching(false);
            }
        }, 500);
    };

    // Handle apply button click
    const handleApplyClick = (job, event) => {
        if (requireAuthWithModal('apply_job', event, job)) {
            router.visit(`/easy-apply-job?job_id=${job.id}`);
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

    // Safely get skills array from talent data
    const getTalentSkills = (talent) => {
        let skillsArray = [];
        if (talent.skills && Array.isArray(talent.skills)) {
            skillsArray = talent.skills;
        } else if (talent.tech && Array.isArray(talent.tech)) {
            skillsArray = talent.tech;
        } else if (talent.skills && typeof talent.skills === 'string') {
            try {
                const parsed = JSON.parse(talent.skills);
                if (Array.isArray(parsed)) skillsArray = parsed;
            } catch (e) {
                skillsArray = [talent.skills];
            }
        } else if (talent.tech && typeof talent.tech === 'string') {
            try {
                const parsed = JSON.parse(talent.tech);
                if (Array.isArray(parsed)) skillsArray = parsed;
            } catch (e) {
                skillsArray = [talent.tech];
            }
        }
        return skillsArray.slice(0, 3);
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

                {/* Toast Notification */}
                {toast.show && (
                    <div className={`toast-notification toast-${toast.type}`}>
                        <div className="toast-content">
                            {toast.type === 'loading' && (
                                <svg className="toast-icon spinning" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 6v6l4 2"></path>
                                </svg>
                            )}
                            {toast.type === 'success' && (
                                <svg className="toast-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 6L9 17l-5-5"></path>
                                </svg>
                            )}
                            {toast.type === 'error' && (
                                <svg className="toast-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                </svg>
                            )}
                            {toast.type === 'info' && (
                                <svg className="toast-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                            )}
                            <span className="toast-message">{toast.message}</span>
                            <button className="toast-close" onClick={() => setToast(prev => ({ ...prev, show: false }))}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className="search-results-section">
                        <h2>Search Results ({searchResults.length})</h2>
                        <div className="jobs-grid">
                            {searchResults.map((job) => (
                                <div key={job.id} className="job-card">
                                    <div className="job-card-header">
                                        <div className={`job-icon ${job.gradient || 'gradient-blue'}`}>
                                            <img src={`/assets/svg/${job.icon || 'code.svg'}`} alt="" className="job-icon-img" />
                                        </div>
                                        <span className="job-type">
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
                                    <div className="job-buttons">
                                        <button
                                            className="apply-btn"
                                            onClick={(e) => handleApplyClick(job, e)}
                                        >
                                            Apply Now
                                        </button>
                                        <button
                                            className="save-btn"
                                            onClick={(e) => handleSaveJob(job, e)}
                                        >
                                            Save Job
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Featured Jobs Section */}
                <div className="feature-jobs">
                    <div className="jobs-wrapper">
                        <div className="jobs-header">
                            <h2 className="jobs-title">Featured Jobs</h2>
                            <p className="jobs-subtitle">Top opportunities from verified employers</p>
                        </div>

                        <div className="jobs-grid">
                            {jobs.length > 0 ? (
                                jobs.map((job) => (
                                    <div key={job.id} className="job-card">
                                        <div className="job-card-header">
                                            <div className={`job-icon ${job.gradient || 'gradient-blue'}`}>
                                                <img src={`/assets/svg/${job.icon || 'code.svg'}`} alt="" className="job-icon-img" />
                                            </div>
                                            <span className="job-type">
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
                                        <div className="job-buttons">
                                            <button
                                                className="apply-btn"
                                                onClick={(e) => handleApplyClick(job, e)}
                                            >
                                                Apply Now
                                            </button>
                                            <button
                                                className="save-btn"
                                                onClick={(e) => handleSaveJob(job, e)}
                                            >
                                                Save Job
                                            </button>
                                        </div>
                                    </div>
                                ))
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

                    <Link href="/find-talents" className='browse-all-btn'>Browse All Talents</Link>
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

                {/* Footer */}
                <footer className="footer">
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