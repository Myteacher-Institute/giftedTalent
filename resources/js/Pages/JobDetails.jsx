import { Head, Link } from '@inertiajs/react';
import '../../css/jobdetails.css';

export default function JobDetails({ job }) {
    // Map database fields to display fields
    const displayData = {
        title: job.job_title || job.title || 'Job Title',
        company: job.company_name || job.company || 'Company Name',
        location: job.company_location || job.location || 'Location',
        salary: job.salary_range || job.salary || 'Salary',
        job_type: job.job_type || 'Full-time',
        description: job.description || 'No description available',
        requirements: job.requirements || null,
        tags: job.tags || []
    };

    return (
        <>
            <Head title={`${displayData.title} - GiftedTalents`} />

            <div className="job-details-container">

                <Link href="/" className="back-to-home-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path fill="rgb(116, 192, 252)" d="M201.4 297.4C188.9 309.9 188.9 330.2 201.4 342.7L361.4 502.7C373.9 515.2 394.2 515.2 406.7 502.7C419.2 490.2 419.2 469.9 406.7 457.4L269.3 320L406.6 182.6C419.1 170.1 419.1 149.8 406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3L201.3 297.3z" />
                    </svg>
                    Back to Home
                </Link>

                <div className="job-details-card">
                    <div className="job-details-header">
                        <div className="job-icon gradient-blue">
                            <img src={`/assets/svg/code.svg`} alt="" className="job-icon-img" />
                        </div>
                        <span className="job-type" id={displayData.job_type === 'Contract' ? 'job-type-contract' : 'job-type-fulltime'}>
                            {displayData.job_type}
                        </span>
                    </div>

                    <h1 className="job-details-title">{displayData.title}</h1>
                    <p className="job-details-company">{displayData.company}</p>

                    <div className="job-details-meta">
                        <div className="job-details-location">
                            <img src="/assets/svg/location.svg" alt="" className="location-icon" />
                            <span>{displayData.location}</span>
                        </div>
                        <span className="job-details-salary">{displayData.salary}</span>
                    </div>

                    <div className="job-details-section">
                        <h3>Job Description</h3>
                        <p>{displayData.description}</p>
                    </div>

                    {displayData.requirements && (
                        <div className="job-details-section">
                            <h3>Requirements</h3>
                            <ul>
                                {typeof displayData.requirements === 'string' ? (
                                    displayData.requirements.split(',').map((req, index) => (
                                        <li key={index}>{req.trim()}</li>
                                    ))
                                ) : (
                                    <li>{displayData.requirements}</li>
                                )}
                            </ul>
                        </div>
                    )}

                    {displayData.tags && displayData.tags.length > 0 && (
                        <div className="job-tags-section">
                            <h3>Skills</h3>
                            <div className="job-tags">
                                {displayData.tags.map((tag, index) => (
                                    <span key={index} className="job-tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="job-details-actions">
                        <button className="apply-now-btn">Apply Now</button>
                        <Link href="/jobs" className="back-to-jobs-btn">Back to Jobs</Link>
                    </div>
                </div>
            </div>
        </>
    );
}