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
    const [openFaq, setOpenFaq] = useState(null);

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
    // Stats data for mission section
    const stats = [
        { number: "10K+", label: "Active Users" },
        { number: "500+", label: "Companies" },
        { number: "5K+", label: "Jobs Posted" },
        { number: "98%", label: "Success Rate" }
    ];

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
                                <input type="text" placeholder="Job title or Keyword" />
                            </div>
                            <div className="input-with-icon">
                                {/* briefcase / skill */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                    <path d="M16 3H8v4h8V3z"></path>
                                </svg>
                                <input type="text" placeholder="Skill" />
                            </div>
                            <div className="input-with-icon">
                                {/* map pin / location */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1118 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <input type="text" placeholder="Location" />
                            </div>
                        </div>

                        <button className="search-button">Search Jobs</button>
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
                                    href="https://wa.me/2348012345678?text=Hello%20GiftedTalents"
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


                {/* Mission Section - ADD THIS */}
                <section className="about-mission">
                    <div className="mission-container">
                        <div className="mission-text">
                            <h2>Our Mission</h2>
                            <p>To empower professionals and employers by creating a seamless, transparent, and efficient platform where talent meets opportunity. We believe that everyone deserves to find work they love and companies deserve to find the talent they need.</p>
                            <div className="mission-stats">
                                {stats.map((stat, index) => (
                                    <div key={index} className="stat-item">
                                        <span className="stat-number">{stat.number}</span>
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
                        {/* Header */}
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

                {/* FAQ Section */}
                <section className="about-faq">
                    <div className="faq-container">
                        <div className="faq-header">
                            <h2>Frequently Asked Questions</h2>
                            <p>Got questions? We've got answers. Here are some of the most common questions we receive.</p>
                        </div>
                        <div className="faq-grid">
                            {faqs.map((faq, index) => (
                                <div className={`faq-item ${openFaq === index ? 'open' : ''}`} key={index}>
                                    <div className="faq-question" onClick={() => toggleFaq(index)}>
                                        <h3>{faq.question}</h3>
                                        <svg className="faq-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </div>
                                    <div className="faq-answer">
                                        <p>{faq.answer}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer>
                    <div className="footer-left">
                        <a href="#" className="brand" onClick={(e) => { e.preventDefault(); navigateTo('/'); }}>
                            GiftedTalents<span>.online</span>
                        </a>
                        <div>
                            <p>©</p>
                            <span>2026</span>
                        </div>
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
