import '../../css/search-job.css';
import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function SearchJob({ auth }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Search Jobs</h2>}
        >
            <Head title="Search Jobs" />

            {/* NAVBAR */}
            <nav className="navbar">
                <div className="logo">
                    <span className="bold">GiftedTalents</span><span className="blue">.online</span>
                </div>

                <button 
                    className="hamburger md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    ☰
                </button>

                <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    <li>Home</li>
                    <li className="active">Jobs</li>
                    <li>Explore</li>
                    <li>Hire</li>
                </ul>

                <div className="nav-right">
                    <div className="search-container">
                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.601 10.601z" />
                        </svg>
                        <input className="search" placeholder="Search for jobs..." />
                    </div>

<div className="icon-group">
                        {/* Message Icon - Professional Envelope */}
<i className="fa-solid fa-envelope message-icon text-gray-600 hover:text-blue-600 text-xl"></i>

                        {/* Notification Icon - Professional Bell */}
<i className="fa-solid fa-bell notification-icon relative">
                            <div className="notification-badge"></div>
                          </i>
                    </div>

                    <img src="https://i.pravatar.cc/40" alt="User avatar" className="avatar" />
                </div>
            </nav>

            <div className="container">
                {/* LEFT SIDEBAR */}
                <div className="left">
                    {/* PROFILE CARD */}
                    <div className="profile-card">
                        <div className="cover"></div>
                        <img src="https://i.pravatar.cc/100" alt="profile" className="profile-img" />
                        <div className="profile-info">
                            <h3>KELVIN NNAJI</h3>
                            <p>Software Engineer MyTeacher Institute...</p>
                            <span>Port Harcourt, Rivers State</span>
                        </div>
                    </div>

                    {/* MENU */}
                    <div className="menu-card">
                        <div className="menu-item">
                            <i className="fa-solid fa-file-lines"></i> References
                        </div>
                        <div className="menu-item">
                            <i className="fa-solid fa-bookmark"></i> Job Tracker
                        </div>
                        <div className="menu-item">
                            <i className="fa-solid fa-chart-line"></i> Carrier Insight
                        </div>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="right">
                    {/* JOB PICKS */}
                    <div className="card">
                        <div className="card-header">
                            <h3>Top Jobs picks for you</h3>
                            <p>Based on your profile, preferences, and activity</p>
                        </div>

                        <div className="job" key="1">
                            <i className="fa-solid fa-building job-company-icon" title="Company"></i>
                            <div className="job-info">
                                <h4>UI/UX Designer</h4>
                                <p>Brand Hive. Port Harcourt. (Remote)</p>
                                <span>Senior Software Engineer. Full Stack. JS</span>
                                <div className="job-meta">
                                    <span>1 day ago</span>
                                    <span>Easy Apply <i className="fa-solid fa-paper-plane ml-1"></i></span>
                                    <span>Save Job <i className="fa-solid fa-bookmark ml-1"></i></span>
                                </div>
                            </div>
                            <i className="fa-solid fa-times-circle close"></i>
                        </div>

                        <div className="job" key="2">
                            <i className="fa-solid fa-building job-company-icon" title="Company"></i>
                            <div className="job-info">
                                <h4>UI/UX Designer</h4>
                                <p>Brand Hive. Port Harcourt. (Remote)</p>
                                <span>Senior Software Engineer. Full Stack. JS</span>
                                <div className="job-meta">
                                    <span>1 day ago</span>
                                    <span>Easy Apply <i className="fa-solid fa-paper-plane ml-1"></i></span>
                                    <span>Save Job <i className="fa-solid fa-bookmark ml-1"></i></span>
                                </div>
                            </div>
                            <i className="fa-solid fa-times-circle close"></i>
                        </div>

                        <div className="job" key="3">
                            <i className="fa-solid fa-building job-company-icon" title="Company"></i>
                            <div className="job-info">
                                <h4>UI/UX Designer</h4>
                                <p>Brand Hive. Port Harcourt. (Remote)</p>
                                <span>Senior Software Engineer. Full Stack. JS</span>
                                <div className="job-meta">
                                    <span>1 day ago</span>
                                    <span>Easy Apply <i className="fa-solid fa-paper-plane ml-1"></i></span>
                                    <span>Save Job <i className="fa-solid fa-bookmark ml-1"></i></span>
                                </div>
                            </div>
                            <i className="fa-solid fa-times-circle close"></i>
                        </div>

                        <div className="show">
                            <i className="fa-solid fa-arrow-down mr-2"></i>Show All
                        </div>
                    </div>

                    {/* JOB COLLECTION */}
                    <div className="card">
                        <div className="card-header">
                            <h3>Explore with job collections</h3>
                            <p>Designer | Easy Apply | Remote</p>
                        </div>

                        <div className="job" key="4">
                            <i className="fa-solid fa-building job-company-icon" title="Company"></i>
                            <div className="job-info">
                                <h4>UI/UX Designer</h4>
                                <p>Brand Hive. Port Harcourt. (Remote)</p>
                                <span>Senior Software Engineer. Full Stack. JS</span>
                                <div className="job-meta">
                                    <span>1 day ago</span>
                                    <span>Easy Apply <i className="fa-solid fa-paper-plane ml-1"></i></span>
                                </div>
                            </div>
                            <i className="fa-solid fa-times-circle close"></i>
                        </div>

                        <div className="job" key="5">
                            <i className="fa-solid fa-building job-company-icon" title="Company"></i>
                            <div className="job-info">
                                <h4>UI/UX Designer</h4>
                                <p>Brand Hive. Port Harcourt. (Remote)</p>
                                <span>Senior Software Engineer. Full Stack. JS</span>
                                <div className="job-meta">
                                    <span>1 day ago</span>
                                    <span>Easy Apply <i className="fa-solid fa-paper-plane ml-1"></i></span>
                                </div>
                            </div>
                            <i className="fa-solid fa-times-circle close"></i>
                        </div>

                        <div className="show">
                            <i className="fa-solid fa-arrow-down mr-2"></i>Show All
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

