import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import '../../css/nav.css';
import '../../css/hero.css';

import '../../css/feature.css';
import '../../css/welcome.css';
import '../../css/feature_talent_section.css';

import starIcon from '../../assets/svg/star.svg';
import halfStarIcon from '../../assets/svg/half-star.svg';

import sample1 from '../../assets/img/sample1.jpg';
import sample2 from '../../assets/img/sample2.jpg';
import sample3 from '../../assets/img/sample3.jpg';
import sample4 from '../../assets/img/sample4.jpg';
import heroImage from '../../assets/img/giftedtalentimage.png';


// Nav Component
function Nav({ auth }) {
    const [isActive, setIsActive] = useState(false);
    const [scrolled, setScrolled] = useState(false);

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

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="logo">
                GiftedTalent<span>.Online</span>
            </div>
            <ul className={`nav-links ${isActive ? 'active' : ''}`}>
                <li><Link href="/" className="nav-link">Home</Link></li>
                <li><Link href="/jobs" className="nav-link">Find Jobs</Link></li>
                <li><Link href="/find-talents" className="nav-link">Find Talents</Link></li>
                <li><Link href="/how-it-works" className="nav-link">How It Works</Link></li>
                <li><Link href="/about" className="nav-link">About</Link></li>
            </ul>
            <div className="nav-right">

                <div className="auth-links">
                    {
                        auth.user ? (
                            <Link href='dashboard' className="nav-auth-link">Dashboard</Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="nav-auth-link">Sign In</Link>
                                <Link href={route('register')} className="get-started">Get Started</Link>
                            </>
                        )
                    }
                </div>

                <div
                    className={`hamburger ${isActive ? 'active' : ''}`}
                    onClick={() => setIsActive(!isActive)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
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
                <p>Connecting skilled talents with verified employers worldwide.</p>
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

export default function Welcome({ auth, laravelVersion, phpVersion, jobs = [] }) {
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
    
    // Toast notification state
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: 'info' // 'info', 'success', 'error', 'loading'
    });
    
    // Auto-hide toast after 3 seconds
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast(prev => ({ ...prev, show: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);
    
    // Function to show toast messages
    const showToast = (message, type = 'info') => {
        setToast({
            show: true,
            message,
            type
        });
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
        // Check if any search input has value
        const hasSearchCriteria = searchInputs.keyword || searchInputs.skill || searchInputs.location;
        
        if (!hasSearchCriteria) {
            showToast('Please enter at least one search criteria', 'error');
            return;
        }
        
        setIsSearching(true);
        setSearchError('');
        showToast('Searching for jobs...', 'loading');
        
        // Simulate minimum loading time for better UX
        setTimeout(() => {
            try {
                // Filter jobs based on search inputs
                const filtered = jobs.filter(job => {
                    // Get search values (trim and lowercase for better matching)
                    const keyword = searchInputs.keyword.toLowerCase().trim();
                    const skill = searchInputs.skill.toLowerCase().trim();
                    const location = searchInputs.location.toLowerCase().trim();
                    
                    // Get job data (handle null/undefined values)
                    const jobTitle = (job.job_title || job.title || '').toLowerCase();
                    const jobSkills = (job.skills_required || job.skills || '').toLowerCase();
                    const jobLocation = (job.company_location || job.location || '').toLowerCase();
                    
                    // Check each field - if field is empty, don't filter by it
                    let matchesKeyword = true;
                    let matchesSkill = true;
                    let matchesLocation = true;
                    
                    if (keyword) {
                        matchesKeyword = jobTitle.includes(keyword);
                    }
                    
                    if (skill) {
                        matchesSkill = jobSkills.includes(skill);
                    }
                    
                    if (location) {
                        matchesLocation = jobLocation.includes(location);
                    }
                    
                    // Return true if all active filters match
                    return matchesKeyword && matchesSkill && matchesLocation;
                });
                
                setSearchResults(filtered);
                
                // Show appropriate feedback
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
        }, 500); // 500ms delay for better UX
    };

    return (
        <>
            <Head title="GiftedTalents" />

            <div className="home-screen">
                {/* Henry */}
                <Nav auth={auth} />

                <Hero />



                {/* search bar */}
                <div className="search-container">
                    <div className="search-box">
                        <div className="search-inputs">
                            <div className="input-with-icon">
                                {/* magnifying glass / keyword */}
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
                                {/* briefcase / skill */}
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
                                {/* map pin / location */}
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

                        <button className="search-button" onClick={handleSearch}>
                            {isSearching ? 'Searching...' : 'Search Jobs'}
                        </button>
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
                                        <span className="job-type" id={job.type === 'Contract' ? 'job-type-contract' : 'job-type-fulltime'}>
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
                                    <button className="apply-btn">Apply Now</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* christopher - Featured Jobs Section */}
                <div className="feature-jobs">

                    <div className="jobs-wrapper">
                        {/* Header */}
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
                                            <span className="job-type" id={job.type === 'Contract' ? 'job-type-contract' : 'job-type-fulltime'}>
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
                                        {/* <div className="job-tags">
                                            {(job.tags || ['Apply Now']).slice(0, 3).map((tag, i) => (
                                                <span key={i} className="job-tag">{tag}</span>
                                            ))}
                                        </div> */}
                                        <button className="apply-btn">Apply Now</button>
                                    </div>
                                ))
                            ) : (
                                // Show message if no jobs
                                <div className="no-jobs-message">
                                    <p>No jobs posted yet. Check back soon!</p>
                                </div>
                            )}
                        </div>

                        {/* View All button */}
                        <div className="view-all-container">
                            <Link href="/jobs" className="view-all-btn">View All Jobs</Link>
                        </div>
                    </div>
                </div>

                <div className="featured-talents">

                    <div className="feature-talent-header">
                        <h3>Featured Talents</h3>
                        <p>Connect with skilled professionals ready to work</p>
                    </div>

                    <div className="feature-talent-content">
                        {featuresData.map((feature, index) => (
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
                                    <Link href="">View Profile</Link>
                                </div>
                            </div>
                        ))}

                    </div>

                    <Link href="" className='browse-all-btn'>Browse All Talents</Link>
                </div>

            </div>
        </>
    );
}