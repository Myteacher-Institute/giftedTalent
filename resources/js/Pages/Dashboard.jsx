import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import '../../css/Dashboard.css';
import Notification from '../Components/Notification';

window.alertify = window.alertify || alertify;

// Job Card Component
function JobCard({ job }) {
    const [showMenu, setShowMenu] = useState(null);

    const toggleMenu = (index) => {
        setShowMenu(showMenu === index ? null : index);
    };

    return (
        <div className={`job-card ${job.match_score >= 60 ? 'recommended-job' : ''}`}>
            <div className="job-left">
                <img src={job.image} alt="" />
            </div>
            <div className="job-right">
                <h3>{job.company}</h3>
                <p>{job.title}</p>
                <span>{job.tags}</span>
                <p className="time">{job.time}</p>
                {job.match_score && (
                    <div className="match-score mt-2">
                        <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${job.match_score}%` }}
                                ></div>
                            </div>
                            <span className="text-xs text-gray-600">
                                {job.match_score}% Match
                            </span>
                        </div>
                    </div>
                )}
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

export default function Dashboard({ 
    user,
    auth, 
    profileComplete = 0, 
    profileStatus = {}, 
    stats = { applied: 0, review: 0, interview: 0, rejected: 0 }, 
    jobs = [], 
    jobTypes = [], 
    searchParams = {}, 
    notifications,
    profile,
    flash 
}) {
    const [searchQuery, setSearchQuery] = useState(searchParams.q || '');
    const [selectedJobType, setSelectedJobType] = useState(searchParams.job_type || '');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [loading, setLoading] = useState(false);

    // Get current user data
    const currentUser = user || auth?.user;

    // Show success message from flash if any
    useEffect(() => {
        if (flash?.success) {
            alertify.success(flash.success);
        }
    }, [flash]);

    // Function to get profile image URL with proper fallback
    const getProfileImageUrl = () => {
        // Check if user has profile with avatar_url
        if (currentUser?.profile?.avatar_url) {
            return currentUser.profile.avatar_url;
        }
        // Check if there's an avatar path
        if (currentUser?.profile?.avatar) {
            const avatarPath = currentUser.profile.avatar;
            if (avatarPath.startsWith('/storage/')) {
                return avatarPath;
            }
            return `/storage/${avatarPath}`;
        }
        // Fallback to UI Avatars with user's name
        const userName = currentUser?.name || 'User';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=150&bold=true`;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        router.get(
            '/dashboard',
            { q: searchQuery, job_type: selectedJobType },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => setLoading(false),
                onError: () => setLoading(false),
            }
        );
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSelectedJobType('');
        router.get('/dashboard', {}, { preserveState: true, preserveScroll: true });
    };

    const toggleAdvanced = () => setShowAdvanced(!showAdvanced);

    const handleLogout = () => {
        router.post('/logout');
    };

    useEffect(() => {
        const hasShown = localStorage.getItem('profileCompleteShown');
        if (profileComplete === 100 && !hasShown) {
            alertify.success('Congratulations! Your profile is 100% complete! 🎉', 3);
            localStorage.setItem('profileCompleteShown', 'true');
        }
    }, [profileComplete]);

    // Split jobs into recommended and others
    const recommendedJobs = jobs.filter(job => job.match_score && job.match_score >= 60);
    const otherJobs = jobs.filter(job => !job.match_score || job.match_score < 60);

    // Get CV count
    const cvCount = currentUser?.resumes?.length || 0;
    const hasCV = cvCount > 0;

    return (
        <AuthenticatedLayout user={currentUser}>
            <Head title="Dashboard" />

            <header className="navbar">
                <div className="logo">
                    <span className="blue">GiftedTalents</span>.Online
                </div>

                <nav>
                    <Link href="/">Home</Link>
                    <Link href="/search-jobs">Jobs</Link>
                    <Link href="#">Explore</Link>
                    <Link href="#">Hire</Link>
                </nav>

                <div className="search">
                    <input type="text" placeholder="search for jobs..." />
                </div>

                <div className="nav-icons">
                    <i className="fa-regular fa-comment"></i>
                    <Notification />
                    <img 
                        src={getProfileImageUrl()} 
                        alt={currentUser?.name || 'Profile'} 
                        className="navbar-profile-image"
                        style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '50%', 
                            objectFit: 'cover', 
                            cursor: 'pointer',
                            border: '2px solid #e5e7eb'
                        }}
                        onClick={() => router.visit('/profile/edit')}
                        onError={(e) => {
                            // Fallback if image fails to load
                            const userName = currentUser?.name || 'User';
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=40&bold=true`;
                        }}
                    />
                </div>
            </header>

            <div className="container">
                <aside className="sidebar">
                    <div className="profile">
                        <img 
                            src={getProfileImageUrl()} 
                            alt={currentUser?.name || 'Profile'} 
                            className="sidebar-profile-image"
                            style={{ 
                                width: '80px', 
                                height: '80px', 
                                borderRadius: '50%', 
                                objectFit: 'cover', 
                                margin: '0 auto',
                                border: '3px solid white',
                                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                            }}
                            onError={(e) => {
                                const userName = currentUser?.name || 'User';
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=80&bold=true`;
                            }}
                        />
                        <h3>{currentUser?.name || 'User'}</h3>
                        <p>{profile?.position || currentUser?.profile?.position || 'Add position'}</p>
                        <button>
                            <Link href="/profile/edit" className="profile-button">Edit Profile</Link>
                        </button>
                    </div>

                    <ul className="menu">
                        <li className="active"><i className="fa-solid fa-table"></i>Dashboard</li>
                        <li><Link href="/search-jobs"><i className="fa-solid fa-magnifying-glass"></i> Search Job</Link></li>
                        <li><i className="fa-solid fa-file"></i> Application</li>
                        <li><i className="fa-regular fa-envelope"></i> Message</li>
                        <li><i className="fa-regular fa-bookmark"></i> Save Jobs</li>
                        <li><i className="fa-solid fa-gear"></i> Settings</li>
                        <li className="logout-item">
                            <a href="/" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                                <i className="fa-solid fa-right-from-bracket logout-icon"></i>
                                Logout
                            </a>
                        </li>
                    </ul>
                </aside>

                <main className="main">
                    <h1>Welcome back, {currentUser?.name?.split(' ')[0] || 'User'}</h1>

                    <div className="status-bar">
                        <span className={hasCV ? 'success' : 'warning'}>
                            {hasCV ? `CV Uploaded (${cvCount})` : 'Upload CV'}
                        </span>
                        <span>
                            Skills: {currentUser?.skills?.slice(0, 2).map(s => s.name).join(', ') || 'No skills added'}
                        </span>
                        <span>
                            Bio: {currentUser?.profile?.bio ? currentUser.profile.bio.substring(0, 50) + '...' : 'Add bio'}
                        </span>
                        <button onClick={() => router.visit('/cv')}>
                            <Link href="/cv" className="status-button">
                                {hasCV ? 'Manage CVs' : 'Upload Your CV'}
                            </Link>
                        </button>
                    </div>

                    {/* Profile completion status */}
                    {profileComplete === 100 ? (
                        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <i className="fa-solid fa-check-circle text-green-400 text-lg"></i>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">
                                        Your profile is 100% complete! 🎉
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : profileComplete < 100 ? (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <i className="fa-solid fa-exclamation-triangle text-yellow-400"></i>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        Complete your profile to get better job recommendations! ({profileComplete}% complete)
                                        <Link href="/profile/edit" className="font-medium underline ml-2 hover:text-yellow-800">
                                            Update Profile →
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    <div className="search-bar">
                        <form onSubmit={handleSearch} className="flex gap-2 w-full">
                            <input 
                                type="text" 
                                placeholder="Search for jobs..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <select 
                                value={selectedJobType} 
                                onChange={(e) => setSelectedJobType(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">All Types</option>
                                {jobTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            <button 
                                type="button" 
                                onClick={toggleAdvanced}
                                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md"
                            >
                                Advanced
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 shadow-md disabled:opacity-50"
                            >
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                            {(searchQuery || selectedJobType) && (
                                <button 
                                    type="button" 
                                    onClick={clearSearch}
                                    className="px-4 py-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-all"
                                >
                                    Clear
                                </button>
                            )}
                        </form>
                    </div>

                    {showAdvanced && (
                        <div className="advanced-filter-modal bg-white p-6 rounded-xl shadow-2xl border border-gray-200 max-w-md mx-auto mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Advanced Filter</h3>
                                <button onClick={toggleAdvanced} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
                            </div>
                            <div className="space-y-4">
                                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <option>Location</option>
                                </select>
                                <input type="range" min="0" max="200" className="w-full" />
                                <span>$0 - $200k</span>
                            </div>
                        </div>
                    )}

                    {/* Recommended Jobs Section */}
                    {recommendedJobs.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    🎯 Recommended for You
                                </h2>
                                <span className="text-sm text-gray-500">
                                    Based on your profile and skills
                                </span>
                            </div>
                            <div className="jobs">
                                {recommendedJobs.map((job) => (
                                    <JobCard key={job.id} job={job} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Other Jobs Section */}
                    {otherJobs.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                {searchQuery ? `Search Results for "${searchQuery}"` : 'Other Available Jobs'}
                            </h2>
                            <div className="jobs">
                                {otherJobs.map((job) => (
                                    <JobCard key={job.id} job={job} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No results message */}
                    {recommendedJobs.length === 0 && otherJobs.length === 0 && !loading && (
                        <div className="text-center py-16 px-8">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl flex items-center justify-center">
                                <i className="fa-solid fa-magnifying-glass text-3xl text-yellow-500"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Sorry, no matching jobs</h3>
                            <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
                                No jobs match your criteria. Complete your profile for better recommendations!
                            </p>
                            <Link href="/profile/edit" className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg font-semibold">
                                Complete Your Profile
                            </Link>
                        </div>
                    )}

                    {loading && (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    )}
                </main>

                <aside className="right-panel">
                    <div className="progress-card">
                        <h3>Complete Your Profile</h3>

                        <div className="progress-circle" style={{ '--progress': `${profileComplete / 100}` }}>
                            <div className="flex flex-col items-center">
                                <h2 className="text-2xl font-bold text-indigo-600 mb-1">{profileComplete}%</h2>
                                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Complete</span>
                            </div>
                        </div>
                        <ul>
                            <li className={profileStatus.status?.portfolio ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                {profileStatus.status?.portfolio ? '✓ Portfolio Added' : '➤ Add Portfolio Link'}
                            </li>
                            <li className={profileStatus.status?.experience ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                {profileStatus.status?.experience ? '✓ Experience Added' : '➤ Update Experience'}
                            </li>
                            <li className={profileStatus.status?.email_verified ? 'done' : ''}>
                                {profileStatus.status?.email_verified ? '✓ Email Verified' : '➤ Verify Email'}
                            </li>
                            <li className={profileStatus.status?.skills ? 'done' : ''} onClick={() => router.visit('/profile/edit')}>
                                {profileStatus.status?.skills ? '✓ Skills Added' : '➤ Add Skills'}
                            </li>
                            <li className={profileStatus.status?.cv_uploaded ? 'done' : ''} onClick={() => router.visit('/cv')}>
                                {profileStatus.status?.cv_uploaded ? '✓ CV Uploaded' : '➤ Upload CV'}
                            </li>
                        </ul>
                    </div>

                    <div className="tracker">
                        <h3>Application Tracker</h3>

                        <div className="grid">
                            <div className="box blue">
                                <h2>{stats.applied || 0}</h2>
                                <p>Applied</p>
                            </div>

                            <div className="box orange">
                                <h2>{stats.review || 0}</h2>
                                <p>Under Review</p>
                            </div>

                            <div className="box green">
                                <h2>{stats.interview || 0}</h2>
                                <p>Interview</p>
                            </div>

                            <div className="box red">
                                <h2>{stats.rejected || 0}</h2>
                                <p>Rejected</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </AuthenticatedLayout>
    );
}