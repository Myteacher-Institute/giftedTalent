import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import '../../css/CreateJob.css';

export default function CreateJob() {
    const [formData, setFormData] = useState({
        company_name: '',
        company_location: '',
        job_title: '',
        job_type: 'Full-Time',
        salary_range: '',
        description: ''
    });

    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.post('/Admin/jobs', formData, {
            onSuccess: () => {
                setProcessing(false);
                // Optionally reset form
                setFormData({
                    company_name: '',
                    company_location: '',
                    job_title: '',
                    job_type: 'Full-Time',
                    salary_range: '',
                    description: ''
                });
            },
            onError: () => {
                setProcessing(false);
                alert('There was an error creating the job. Please try again.');
            }
        });
    };

    return (
        <>
            <Head title="Create Job - GiftedTalents" />

            <div className="create-job-container">
                <a href="/Admin/dashboard" className='button'>Back</a>
                <h1>Create New Job Post</h1>

                <form onSubmit={handleSubmit} className="job-form">
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
                            disabled={processing}
                        >
                            <option>Full-Time</option>
                            <option>Part-Time</option>
                            <option>Contract</option>
                            <option>Remote</option>
                        </select>

                        <svg className='form-group-svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path d="M300.3 440.8C312.9 451 331.4 450.3 343.1 438.6L471.1 310.6C480.3 301.4 483 287.7 478 275.7C473 263.7 461.4 256 448.5 256L192.5 256C179.6 256 167.9 263.8 162.9 275.8C157.9 287.8 160.7 301.5 169.9 310.6L297.9 438.6L300.3 440.8z" />
                        </svg>
                    </div>

                    <div className="form-group">
                        <label>Salary Range</label>
                        <input
                            type="text"
                            value={formData.salary_range}
                            onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                            placeholder="e.g. N180,000/Month"
                            required
                            disabled={processing}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            rows="5"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            disabled={processing}
                        />
                    </div>

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={processing}
                    >
                        {processing ? 'Posting...' : 'Post Job'}
                    </button>
                </form>
            </div>
        </>
    );
}