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
import sample1 from '../../assets/img/sample1.jpg';
import sample2 from '../../assets/img/sample2.jpg';
import sample3 from '../../assets/img/sample3.jpg';
import sample4 from '../../assets/img/sample4.jpg';
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
                    <ApplicationLogo style={{
                        width: '100%',
                        maxWidth: '100px'
                    }} />
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
                           
                            {!auth.user && (
                                <>
                                    <Link href={route('login')} onClick={closeMobileMenu}>Sign In</Link>
                                    <Link href={route('register')} onClick={closeMobileMenu}>Get Started</Link>
                                </>
                            )}
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
                    <Link href="/jobs" className="btn-primary">Find Jobs</Link>
                    <Link href="/find-talents" className="btn-secondary">Hire Talent</Link>
                </div>
            </div>
            <div className="hero-right">
                <img src={heroImage} alt="Hero" />
            </div>
        </div>
    );
}

const featuresData = [
    {
        image: sample1,
        name: 'Sarah Johnson',
        role: 'Senior Frontend Developer',
        stars: 5,
        halfStar: false,
        icon: starIcon,
        halfStarIcon: halfStarIcon,
        rating: '5.0',
        tech: ['React', 'TypeScript', 'Tailwind'],
        bg: { backgroundColor: '#eff6ff' },
        border: { borderColor: '#0ea5e9', borderWidth: '1px', borderStyle: 'solid' }
    },
    {
        image: sample2,
        name: 'Michael Chen',
        role: 'Full Stack Engineer',
        stars: 4,
        halfStar: true,
        icon: starIcon,
        halfStarIcon: halfStarIcon,
        rating: '4.5',
        tech: ['Node.js', 'Python', 'PostgreSQL'],
        bg: { backgroundColor: '#f0fdf4' },
        border: { borderColor: '#10b981', borderWidth: '1px', borderStyle: 'solid' }
    },
    {
        image: sample3,
        name: 'Emily Rodriguez',
        role: 'UX/UI Designer',
        stars: 4,
        halfStar: false,
        icon: starIcon,
        halfStarIcon: halfStarIcon,
        rating: '4.0',
        tech: ['Figma', 'Adobe XD', 'Prototyping'],
        bg: { backgroundColor: '#fdf4ff' },
        border: { borderColor: '#ec4899', borderWidth: '1px', borderStyle: 'solid' }
    },
    {
        image: sample4,
        name: 'David Kim',
        role: 'DevOps Specialist',
        stars: 5,
        halfStar: false,
        icon: starIcon,
        halfStarIcon: halfStarIcon,
        rating: '5.0',
        tech: ['AWS', 'Docker', 'Kubernetes'],
        bg: { backgroundColor: '#fef3c7' },
        border: { borderColor: '#f59e0b', borderWidth: '1px', borderStyle: 'solid' }
    },
    {
        image: sample1,
        name: 'Lisa Wang',
        role: 'Product Manager',
        stars: 4,
        halfStar: true,
        icon: starIcon,
        halfStarIcon: halfStarIcon,
        rating: '4.5',
        tech: ['Agile', 'Jira', 'Analytics'],
        bg: { backgroundColor: '#f3f4f6' },
        border: { borderColor: '#6b7280', borderWidth: '1px', borderStyle: 'solid' }
    },
    {
        image: sample2,
        name: 'Alex Patel',
        role: 'Data Scientist',
        stars: 5,
        halfStar: false,
        icon: starIcon,
        halfStarIcon: halfStarIcon,
        rating: '5.0',
        tech: ['Python', 'ML', 'TensorFlow'],
        bg: { backgroundColor: '#dbeafe' },
        border: { borderColor: '#3b82f6', borderWidth: '1px', borderStyle: 'solid' }
    }
];

