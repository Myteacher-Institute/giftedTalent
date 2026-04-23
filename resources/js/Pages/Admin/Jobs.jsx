import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import '/resources/css/admin-job-applicants.css';

export default function JobApplicants({ job, applicants }) {
    const [processing, setProcessing] = useState(false);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const updateStatus = (applicationId, status) => {
        setProcessing(true);
        router.patch(`/Admin/applications/${applicationId}/status`, { status }, {
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

    return (
        <>
            <Head title={`Applicants for ${job.job_title} - Admin`} />

            <div className="job-applicants-container">
                <div className="job-applicants-header">
                    <button
                        className="back-btn"
                        onClick={() => router.get('/Admin/dashboard')}
                    >
                        ← Back to Dashboard
                    </button>
                    <h1>Applicants for: {job.job_title}</h1>
                    <p className="company-name">{job.company_name} | {job.location}</p>
                </div>

                <div className="applicants-stats">
                    <div className="stat-card">
                        <span className="stat-value">{applicants.total}</span>
                        <span className="stat-label">Total Applicants</span>
                    </div>
                </div>

                <div className="applicants-list">
                    {applicants.data.length === 0 ? (
                        <div className="no-applicants">
                            <p>No applicants yet for this job.</p>
                        </div>
                    ) : (
                        <table className="applicants-table">
                            <thead>
                                <tr>
                                    <th>Applicant</th>
                                    <th>Email</th>
                                    <th>Applied Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applicants.data.map((application) => (
                                    <tr key={application.id}>
                                        <td>
                                            <div className="applicant-info">
                                                <div className="applicant-avatar">
                                                    {application.user?.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <span>{application.user?.name}</span>
                                            </div>
                                        </td>
                                        <td>{application.user?.email}</td>
                                        <td>{formatDate(application.applied_at)}</td>
                                        <td>
                                            <span className={`status-badge ${application.status}`}>
                                                {application.status}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                className="status-select"
                                                value={application.status}
                                                onChange={(e) => updateStatus(application.id, e.target.value)}
                                                disabled={processing}
                                            >
                                                <option value="applied">Applied</option>
                                                <option value="review">Review</option>
                                                <option value="interview">Interview</option>
                                                <option value="offered">Offered</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {applicants.links && (
                    <div className="pagination">
                        {applicants.links.map((link, index) => (
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