import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppNavbar from '../Components/AppNavbar';
import '../../css/search-results.css';

export default function SearchResults({ auth, jobs = [], talents = [], searchQuery = '' }) {
    const [filterType, setFilterType] = useState('all'); // 'all', 'jobs', 'talents'
    const [sortBy, setSortBy] = useState('relevance'); // 'relevance', 'newest', 'name'
    const [filtersOpen, setFiltersOpen] = useState(false); // Mobile filters state
    const currentUser = auth?.user;

    const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);

    const calculateRelevance = (item, searchTerms) => {
        let score = 0;
        const searchableText = [
            item.title || item.name || '',
            item.description || item.bio || '',
            item.company || item.position || '',
            item.tags?.join(' ') || '',
            item.skills?.join(' ') || '',
        ].join(' ').toLowerCase();

        searchTerms.forEach(term => {
            const regex = new RegExp(`\\b${term}`, 'gi');
            const matches = searchableText.match(regex);
            score += (matches ? matches.length : 0) * 10;
            if (searchableText.includes(term)) score += 5;
        });

        return score;
    };

    const filteredJobs = useMemo(() => {
        return jobs
            .filter(job => {
                if (searchTerms.length === 0) return true;
                return searchTerms.some(term => {
                    const searchText = [job.title, job.description, job.company, job.tags?.join(' ')].join(' ').toLowerCase();
                    return searchText.includes(term);
                });
            })
            .map(job => ({ ...job, type: 'job', relevance: calculateRelevance(job, searchTerms) }))
            .sort((a, b) => {
                if (sortBy === 'relevance') return b.relevance - a.relevance;
                if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
                return 0;
            });
    }, [jobs, searchTerms, sortBy]);

    const filteredTalents = useMemo(() => {
        return talents
            .filter(talent => {
                if (searchTerms.length === 0) return true;
                return searchTerms.some(term => {
                    const searchText = [talent.name, talent.position, talent.title, talent.skills?.join(' ')].join(' ').toLowerCase();
                    return searchText.includes(term);
                });
            })
            .map(talent => ({ ...talent, type: 'talent', relevance: calculateRelevance(talent, searchTerms) }))
            .sort((a, b) => {
                if (sortBy === 'relevance') return b.relevance - a.relevance;
                if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
                return (a.name || '').localeCompare(b.name || '');
            });
    }, [talents, searchTerms, sortBy]);

    const displayJobs = filterType === 'all' || filterType === 'jobs' ? filteredJobs : [];
    const displayTalents = filterType === 'all' || filterType === 'talents' ? filteredTalents : [];

    const totalResults = displayJobs.length + displayTalents.length;

    // Close filters when clicking outside on mobile
    const handleOverlayClick = () => {
        setFiltersOpen(false);
    };

    return (
        <>
            <Head title={`Search Results: "${searchQuery}" - GiftedTalent`} />
            <AppNavbar user={currentUser} />

            <div className="search-results-page">
                <div className="search-results-container">
                    {/* Header */}
                    <div className="search-header">
                        <h1>Search Results</h1>
                        <p>{totalResults} result{totalResults !== 1 ? 's' : ''} found for "{searchQuery}"</p>
                    </div>

                    {/* Mobile Filter Toggle Button */}
                    <button 
                        className={`filter-toggle-btn ${filtersOpen ? 'active' : ''}`}
                        onClick={() => setFiltersOpen(!filtersOpen)}
                    >
                        <span>🔍 Filter Results</span>
                        <i className={`fas fa-chevron-${filtersOpen ? 'up' : 'down'}`}></i>
                    </button>

                    {/* Mobile Overlay */}
                    {filtersOpen && <div className="filter-overlay" onClick={handleOverlayClick}></div>}

                    {/* Main Layout */}
                    <div className="search-layout">
                        {/* Filters Sidebar */}
                        <aside className={`search-filters-sidebar ${filtersOpen ? 'open' : ''}`}>
                            <h3 className="filter-title">
                                Filters
                                <button 
                                    className="clear-filters-btn"
                                    onClick={() => {
                                        setFilterType('all');
                                        setSortBy('relevance');
                                    }}
                                    style={{ width: 'auto', padding: '4px 12px', fontSize: '12px' }}
                                >
                                    Clear All
                                </button>
                            </h3>

                            <div className="filter-group">
                                <label className="filter-label">Type</label>
                                <div className="radio-group">
                                    {[
                                        { value: 'all', label: `All (${displayJobs.length + displayTalents.length})` },
                                        { value: 'jobs', label: `Jobs (${filteredJobs.length})` },
                                        { value: 'talents', label: `Talents (${filteredTalents.length})` },
                                    ].map(opt => (
                                        <label key={opt.value} className="radio-option">
                                            <input 
                                                type="radio" 
                                                name="filter" 
                                                value={opt.value} 
                                                checked={filterType === opt.value} 
                                                onChange={() => {
                                                    setFilterType(opt.value);
                                                    setFiltersOpen(false); // Close filters on mobile after selection
                                                }} 
                                            />
                                            <span>{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-group">
                                <label className="filter-label">Sort By</label>
                                <select 
                                    className="filter-select" 
                                    value={sortBy} 
                                    onChange={(e) => {
                                        setSortBy(e.target.value);
                                        setFiltersOpen(false); // Close filters on mobile after selection
                                    }}
                                >
                                    <option value="relevance">Most Relevant</option>
                                    <option value="newest">Newest First</option>
                                    <option value="name">Name (A-Z)</option>
                                </select>
                            </div>
                        </aside>

                        {/* Results Main Content */}
                        <main className="search-results-main">
                            {/* Results Count Bar */}
                            <div className="results-count">
                                <strong>{totalResults}</strong> results found
                                {filterType !== 'all' && <span> in <strong>{filterType}</strong></span>}
                            </div>

                            {totalResults === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">🔍</div>
                                    <h2 className="empty-title">No Results Found</h2>
                                    <p className="empty-text">
                                        We could not find any jobs or talent matching "{searchQuery}".
                                    </p>
                                    <p className="empty-text">
                                        Try a different keyword or make the query more specific.
                                    </p>
                                </div>
                            ) : (
                                <div className="search-results-main">
                                    {/* Jobs Section */}
                                    {displayJobs.map(job => (
                                        <Link key={`job-${job.id}`} href={`/jobs/${job.id}`} className="search-result-card">
                                            <div className="result-flex">
                                                <div className="result-content">
                                                    <span className="result-badge-job">Job</span>
                                                    <h3 className="result-title">{job.title}</h3>
                                                    <p className="result-subtitle">{job.company}</p>
                                                    <p className="result-description">{job.description}</p>
                                                    {job.tags && job.tags.length > 0 && (
                                                        <div className="result-tags">
                                                            {job.tags.slice(0, 3).map(tag => (
                                                                <span key={tag} className="result-tag">{tag}</span>
                                                            ))}
                                                            {job.tags.length > 3 && (
                                                                <span className="result-tag">+{job.tags.length - 3} more</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}

                                    {/* Talents Section */}
                                    {displayTalents.map(talent => (
                                        <Link key={`talent-${talent.id}`} href={`/talent/${talent.id}`} className="search-result-card">
                                            <div className="result-flex-row">
                                                <img 
                                                    src={talent.avatar || talent.profile_image_base64 || `https://ui-avatars.com/api/?name=${encodeURIComponent(talent.name)}&background=4F46E5&color=fff`} 
                                                    alt={talent.name} 
                                                    className="result-avatar"
                                                    onError={(e) => {
                                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(talent.name)}&background=4F46E5&color=fff`;
                                                    }}
                                                />
                                                <div className="result-content">
                                                    <span className="result-badge-talent">Talent</span>
                                                    <h3 className="result-title">{talent.name}</h3>
                                                    <p className="result-subtitle">{talent.title || talent.position}</p>
                                                    {talent.skills && talent.skills.length > 0 && (
                                                        <div className="result-tags">
                                                            {talent.skills.slice(0, 3).map(skill => (
                                                                <span key={skill} className="result-tag">{skill}</span>
                                                            ))}
                                                            {talent.skills.length > 3 && (
                                                                <span className="result-tag">+{talent.skills.length - 3} more</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}