import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import '../../css/about.css';
import '../../css/welcome.css';
import '../../css/nav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faHeart, faUsers, faRocket } from '@fortawesome/free-solid-svg-icons';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Footer from '@/Components/Footer';


// Nav Component - FIXED to check auth.user
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

    const toggleMenu = () => {
        setIsActive(!isActive);
    };

    const closeMenu = () => {
        setIsActive(false);
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <Link href="/" className="logo">
                <ApplicationLogo className="w-20 h-10 mr-2" />
            </Link>
            <ul className={`nav-links ${isActive ? 'active' : ''}`}>
                <li><Link href="/" className="nav-link" onClick={closeMenu}>Home</Link></li>
                <li><Link href="/jobs" className="nav-link" onClick={closeMenu}>Find Jobs</Link></li>
                <li><Link href="/find-talents" className="nav-link" onClick={closeMenu}>Find Talents</Link></li>
                <li><Link href="/how-it-works" className="nav-link" onClick={closeMenu}>How It Works</Link></li>
                <li><Link href="/about" className="nav-link" onClick={closeMenu}>About</Link></li>
                <li><Link href="/contact" className="nav-link" onClick={closeMenu}>Contact</Link></li>
            </ul>
            <div className="nav-right">
                <div className="auth-links">
                    {auth?.user ? (
                        <Link href="/dashboard" className="nav-auth-link">Dashboard</Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="nav-auth-link">Sign In</Link>
                            <Link href={route('register')} className="get-started">Get Started</Link>
                        </>
                    )}
                </div>
                <div
                    className={`hamburger ${isActive ? 'active' : ''}`}
                    onClick={toggleMenu}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    );
}

export default function About({ auth }) {  // ← Make sure auth is received as prop
    const values = [
        {
            icon: <FontAwesomeIcon icon={faStar} className="value-icon" />,
            title: "Excellence",
            description: "We strive for excellence in everything we do, connecting top talent with exceptional opportunities."
        },
        {
            icon: <FontAwesomeIcon icon={faHeart} className="value-icon" />,
            title: "Integrity",
            description: "We operate with transparency, honesty, and ethical practices in all our interactions."
        },
        {
            icon: <FontAwesomeIcon icon={faUsers} className="value-icon" />,
            title: "Community",
            description: "Building a supportive community where talents and employers grow together."
        },
        {
            icon: <FontAwesomeIcon icon={faRocket} className="value-icon" />,
            title: "Innovation",
            description: "Constantly evolving to meet the changing needs of the modern workforce."
        }
    ];

    const stats = [
        { number: "100+", label: "Active Users" },
        { number: "50+", label: "Companies" },
        { number: "30+", label: "Jobs Posted" },
        { number: "98%", label: "Success Rate" }
    ];

    return (
        <>
            <Head title="About Us - GiftedTalents" />

            <div className="about-page">
                {/* Header */}
                <Nav auth={auth} />  {/* ← Pass auth to Nav */}

                {/* Hero Section */}
                <section className="about-hero">
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
                                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.277-.582c.949.544 2.017.83 3.09.831 3.18 0 5.767-2.586 5.768-5.766.001-3.18-2.585-5.767-5.766-5.767zm-.001 10.285c-.893 0-1.77-.24-2.537-.692l-.18-.108-1.359.348.356-1.325-.117-.186c-.462-.742-.707-1.6-.707-2.477 0-2.553 2.077-4.63 4.63-4.63 2.553 0 4.63 2.077 4.63 4.63 0 2.553-2.077 4.63-4.63 4.63zm2.62-3.453c-.144-.072-.852-.42-.984-.468-.132-.048-.228-.072-.324.072-.096.144-.372.468-.456.564-.084.096-.168.108-.312.036-.144-.072-.608-.224-1.158-.714-.432-.384-.72-.858-.804-1.002-.084.144-.012-.222.06-.294.064-.072.144-.168.216-.252.072-.084.096-.144.144-.24.048-.096.024-.18-.012-.252-.036-.072-.324-.78-.444-1.068-.12-.288-.24-.24-.324-.252-.084-.012-.18-.012-.276-.012-.096 0-.252.036-.384.18-.132.144-.504.492-.504 1.2 0 .708.516 1.392.588 1.488.072.096 1.008 1.548 2.448 2.172.348.144.612.228.828.288.348.108.672.084.924.048.276-.036.852-.348.972-.684.12-.336.12-.624.084-.684-.036-.06-.132-.096-.276-.168z" />
                                    </svg>
                                    <span>Chat on WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
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

                {/* Values Section */}
                <section className="about-values">
                    <div className="values-header">
                        <h2>Our Core Values</h2>
                        <p>What drives us every day</p>
                    </div>
                    <div className="values-grid">
                        {values.map((value, index) => (
                            <div key={index} className="value-card">
                                <div className="value-icon-wrapper">
                                    {value.icon}
                                </div>
                                <h3>{value.title}</h3>
                                <p>{value.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="about-cta">
                    <div className="cta-content">
                        <h2>Ready to start your journey?</h2>
                        <p>Join thousands of professionals and companies already using GiftedTalents</p>
                        <div className="cta-buttons">
                            <Link href="/jobs" className="btn-primary">Find Jobs</Link>
                            <Link href="/find-talents" className="btn-secondary">Find Talents</Link>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}