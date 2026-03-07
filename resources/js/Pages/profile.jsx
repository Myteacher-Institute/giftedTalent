import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { CheckCircle, Briefcase, Mail, Phone, MessageCircle as Message, Layers as Layer, FileText } from 'lucide-react';
import '../../css/profile.css';

export default function Profile({ user }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="profile-container">
                        <div className="profile-header">
                            <div className="profile-left">
                                <img className="profile-image" src="/path/to/profile/image.jpg" alt="Profile" />
                                <div>
                                    <h1>{user.name}</h1>
                                    <p className="job-title">Software Engineer Myteacher Institute (Current)</p>
                                </div>
                            </div>
                            <div className="availability-badge">
                                <CheckCircle size={18} />
                                Available
                            </div>
                        </div>

                        <hr className="divider" />

                        {/* Available */}
                        <div className="card">
                            <div className="card-holder">
                                <Briefcase size={18} />
                                <span>Available</span>
                            </div>

                            <div className="card-body">
                                <p>open to work: Full - Time, Remote</p>
                                <p>Start Date: Available Immediately</p>
                            </div>
                        </div>

                        {/* contact info */}
                        <div className="card">
                          <div className="card-holder">
                                 <Mail size={18} />
                                 <span>Contact Info</span>
                          </div>

                          <div className="contact-row">
                              <div className="contact-item">
                                  <Mail size={18} />
                                  Kelvin.nnaji@gmail.com
                              </div>

                              <div className="contact-item">
                                  <Phone size={18}/>
                                  +234 706 536 2278
                              </div>

                              <button className="message-btn">
                                <Message size={18}/>
                                   Message
                              </button>
                          </div>
                        </div>

                        {/* Skill */}
                        <div className="card">
                          <div className="card-holder">
                              <Layer size={18} />
                              <span>Skills</span>
                          </div>

                          <div className="skills">
                              {[
                                "Figma",
                                "Prototype",
                                "Wireframing",
                                "Backend Developer",
                                "Front End Developer",
                                "SQL",
                                "Node.js",
                                "Adobe XD",
                              ] .map((skill, index) => (
                                <span key={index} className="skill-tag">
                                {skill}
                                </span>
                              ))}
                          </div>
                        </div>

                        {/* resume */}
                        <div  className="resume-section">
                          <div className="resume-left">
                            <FileText size={18} />
                            View Resume
                          </div>

                          <button className="resume-btn">View Resume</button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
