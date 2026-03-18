import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import '../../css/Dashboard.css';

// Job Card Component
function JobCard({ job }) {
    const [showMenu, setShowMenu] = useState(null);

    const toggleMenu = (index) => {
        setShowMenu(showMenu === index ? null : index);
    };

    return (
        <div className="job-card">
            <div className="job-left">
                <img src={job.image} alt="" />
            </div>
            <div className="job-right">
                <h3>{job.company}</h3>
                <p>{job.title}</p>
                <span>{job.tags}</span>
                <p className="time">{job.time}</p>
            </div>
            <div className="job-actions">
                <button className="apply desktop-only">Apply Now</button>
                <div className="menu-trigger" onClick={() => toggleMenu(job.id)}>
                    <i className="fa-solid fa-ellipsis"></i>
                </div>
{showMenu === job.id && (
                    <div className="dropdown-menu">
                        <button onClick={() => setShowMenu(null)}>
                            <i className="fa-regular fa-eye-slash"></i> Hide Job
                        </button>
                        <button onClick={() => setShowMenu(null)}>
                            <i className="fa-regular fa-paper-plane"></i> Apply Now
                        </button>
                        <button onClick={() => setShowMenu(null)}>
                            <i className="fa-regular fa-bookmark"></i> Save Job
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Dashboard({ auth }) {
    const [activeMenu, setActiveMenu] = useState(null);

    const jobs = [
        { id: 1, company: 'BoyAlone Studio', title: 'Software Engineer', tags: 'Senior Software Engineer. Full Stack . Js', time: '6 hours ago', image: 'https://i.pravatar.cc/40' },
        { id: 2, company: 'Tech Innovators', title: 'Frontend Developer', tags: 'React. TypeScript. Remote', time: '2 hours ago', image: 'https://i.pravatar.cc/40' },
        { id: 3, company: 'Digital Solutions', title: 'Full Stack Developer', tags: 'Node.js. MongoDB. Full Time', time: '1 day ago', image: 'https://i.pravatar.cc/40' },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <header className="navbar">
                <div className="logo">
                    <span className="blue">GiftedTalents</span>.Online
                </div>

                <nav>
                    <a href="#">Home</a>
                    <a href="#">Jobs</a>
                    <a href="#">Explore</a>
                    <a href="#">Hire</a>
                </nav>

                <div className="search">
                    <input type="text" placeholder="search for jobs..." />
                </div>

                <div className="nav-icons">
                    <i className="fa-regular fa-comment"></i>
                    <i className="fa-regular fa-bell"></i>
                    <img src="https://i.pravatar.cc/40" alt="" />
                </div>
            </header>

            <div className="container">
                <aside className="sidebar">
                    <div className="profile">
                        <img src="https://i.pravatar.cc/40" alt="" />
                        <h3>Kelvi Nnaji</h3>
                        <p>Software Engineer</p>
                        <button><Link href="/user-profile" className="profile-button">Edit Profile</Link></button>
                    </div>

                    <ul className="menu">
                        <li className="active"><i className="fa-solid fa-table"></i>Dashboard</li>
                        <li><Link href="/search-jobs"><i className="fa-solid fa-magnifying-glass"></i> Search Job</Link></li>
                        <li><i className="fa-solid fa-file"></i> Application</li>
                        <li><i className="fa-regular fa-envelope"></i> Message</li>
                        <li><i className="fa-regular fa-bookmark"></i> Save Jobs</li>
                        <li><i className="fa-solid fa-gear"></i> Settings</li>
                    </ul>
                </aside>

                <main className="main">
                    <h1>Welcome back, Kelvin</h1>

                    <div className="status-bar">
                        <span className="success">CV Uploaded</span>
                        <span>Skills: Front End Dev, Software Eng.</span>
                        <button><Link href="/user-profile" className="status-button">Edit Profile</Link></button>
                    </div>

                    <div className="search-bar">
                        <input type="text" placeholder="Search for jobs..." />
                        <button>Job Type</button>
                        <button>Advanced Filter</button>
                    </div>

                    <h2>Recommended Jobs</h2>

                    <div className="jobs">
                        {jobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                </main>

                <aside className="right-panel">
                    <div className="progress-card">
                        <h3>Complete Your Profile</h3>

                        <div className="progress-circle">
                            75%
                        </div>
                        <ul>
                            <li>Add Portfolio Link</li>
                            <li>Upddate Experience</li>
                            <li className="done">Verify Email</li>
                        </ul>
                    </div>

                    <div className="tracker">
                        <h3>Application Tracker</h3>

                        <div className="grid">
                            <div className="box blue">
                                <h2>8</h2>
                                <p>Applied</p>
                            </div>

                            <div className="box orange">
                                <h2>3</h2>
                                <p>Under Review</p>
                            </div>

                            <div className="box green">
                                <h2>1</h2>
                                <p>Interview</p>
                            </div>

                            <div className="box red">
                                <h2>2</h2>
                                <p>Rejected</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </AuthenticatedLayout>
    );
}

