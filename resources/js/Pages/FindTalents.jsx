import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import '../../css/find-talents.css';
import ApplicationLogo from '@/Components/ApplicationLogo';

// Helper function to safely get skills array
const getSkillsArray = (skills) => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    if (typeof skills === 'string') {
        try {
            const parsed = JSON.parse(skills);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return skills.split(',').map(s => s.trim());
        }
    }
    return [];
};

// Nav Component - Same as Welcome.jsx
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
                    <ApplicationLogo className="w-10 h-10 mr-2" style={{
                        width: '100%',
                        maxWidth: '100px'
                    }}  />
                </Link>
                
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

export default function FindTalents({ auth, talents = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const swiperRef = useRef(null);
    const currentUser = auth?.user;

    // Filter talents based on search
    const filteredTalents = talents.filter(talent => {
        if (searchQuery) {
            return talent.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   talent.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   getSkillsArray(talent.skills).some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return true;
    });

    const handleTalentClick = (talentId) => {
        router.visit(`/talent/${talentId}`);
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    };

    const scrollContainer = (direction) => {
        if (swiperRef.current) {
            const scrollAmount = direction === 'left' ? -320 : 320;
            swiperRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <>
            <Head title="Find Talents - GiftedTalents" />
            
            <Nav auth={auth} />

            <div className="find-talents-page">
                <div className="find-talents-container">
                    <div className="find-talents-hero">
                        <h1>Find <span className="gradient-text">Talents</span></h1>
                        <p>Discover skilled professionals ready to work</p>
                        
                        <div className="talents-search-bar">
                            <i className="fas fa-search"></i>
                            <input 
                                type="text" 
                                placeholder="Search by name, title, or skills..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Desktop View */}
                    <div className="talents-desktop-view">
                        <div className="talents-grid">
                            {filteredTalents.length === 0 ? (
                                <div className="empty-state">
                                    <i className="fas fa-users"></i>
                                    <h3>No talents found</h3>
                                    <p>Try adjusting your search</p>
                                </div>
                            ) : (
                                filteredTalents.map((talent) => {
                                    const skillsArray = getSkillsArray(talent.skills);
                                    return (
                                        <div 
                                            key={talent.id} 
                                            className="talent-card"
                                            onClick={() => handleTalentClick(talent.id)}
                                        >
                                            <div className="talent-card-header">
                                                <div className="talent-avatar">
                                                    {talent.avatar ? (
                                                        <img src={talent.avatar} alt={talent.name} />
                                                    ) : (
                                                        <div className="avatar-initials">{getInitials(talent.name)}</div>
                                                    )}
                                                </div>
                                                <div className="talent-rating">
                                                    <i className="fas fa-star"></i>
                                                    <span>{talent.rating || 4.0}</span>
                                                </div>
                                            </div>
                                            <h3 className="talent-name">{talent.name}</h3>
                                            <p className="talent-title">{talent.title || 'Professional'}</p>
                                            {talent.location && (
                                                <p className="talent-location">
                                                    <i className="fas fa-map-marker-alt"></i>
                                                    {talent.location}
                                                </p>
                                            )}
                                            <div className="talent-skills">
                                                {skillsArray.slice(0, 3).map((skill, idx) => (
                                                    <span key={idx} className="skill-tag">{skill}</span>
                                                ))}
                                            </div>
                                            <button className="view-profile-btn">View Profile</button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Mobile View */}
                    <div className="talents-mobile-view">
                        <div className="swipe-controls">
                            <button className="swipe-prev" onClick={() => scrollContainer('left')}>
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <div className="talents-swiper" ref={swiperRef}>
                                <div className="talents-swiper-wrapper">
                                    {filteredTalents.length === 0 ? (
                                        <div className="empty-state">
                                            <i className="fas fa-users"></i>
                                            <h3>No talents found</h3>
                                        </div>
                                    ) : (
                                        filteredTalents.map((talent) => {
                                            const skillsArray = getSkillsArray(talent.skills);
                                            return (
                                                <div 
                                                    key={talent.id} 
                                                    className="talent-swiper-slide"
                                                    onClick={() => handleTalentClick(talent.id)}
                                                >
                                                    <div className="talent-card-mobile">
                                                        <div className="talent-card-header">
                                                            <div className="talent-avatar">
                                                                {talent.avatar ? (
                                                                    <img src={talent.avatar} alt={talent.name} />
                                                                ) : (
                                                                    <div className="avatar-initials">{getInitials(talent.name)}</div>
                                                                )}
                                                            </div>
                                                            <div className="talent-rating">
                                                                <i className="fas fa-star"></i>
                                                                <span>{talent.rating || 4.0}</span>
                                                            </div>
                                                        </div>
                                                        <h3 className="talent-name">{talent.name}</h3>
                                                        <p className="talent-title">{talent.title || 'Professional'}</p>
                                                        {talent.location && (
                                                            <p className="talent-location">
                                                                <i className="fas fa-map-marker-alt"></i>
                                                                {talent.location}
                                                            </p>
                                                        )}
                                                        <div className="talent-skills">
                                                            {skillsArray.slice(0, 3).map((skill, idx) => (
                                                                <span key={idx} className="skill-tag">{skill}</span>
                                                            ))}
                                                        </div>
                                                        <button className="view-profile-btn">View Profile</button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                            <button className="swipe-next" onClick={() => scrollContainer('right')}>
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}