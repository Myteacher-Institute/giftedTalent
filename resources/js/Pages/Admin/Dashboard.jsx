import { Head } from '@inertiajs/react';

export default function AdminDashboard() {
    return (
        <>
            <Head title="Dashboard - GiftedTalents" />

            <div className="dashboard-container">
                {/* Sidebar */}
                <aside className="sidebar">
                    <div className="logo">
                        <h2>GiftedTalents<span>.online</span></h2>
                    </div>

                    <nav className="sidebar-nav">
                        <ul>
                            <li className="active"><a href="#">Dashboard</a></li>
                            <li><a href="#">Job Search</a></li>
                            <li><a href="#">Applications</a></li>
                            <li><a href="#">Messages</a></li>
                            <li><a href="#">Saved Jobs</a></li>
                            <li><a href="#">Settings</a></li>
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="main-content">
                    {/* Top Navigation */}
                    <header className="top-nav">
                        <div className="nav-left">
                            <div className="menu-icon">☰</div>
                            <div className="breadcrumb">
                                <a href="#">Home</a> |
                                <a href="#">Jobs</a> |
                                <a href="#">Explore</a> |
                                <a href="#">Hire</a>
                            </div>
                        </div>

                        <div className="search-bar">
                            <input type="text" placeholder="Search for jobs..." />
                            <button className="search-btn">🔍</button>
                        </div>

                        <div className="user-profile">
                            <span>MyTeacher Institute</span>
                            <div className="avatar">MI</div>
                        </div>
                    </header>

                    {/* Welcome Section */}
                    <section className="welcome-section">
                        <h1>Hello, MyTeacher Institute! 👋</h1>
                    </section>

                    {/* Stats Cards */}
                    <section className="stats-grid">
                        <div className="stat-card">
                            <h3>Your Job Posts</h3>
                            <div className="stat-numbers">
                                <div className="stat-item">
                                    <span className="stat-value">2</span>
                                    <span className="stat-label">Active Jobs</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">5</span>
                                    <span className="stat-label">Passed</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">12</span>
                                    <span className="stat-label">Under Review</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">8</span>
                                    <span className="stat-label">Hired</span>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <h3>Post a new Job</h3>
                            <button className="post-job-btn">+ Create New Job Post</button>
                        </div>

                        <div className="stat-card">
                            <h3>Application Tracker</h3>
                            <div className="tracker-numbers">
                                <div className="tracker-item">
                                    <span className="tracker-value">320%</span>
                                    <span className="tracker-label">Shortlisted</span>
                                </div>
                                <div className="tracker-item">
                                    <span className="tracker-value">250</span>
                                    <span className="tracker-label">Interview Stage</span>
                                </div>
                                <div className="tracker-item">
                                    <span className="tracker-value">128</span>
                                    <span className="tracker-label">Total Rejected</span>
                                </div>
                                <div className="tracker-item">
                                    <span className="tracker-value">45</span>
                                    <span className="tracker-label">Under Review</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Recent Job Posts Section */}
                    <section className="recent-jobs">
                        <div className="section-header">
                            <h2>Recent Job Posts</h2>
                            <div className="search-filter">
                                <input type="text" placeholder="Search job titles or keypad" />
                                <select name="status" id="status">
                                    <option value="all">All Status ▼</option>
                                    <option value="active">Active</option>
                                    <option value="review">Under Review</option>
                                    <option value="closed">Closed</option>
                                </select>
                                <button className="advanced-filter">Advanced Filter</button>
                            </div>
                        </div>

                        <div className="jobs-list">
                            {/* Job Card 1 */}
                            <div className="job-card">
                                <div className="job-card-header">
                                    <div className="company-info">
                                        <h3>BoyAlone Studio</h3>
                                        <p className="company-location">@Ozuba PH</p>
                                    </div>
                                    <span className="job-type">Full-Time</span>
                                </div>

                                <p className="job-salary">N180,000/ Month</p>
                                <p className="job-description">Senior Software Engineer. Full Stack. JS</p>

                                <div className="job-card-footer">
                                    <div className="job-meta">
                                        <span className="time">6 hours ago</span>
                                        <span className="applicants">📧 27</span>
                                    </div>
                                    <button className="view-applicants">View Applicants</button>
                                </div>
                            </div>

                            {/* Job Card 2 */}
                            <div className="job-card">
                                <div className="job-card-header">
                                    <div className="company-info">
                                        <h3>BoyAlone Studio</h3>
                                        <p className="company-location">@Ozuba PH</p>
                                    </div>
                                    <span className="job-type">Full-Time</span>
                                </div>

                                <p className="job-salary">N180,000/ Month</p>
                                <p className="job-description">Senior Software Engineer. Full Stack. JS</p>

                                <div className="job-card-footer">
                                    <div className="job-meta">
                                        <span className="time">6 hours ago</span>
                                        <span className="applicants">📧 27</span>
                                    </div>
                                    <button className="view-applicants">View Applicants</button>
                                </div>
                            </div>

                            {/* Job Card 3 */}
                            <div className="job-card">
                                <div className="job-card-header">
                                    <div className="company-info">
                                        <h3>BoyAlone Studio</h3>
                                        <p className="company-location">@Ozuba PH</p>
                                    </div>
                                    <span className="job-type">Full-Time</span>
                                </div>

                                <p className="job-salary">N180,000/ Month</p>
                                <p className="job-description">Senior Software Engineer. Full Stack. JS</p>

                                <div className="job-card-footer">
                                    <div className="job-meta">
                                        <span className="time">6 hours ago</span>
                                        <span className="applicants">📧 27</span>
                                    </div>
                                    <button className="view-applicants">View Applicants</button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}