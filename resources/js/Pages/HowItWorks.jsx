import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import '../../css/how-it-works.css';
import '../../css/nav.css';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Footer from '@/Components/Footer';

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

export default function HowItWorks() {
    const steps = [
        {
            number: "01",
            title: "Create an Account",
            description: "Sign up for free and create your profile. Choose whether you're looking for talent or job opportunities.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            ),
            color: "#3B82F6"
        },
        {
            number: "02",
            title: "Build Your Profile",
            description: "Complete your profile with skills, experience, portfolio, and what you're looking for in your next opportunity.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                </svg>
            ),
            color: "#10B981"
        },
        {
            number: "03",
            title: "Search & Discover",
            description: "Browse thousands of job listings or search for talented professionals using our advanced filters.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            ),
            color: "#F59E0B"
        },
        {
            number: "04",
            title: "Connect & Apply",
            description: "Apply to jobs that match your skills or reach out to candidates who fit your requirements.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
            ),
            color: "#8B5CF6"
        },
        {
            number: "05",
            title: "Get Hired / Hire",
            description: "Receive job offers or find the perfect candidate for your team. Success is just around the corner!",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                </svg>
            ),
            color: "#EF4444"
        }
    ];

    const forJobSeekers = [
        {
            title: "Find Your Dream Job",
            description: "Access thousands of job listings from top companies across various industries.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                </svg>
            )
        },
        {
            title: "Showcase Your Skills",
            description: "Create a standout profile that highlights your experience and achievements.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
            )
        },
        {
            title: "Apply with One Click",
            description: "Save time with our easy application process. Apply to multiple jobs instantly.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
            )
        },
        {
            title: "Track Applications",
            description: "Monitor your application status and receive updates in real-time.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="20" x2="12" y2="10" />
                    <line x1="18" y1="20" x2="18" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="16" />
                </svg>
            )
        }
    ];

    const forEmployers = [
        {
            title: "Post Jobs for Free",
            description: "Reach qualified candidates with our free job posting service.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
            )
        },
        {
            title: "Search Talent Pool",
            description: "Browse through our database of skilled professionals ready to work.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            )
        },
        {
            title: "Smart Matching",
            description: "Get matched with candidates who perfectly fit your requirements.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
            )
        },
        {
            title: "Manage Applications",
            description: "Easily track and manage all applications in one dashboard.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                </svg>
            )
        }
    ];

    const faqs = [
        {
            question: "Is GiftedTalents free to use?",
            answer: "Yes! Creating an account, browsing jobs, and applying for positions is completely free. We also offer premium features for employers who want to boost their job postings."
        },
        {
            question: "How do I know if I'm a good fit for a job?",
            answer: "Our smart matching system analyzes your profile and skills to recommend jobs that align with your experience. You can also use our filters to narrow down opportunities."
        },
        {
            question: "How long does it take to get hired?",
            answer: "The timeline varies depending on the industry and role. Many users find opportunities within 2-4 weeks of active searching and applying."
        },
        {
            question: "Can I edit my profile after creating it?",
            answer: "Absolutely! You can update your profile, add new skills, and modify your preferences anytime from your dashboard."
        },
        {
            question: "Is my data secure?",
            answer: "We take security seriously. Your personal information is encrypted and protected. We never share your data without your consent."
        },
        {
            question: "How do I contact support?",
            answer: "You can reach our support team through the contact page or email us directly at support@giftedtalents.online"
        }
    ];

    const [openFaq, setOpenFaq] = useState(null);

    return (
        <>
            <Head title="How It Works - GiftedTalents" />

            <div className="how-it-works-page">
                <Nav />

                {/* Hero Section */}
                <section className="hiw-hero">
                    <div className="hiw-hero-content">
                        <h1>How It Works</h1>
                        <p>Your journey to finding the perfect job or talent starts here</p>
                    </div>
                </section>

                {/* Steps Section */}
                <section className="hiw-steps">
                    <div className="hiw-container">
                        <div className="hiw-section-header">
                            <h2>Simple Steps to Success</h2>
                            <p>Get started in minutes with our easy-to-use platform</p>
                        </div>
                        <div className="steps-grid">
                            {steps.map((step, index) => (
                                <div key={index} className="step-card">
                                    <div className="step-number" style={{ background: step.color }}>
                                        {step.number}
                                    </div>
                                    <div className="step-icon" style={{ color: step.color }}>
                                        {step.icon}
                                    </div>
                                    <h3>{step.title}</h3>
                                    <p>{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* For Job Seekers Section */}
                <section className="hiw-job-seekers">
                    <div className="hiw-container">
                        <div className="hiw-section-header">
                            <h2>For Job Seekers</h2>
                            <p>Everything you need to land your dream job</p>
                        </div>
                        <div className="features-grid">
                            {forJobSeekers.map((feature, index) => (
                                <div key={index} className="feature-card">
                                    <div className="feature-icon">
                                        {feature.icon}
                                    </div>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* For Employers Section */}
                <section className="hiw-employers">
                    <div className="hiw-container">
                        <div className="hiw-section-header">
                            <h2>For Employers</h2>
                            <p>Find the best talent for your team</p>
                        </div>
                        <div className="features-grid">
                            {forEmployers.map((feature, index) => (
                                <div key={index} className="feature-card">
                                    <div className="feature-icon">
                                        {feature.icon}
                                    </div>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="hiw-stats">
                    <div className="hiw-container">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <span className="stat-number">30+</span>
                                <span className="stat-label">Active Jobs</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-number">50+</span>
                                <span className="stat-label">Companies</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-number">100+</span>
                                <span className="stat-label">Job Seekers</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-number">98%</span>
                                <span className="stat-label">Success Rate</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="hiw-faq">
                    <div className="hiw-container">
                        <div className="hiw-section-header">
                            <h2>Frequently Asked Questions</h2>
                            <p>Got questions? We've got answers</p>
                        </div>
                        <div className="faq-grid">
                            {faqs.map((faq, index) => (
                                <div key={index} className="faq-item">
                                    <button
                                        className="faq-question"
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    >
                                        <span>{faq.question}</span>
                                        <svg className={`faq-icon ${openFaq === index ? 'open' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </button>
                                    <div className={`faq-answer ${openFaq === index ? 'open' : ''}`}>
                                        <p>{faq.answer}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="hiw-cta">
                    <div className="hiw-container">
                        <div className="cta-content">
                            <h2>Ready to Get Started?</h2>
                            <p>Join thousands of successful users who found their perfect match</p>
                            <div className="cta-buttons">
                                <Link href="/register" className="btn-primary">Sign Up Now</Link>
                                <Link href="/jobs" className="btn-secondary">Browse Jobs</Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <Footer />
            </div>
        </>
    );
}