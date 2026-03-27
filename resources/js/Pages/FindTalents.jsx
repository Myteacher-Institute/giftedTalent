import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
// import Nav from '../Components/Nav';
import { Nav } from './Welcome';
// import '../css/find_talents.css';

export default function FindTalents({ auth, talents, searchQuery = '' }) {
    const [searchTerm, setSearchTerm] = useState(searchQuery);
    const [isSearching, setIsSearching] = useState(false);

    // Handle search - uses Inertia to navigate with search parameter
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            // If search is empty, go to the main page
            router.get('/find-talents');
            return;
        }

        setIsSearching(true);
        
        // Navigate with search query parameter
        router.get('/find-talents', { search: searchTerm }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => {
                setIsSearching(false);
            }
        });
    };

    // Handle enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Handle reset search
    const handleResetSearch = () => {
        setSearchTerm('');
        router.get('/find-talents');
    };

    // Get initials for avatar fallback
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Format availability status color
    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'open to work':
                return '#10b981';
            case 'available':
                return '#10b981';
            case 'not available':
                return '#ef4444';
            default:
                return '#f59e0b';
        }
    };

    // Get the data to display (either search results or all talents)
    const displayData = talents.data || talents;

    return (
        <>
            <Head title="Find Talents - GiftedTalent" />
            
            <div className="find-talents-page">
                <Nav auth={auth} />
                
                <div className="find-talents-container">
                    {/* Header Section */}
                    <div className="find-talents-header">
                        <h1>Find Talents</h1>
                        <p>Connect with skilled professionals ready to work</p>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="find-talents-search">
                        <div className="search-input-wrapper">
                            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input 
                                type="text"
                                placeholder="Search by name, title, skills, or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            {searchTerm && (
                                <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
                                    ✕
                                </button>
                            )}
                        </div>
                        <div className="search-actions">
                            <button 
                                className="search-submit-btn" 
                                onClick={handleSearch}
                                disabled={isSearching}
                            >
                                {isSearching ? 'Searching...' : 'Search'}
                            </button>
                            {searchQuery && (
                                <button className="search-reset-btn" onClick={handleResetSearch}>
                                    Show All
                                </button>
                            )}
                        </div>
                        <div className="results-count">
                            Found {displayData.length} talent{displayData.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                    
                    {/* Talents Grid */}
                    <div className="talents-grid">
                        {displayData.length > 0 ? (
                            displayData.map((talent) => (
                                <div key={talent.id} className="talent-card">
                                    {/* Card Cover */}
                                    <div className="talent-card-cover"></div>
                                    
                                    {/* Profile Image */}
                                    <div className="talent-card-image">
                                        {talent.avatar ? (
                                            <img src={talent.avatar} alt={talent.name} />
                                        ) : (
                                            <div className="talent-card-initials">
                                                {getInitials(talent.name)}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Card Content */}
                                    <div className="talent-card-content">
                                        <h3 className="talent-card-name">{talent.name}</h3>
                                        <p className="talent-card-title">{talent.title || 'Professional'}</p>
                                        <p className="talent-card-company">{talent.company || 'Freelancer'}</p>
                                        
                                        {/* Availability Badge */}
                                        <div className="talent-card-availability">
                                            <span 
                                                className="availability-badge"
                                                style={{ backgroundColor: getStatusColor(talent.availability_status) }}
                                            >
                                                {talent.availability_status || 'Open to work'}
                                            </span>
                                        </div>
                                        
                                        {/* Skills */}
                                        {talent.skills && talent.skills.length > 0 && (
                                            <div className="talent-card-skills">
                                                {talent.skills.slice(0, 4).map((skill, index) => (
                                                    <span key={index} className="skill-tag">{skill}</span>
                                                ))}
                                                {talent.skills.length > 4 && (
                                                    <span className="skill-tag more">+{talent.skills.length - 4}</span>
                                                )}
                                            </div>
                                        )}
                                        
                                        {/* Location */}
                                        {talent.location && (
                                            <div className="talent-card-location">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1118 0z"></path>
                                                    <circle cx="12" cy="10" r="3"></circle>
                                                </svg>
                                                <span>{talent.location}</span>
                                            </div>
                                        )}
                                        
                                        {/* View Profile Button */}
                                        <Link 
                                            href={`/talent/${talent.id}`}
                                            className="view-profile-btn"
                                        >
                                            View Profile
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                                <polyline points="12 5 19 12 12 19"></polyline>
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-talents-found">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                <h3>No talents found</h3>
                                <p>{searchQuery ? `No results matching "${searchQuery}"` : 'No talents available yet'}</p>
                                {searchQuery && (
                                    <button className="clear-search-btn" onClick={handleResetSearch}>
                                        Clear Search
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {/* Pagination - Only show when not searching and data is paginated */}
                    {!searchQuery && talents.links && talents.links.length > 3 && (
                        <div className="pagination">
                            {talents.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`pagination-link ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}