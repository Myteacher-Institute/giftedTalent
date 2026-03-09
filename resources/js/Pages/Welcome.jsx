import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import '../../css/nav.css';
import '../../css/hero.css';
import heroImage from '../../image/div (1).jpg';


export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <>
            <Head title="GiftedTalents" />

            <div className="home-screen">
                {/* Henry */}
                <nav className="navbar">
                    <div className="logo">
                        GiftedTalents<span>.online</span>
                    </div>
                    <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
                        <Link href="/find-jobs">Find Jobs</Link>
                        <Link href="/find-talents">Find Talents</Link>
                        <Link href="/how-it-works">How It Works</Link>
                        <Link href="/about">About</Link>
                    </div>

                    <div className="nav-right">
                        {auth?.user ? (
                            <Link href="/dashboard">Dashboard</Link>
                        ) : (
                    <div className="auth-links">
                                <Link href="/login">Sign In</Link>
                                <div className={`dropdown-container ${dropdownOpen ? 'active' : ''}`}>
                                    <button
                                        className={`get-started ${dropdownOpen ? 'active' : ''}`}
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                    >
                                        Get Started
                                    </button>
                                    <div className={`dropdown-menu ${dropdownOpen ? 'active' : ''}`}>
                                        <Link href="/register" className="dropdown-item">Register</Link>
                                        <Link href="/login" className="dropdown-item">Sign In</Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        className={`hamburger ${menuOpen ? 'active' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </nav>

                <section className="hero">
                    <div className="circle1"></div>
                    <div className="circle2"></div>

                    <div className="hero-left">
                        <h1>
                            Discover Opportunities.
                            <br />
                            <span className="talent-text">Showcase Your Talent.</span>
                        </h1>
                        <p>
                            Connecting skilled talents with verified employers worldwide.
                        </p>

                        <div className="hero-buttons">
                            <button className="btn-primary">Find Jobs</button>
                            <button className="btn-secondary">Hire Talents</button>
                        </div>
                    </div>

                    <div className="hero-right">
                        <img src={heroImage} alt="Hero Image" />
                    </div>
                </section>



                {/* search bar */}
                <div className="search-container">
                    <div className="search-box">
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

                        <button className="search-button">Search Jobs</button>
                    </div>
                </div>

                {/* christopher */}
                <div className="feature-jobs">

                </div>

                <div className="featured-talents">

                </div>


            </div>
        </>
    );
}