export default function Welcome({ auth, laravelVersion, phpVersion, jobs = [], featuredTalents = [] }) {
    const [openFaq, setOpenFaq] = useState(null);
    const [searchInputs, setSearchInputs] = useState({
        keyword: '',
        skill: '',
        location: ''
    });
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState('');
    const [showToastNotification, setShowToastNotification] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const [intendedAction, setIntendedAction] = useState(null);
    const [intendedData, setIntendedData] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const stats = [
        { number: 1000, label: 'Active Talents' },
        { number: 500, label: 'Companies' },
        { number: 5000, label: 'Jobs Posted' },
        { number: 95, label: 'Success Rate' }
    ];

    // Counter Component
    function Counter({ target, duration }) {
        const [count, setCount] = useState(0);
        
        useEffect(() => {
            let start = 0;
            const increment = target / (duration / 16);
            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    setCount(target);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);
            
            return () => clearInterval(timer);
        }, [target, duration]);
        
        return count;
    }

    // Toast notification function
    const showToast = (message, type = 'info') => {
        setToastMessage(message);
        setToastType(type);
        setShowToastNotification(true);
        setTimeout(() => {
            setShowToastNotification(false);
        }, 3000);
    };

    // Auth check with modal
    const requireAuthWithModal = (action, event, data) => {
        if (!auth.user) {
            event.preventDefault();
            setIntendedAction(action);
            setIntendedData(data);
            setShowAuthModal(true);
            return false;
        }
        return true;
    };

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        {
            question: "How do I create an account?",
            answer: "Click the 'Get Started' button on the top right corner. Choose whether you're a talent or employer, fill in your details, and you're ready to go. It takes less than 2 minutes!"
        },
        {
            question: "Is GiftedTalents free to use?",
            answer: "Creating a profile and browsing jobs or talents is completely free. Employers can post jobs for free, and there are premium features available for enhanced visibility and advanced matching."
        },
        {
            question: "How does the matching process work?",
            answer: "Our intelligent algorithm matches your skills, experience, and preferences with relevant job opportunities or talent profiles. You'll receive personalized recommendations based on your profile."
        },
        {
            question: "Can I edit my profile after creating it?",
            answer: "Absolutely! You can update your profile anytime from your dashboard. Add new skills, update your experience, or change your preferences whenever you want."
        },
        {
            question: "How do I apply for jobs?",
            answer: "Browse job listings and click 'Apply Now' on any position that interests you. You'll be guided through a simple application process where you can submit your profile and any additional information."
        },
        {
            question: "Is my data secure?",
            answer: "Yes! We take data security seriously. Your personal information is encrypted and protected. We never share your data without your consent. Read our Privacy Policy for more details."
        }
    ];

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

                        <button className="search-button" onClick={handleSearch} disabled={isSearching}>
                            {isSearching ? 'Searching...' : 'Search Jobs'}
                        </button>
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
                            <div className="mission-stats">
                                {stats.map((stat, index) => (
                                    <div key={index} className="stat-item">
                                        <Counter target={stat.number} duration={2000} />
                                        <span className="stat-label">{stat.label}</span>
                                    </div>
                                ))}
                            </div>
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
                        {featuredTalents.length > 0 ? (
                            featuredTalents.map((talent, index) => {
                                // Generate random colors for variety
                                const colors = [
                                    { bg: '#eff6ff', border: '#0ea5e9' },
                                    { bg: '#f0fdf4', border: '#10b981' },
                                    { bg: '#fdf4ff', border: '#ec4899' },
                                    { bg: '#fef3c7', border: '#f59e0b' },
                                    { bg: '#f3f4f6', border: '#6b7280' },
                                    { bg: '#dbeafe', border: '#3b82f6' }
                                ];
                                const color = colors[index % colors.length];
                                
                                return (
                                    <div 
                                        className="feature-talent-card" 
                                        key={talent.id} 
                                        style={{ 
                                            backgroundColor: color.bg, 
                                            borderColor: color.border, 
                                            borderWidth: '1px', 
                                            borderStyle: 'solid' 
                                        }}
                                    >
                                        <div className="feature-talent-card-header">
                                            {talent.avatar ? (
                                                <img src={talent.avatar} alt={talent.name} />
                                            ) : (
                                                <div className="talent-initial">
                                                    {getInitials(talent.name)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="feature-talent-card-body">
                                            <h3>{talent.name}</h3>
                                            <p>{talent.position || 'Professional'}</p>
                                        </div>

                                        <div className="feature-talent-card-stars">
                                            <img src={starIcon} alt="star" />
                                            <img src={starIcon} alt="star" />
                                            <img src={starIcon} alt="star" />
                                            <img src={starIcon} alt="star" />
                                            <img src={starIcon} alt="star" />
                                            <span>({talent.profile_completion || 100}%)</span>
                                        </div>

                                        <div className="feature-talent-card-roles">
                                            {getTalentSkills(talent).map((skill, skillIndex) => (
                                                <span key={skillIndex}>{skill}</span>
                                            ))}
                                        </div>

                                        <div className="feature-talent-card-footer">
                                            <Link href={`/talent/${talent.id}`}>View Profile</Link>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            // Fallback to hardcoded data if no featured talents
                            featuresData.map((feature, index) => (
                                <div className="feature-talent-card" key={index} style={{ ...feature.bg, ...feature.border }}>
                                    <div className="feature-talent-card-header">
                                        <img src={feature.image} alt="" />
                                    </div>

                                    <div className="feature-talent-card-body">
                                        <h3>{feature.name}</h3>
                                        <p>{feature.role}</p>
                                    </div>

                                    <div className="feature-talent-card-stars">
                                        {[...Array(5)].map((_, starIndex) => {
                                            if (starIndex < feature.stars) {
                                                return <img key={starIndex} src={feature.icon} alt="star" />;
                                            } else if (starIndex === feature.stars && feature.halfStar) {
                                                return <img key={starIndex} src={feature.halfStarIcon} alt="half star" />;
                                            }
                                            return null;
                                        })}
                                        <span>{`(${feature.rating})`}</span>
                                    </div>

                                    <div className="feature-talent-card-roles">
                                        {feature.tech.map((tech, techIndex) => (
                                            <span key={techIndex}>{tech}</span>
                                        ))}
                                    </div>

                                    <div className="feature-talent-card-footer">
                                        <Link href="/find-talents">View Profile</Link>
                                    </div>
                                </div>
                            ))
                        )}

                    </div>

                    <Link href="/find-talents" className='browse-all-btn'>Browse All Talents</Link>
                </div>

                {/* FAQ Section */}
                <section className="faq-section">
                    <div className="faq-container">
                        <div className="faq-header">
                            <span className="faq-badge">FAQ</span>
                            <h2>Frequently Asked Questions</h2>
                            <p>Everything you need to know about GiftedTalents</p>
                        </div>

                        <div className="faq-grid">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className={`faq-card ${openFaq === index ? 'active' : ''}`}
                                >
                                    <button
                                        className="faq-card-header"
                                        onClick={() => toggleFaq(index)}
                                    >
                                        <div className="faq-card-left">
                                            <span className="faq-title">{faq.question}</span>
                                        </div>
                                        <span className="faq-toggle">
                                            {openFaq === index ? '−' : '+'}
                                        </span>
                                    </button>
                                    <div className="faq-card-content">
                                        <div className="faq-card-inner">
                                            <p>{faq.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                {/* FOOTER */}
                <footer>
                    <div className="footer-top">
                        <div className="footer-left">
                            <Link href="/" className="brand">
                                <ApplicationLogo className="logo" />
                            </Link>
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