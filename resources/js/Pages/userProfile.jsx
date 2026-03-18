import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EditModal from '@/Components/EditModal';
import '../../css/userProfile.css';

const icons = {
    CheckCircle: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    ),
    Briefcase: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    ),
    Mail: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    ),
    Phone: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
        </svg>
    ),
    MapPin: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    ),
    Layers: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
        </svg>
    ),
    FileText: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    ),
    MessageSquare: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
    ),
};

export default function UserProfile({ user, profile, skills, experiences = [], educations = [] }) {
    const [activeTab, setActiveTab] = useState('view');
    const [modals, setModals] = useState({
        experience: false,
        education: false,
    });

    const toggleModal = (modal) => {
        setModals(prev => ({ ...prev, [modal]: !prev[modal] }));
    };

    const handleAvailabilityUpdate = (e) => {
        const formData = new FormData();
        formData.append('availability_status', e.target.value);
        router.post('/profile/extended', Object.fromEntries(formData));
    };

    const removeSkill = (skillId) => {
        router.delete(`/profile/skills/${skillId}`);
    };

    if (!user) return <div>Loading...</div>;

    const ViewTab = () => (
        <div className="profile-container">
            {/* Header */}
            <div className="profile-header">
                <div className="profile-left">
                    <img src={profile?.avatar || '/assets/img/sample1.jpg'} alt="Profile" className="profile-image" />
                    <div>
                        <h1>{user.name}</h1>
                        <p className="job-title">{profile?.headline || 'Software Developer'}</p>
                    </div>
                </div>
                <div className="availability-badge">
                    <icons.CheckCircle />
                    {profile?.availability_status || 'Available'}
                </div>
            </div>

            {/* Availability */}
            <div className="card">
                <div className="card-holder">
                    <icons.Briefcase />
                    <span>Availability</span>
                </div>
                <div className="card-body">
                    <p>Open to work: {profile?.availability_type || 'Full Time'}</p>
                    <p>Start Date: Available Immediately</p>
                </div>
            </div>

            {/* Contact Info */}
            <div className="card">
                <div className="card-holder">
                    <icons.Mail />
                    <span>Contact Info</span>
                </div>
                <div className="contact-row">
                    <div className="contact-item">
                        <icons.Mail />
                        <span>{user.email}</span>
                    </div>
                    <div className="contact-item">
                        <icons.Phone />
                        <span>{profile?.phone || 'Not provided'}</span>
                    </div>
                    <div className="contact-item">
                        <icons.MapPin />
                        <span>{profile?.city}, {profile?.country}</span>
                    </div>
                </div>
            </div>

            {/* Skills */}
            <div className="card">
                <div className="card-holder">
                    <icons.Layers />
                    <span>Skills</span>
                </div>
                <div className="skills">
                    {skills?.map(skill => (
                        <span key={skill.id} className="skill-tag">
                            {skill.name} 
                            <button onClick={() => removeSkill(skill.pivot.skill_id)} className="skill-remove">×</button>
                        </span>
                    )) || 'No skills'}
                </div>
            </div>

            {/* Experience & Education Summary */}
            <div className="card">
                <div className="card-holder">
                    <icons.FileText />
                    <span>Experience</span>
                </div>
                <div className="list-group">
                    {experiences.slice(0, 3).map(exp => (
                        <div key={exp.id} className="list-item">
                            <strong>{exp.job_title}</strong> at {exp.company_name}
                            <span>{exp.start_date} - {exp.end_date || 'Present'}</span>
                        </div>
                    ))}
                    {experiences.length === 0 && <p>No experience added</p>}
                </div>
            </div>

            <div className="card">
                <div className="card-holder">
                    <icons.BookOpen />
                    <span>Education</span>
                </div>
                <div className="list-group">
                    {educations.slice(0, 3).map(edu => (
                        <div key={edu.id} className="list-item">
                            <strong>{edu.degree}</strong> - {edu.institution}
                            <span>{edu.start_date} - {edu.end_date || 'Present'}</span>
                        </div>
                    ))}
                    {educations.length === 0 && <p>No education added</p>}
                </div>
            </div>
        </div>
    );

    const EditTab = () => (
        <div className="edit-container">
            <div className="form-section">
                <h3>Basic Info</h3>
                <div className="form-group">
                    <label>Headline</label>
                    <input type="text" placeholder="e.g. Full Stack Developer" />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Phone</label>
                        <input type="tel" defaultValue={profile?.phone} />
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input type="text" defaultValue={profile?.city} />
                    </div>
                </div>
                <div className="form-group">
                    <label>Bio</label>
                    <textarea placeholder="Tell us about yourself..." />
                </div>
            </div>

            <div className="form-section">
                <h3>Availability</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label>Status</label>
                        <select onChange={handleAvailabilityUpdate}>
                            <option value="available">Available</option>
                            <option value="open_to_work">Open to Work</option>
                            <option value="not_available">Not Available</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Type</label>
                        <select>
                            <option>Full Time</option>
                            <option>Part Time</option>
                            <option>Contract</option>
                            <option>Freelance</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h3>Links</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label>LinkedIn</label>
                        <input type="url" />
                    </div>
                    <div className="form-group">
                        <label>GitHub</label>
                        <input type="url" />
                    </div>
                </div>
                <div className="form-group">
                    <label>Portfolio</label>
                    <input type="url" />
                </div>
            </div>

            <button className="save-all-btn">Save All Changes</button>
        </div>
    );

    return (
        <AuthenticatedLayout user={usePage().props.auth.user}>
            <Head title="User Profile" />

            <div className="profile-page">
                <div className="tabs">
                    <button 
                        className={activeTab === 'view' ? 'tab-active' : 'tab'} 
                        onClick={() => setActiveTab('view')}
                    >
                        View Profile
                    </button>
                    <button 
                        className={activeTab === 'edit' ? 'tab-active' : 'tab'} 
                        onClick={() => setActiveTab('edit')}
                    >
                        Edit Profile
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'view' && <ViewTab />}
                    {activeTab === 'edit' && <EditTab />}
                </div>

                {/* Modals */}
                <EditModal 
                    isOpen={modals.experience}
                    onClose={() => toggleModal('experience')}
                    title="Add Experience"
                    submitUrl="/profile/experiences"
                >
                    <div className="form-group">
                        <label>Company</label>
                        <input name="company_name" required />
                    </div>
                    <div className="form-group">
                        <label>Job Title</label>
                        <input name="job_title" required />
                    </div>
                    <div className="form-group">
                        <label>Start Date</label>
                        <input type="date" name="start_date" required />
                    </div>
                </EditModal>

                <EditModal 
                    isOpen={modals.education}
                    onClose={() => toggleModal('education')}
                    title="Add Education"
                    submitUrl="/profile/educations"
                >
                    <div className="form-group">
                        <label>Institution</label>
                        <input name="institution" required />
                    </div>
                    <div className="form-group">
                        <label>Degree</label>
                        <input name="degree" required />
                    </div>
                    <div className="form-group">
                        <label>Start Date</label>
                        <input type="date" name="start_date" />
                    </div>
                </EditModal>
            </div>
        </AuthenticatedLayout>
    );
}

