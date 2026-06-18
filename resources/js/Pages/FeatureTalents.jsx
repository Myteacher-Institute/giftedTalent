import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { getAvatarUrl } from '@/Utils/avatar';
import '../../css/nav.css';
import '../../css/feature_talent_section.css';
import '../../css/welcome.css';

export default function FeatureTalents({ auth, featuredTalents = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTalents, setFilteredTalents] = useState([]);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [intendedTalent, setIntendedTalent] = useState(null);

    // Filter talents based on search term
    useEffect(() => {
        // SAFETY: Ensure featuredTalents is an array and filter out null/undefined
        const safeTalents = Array.isArray(featuredTalents) 
            ? featuredTalents.filter(talent => talent !== null && talent !== undefined)
            : [];
        
        if (searchTerm.trim() === '') {
            setFilteredTalents(safeTalents);
        } else {
            const filtered = safeTalents.filter(talent => {
                // SAFETY: Check if talent exists
                if (!talent) return false;
                
                const searchLower = searchTerm.toLowerCase();
                
                // SAFETY: Check name with optional chaining
                const nameMatch = talent.name?.toLowerCase().includes(searchLower) || false;
                
                // SAFETY: Check title
                const titleMatch = talent.title && talent.title.toLowerCase().includes(searchLower);
                
                // SAFETY: Check skills with proper validation
                let skillsMatch = false;
                // FIX: Check if skills is a string and parse it first
                let skillsArray = talent.skills;
                if (typeof skillsArray === 'string') {
                    try {
                        skillsArray = JSON.parse(skillsArray);
                    } catch(e) {
                        skillsArray = [];
                    }
                }
                if (skillsArray && Array.isArray(skillsArray)) {
                    skillsMatch = skillsArray.some(skill => 
                        skill && skill.toLowerCase().includes(searchLower)
                    );
                }
                
                return nameMatch || titleMatch || skillsMatch;
            });
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
        if (!talent) return;
        
        if (!isAuthenticated()) {
            event.preventDefault();
            setIntendedTalent(talent);
            setShowAuthModal(true);
            return false;
        }
        router.visit(`/talent/${talent.id}`);
    };

    // Get skills array safely - FIXED to handle string skills
    const getSkills = (talent) => {
        // SAFETY: Check if talent exists
        if (!talent) return ['Available for work'];
        
        // FIX: If skills is a string, parse it first
        if (talent.skills && typeof talent.skills === 'string') {
            try {
                const parsed = JSON.parse(talent.skills);
                if (Array.isArray(parsed)) return parsed;
                return [talent.skills];
            } catch(e) {
                return [talent.skills];
            }
        }
        
        // Check multiple possible field names for skills
        if (talent.skills && Array.isArray(talent.skills)) return talent.skills;
        if (talent.tech && Array.isArray(talent.tech)) return talent.tech;
        
        return ['Available for work'];
    };

    // Get display title safely
    const getDisplayTitle = (talent) => {
        if (!talent) return 'Professional';
        return talent.title || talent.role || 'Professional';
    };

    // Get rating safely
    const getRating = (talent) => {
        if (!talent) return 4.0;
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
                            // SAFETY: Skip if talent is null/undefined
                            if (!talent) return null;
                            
                            const skills = getSkills(talent);
                            const rating = getRating(talent);
                            const fullStars = Math.floor(rating);
                            const hasHalfStar = (rating - fullStars) >= 0.5;
                            
                            return (
                                <div key={talent.id} className="feature-talent-card">
                                    <div className="feature-talent-card-header">
                                        {(() => {
                                            const url = getAvatarUrl({ profile: { profile_image_base64: talent.profile_image_base64, avatar_url: talent.avatar_url, avatar: talent.avatar }, fallbackName: talent.name, fallbackColor: '4F46E5' });
                                            if (!url) return (
                                                <div className="feature-talent-avatar-initials">{getInitials(talent.name)}</div>
                                            );
                                            return (
                                                <img
                                                    src={url}
                                                    alt={talent.name || 'Talent'}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        if (e.target.parentElement) {
                                                            e.target.parentElement.innerHTML = `<div class="feature-talent-avatar-initials">${getInitials(talent.name)}</div>`;
                                                        }
                                                    }} />
                                            );
                                        })()}
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