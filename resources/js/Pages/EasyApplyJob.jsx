import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import '../../css/EasyApplyJob.css';
import '../../css/nav.css';
import AppNavbar from '../Components/AppNavbar';

export default function EasyApplyJob({ auth, profile, job, hasApplied }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [applicationData, setApplicationData] = useState({
        cover_letter: '',
        expected_salary: '',
        start_date: 'immediate',
        resume_id: ''
    });
    const [resumes, setResumes] = useState([]);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    
    const currentUser = auth?.user;

    // Fetch user's resumes on load
    useEffect(() => {
        if (currentUser?.resumes) {
            setResumes(currentUser.resumes);
        }
    }, [currentUser]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const getProfileImageUrl = () => {
        if (profile?.profile_image_base64) {
            return profile.profile_image_base64;
        }
        if (currentUser?.profile?.profile_image_base64) {
            return currentUser.profile.profile_image_base64;
        }
        if (currentUser?.profile?.avatar_url) {
            return currentUser.profile.avatar_url;
        }
        if (currentUser?.profile?.avatar) {
            const avatarPath = currentUser.profile.avatar;
            if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
                return avatarPath;
            }
            if (avatarPath.startsWith('data:image')) {
                return avatarPath;
            }
            const cleanPath = avatarPath.replace(/^\/+/, '');
            return `/storage/${cleanPath}`;
        }
        const userName = currentUser?.name || 'User';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=150&bold=true`;
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setApplicationData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmitApplication = async (e) => {
        e.preventDefault();
        setIsApplying(true);
        setErrors({});
        setSuccessMessage('');

        // Validate required fields
        const newErrors = {};
        if (!applicationData.cover_letter.trim()) {
            newErrors.cover_letter = 'Please write a cover letter';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsApplying(false);
            return;
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch(`/jobs/${job?.id}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    job_id: job?.id,
                    cover_letter: applicationData.cover_letter,
                    expected_salary: applicationData.expected_salary,
                    start_date: applicationData.start_date,
                    resume_id: applicationData.resume_id
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Application submitted successfully!');
                setShowApplicationForm(false);
                setApplicationData({
                    cover_letter: '',
                    expected_salary: '',
                    start_date: 'immediate',
                    resume_id: ''
                });
                // Show success alert
                if (window.alertify) {
                    alertify.success('Application submitted successfully!');
                } else {
                    alert('Application submitted successfully!');
                }
                // Redirect after 2 seconds
                setTimeout(() => {
                    router.visit('/my-applications');
                }, 2000);
            } else {
                setErrors({ submit: data.message || 'Failed to submit application' });
                if (window.alertify) {
                    alertify.error(data.message || 'Failed to submit application');
                }
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            setErrors({ submit: 'Network error. Please try again.' });
            if (window.alertify) {
                alertify.error('Network error. Please try again.');
            }
        } finally {
            setIsApplying(false);
        }
    };

    // If already applied, show message
    if (hasApplied) {
        return (
            <>
                <Head title="Already Applied" />
                <AppNavbar user={currentUser} onMenuToggle={toggleSidebar} isMenuOpen={sidebarOpen} />
                {sidebarOpen && <div className="mobile-overlay" onClick={closeSidebar}></div>}
                <div className="easy-apply-container">
                    <aside className={`easy-apply-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
                        {/* Sidebar content same as dashboard */}
                        <div className="profile">
                            <div className="profile-image-wrapper">
                                <img src={getProfileImageUrl()} alt={currentUser?.name || 'Profile'} className="profile-image" />
                                <div className="verified-overlay"><i className="fa-solid fa-check-circle"></i></div>
                            </div>
                            <h3>{currentUser?.name || 'User'}</h3>
                            <p>{profile?.position || currentUser?.profile?.position || 'Add position'}</p>
                            <button><Link href="/profile/edit" className="profile-button">Edit Profile</Link></button>
                        </div>
                        <ul className="menu">
                            <li><Link href="/dashboard"><i className="fa-solid fa-table"></i>Dashboard</Link></li>
                            <li><Link href="/search-jobs"><i className="fa-solid fa-magnifying-glass"></i> Search Job</Link></li>
                            <li><Link href="/my-applications"><i className="fa-solid fa-file"></i> My Applications</Link></li>
                            <li><Link href="/messages"><i className="fa-regular fa-envelope"></i> Message</Link></li>
                            <li><Link href="/settings"><i className="fa-solid fa-gear"></i> Settings</Link></li>
                            <li className="logout-item"><a href="/" onClick={(e) => { e.preventDefault(); handleLogout(); }}><i className="fa-solid fa-right-from-bracket logout-icon"></i>Logout</a></li>
                        </ul>
                    </aside>
                    <div className="easy-apply-main">
                        <div className="already-applied-container">
                            <i className="fa-solid fa-check-circle"></i>
                            <h2>You've Already Applied</h2>
                            <p>You have already submitted an application for this position.</p>
                            <Link href="/my-applications" className="view-applications-btn">View My Applications</Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title={`Apply for ${job?.title || 'Job'} - GiftedTalent`} />
            
            <AppNavbar user={currentUser} onMenuToggle={toggleSidebar} isMenuOpen={sidebarOpen} />

            {sidebarOpen && <div className="mobile-overlay" onClick={closeSidebar}></div>}

            <div className="easy-apply-container">
                {/* Sidebar */}
                <aside className={`easy-apply-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
                    <div className="profile">
                        <div className="profile-image-wrapper">
                            <img src={getProfileImageUrl()} alt={currentUser?.name || 'Profile'} className="profile-image" onError={(e) => {
                                const userName = currentUser?.name || 'User';
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=150&bold=true`;
                            }} />
                            <div className="verified-overlay"><i className="fa-solid fa-check-circle"></i></div>
                        </div>
                        <h3>{currentUser?.name || 'User'}</h3>
                        <p>{profile?.position || currentUser?.profile?.position || 'Add position'}</p>
                        <button><Link href="/profile/edit" className="profile-button">Edit Profile</Link></button>
                    </div>
                    <ul className="menu">
                        <li><Link href="/dashboard"><i className="fa-solid fa-table"></i>Dashboard</Link></li>
                        <li><Link href="/search-jobs"><i className="fa-solid fa-magnifying-glass"></i> Search Job</Link></li>
                        <li><Link href="/my-applications"><i className="fa-solid fa-file"></i> My Applications</Link></li>
                        <li><Link href="/messages"><i className="fa-regular fa-envelope"></i> Message</Link></li>
                        <li><Link href="/settings"><i className="fa-solid fa-gear"></i> Settings</Link></li>
                        <li className="logout-item"><a href="/" onClick={(e) => { e.preventDefault(); handleLogout(); }}><i className="fa-solid fa-right-from-bracket logout-icon"></i>Logout</a></li>
                    </ul>
                </aside>

                {/* Main Content */}
                <div className="easy-apply-main">
                    {!showApplicationForm ? (
                        // Job Details View
                        <>
                            <div className="container">
                                <div className="card">
                                    <div className="company-header">
                                        <div className="company-logo">
                                            {job?.company_logo ? (
                                                <img src={job.company_logo} alt={job.company_name} />
                                            ) : (
                                                <div className="logo-placeholder">{job?.company_name?.charAt(0) || 'C'}</div>
                                            )}
                                        </div>
                                        <div className="company-name">{job?.company_name || 'Company Name'}</div>
                                    </div>

                                    <div className="job-title">{job?.title || job?.job_title || 'Job Title'} <i className="fa-solid fa-check-circle verified-icon"></i></div>

                                    <div className="location">
                                        <i className="fa-solid fa-location-dot"></i> {job?.location || job?.company_location || 'Location'} &bull; <i className="fa-regular fa-clock"></i> {job?.posted_at || 'Recently'}
                                    </div>

                                    <div className="tags">
                                        <div className="tag"><i className="fa-solid fa-money-bill-wave"></i> {job?.salary_range || 'Salary not specified'}</div>
                                        <div className="tag"><i className="fa-solid fa-house-laptop"></i> {job?.job_type || 'Full-time'}</div>
                                        <div className="tag"><i className="fa-regular fa-clock"></i> {job?.employment_type || 'Full-Time'}</div>
                                    </div>

                                    <div className="actions">
                                        <button className="apply-btn" onClick={() => setShowApplicationForm(true)}>
                                            <i className="fa-regular fa-paper-plane"></i> Easy Apply
                                        </button>
                                        <button className="save-btn"><i className="fa-regular fa-bookmark"></i> Save</button>
                                    </div>

                                    <div className="section-title"><i className="fa-solid fa-circle-info"></i> About the Job</div>
                                    <p>{job?.description || 'No description available.'}</p>

                                    {job?.requirements && (
                                        <>
                                            <div className="sub-heading"><i className="fa-solid fa-list-check"></i> Requirements</div>
                                            <p>{job.requirements}</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="container">
                                <div className="card">
                                    <h2><i className="fa-solid fa-building"></i> About the Company</h2>
                                    <div className="company-meta">
                                        <i className="fa-solid fa-briefcase"></i> {job?.industry || 'Digital Company'} &bull; 
                                        <i className="fa-solid fa-users"></i> {job?.company_size || 'Information not available'}
                                    </div>
                                    <p className="company-text">{job?.company_description || 'No company description available.'}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        // Application Form View
                        <div className="container">
                            <div className="card application-form-card">
                                <div className="form-header">
                                    <button className="back-btn" onClick={() => setShowApplicationForm(false)}>
                                        <i className="fa-solid fa-arrow-left"></i> Back to Job
                                    </button>
                                    <h2>Apply for {job?.title || job?.job_title}</h2>
                                    <p>{job?.company_name}</p>
                                </div>

                                {successMessage && (
                                    <div className="success-message">
                                        <i className="fa-solid fa-check-circle"></i> {successMessage}
                                    </div>
                                )}

                                {errors.submit && (
                                    <div className="error-message">
                                        <i className="fa-solid fa-exclamation-triangle"></i> {errors.submit}
                                    </div>
                                )}

                                <form onSubmit={handleSubmitApplication}>
                                    <div className="form-group">
                                        <label><i className="fa-regular fa-file-lines"></i> Cover Letter <span className="required">*</span></label>
                                        <textarea
                                            name="cover_letter"
                                            rows="6"
                                            placeholder="Tell us why you're the perfect fit for this role..."
                                            value={applicationData.cover_letter}
                                            onChange={handleInputChange}
                                            className={errors.cover_letter ? 'error' : ''}
                                        ></textarea>
                                        {errors.cover_letter && <span className="error-text">{errors.cover_letter}</span>}
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label><i className="fa-solid fa-money-bill-wave"></i> Expected Salary</label>
                                            <input
                                                type="text"
                                                name="expected_salary"
                                                placeholder="e.g., NGN 300,000/month or $900/month"
                                                value={applicationData.expected_salary}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label><i className="fa-regular fa-calendar"></i> Available to Start</label>
                                            <select name="start_date" value={applicationData.start_date} onChange={handleInputChange}>
                                                <option value="immediate">Immediately</option>
                                                <option value="1_week">Within 1 week</option>
                                                <option value="2_weeks">Within 2 weeks</option>
                                                <option value="1_month">Within 1 month</option>
                                            </select>
                                        </div>
                                    </div>

                                    {resumes.length > 0 && (
                                        <div className="form-group">
                                            <label><i className="fa-regular fa-file-pdf"></i> Select Resume/CV</label>
                                            <select name="resume_id" value={applicationData.resume_id} onChange={handleInputChange}>
                                                <option value="">Select a resume</option>
                                                {resumes.map(resume => (
                                                    <option key={resume.id} value={resume.id}>{resume.title || resume.file_name}</option>
                                                ))}
                                            </select>
                                            <Link href="/cv" className="upload-resume-link">+ Upload new resume</Link>
                                        </div>
                                    )}

                                    <div className="form-actions">
                                        <button type="button" className="cancel-btn" onClick={() => setShowApplicationForm(false)}>Cancel</button>
                                        <button type="submit" className="submit-btn" disabled={isApplying}>
                                            {isApplying ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-regular fa-paper-plane"></i>}
                                            {isApplying ? ' Submitting...' : ' Submit Application'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}