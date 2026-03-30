import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import '../../css/privacy.css';
import '../../css/nav.css';

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
            <div className="logo">
                GiftedTalent<span>.Online</span>
            </div>
            <ul className={`nav-links ${isActive ? 'active' : ''}`}>
                <li><Link href="/" className="nav-link">Home</Link></li>
                <li><Link href="/jobs" className="nav-link">Find Jobs</Link></li>
                <li><Link href="/find-talents" className="nav-link">Find Talents</Link></li>
                <li><Link href="/how-it-works" className="nav-link">How It Works</Link></li>
                <li><Link href="/about" className="nav-link">About</Link></li>
                <li><Link href="/contact" className="nav-link">Contact</Link></li>
                <li><Link href="/privacy" className="nav-link active">Privacy</Link></li>
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

export default function Privacy() {
    const lastUpdated = "March 30, 2026";

    const sections = [
        {
            title: "Information We Collect",
            content: [
                "Personal Information: Name, email address, phone number, location, and professional background.",
                "Account Information: Login credentials, profile information, and job preferences.",
                "Usage Data: Information about how you interact with our platform, including searches, applications, and messages.",
                "Device Information: IP address, browser type, operating system, and device identifiers."
            ]
        },
        {
            title: "How We Use Your Information",
            content: [
                "To provide and maintain our services",
                "To match job seekers with relevant opportunities",
                "To communicate with you about applications and messages",
                "To improve and personalize your experience",
                "To detect and prevent fraud or security issues",
                "To comply with legal obligations"
            ]
        },
        {
            title: "Information Sharing",
            content: [
                "With employers when you apply for jobs",
                "With service providers who assist our operations",
                "When required by law or to protect rights",
                "With your consent for other purposes",
                "We do NOT sell your personal information to third parties"
            ]
        },
        {
            title: "Data Security",
            content: [
                "We implement industry-standard security measures to protect your data.",
                "All data is encrypted during transmission using SSL/TLS technology.",
                "Access to personal information is restricted to authorized personnel only.",
                "Regular security audits and updates are performed."
            ]
        },
        {
            title: "Your Rights",
            content: [
                "Access and review your personal information",
                "Request corrections to inaccurate data",
                "Delete your account and associated data",
                "Opt out of marketing communications",
                "Export your data in a portable format",
                "Withdraw consent at any time"
            ]
        },
        {
            title: "Cookies and Tracking",
            content: [
                "We use cookies to enhance your browsing experience.",
                "Essential cookies are required for platform functionality.",
                "Analytics cookies help us understand platform usage.",
                "You can manage cookie preferences in your browser settings."
            ]
        },
        {
            title: "Children's Privacy",
            content: [
                "Our services are not intended for users under 16 years of age.",
                "We do not knowingly collect information from children under 16.",
                "If we learn of such collection, we will delete the information promptly."
            ]
        },
        {
            title: "Changes to This Policy",
            content: [
                "We may update this Privacy Policy periodically.",
                "Significant changes will be notified via email or platform notification.",
                "Continued use of our services constitutes acceptance of updated terms.",
                `Last updated: ${lastUpdated}`
            ]
        },
        {
            title: "Contact Us",
            content: [
                "If you have questions about this Privacy Policy, please contact us:",
                "Email: privacy@giftedtalents.online",
                "Address: Myteacher-Institute, Rumuagholu, Port Harcourt, Rivers State, Nigeria",
                "Phone: +234 801 234 5678"
            ]
        }
    ];

    return (
        <>
            <Head title="Privacy Policy - GiftedTalents" />

            <div className="privacy-page">
                <Nav />

                {/* Hero Section */}
                <section className="privacy-hero">
                    <div className="privacy-hero-content">
                        <h1>Privacy Policy</h1>
                        <p>Your privacy is important to us. Learn how we collect, use, and protect your information.</p>
                        <span className="last-updated">Last Updated: {lastUpdated}</span>
                    </div>
                </section>

                {/* Content Sections */}
                <section className="privacy-content">
                    <div className="privacy-container">
                        {sections.map((section, index) => (
                            <div key={index} className="privacy-section">
                                <h2>{section.title}</h2>
                                <ul>
                                    {section.content.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FOOTER */}
                <footer>
                    <div className="footer-left">
                        <a href="/" className="brand">GiftedTalents<span>.online</span></a>
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