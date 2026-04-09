import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import '../../css/nav.css';
import '../../css/feature_talent_section.css';
import '../../css/welcome.css';

export default function FeatureTalents({ auth, featuredTalents = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTalents, setFilteredTalents] = useState(featuredTalents);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [intendedTalent, setIntendedTalent] = useState(null);

    // Filter talents based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredTalents(featuredTalents);
        } else {
            const filtered = featuredTalents.filter(talent => 
                talent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (talent.title && talent.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (talent.skills && talent.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
            );
            setFilteredTalents(filtered);
        }
    }, [searchTerm, featuredTalents]);

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

    // Check if user is authenticated
    const isAuthenticated = () => {
        return auth && auth.user !== null;
    };

    // Handle view profile with auth check
    const handleViewProfile = (talent, event) => {
        if (!isAuthenticated()) {
            event.preventDefault();
            setIntendedTalent(talent);
            setShowAuthModal(true);
            return false;
        }
        router.visit(`/talent/${talent.id}`);
    };

    // Get skills array safely
    const getSkills = (talent) => {
        // Check multiple possible field names for skills
        if (talent.skills && Array.isArray(talent.skills)) return talent.skills;
        if (talent.tech && Array.isArray(talent.tech)) return talent.tech;
        if (talent.skills && typeof talent.skills === 'string') {
            try {
                const parsed = JSON.parse(talent.skills);
                if (Array.isArray(parsed)) return parsed;
            } catch(e) {}
            return [talent.skills];
        }
        return ['Available for work'];
    };

    // Get display title safely
    const getDisplayTitle = (talent) => {
        return talent.title || talent.role || 'Professional';
    };

    // Get rating safely
    const getRating = (talent) => {
        return talent.rating || 4.0;
    };

    return (
        <>
            <Head title="Find Talents - GiftedTalent" />
            
            <nav className="navbar">
                <div className="logo">
                    GiftedTalent<span>.Online</span>
                </div>
                <ul className="nav-links">
                    <li><Link href="/" className="nav-link">Home</Link></li>
                    <li><Link href="/jobs" className="nav-link">Find Jobs</Link></li>
                    <li><Link href="/find-talents" className="nav-link active">Find Talents</Link></li>
                    <li><Link href="/how-it-works" className="nav-link">How It Works</Link></li>
                    <li><Link href="/about" className="nav-link">About</Link></li>
                </ul>
                <div className="nav-right">
                    <div className="auth-links">
                        {auth?.user ? (
                            <Link href='/dashboard' className="nav-auth-link">Dashboard</Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="nav-auth-link">Sign In</Link>
                                <Link href={route('register')} className="get-started">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <div className="featured-talents-page">
                <div className="featured-talents-header">
                    <h1>Find Talents</h1>
                    <p>Connect with skilled professionals ready to work</p>
                </div>

                {/* Search Bar */}
                <div className="talents-search-container">
                    <div className="talents-search-box">
                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Search by name, role, or skills..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button className="clear-search" onClick={() => setSearchTerm('')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Results Count */}
                <div className="talents-results-count">
                    <p>Found <strong>{filteredTalents.length}</strong> {filteredTalents.length === 1 ? 'talent' : 'talents'}</p>
                </div>

                {/* Talents Grid */}
                <div className="feature-talent-content">
                    {filteredTalents && filteredTalents.length > 0 ? (
                        filteredTalents.map((talent) => {
                            const skills = getSkills(talent);
                            const rating = getRating(talent);
                            const fullStars = Math.floor(rating);
                            const hasHalfStar = (rating - fullStars) >= 0.5;
                            
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
                                            <span>{rating}</span>
                                        </div>
                                    </div>

                                    <div className="feature-talent-card-body">
                                        <h3>{talent.name || 'Anonymous'}</h3>
                                        <p>{getDisplayTitle(talent)}</p>
                                    </div>

                                    <div className="feature-talent-card-stars">
                                        {[...Array(5)].map((_, starIndex) => {
                                            if (starIndex < fullStars) {
                                                return <i key={starIndex} className="fas fa-star"></i>;
                                            } else if (starIndex === fullStars && hasHalfStar) {
                                                return <i key={starIndex} className="fas fa-star-half-alt"></i>;
                                            } else {
                                                return <i key={starIndex} className="far fa-star"></i>;
                                            }
                                        })}
                                        <span>({rating})</span>
                                    </div>

                                    <div className="feature-talent-card-roles">
                                        {skills && skills.length > 0 ? (
                                            skills.slice(0, 3).map((skill, skillIndex) => (
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
                            <h3>No talents found</h3>
                            <p>We couldn't find any talents matching your search criteria.</p>
                            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Auth Modal */}
            {showAuthModal && (
                <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
                    <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="auth-modal-close" onClick={() => setShowAuthModal(false)}>×</button>
                        <div className="auth-modal-content">
                            <h2>Join GiftedTalent to Continue</h2>
                            <p>You need to be a member to view talent profiles.</p>
                            {intendedTalent && (
                                <div className="auth-modal-job">
                                    <p>You were about to view:</p>
                                    <strong>{intendedTalent.name}</strong>
                                </div>
                            )}
                            <div className="auth-modal-buttons">
                                <Link href={route('login')} className="auth-modal-btn auth-modal-btn-primary">Sign In</Link>
                                <Link href={route('register')} className="auth-modal-btn auth-modal-btn-secondary">Create Account</Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <footer className="footer">
                <div className="footer-right">
                    <a href="/about">About</a>
                    <a href="/contact">Contact</a>
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/guidelines">Community Guideline</a>
                </div>
            </footer>
        </>
    );
}