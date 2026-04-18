import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppNavbar from '../Components/AppNavbar';
import '../../css/Hire.css';

export default function Hire({ auth, profile, stats, featuredTalents }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSkill, setSelectedSkill] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedExperience, setSelectedExperience] = useState('');
    
    const currentUser = auth?.user;
    const statsData = stats || {};
    const talents = featuredTalents || [];

    // Filter talents based on search and filters
    const filteredTalents = talents.filter(talent => {
        const matchesSearch = searchTerm === '' || 
            talent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            talent.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (talent.skills && Array.isArray(talent.skills) && talent.skills.some(skill => skill?.toLowerCase().includes(searchTerm.toLowerCase())));
        
        const matchesSkill = selectedSkill === '' || 
            (talent.skills && Array.isArray(talent.skills) && talent.skills.some(skill => skill?.toLowerCase() === selectedSkill.toLowerCase()));
        
        const matchesLocation = selectedLocation === '' || 
            talent.location?.toLowerCase() === selectedLocation.toLowerCase();
        
        const matchesExperience = selectedExperience === '' || 
            talent.experience_level === selectedExperience;
        
        return matchesSearch && matchesSkill && matchesLocation && matchesExperience;
    });

    // Get unique values for filters
    const allSkills = [...new Set(talents.flatMap(t => t.skills && Array.isArray(t.skills) ? t.skills : []))];
    const allLocations = [...new Set(talents.map(t => t.location).filter(Boolean))];
    const experienceLevels = [
        { value: 'entry', label: 'Entry (0-2 years)' },
        { value: 'mid', label: 'Mid (3-5 years)' },
        { value: 'senior', label: 'Senior (5+ years)' }
    ];

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedSkill('');
        setSelectedLocation('');
        setSelectedExperience('');
    };

    const getProfileImageUrl = () => {
        if (profile?.profile_image_base64) return profile.profile_image_base64;
        if (currentUser?.profile?.profile_image_base64) return currentUser.profile.profile_image_base64;
        if (currentUser?.profile?.avatar_url) return currentUser.profile.avatar_url;
        const userName = currentUser?.name || 'User';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0A2463&color=fff&size=150&bold=true`;
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    const getInitials = (name) => {
        return name?.charAt(0)?.toUpperCase() || 'U';
    };

    const renderStars = (rating) => {
        return '⭐'.repeat(Math.floor(rating || 0)) + '☆'.repeat(5 - Math.floor(rating || 0));
    };

    const handleViewProfile = (talentId) => {
        router.visit(`/talent/${talentId}`);
    };

    const handleContactTalent = (talentId) => {
    router.visit(`/messages/user/${talentId}`);
};

    return (
        <>
            <Head title="Hire Talent - GiftedTalent" />
            
            <AppNavbar 
                user={currentUser} 
                onMenuToggle={toggleSidebar}
                isMenuOpen={sidebarOpen}
            />

            {sidebarOpen && <div className="mobile-overlay" onClick={closeSidebar}></div>}

            <div className="hire-container">
                {/* Sidebar */}
                <aside className={`hire-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
                    <div className="profile">
                        <div className="profile-image-wrapper">
                            <img src={getProfileImageUrl()} alt={currentUser?.name || 'Profile'} className="profile-image" />
                            <div className="verified-overlay"><i className="fa-solid fa-check-circle"></i></div>
                        </div>
                        <h3>{currentUser?.name || 'User'}</h3>
                        <p>{profile?.position || currentUser?.profile?.position || 'Employer'}</p>
                        <button><Link href="/profile/edit" className="profile-button">Edit Profile</Link></button>
                    </div>
                    <ul className="menu">
                      <ul className="menu">
    <li><Link href="/dashboard"><i className="fa-solid fa-table"></i>Dashboard</Link></li>
    <li className="active"><Link href="/hire"><i className="fa-solid fa-user-plus"></i>Hire Talent</Link></li>
    <li><Link href="/jobs"><i className="fa-solid fa-briefcase"></i>Jobs</Link></li>
    <li><Link href="/my-applications"><i className="fa-solid fa-file"></i>Applications</Link></li>
    <li><Link href="/messages"><i className="fa-regular fa-envelope"></i>Messages</Link></li>
    <li><Link href="/settings"><i className="fa-solid fa-gear"></i>Settings</Link></li>
    <li className="logout-item"><a href="/" onClick={(e) => { e.preventDefault(); handleLogout(); }}><i className="fa-solid fa-right-from-bracket logout-icon"></i>Logout</a></li>
</ul>
                    </ul>
                </aside>

                {/* Main Content */}
                <div className="hire-main">
                    {/* Hero Section */}
                    <div className="hire-hero">
                        <div className="hire-hero-content">
                            <span className="hero-badge"><i className="fa-solid fa-rocket"></i> Hire the Best</span>
                            <h1>Find Your Next <span className="gradient-text">Superstar</span></h1>
                            <p>Browse through thousands of qualified candidates ready to work</p>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="hire-stats">
                        <div className="stat-card">
                            <i className="fa-solid fa-user-graduate"></i>
                            <span className="stat-number">{statsData.total_talents?.toLocaleString() || 0}+</span>
                            <span className="stat-label">Talents</span>
                        </div>
                        <div className="stat-card">
                            <i className="fa-solid fa-briefcase"></i>
                            <span className="stat-number">{statsData.total_placements?.toLocaleString() || 0}+</span>
                            <span className="stat-label">Placements</span>
                        </div>
                        <div className="stat-card">
                            <i className="fa-solid fa-building"></i>
                            <span className="stat-number">{statsData.total_companies?.toLocaleString() || 0}+</span>
                            <span className="stat-label">Companies</span>
                        </div>
                        <div className="stat-card">
                            <i className="fa-solid fa-clock"></i>
                            <span className="stat-number">&lt;{statsData.avg_response_time || 24} hrs</span>
                            <span className="stat-label">Response Time</span>
                        </div>
                    </div>

                    {/* Browse Talent Section */}
                    <div className="hire-content">
                        <div className="content-header">
                            <h2><i className="fa-solid fa-users"></i> Browse Top Talent</h2>
                            <p>Find and connect with qualified candidates for your open positions</p>
                        </div>

                        {/* Search and Filters */}
                        <div className="search-filters">
                            <div className="search-bar">
                                <i className="fa-solid fa-magnifying-glass"></i>
                                <input 
                                    type="text" 
                                    placeholder="Search by name, skill, or title..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {(searchTerm || selectedSkill || selectedLocation || selectedExperience) && (
                                    <button className="clear-search-btn" onClick={clearFilters}>
                                        <i className="fa-solid fa-xmark"></i> Clear
                                    </button>
                                )}
                            </div>
                            <div className="filter-group">
                                <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}>
                                    <option value="">All Skills</option>
                                    {allSkills.map(skill => (
                                        <option key={skill} value={skill}>{skill}</option>
                                    ))}
                                </select>
                                <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                                    <option value="">All Locations</option>
                                    {allLocations.map(location => (
                                        <option key={location} value={location}>{location}</option>
                                    ))}
                                </select>
                                <select value={selectedExperience} onChange={(e) => setSelectedExperience(e.target.value)}>
                                    <option value="">Experience Level</option>
                                    {experienceLevels.map(level => (
                                        <option key={level.value} value={level.value}>{level.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="results-count">
                            <i className="fa-solid fa-users"></i>
                            Found <strong>{filteredTalents.length}</strong> {filteredTalents.length === 1 ? 'candidate' : 'candidates'}
                        </div>

                        {/* Talents Grid */}
                        {filteredTalents.length === 0 ? (
                            <div className="no-results">
                                <i className="fa-solid fa-user-slash"></i>
                                <h3>No talents found</h3>
                                <p>Try adjusting your search or filters to find more candidates</p>
                                <button className="clear-filters-btn" onClick={clearFilters}>
                                    <i className="fa-solid fa-eraser"></i> Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <div className="talents-grid">
                                {filteredTalents.map(talent => (
                                    <div key={talent.id} className="talent-card">
                                        <div className="talent-avatar">
                                            {talent.avatar ? (
                                                <img src={talent.avatar} alt={talent.name} />
                                            ) : (
                                                <div className="avatar-placeholder">{getInitials(talent.name)}</div>
                                            )}
                                        </div>
                                        <h3 className="talent-name">{talent.name}</h3>
                                        <p className="talent-title">{talent.title}</p>
                                        <div className="talent-rating">{renderStars(talent.rating)}</div>
                                        <div className="talent-skills">
                                            {talent.skills && Array.isArray(talent.skills) && talent.skills.slice(0, 3).map((skill, i) => (
                                                <span key={i} className="skill-tag"><i className="fa-solid fa-code"></i> {skill}</span>
                                            ))}
                                            {talent.skills && Array.isArray(talent.skills) && talent.skills.length > 3 && (
                                                <span className="skill-tag more"><i className="fa-solid fa-plus"></i> +{talent.skills.length - 3}</span>
                                            )}
                                        </div>
                                        <div className="talent-info">
                                            <div className="talent-experience">
                                                <i className="fa-solid fa-briefcase"></i> {talent.experience || 'Entry level'}
                                            </div>
                                            <div className="talent-location">
                                                <i className="fa-solid fa-location-dot"></i> {talent.location || 'Remote'}
                                            </div>
                                            <div className="talent-availability">
                                                <i className="fa-regular fa-calendar-check"></i> Available: {talent.availability || 'Immediate'}
                                            </div>
                                            {talent.expected_salary && (
                                                <div className="talent-salary">
                                                    <i className="fa-solid fa-money-bill-wave"></i> {talent.expected_salary}
                                                </div>
                                            )}
                                        </div>
                                        <div className="talent-actions">
                                            <button className="view-profile-btn" onClick={() => handleViewProfile(talent.id)}>
                                                <i className="fa-regular fa-eye"></i> View Profile
                                            </button>
                                            <button className="contact-btn" onClick={() => handleContactTalent(talent.id)}>
                                                <i className="fa-regular fa-envelope"></i> Message
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* How It Works Section */}
                    <div className="how-it-works">
                        <div className="section-header">
                            <h2><i className="fa-solid fa-chart-simple"></i> How It Works</h2>
                            <p>Simple steps to find your perfect candidate</p>
                        </div>
                        <div className="steps-grid">
                            <div className="step-card">
                                <div className="step-number">1</div>
                                <i className="fa-solid fa-magnifying-glass step-icon"></i>
                                <h3>Search & Filter</h3>
                                <p>Browse through qualified candidates using our filters</p>
                            </div>
                            <div className="step-card">
                                <div className="step-number">2</div>
                                <i className="fa-solid fa-eye step-icon"></i>
                                <h3>Review Profiles</h3>
                                <p>Check candidate experience, skills, and portfolio</p>
                            </div>
                            <div className="step-card">
                                <div className="step-number">3</div>
                                <i className="fa-solid fa-message step-icon"></i>
                                <h3>Contact & Hire</h3>
                                <p>Reach out directly and hire the best talent</p>
                            </div>
                        </div>
                    </div>

                    {/* Testimonials Section */}
                    <div className="testimonials-section">
                        <div className="section-header">
                            <h2><i className="fa-solid fa-quote-right"></i> What Companies Say</h2>
                            <p>Trusted by businesses of all sizes</p>
                        </div>
                        <div className="testimonials-grid">
                            <div className="testimonial-card">
                                <i className="fa-solid fa-quote-left quote-icon"></i>
                                <p>"Found amazing talent within 24 hours! The quality of candidates was exceptional."</p>
                                <div className="testimonial-author">
                                    <strong>Sarah Johnson</strong>
                                    <span>HR Manager, TechCorp</span>
                                </div>
                            </div>
                            <div className="testimonial-card">
                                <i className="fa-solid fa-quote-left quote-icon"></i>
                                <p>"The platform made it easy to find and connect with qualified developers."</p>
                                <div className="testimonial-author">
                                    <strong>Michael Okonkwo</strong>
                                    <span>CTO, InnovateHub</span>
                                </div>
                            </div>
                            <div className="testimonial-card">
                                <i className="fa-solid fa-quote-left quote-icon"></i>
                                <p>"Hired our best employee through GiftedTalent. Highly recommended!"</p>
                                <div className="testimonial-author">
                                    <strong>Chiamaka Nwosu</strong>
                                    <span>Founder, CreativeSpace</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="faq-section">
                        <div className="section-header">
                            <h2><i className="fa-solid fa-circle-question"></i> Frequently Asked Questions</h2>
                            <p>Everything you need to know about hiring on GiftedTalent</p>
                        </div>
                        <div className="faq-grid">
                            <div className="faq-item">
                                <h3><i className="fa-solid fa-dollar-sign"></i> Is it free to browse talent?</h3>
                                <p>Yes! Browsing and searching for talent is completely FREE.</p>
                            </div>
                            <div className="faq-item">
                                <h3><i className="fa-solid fa-clock"></i> How quickly can I hire?</h3>
                                <p>Most companies find and hire candidates within 1-2 weeks.</p>
                            </div>
                            <div className="faq-item">
                                <h3><i className="fa-solid fa-message"></i> Can I message candidates directly?</h3>
                                <p>Yes! You can message candidates directly through our built-in messaging system.</p>
                            </div>
                            <div className="faq-item">
                                <h3><i className="fa-solid fa-file"></i> Can I see candidate portfolios?</h3>
                                <p>Yes, candidates can upload their portfolios and work samples to their profiles.</p>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <div className="newsletter-section">
                        <div className="newsletter-content">
                            <div className="newsletter-icon">
                                <i className="fa-solid fa-envelope-open-text"></i>
                            </div>
                            <h3>Get Hiring Tips & Updates</h3>
                            <p>Subscribe to receive the best hiring strategies and talent insights</p>
                            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alertify.success('Subscribed successfully!'); }}>
                                <input type="email" placeholder="Enter your email address" required />
                                <button type="submit"><i className="fa-solid fa-paper-plane"></i> Subscribe</button>
                            </form>
                            <p className="newsletter-note"><i className="fa-regular fa-lock"></i> We respect your privacy. Unsubscribe anytime.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}