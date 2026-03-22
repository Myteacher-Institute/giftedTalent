import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import '../../css/Dashboard.css';
import Notification from '@/Components/Notification';

window.alertify = window.alertify || alertify;

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

export default function Dashboard({ auth, profileComplete = 75, profileStatus = {}, stats = { applied: 8, review: 3, interview: 1, rejected: 2 }, jobs = [] }) {
    const [activeMenu, setActiveMenu] = useState(null);

    useEffect(() => {
        // Profile complete celebration (one-time)
        const hasShown = localStorage.getItem('profileCompleteShown');
        if (profileComplete === 100 && !hasShown) {
            alertify.success('Congratulations! Your profile is 100% complete! 🎉', 3);
            localStorage.setItem('profileCompleteShown', 'true');
        }
    }, [profileComplete]);

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
                    <Notification />
                    <img src={auth.user.profile?.avatar_url || `https://i.pravatar.cc/40?img=${auth.user.id}`} alt="" />
                </div>
            </header>

            <div className="container">
                <aside className="sidebar">
                    <div className="profile">
                        <img src={auth.user.profile?.avatar_url || `https://i.pravatar.cc/40?img=${auth.user.id}`} alt="" />
                        <h3>{auth.user.name}</h3>
                        <p>{auth.user.profile?.position || 'Add position'}</p>
                        <Link href={route('profile.editExtended')} className="profile-button">Edit Profile</Link>

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
                    <h1>Welcome back, {auth.user.name.split(' ')[0]}</h1>

                    <div className="status-bar">
                        <span className="success">{auth.user.profile?.cv_uploaded ? 'CV Uploaded' : 'Upload CV'}</span>
                        <span>Skills: {auth.user.skills?.slice(0,2).map(s => s.name).join(', ') || 'No skills added'}</span>
                        <span>Bio: {auth.user.profile?.bio ? auth.user.profile.bio.substring(0,50) + '...' : 'Add bio'}</span>
                        <button><Link href="/cv" className="status-button">Upload Your CV</Link></button>
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

                        <div className="progress-circle" style={{'--progress': `${profileComplete / 100}`}}>
                            <div className="flex flex-col items-center">
                                <h2 className="text-2xl font-bold text-indigo-600 mb-1">{profileComplete}%</h2>
                                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Complete</span>
                            </div>
                        </div>
                        <ul>
                            <li className={profileStatus.status?.portfolio ? 'done' : ''} onClick={() => router.visit(route('profile.editExtended'))}>
                                {profileStatus.status?.portfolio ? '✓ Portfolio Added' : '➤ Add Portfolio Link'}
                            </li>

                            <li className={profileStatus.status?.experience ? 'done' : ''} onClick={() => router.visit(route('profile.editExtended'))}>
                                {profileStatus.status?.experience ? '✓ Experience Added' : '➤ Update Experience'}
                            </li>

                            <li className={profileStatus.status?.email_verified ? 'done' : ''}>
                                {profileStatus.status?.email_verified ? '✓ Email Verified' : '➤ Verify Email'}
                            </li>
                            <li className={profileStatus.status?.skills ? 'done' : ''} onClick={() => router.visit(route('profile.editExtended'))}>
                                {profileStatus.status?.skills ? '✓ Skills Added' : '➤ Add Skills'}
                            </li>

                        </ul>
                    </div>

                    <div className="tracker">
                        <h3>Application Tracker</h3>

                        <div className="grid">
                            <div className="box blue">
                                <h2>{stats.applied}</h2>
                                <p>Applied</p>
                            </div>

                            <div className="box orange">
                                <h2>{stats.review}</h2>
                                <p>Under Review</p>
                            </div>

                            <div className="box green">
                                <h2>{stats.interview}</h2>
                                <p>Interview</p>
                            </div>

                            <div className="box red">
                                <h2>{stats.rejected}</h2>
                                <p>Rejected</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </AuthenticatedLayout>
    );
}

