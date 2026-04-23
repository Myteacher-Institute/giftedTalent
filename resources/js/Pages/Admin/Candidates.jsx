import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import '/resources/css/admin-candidates.css';

export default function Candidates({ candidates, stats }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [processing, setProcessing] = useState(false);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleSearch = () => {
        router.get('/Admin/candidates', {
            search: searchTerm,
            status: statusFilter
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const updateStatus = (applicationId, status) => {
        setProcessing(true);
        router.patch(`/Admin/candidates/${applicationId}/status`, { status }, {
            onSuccess: () => {
                setProcessing(false);
                alert('Status updated successfully!');
            },
            onError: () => {
                setProcessing(false);
                alert('Failed to update status');
            }
        });
    };

    const filteredCandidates = candidates?.data?.filter(candidate => {
        if (searchTerm && !candidate.name?.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        if (statusFilter && candidate.status !== statusFilter) {
            return false;
        }
        return true;
    }) || candidates || [];

    return (
        <>
            <Head title="Candidates - Admin" />

            <div className="admin-candidates-container">
                <div className="candidates-header">
                    <div className="header-left">
                        <button
                            className="back-btn"
                            onClick={() => router.get('/Admin/dashboard')}
                            title="Back to Dashboard"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </button>
                        <h1>Candidates</h1>
                    </div>
                    <div className="candidates-stats">
                        <div
                            className={`stat-card ${statusFilter === '' ? 'active' : ''}`}
                            onClick={() => { setStatusFilter(''); handleSearch(); }}
                            style={{ cursor: 'pointer' }}
                        >
                            <span className="stat-value">{stats?.total || 0}</span>
                            <span className="stat-label">Total Candidates</span>
                        </div>
                        <div
                            className={`stat-card pending ${statusFilter === 'applied' ? 'active' : ''}`}
                            onClick={() => { setStatusFilter('applied'); handleSearch(); }}
                            style={{ cursor: 'pointer' }}
                        >
                            <span className="stat-value">{stats?.pending || 0}</span>
                            <span className="stat-label">Pending Review</span>
                        </div>
                        <div
                            className={`stat-card approved ${statusFilter === 'approved' ? 'active' : ''}`}
                            onClick={() => { setStatusFilter('approved'); handleSearch(); }}
                            style={{ cursor: 'pointer' }}
                        >
                            <span className="stat-value">{stats?.approved || 0}</span>
                            <span className="stat-label">Approved</span>
                        </div>
                        <div
                            className={`stat-card rejected ${statusFilter === 'rejected' ? 'active' : ''}`}
                            onClick={() => { setStatusFilter('rejected'); handleSearch(); }}
                            style={{ cursor: 'pointer' }}
                        >
                            <span className="stat-value">{stats?.rejected || 0}</span>
                            <span className="stat-label">Rejected</span>
                        </div>
                    </div>
                </div>

                <div className="candidates-filters">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button onClick={handleSearch} className="search-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                            </svg>
                        </button>
                    </div>
                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${statusFilter === '' ? 'active' : ''}`}
                            onClick={() => { setStatusFilter(''); handleSearch(); }}
                        >
                            All
                        </button>
                        <button
                            className={`filter-btn ${statusFilter === 'applied' ? 'active' : ''}`}
                            onClick={() => { setStatusFilter('applied'); handleSearch(); }}
                        >
                            Applied
                        </button>
                        <button
                            className={`filter-btn ${statusFilter === 'review' ? 'active' : ''}`}
                            onClick={() => { setStatusFilter('review'); handleSearch(); }}
                        >
                            Review
                        </button>
                        <button
                            className={`filter-btn ${statusFilter === 'interview' ? 'active' : ''}`}
                            onClick={() => { setStatusFilter('interview'); handleSearch(); }}
                        >
                            Interview
                        </button>
                        <button
                            className={`filter-btn ${statusFilter === 'offered' ? 'active' : ''}`}
                            onClick={() => { setStatusFilter('offered'); handleSearch(); }}
                        >
                            Offered
                        </button>
                        <button
                            className={`filter-btn ${statusFilter === 'rejected' ? 'active' : ''}`}
                            onClick={() => { setStatusFilter('rejected'); handleSearch(); }}
                        >
                            Rejected
                        </button>
                    </div>
                </div>

                <div className="candidates-list">
                    {filteredCandidates.length === 0 ? (
                        <div className="no-candidates">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                            <p>No candidates found</p>
                        </div>
                    ) : (
                        <table className="candidates-table">
                            <thead>
                                <tr>
                                    <th>Candidate</th>
                                    <th>Email</th>
                                    <th>Applied For</th>
                                    <th>Applied Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCandidates.map((candidate) => (
                                    <tr key={candidate.id}>
                                        <td>
                                            <div className="candidate-info">
                                                <div className="candidate-avatar">
                                                    {candidate.avatar ? (
                                                        <img src={candidate.avatar} alt={candidate.name} />
                                                    ) : (
                                                        <span>{candidate.name?.charAt(0)?.toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <span>{candidate.name}</span>
                                            </div>
                                        </td>
                                        <td>{candidate.email}</td>
                                        <td>{candidate.job_title || candidate.applications?.[0]?.job_title || 'N/A'}</td>
                                        <td>{formatDate(candidate.created_at)}</td>
                                        <td>
                                            <span className={`status-badge ${candidate.status}`}>
                                                {candidate.status || 'applied'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="view-btn"
                                                    onClick={() => router.get(`/Admin/candidates/${candidate.id}`)}
                                                    title="View Details"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                        <circle cx="12" cy="12" r="3" />
                                                    </svg>
                                                </button>
                                                <select
                                                    className="status-select"
                                                    value={candidate.status}
                                                    onChange={(e) => updateStatus(candidate.applications?.[0]?.id, e.target.value)}
                                                    disabled={processing}
                                                >
                                                    <option value="applied">Applied</option>
                                                    <option value="review">Review</option>
                                                    <option value="interview">Interview</option>
                                                    <option value="offered">Offered</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => {
                                                        if (confirm('Delete this candidate?')) {
                                                            router.delete(`/Admin/candidates/${candidate.id}`);
                                                        }
                                                    }}
                                                    title="Delete"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {candidates?.links && (
                    <div className="pagination">
                        {candidates.links.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={link.active ? 'active' : ''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (link.url) {
                                        router.get(link.url);
                                    }
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}