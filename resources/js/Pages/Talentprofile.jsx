import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Nav from '../Components/Nav';
import '../css/talent-profile.css';

export default function TalentProfile({ auth, talent }) {
    const [imageError, setImageError] = useState(false);

    // Get initials for avatar fallback
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Format availability status color
    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'open to work':
                return '#10b981';
            case 'available':
                return '#10b981';
            case 'not available':
                return '#ef4444';
            default:
                return '#f59e0b';
        }
    };

    const handleMessage = () => {
        // You can implement messaging functionality here
        alert('Messaging feature coming soon!');
    };

    return (
        <>
            <Head title={`${talent.name} - GiftedTalent Profile`} />
            
            <div className="talent-profile-page">
                <Nav auth={auth} />
                
                <div className="talent-profile-container">
                    <div className="talent-profile-card-full">
                        {/* Cover Image */}
                        <div className="talent-cover-image-full"></div>
                        
                        {/* Profile Image */}
                        <div className="talent-profile-image-full">
                            {!imageError && talent.avatar ? (
                                <img 
                                    src={talent.avatar} 
                                    alt={talent.name}
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="talent-avatar-initials-full">
                                    {getInitials(talent.name)}
                                </div>
                            )}
                        </div>
                        
                        {/* Profile Info */}
                        <div className="talent-profile-info-full">
                            <h1 className="talent-name-full">{talent.name}</h1>
                            <div className="talent-title-full">{talent.title || 'Professional'}</div>
                            <div className="talent-company-full">
                                <svg className="company-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                    <path d="M16 3H8v4h8V3z"></path>
                                </svg>
                                {talent.company || 'Freelancer'}
                                <span className="current-badge-full">(Active)</span>
                            </div>
                        </div>
                        
                        <div className="talent-divider-full"></div>
                        
                        {/* Bio Section */}
                        {talent.bio && (
                            <>
                                <div className="talent-bio-section">
                                    <div className="talent-section-title-full">About</div>
                                    <p className="talent-bio-text">{talent.bio}</p>
                                </div>
                                <div className="talent-divider-full"></div>
                            </>
                        )}
                        
                        {/* Availability Section */}
                        <div className="talent-availability-section-full">
                            <div className="talent-section-title-full">Availability</div>
                            <div className="talent-availability-status-full">
                                <span 
                                    className="talent-status-badge-full"
                                    style={{ backgroundColor: getStatusColor(talent.availability_status) }}
                                >
                                    {talent.availability_status || 'Open to work'}
                                </span>
                                <div className="talent-availability-text-full">
                                    {talent.employment_type || 'Full-Time, Remote'}
                                </div>
                                <div className="talent-start-date-full">
                                    Start Date: {talent.start_date || 'Available Immediately'}
                                </div>
                            </div>
                        </div>
                        
                        <div className="talent-divider-full"></div>
                        
                        {/* Contact Info Section */}
                        <div className="talent-contact-section-full">
                            <div className="talent-section-title-full">Contact Info</div>
                            
                            <div className="talent-contact-item-full">
                                <div className="talent-contact-icon-full">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                </div>
                                <div className="talent-contact-text-full">{talent.email}</div>
                            </div>
                            
                            {talent.phone && (
                                <div className="talent-contact-item-full">
                                    <div className="talent-contact-icon-full">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                        </svg>
                                    </div>
                                    <div className="talent-contact-text-full">{talent.phone}</div>
                                </div>
                            )}
                            
                            <div className="talent-contact-item-full">
                                <div className="talent-contact-icon-full">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </div>
                                <div className="talent-contact-text-full"></div>
                                <button 
                                    className="talent-message-btn-full"
                                    onClick={handleMessage}
                                >
                                    Send Message
                                </button>
                            </div>
                        </div>
                        
                        <div className="talent-divider-full"></div>
                        
                        {/* Location Section */}
                        {talent.location && (
                            <>
                                <div className="talent-location-section">
                                    <div className="talent-section-title-full">Location</div>
                                    <div className="talent-location-text">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1118 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                        {talent.location}
                                    </div>
                                </div>
                                <div className="talent-divider-full"></div>
                            </>
                        )}
                        
                        {/* Skills Section */}
                        {talent.skills && talent.skills.length > 0 && (
                            <div className="talent-skills-section-full">
                                <div className="talent-section-title-full">Skills & Expertise</div>
                                <div className="talent-skills-container-full">
                                    {talent.skills.map((skill, index) => (
                                        <span key={index} className="talent-skill-tag-full">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Resume Button */}
                        <div className="talent-resume-section-full">
                            {talent.resume_url ? (
                                <a 
                                    href={talent.resume_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="talent-view-resume-btn-full"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                    </svg>
                                    View Resume
                                </a>
                            ) : (
                                <button className="talent-view-resume-btn-full disabled" disabled>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                    </svg>
                                    No Resume Uploaded
                                </button>
                            )}
                        </div>
                        
                        {/* Back Button */}
                        <div className="talent-back-btn-container">
                            <button 
                                className="talent-back-btn"
                                onClick={() => window.history.back()}
                            >
                                ← Back to Talents
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}