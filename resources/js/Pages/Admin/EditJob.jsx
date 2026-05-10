import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import '/resources/css/admin-edit-job.css';

export default function EditJob({ job }) {
    const [formData, setFormData] = useState({
        company_name: job.company_name || '',
        company_location: job.company_location || '',
        job_title: job.job_title || '',
        job_type: job.job_type || '',
        salary_range: job.salary_range || '',
        description: job.description || '',
    });

    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.patch(`/Admin/jobs/${job.id}`, formData, {
            onSuccess: () => {
                setProcessing(false);
                router.get('/Admin/dashboard');
            },
            onError: () => {
                setProcessing(false);
                alert('Failed to update job');
            }
        });
    };

    return (
        <>
            <Head title="Edit Job - Admin" />

            <div className="edit-job-container">
                <button className="back-btn" onClick={() => router.get('/Admin/dashboard')}>
                    ← Back to Dashboard
                </button>

                <h1>Edit Job</h1>

                <form onSubmit={handleSubmit} className="edit-job-form">
                    <div className="form-group">
                        <label>Company Name</label>
                        <input
                            type="text"
                            value={formData.company_name}
                            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                            required
                            disabled={processing}
                        />
                    </div>

                    <div className="form-group">
                        <label>Company Location</label>
                        <input
                            type="text"
                            value={formData.company_location}
                            onChange={(e) => setFormData({ ...formData, company_location: e.target.value })}
                            required
                            disabled={processing}
                        />
                    </div>

                    <div className="form-group">
                        <label>Job Title</label>
                        <input
                            type="text"
                            value={formData.job_title}
                            onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                            required
                            disabled={processing}
                        />
                    </div>

                    <div className="form-group">
                        <label>Job Type</label>
                        <select
                            value={formData.job_type}
                            onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                            required
                            disabled={processing}
                        >
                            <option value="Full-Time">Full-Time</option>
                            <option value="Part-Time">Part-Time</option>
                            <option value="Contract">Contract</option>
                            <option value="Remote">Remote</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Salary Range</label>
                        <input
                            type="text"
                            value={formData.salary_range}
                            onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                            required
                            disabled={processing}
                            placeholder="e.g., $50,000 - $70,000"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            rows="6"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            disabled={processing}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => router.get('/Admin/dashboard')}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}