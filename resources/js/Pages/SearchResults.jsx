import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppNavbar from '../Components/AppNavbar';
import '../../css/search-results.css';

export default function SearchResults({ auth, jobs = [], talents = [], searchQuery = '' }) {
    const [filterType, setFilterType] = useState('all'); // 'all', 'jobs', 'talents'
    const [sortBy, setSortBy] = useState('relevance'); // 'relevance', 'newest', 'name'
    const currentUser = auth?.user;

    const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);

    const calculateRelevance = (item, searchTerms) => {
        let score = 0;
        const searchableText = [
            item.title || item.name || '',
            item.description || item.bio || '',
            item.company || item.position || '',
            item.tags?.join(' ') || '',
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

    return (
        <>
            <Head title={`Search Results: "${searchQuery}" - GiftedTalent`} />
            <AppNavbar user={currentUser} />

            <div style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: '20px', paddingBottom: '60px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '32px', color: '#111827', margin: 0 }}>
                            Search Results
                        </h1>
                        <p style={{ fontSize: '16px', color: '#6b7280', margin: '8px 0 0' }}>
                            {totalResults} result{totalResults !== 1 ? 's' : ''} found for "{searchQuery}"
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px', marginBottom: '32px' }}>
                        <aside style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e5e7eb', height: 'fit-content' }}>
                            <h3 style={{ fontSize: '16px', color: '#111827', fontWeight: '700', marginBottom: '14px' }}>Filter</h3>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '10px', fontWeight: '500' }}>Type</label>
                                <div style={{ display: 'grid', gap: '8px' }}>
                                    {[
                                        { value: 'all', label: `All (${displayJobs.length + displayTalents.length})` },
                                        { value: 'jobs', label: `Jobs (${filteredJobs.length})` },
                                        { value: 'talents', label: `Talents (${filteredTalents.length})` },
                                    ].map(opt => (
                                        <label key={opt.value} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                                            <input type="radio" name="filter" value={opt.value} checked={filterType === opt.value} onChange={() => setFilterType(opt.value)} style={{ cursor: 'pointer' }} />
                                            <span style={{ fontSize: '14px', color: '#374151' }}>{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '10px', fontWeight: '500' }}>Sort By</label>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', cursor: 'pointer' }}>
                                    <option value="relevance">Most Relevant</option>
                                    <option value="newest">Newest First</option>
                                    <option value="name">Name (A-Z)</option>
                                </select>
                            </div>
                        </aside>

                        <main>
                            {totalResults === 0 ? (
                                <div style={{ background: '#fff', borderRadius: '16px', padding: '60px 20px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                                    <h2 style={{ fontSize: '20px', color: '#111827', margin: 0 }}>No Results Found</h2>
                                    <p style={{ color: '#6b7280', margin: '12px 0 0' }}>Try adjusting your search terms or explore featured opportunities.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gap: '16px' }}>
                                    {displayJobs.map(job => (
                                        <Link key={`job-${job.id}`} href={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                                            <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'all 0.2s', hover: { boxShadow: '0 10px 30px rgba(15, 23, 42, 0.1)' } }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <span style={{ display: 'inline-block', fontSize: '12px', backgroundColor: '#dbeafe', color: '#0284c7', padding: '4px 10px', borderRadius: '8px', marginBottom: '8px' }}>Job</span>
                                                        <h3 style={{ fontSize: '18px', color: '#111827', margin: 0, marginBottom: '4px' }}>{job.title}</h3>
                                                        <p style={{ color: '#6b7280', margin: 0, marginBottom: '8px', fontSize: '14px' }}>{job.company}</p>
                                                        <p style={{ color: '#6b7280', margin: 0, fontSize: '14px', display: 'line-clamp', WebkitLineClamp: 2, overflow: 'hidden' }}>{job.description}</p>
                                                        {job.tags && (
                                                            <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                                                                {job.tags.slice(0, 3).map(tag => (
                                                                    <span key={tag} style={{ fontSize: '12px', background: '#f3f4f6', color: '#6b7280', padding: '4px 8px', borderRadius: '6px' }}>{tag}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}

                                    {displayTalents.map(talent => (
                                        <Link key={`talent-${talent.id}`} href={`/talent/${talent.id}`} style={{ textDecoration: 'none' }}>
                                            <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                                                    <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                                                        <img src={talent.avatar || talent.profile_image_base64 || `https://ui-avatars.com/api/?name=${talent.name}&background=4F46E5&color=fff`} alt={talent.name} style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover' }} />
                                                        <div style={{ flex: 1 }}>
                                                            <span style={{ display: 'inline-block', fontSize: '12px', backgroundColor: '#f0fdf4', color: '#16a34a', padding: '4px 10px', borderRadius: '8px', marginBottom: '8px' }}>Talent</span>
                                                            <h3 style={{ fontSize: '18px', color: '#111827', margin: 0, marginBottom: '4px' }}>{talent.name}</h3>
                                                            <p style={{ color: '#6b7280', margin: 0, marginBottom: '8px', fontSize: '14px' }}>{talent.title || talent.position}</p>
                                                            {talent.skills && (
                                                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                                    {talent.skills.slice(0, 3).map(skill => (
                                                                        <span key={skill} style={{ fontSize: '12px', background: '#f3f4f6', color: '#6b7280', padding: '4px 8px', borderRadius: '6px' }}>{skill}</span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
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
