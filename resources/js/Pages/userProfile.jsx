import React from 'react';
import '../../css/userProfile.css';

// Simple inline SVG icons
const CheckCircle = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const Briefcase = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

const Mail = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const Phone = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const MapPin = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const Layers = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
    </svg>
);

const FileText = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const MessageSquare = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

function UserProfile() {
    return (
        <div className="profile-container">
            {/* Header */}
            <div className="profile-header">
                <div className="profile-left">
                    <img 
                        src="/assets/img/sample1.jpg" 
                        alt="Profile" 
                        className="profile-image" 
                    />
                    <div>
                        <h1>Kelvin Nnaji</h1>
                        <p className="job-title">Full Stack Developer</p>
                    </div>
                </div>

                <div className="availability-badge">
                    <CheckCircle size={18} /> Available
                </div>
            </div>

            <hr className="divider" />

            {/* Availability */}
            <div className="card">
                <div className="card-holder">
                    <Briefcase size={18} />
                    <span>Availability</span>
                </div>

                <div className="card-body">
                    <p>Open to work: Full - Time, Remote</p>
                    <p>Start Date: Available Immediately</p>
                </div>
            </div>

            {/* Contact Info */}
            <div className="card">
                <div className="card-holder">
                    <Mail size={18} />
                    <span>Contact Info</span>
                </div>

                <div className="contact-row">
                    <div className="contact-item">
                        <Mail size={18} />
                        <span>Kelvin.Nnaji@example.com</span>
                    </div>

                    <div className="contact-item">
                        <Phone size={18} />
                        <span>+234 90 234 567 8900</span>
                    </div>

                    <div className="contact-item">
                        <MapPin size={18} />
                        <span>New York, USA</span>
                    </div>
                </div>

                <button className="message-btn">
                    <MessageSquare size={18} />
                    Send Message
                </button>
            </div>
                 
            {/* Skills */}
            <div className="card">
                <div className="card-holder">
                    <Layers size={18} />
                    <span>Skills</span>
                </div>
                <div className="skills">
                    <span className="skill-tag">React</span>
                    <span className="skill-tag">JavaScript</span>
                    <span className="skill-tag">Laravel</span>
                    <span className="skill-tag">PHP</span>
                    <span className="skill-tag">Node.js</span>
                    <span className="skill-tag">MySQL</span>
                    <span className="skill-tag">Git</span>
                </div>
            </div>
                
            {/* Resume */}
            <div className="card">
                <div className="card-holder">
                    <FileText size={18} />
                    <span>Resume</span>
                </div>
                <div className="resume-section">
                    <div className="resume-left">
                        <FileText size={18} />
                        <span>View Resume</span>
                    </div>
                    <button className="resume-btn">View Resume</button>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;

