import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import '../../css/guidelines.css';
import '../../css/nav.css';
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
                <ApplicationLogo className="w-10 h-10 mr-2" />
            </a>
            <ul className={`nav-links ${isActive ? 'active' : ''}`}>
                <li><Link href="/" className="nav-link">Home</Link></li>
                <li><Link href="/jobs" className="nav-link">Find Jobs</Link></li>
                <li><Link href="/find-talents" className="nav-link">Find Talents</Link></li>
                <li><Link href="/how-it-works" className="nav-link">How It Works</Link></li>
                <li><Link href="/about" className="nav-link">About</Link></li>
                <li><Link href="/contact" className="nav-link">Contact</Link></li>
                <li><Link href="/privacy" className="nav-link">Privacy</Link></li>
                <li><Link href="/guidelines" className="nav-link active">Guidelines</Link></li>
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

export default function Guidelines() {
    const sections = [
        {
            title: "Our Community Promise",
            content: "GiftedTalents is committed to creating a safe, respectful, and inclusive environment where talent meets opportunity. All users agree to uphold these community guidelines."
        },
        {
            title: "Be Respectful",
            rules: [
                "Treat all members with courtesy and respect",
                "No harassment, bullying, or hate speech",
                "Respect different opinions and backgrounds",
                "Communicate professionally at all times"
            ]
        },
        {
            title: "Be Honest",
            rules: [
                "Provide accurate and truthful information about your skills and experience",
                "Do not misrepresent your identity or qualifications",
                "Post legitimate job opportunities only",
                "Report any suspicious or fraudulent activity"
            ]
        },
        {
            title: "No Spam or Scams",
            rules: [
                "Do not post repetitive or irrelevant content",
                "No unsolicited promotional messages",
                "Do not attempt to collect personal information fraudulently",
                "Report phishing attempts immediately"
            ]
        },
        {
            title: "Professional Conduct",
            rules: [
                "Respond to applications and messages in a timely manner",
                "Keep communication professional and relevant",
                "Do not share confidential information",
                "Honor commitments made through the platform"
            ]
        },
        {
            title: "Content Guidelines",
            rules: [
                "Job postings must be legitimate and accurately described",
                "Profiles should represent real individuals or businesses",
                "No offensive, discriminatory, or illegal content",
                "Respect intellectual property rights"
            ]
        },
        {
            title: "Privacy & Safety",
            rules: [
                "Do not share personal contact information publicly",
                "Use platform messaging for initial communications",
                "Report any safety concerns immediately",
                "Protect your account credentials"
            ]
        },
        {
            title: "Consequences of Violation",
            content: "Violation of these guidelines may result in warning, temporary suspension, or permanent ban from the platform, depending on the severity and frequency of violations."
        },
        {
            title: "Reporting Violations",
            content: "If you encounter any user or content that violates these guidelines, please report it using the report button or contact us at support@giftedtalents.online"
        }
    ];

    return (
        <>
            <Head title="Community Guidelines - GiftedTalents" />

            <div className="guidelines-page">
                <Nav />

                {/* Hero Section */}
                <section className="guidelines-hero">
                    <div className="guidelines-hero-content">
                        <h1>Community Guidelines</h1>
                        <p>Building a safe, respectful, and professional community for everyone.</p>
                    </div>
                </section>

                {/* Content Sections */}
                <section className="guidelines-content">
                    <div className="guidelines-container">
                        {sections.map((section, index) => (
                            <div key={index} className="guidelines-section">
                                <h2>{section.title}</h2>
                                {section.content && (
                                    <p>{section.content}</p>
                                )}
                                {section.rules && (
                                    <ul>
                                        {section.rules.map((rule, i) => (
                                            <li key={i}>{rule}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}

                        {/* Report Button */}
                        <div className="report-section">
                            <h3>Need to report a violation?</h3>
                            <p>Contact our support team immediately</p>
                            <a href="mailto:support@giftedtalents.online" className="report-btn">
                                Report Now
                            </a>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer>
                    <div className="footer-left">
                        <a className="logo">
                            <ApplicationLogo className="w-10 h-10 mr-2" />
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