import { Head } from '@inertiajs/react';
import '/resources/css/admindashboard.css';

export default function AdminDashboard() {
    return (
        <>
            <Head title="Dashboard - GiftedTalents" />

            <div className="dashboard-container">
                {/* Sidebar */}
                <aside className="sidebar">
                    <div className="logo">
                        <a href='#'>GiftedTalents<span>.online</span></a>
                    </div>

                    <nav className="sidebar-nav">
                        <div>
                            <img src="/assets/svg/01f7c576-04bb-4d9e-b318-158c701bfeda 1.jpg" alt="" className="side-bar-img" />
                            <h2>MyTeacher Institute</h2>
                            <p>Port Harcourt, Innovation Institute</p>
                        </div>
                        <ul>
                            <li className="active"><a href="#"><img src="/assets/svg/column.svg" alt="" className="column-icon" />Dashboard</a></li>

                            <li><a href="#"><img src="/assets/svg/tag.svg" alt="" className="tag-icon" />Job Search</a></li>

                            <li><a href="#"><img src="/assets/svg/forward-out.svg" alt="" className="forward-out-icon" />Applications</a></li>

                            <li><a href="#"><img src="/assets/svg/message.svg" alt="" className="message-icon" />Messages</a></li>

                            <li><a href="#"><img src="/assets/svg/jobs.svg" alt="" className="jobs-icon"></img>Saved Jobs</a></li>

                            <li><a href="#"><img src="/assets/svg/setting.svg" alt="" className="setting-icon" />Settings</a></li>
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="main-content">
                    {/* Top Navigation */}
                    <header className="top-nav">
                        <div className="nav-left">
                            <div className="menu-icon">
                                {/* Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(116, 192, 252)" d="M96 160C96 142.3 110.3 128 128 128L512 128C529.7 128 544 142.3 544 160C544 177.7 529.7 192 512 192L128 192C110.3 192 96 177.7 96 160zM96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320zM544 480C544 497.7 529.7 512 512 512L128 512C110.3 512 96 497.7 96 480C96 462.3 110.3 448 128 448L512 448C529.7 448 544 462.3 544 480z" /></svg>
                            </div>
                            <div className="nav-links">
                                <a href="#" className='home'>Home</a>
                                <a href="#">Jobs</a>
                                <a href="#">Explore</a>
                                <div>
                                    <a href="#" className='hire'>Hire</a>
                                    <img src="/assets/svg/arrow-down.svg" alt="" className="arrow-down-icon" />
                                </div>
                            </div>
                        </div>

                        <div className="search-bar">
                            <input type="text" placeholder="Search for jobs..." />
                            <button className="search-btn"><img src="/assets/svg/search.svg" alt="" className="search-icon" /></button>
                        </div>

                        <img src="/assets/svg/chats.svg" alt="" className="chats-icon" />

                        <img src="/assets/svg/notification.svg" alt="" className="notification-icon" />

                        <div className="user-profile">
                            <div className="avatar">MI</div>
                        </div>
                    </header>

                    {/* Welcome Section */}
                    <section className="welcome-section">
                        <h1>Hello, MyTeacher Institute!</h1>
                    </section>

                    {/* Stats Cards */}
                    <section className="stats-grid">
                        <div className="stat-card">
                            <h3>Your Job Posts</h3>
                            <div className="stat-numbers">
                                <div id='stat-item-1' className="stat-item">
                                    <span className="stat-value">2</span>
                                    <span className="stat-label">Active Jobs</span>
                                </div>
                                <div id='stat-item-2' className="stat-item">
                                    <span className="stat-value">5</span>
                                    <span className="stat-label">Passed</span>
                                </div>
                                <div id='stat-item-3' className="stat-item">
                                    <span className="stat-value">12</span>
                                    <span className="stat-label">Under Review</span>
                                </div>
                                <div id='stat-item-4' className="stat-item">
                                    <span className="stat-value">8</span>
                                    <span className="stat-label">Hired</span>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card-post-job">
                            <h3>Post a new Job</h3>
                            <img src="/assets/svg/hero-image.jpg" alt="" className="hero-image" />
                            <button className="post-job-btn">+ Create New Job Post</button>
                        </div>

                    </section>

                    {/* Recent Job Posts Section */}
                    <section className="recent-jobs">
                        <div className="section-header">
                            <h3>Recent Job Posts</h3>
                            {/* <div className="search-filter">
                                <input type="text" placeholder="Search job titles or keypad" />
                                <select name="status" id="status">
                                    <option value="all">All Status ▼</option>
                                    <option value="active">Active</option>
                                    <option value="review">Under Review</option>
                                    <option value="closed">Closed</option>
                                </select>
                                <button className="advanced-filter">Advanced Filter</button>
                            </div>
                         </div> */}

                            <div className="jobs-list">
                                {/* Job Card 1 */}
                                <div className="job-card">
                                    <div className="job-card-header">
                                        <div className="company-info">
                                            <div className="user-profile">
                                                <div className="avatar">MI</div>
                                            </div>

                                            <div className="company-info-header">
                                                <h3>BoyAlone Studio</h3>

                                                <div className='location'>
                                                    <img src="/assets/svg/location.svg" alt="" className="location-icon" />
                                                    <p className="company-location">Ozuoba PH</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='job-details'>
                                            <div className='jobs-info'>
                                                <div>
                                                    <h4 className="job-type">Full-Time</h4>
                                                    <p className="job-salary">| N180,000/ <span>Month</span></p>
                                                </div>
                                                <div className="job-meta">
                                                    <div className='job-details-container'>
                                                        <p className="time">6 hours ago</p>
                                                        <div className="applicants">
                                                            <img src="/assets/svg/message.svg" alt="" className="message-icon" />
                                                            <p> 27</p>
                                                        </div>

                                                        <button className="view-applicants">View Applicants</button>

                                                        <img src="/assets/svg/menu.svg" alt="" id="menu-icon" />
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="job-description">Senior Software Engineer. Full <br /> Stack. JS</p> <hr />
                                        </div>
                                    </div>
                                </div>

                                {/* Job Card 2 */}
                                <div className="job-card">
                                    <div className="job-card-header">
                                        <div className="company-info">
                                            <div className="user-profile">
                                                <div className="avatar">MI</div>
                                            </div>

                                            <div className="company-info-header">
                                                <h3>BoyAlone Studio</h3>

                                                <div className='location'>
                                                    <img src="/assets/svg/location.svg" alt="" className="location-icon" />
                                                    <p className="company-location">Ozuoba PH</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='job-details'>
                                            <div className='jobs-info'>
                                                <div>
                                                    <h4 className="job-type">Full-Time</h4>
                                                    <p className="job-salary">| N180,000/ <span>Month</span></p>
                                                </div>
                                                <div className="job-meta">
                                                    <div className='job-details-container'>
                                                        <p className="time">6 hours ago</p>
                                                        <div className="applicants">
                                                            <img src="/assets/svg/message.svg" alt="" className="message-icon" />
                                                            <p> 27</p>
                                                        </div>

                                                        <button className="view-applicants">View Applicants</button>

                                                        <img src="/assets/svg/menu.svg" alt="" id="menu-icon" />
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="job-description">Senior Software Engineer. Full <br /> Stack. JS</p> <hr />
                                        </div>
                                    </div>
                                </div>

                                {/* Job Card 3 */}
                                <div className="job-card">
                                    <div className="job-card-header">
                                        <div className="company-info">
                                            <div className="user-profile">
                                                <div className="avatar">MI</div>
                                            </div>

                                            <div className="company-info-header">
                                                <h3>BoyAlone Studio</h3>

                                                <div className='location'>
                                                    <img src="/assets/svg/location.svg" alt="" className="location-icon" />
                                                    <p className="company-location">Ozuoba PH</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='job-details'>
                                            <div className='jobs-info'>
                                                <div>
                                                    <h4 className="job-type">Full-Time</h4>
                                                    <p className="job-salary">| N180,000/ <span>Month</span></p>
                                                </div>
                                                <div className="job-meta">
                                                    <div className='job-details-container'>
                                                        <p className="time">6 hours ago</p>
                                                        <div className="applicants">
                                                            <img src="/assets/svg/message.svg" alt="" className="message-icon" />
                                                            <p> 27</p>
                                                        </div>

                                                        <button className="view-applicants">View Applicants</button>

                                                        <img src="/assets/svg/menu.svg" alt="" id="menu-icon" />
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="job-description">Senior Software Engineer. Full <br /> Stack. JS</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* <div className="search-bar">
                            
                            <input type="text" placeholder="Search for jobs..." />
                            <button className="search-btn"></button>
                        </div> */}

                    <section class="search-section">

                        <div class="search-box">

                            <div class="search-input">
                                <div>
                                    <img src="/assets/svg/search.svg" alt="" className="search-icon" />
                                </div>
                                <input type="text" placeholder="Search job titles or keypad" />
                            </div>

                            <div class="status-filter">
                                <select>
                                    <option>All Status</option>
                                    <option>Full Time</option>
                                    <option>Part Time</option>
                                    <option>Remote</option>
                                </select>
                                <img src="/assets/svg/arrow-down.svg" alt="" className="arrow-down-icon" />
                            </div>
                        </div>


                    </section>
                    {/* FOOTER */}
                    <footer>
                        <div className="footer-left">
                            <a href="#" className="brand">GiftedTalents<span>.online</span></a>
                            <div>
                                <p>©</p>
                                <span>
                                    2026
                                </span>
                            </div>
                        </div>

                        <div className="footer-right">
                            <a href="#">About</a>
                            <a href="#">Contact</a>
                            <a href="#">Privacy Policy</a>
                            <a href="#">Community Guideline</a>
                        </div>

                    </footer>

                </main>
            </div>
        </>
    );
}