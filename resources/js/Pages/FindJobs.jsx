import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import '../../css/Dashboard.css';
import AppNavbar from '../Components/AppNavbar';

export default function FindJobs({ auth, jobs: initialJobs, jobTypes: initialJobTypes }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJobType, setSelectedJobType] = useState('');
    const [filteredJobs, setFilteredJobs] = useState(initialJobs);
    const [savedJobs, setSavedJobs] = useState([]);
    
    const currentUser = auth?.user;

    // Filter jobs based on search and job type
    useEffect(() => {
        let filtered = [...initialJobs];
        
        if (searchTerm) {
            filtered = filtered.filter(job => 
                job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (job.tags && job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
            );
        }
        
        if (selectedJobType) {
            filtered = filtered.filter(job => job.job_type === selectedJobType);
        }
        
        setFilteredJobs(filtered);
    }, [searchTerm, selectedJobType, initialJobs]);

    const handleSaveJob = (jobId) => {
        router.post(`/saved-jobs/${jobId}`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                if (savedJobs.includes(jobId)) {
                    setSavedJobs(savedJobs.filter(id => id !== jobId));
                    if (window.alertify) alertify.success('Job removed from saved');
                } else {
                    setSavedJobs([...savedJobs, jobId]);
                    if (window.alertify) alertify.success('Job saved successfully');
                }
            },
            onError: () => {
                if (window.alertify) alertify.error('Failed to save job');
            }
        });
    };

    const handleApplyClick = (jobId) => {
        router.visit(`/easy-apply-job/${jobId}`);
    };

    return (
        <>
            <Head title="Find Jobs" />
            
            <AppNavbar user={currentUser} />

            <div className="find-jobs-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#0A2463', marginBottom: '10px' }}>Find Jobs</h1>
                    <p style={{ fontSize: '18px', color: '#6b7280' }}>Discover your next career opportunity</p>
                </div>

                {/* Search and Filter Bar */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <i className="fas fa-search" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}></i>
                        <input
                            type="text"
                            placeholder="Search by title, company, or skill..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '12px 15px 12px 45px', border: '1px solid #e5e7eb', borderRadius: '30px', fontSize: '14px' }}
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>
                    
                    <select 
                        value={selectedJobType} 
                        onChange={(e) => setSelectedJobType(e.target.value)}
                        style={{ padding: '12px 20px', border: '1px solid #e5e7eb', borderRadius: '30px', fontSize: '14px', background: 'white', cursor: 'pointer' }}
                    >
                        <option value="">All Job Types</option>
                        {initialJobTypes?.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* Results Count */}
                <div style={{ marginBottom: '20px', color: '#6b7280' }}>
                    Found <strong style={{ color: '#0A2463' }}>{filteredJobs.length}</strong> jobs
                </div>

                {/* Jobs Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => (
                            <div key={job.id} style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', transition: 'transform 0.3s ease', cursor: 'pointer' }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', color: '#0A2463' }}>
                                        {job.company?.charAt(0).toUpperCase()}
                                    </div>
                                    {job.is_featured && <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>Featured</span>}
                                </div>
                                
                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', marginBottom: '5px' }}>{job.title}</h3>
                                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '10px' }}>{job.company}</p>
                                <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '12px' }}>
                                    <i className="fas fa-map-marker-alt" style={{ marginRight: '5px' }}></i> {job.location || 'Remote'}
                                </p>
                                
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                                    <span style={{ background: '#eef2ff', color: '#0A2463', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '500' }}>{job.job_type}</span>
                                    {job.tags && job.tags.slice(0, 2).map((skill, idx) => (
                                        <span key={idx} style={{ background: '#f3f4f6', color: '#4b5563', padding: '4px 12px', borderRadius: '20px', fontSize: '11px' }}>{skill}</span>
                                    ))}
                                </div>
                                
                                <p style={{ color: '#6b7280', fontSize: '13px', lineHeight: '1.5', marginBottom: '15px' }}>
                                    {job.description?.substring(0, 100)}...
                                </p>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', fontSize: '12px', color: '#9ca3af' }}>
                                    {job.salary_range && <span><i className="fas fa-dollar-sign"></i> {job.salary_range}</span>}
                                    <span><i className="far fa-clock"></i> {job.posted_at}</span>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button 
                                        onClick={() => handleApplyClick(job.id)}
                                        style={{ flex: 1, background: '#0A2463', color: 'white', border: 'none', padding: '10px', borderRadius: '30px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', transition: 'background 0.3s ease' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#0d2d6e'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#0A2463'}
                                    >
                                        Apply Now
                                    </button>
                                    <button 
                                        onClick={() => handleSaveJob(job.id)}
                                        style={{ background: 'white', border: '1px solid #e5e7eb', padding: '10px', borderRadius: '30px', cursor: 'pointer', transition: 'all 0.3s ease', color: savedJobs.includes(job.id) ? '#0A2463' : '#6b7280' }}
                                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0A2463'}
                                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                                    >
                                        <i className={`fa-${savedJobs.includes(job.id) ? 'solid' : 'regular'} fa-bookmark`}></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '16px' }}>
                            <i className="fas fa-briefcase" style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '16px' }}></i>
                            <h3 style={{ fontSize: '20px', color: '#1f2937', marginBottom: '8px' }}>No jobs found</h3>
                            <p style={{ color: '#6b7280', marginBottom: '20px' }}>Try adjusting your search or filter criteria</p>
                            <button onClick={() => { setSearchTerm(''); setSelectedJobType(''); }} style={{ background: '#0A2463', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '30px', cursor: 'pointer' }}>
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <footer className="footer" style={{ marginTop: '60px', padding: '24px', textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
                <div className="footer-right" style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a href="/about" style={{ textDecoration: 'none', color: '#64748b' }}>About</a>
                    <a href="/contact" style={{ textDecoration: 'none', color: '#64748b' }}>Contact</a>
                    <a href="/privacy" style={{ textDecoration: 'none', color: '#64748b' }}>Privacy Policy</a>
                    <a href="/guidelines" style={{ textDecoration: 'none', color: '#64748b' }}>Community Guideline</a>
                </div>
            </footer>
        </>
    );
}