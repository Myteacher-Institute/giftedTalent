import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import '../../css/EasyApplyJob.css';
import '../../css/nav.css';
import AppNavbar from '../Components/AppNavbar';

export default function EasyApplyJob({ auth, profile }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const currentUser = auth?.user;

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const getProfileImageUrl = () => {
        if (profile?.profile_image_base64) {
            return profile.profile_image_base64;
        }
        if (currentUser?.profile?.profile_image_base64) {
            return currentUser.profile.profile_image_base64;
        }
        if (currentUser?.profile?.avatar_url) {
            return currentUser.profile.avatar_url;
        }
        if (currentUser?.profile?.avatar) {
            const avatarPath = currentUser.profile.avatar;
            if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
                return avatarPath;
            }
            if (avatarPath.startsWith('data:image')) {
                return avatarPath;
            }
            const cleanPath = avatarPath.replace(/^\/+/, '');
            return `/storage/${cleanPath}`;
        }
        const userName = currentUser?.name || 'User';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=150&bold=true`;
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <>
            <Head title="Easy Apply Job" />
            
            {/* AppNavbar with sidebar toggle */}
            <AppNavbar 
                user={currentUser} 
                onMenuToggle={toggleSidebar} 
                isMenuOpen={sidebarOpen} 
            />

            {/* Mobile Overlay */}
            {sidebarOpen && <div className="mobile-overlay" onClick={closeSidebar}></div>}

            <div className="easy-apply-container">
                {/* Sidebar - Same as Dashboard */}
                <aside className={`easy-apply-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
                    <div className="profile">
                        <div className="profile-image-wrapper">
                            <img
                                src={getProfileImageUrl()}
                                alt={currentUser?.name || 'Profile'}
                                className="profile-image"
                                onError={(e) => {
                                    const userName = currentUser?.name || 'User';
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=150&bold=true`;
                                }}
                            />
                            <div className="verified-overlay">
                                <i className="fa-solid fa-check-circle"></i>
                            </div>
                        </div>

                        <h3>{currentUser?.name || 'User'}</h3>
                        <p>{profile?.position || currentUser?.profile?.position || 'Add position'}</p>
                        <button>
                            <Link href="/profile/edit" className="profile-button">Edit Profile</Link>
                        </button>
                    </div>

                    <ul className="menu">
                        <li><Link href="/dashboard"><i className="fa-solid fa-table"></i>Dashboard</Link></li>
                        <li><Link href="/search-jobs"><i className="fa-solid fa-magnifying-glass"></i> Search Job</Link></li>
                        <li><Link href="/applications"><i className="fa-solid fa-file"></i> My Applications</Link></li>
                        <li><Link href="/messages"><i className="fa-regular fa-envelope"></i> Message</Link></li>
                        <li><Link href="/saved-jobs"><i className="fa-regular fa-bookmark"></i> Save Jobs</Link></li>
                        <li><Link href="/settings"><i className="fa-solid fa-gear"></i> Settings</Link></li>
                        <li className="logout-item">
                            <a href="/" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                                <i className="fa-solid fa-right-from-bracket logout-icon"></i>
                                Logout
                            </a>
                        </li>
                    </ul>
                </aside>

                {/* Main Content */}
                <div className="easy-apply-main">
                    <div className="container">
                        <div className="card">
                            <div className="company-header">
                                <div className="company-logo"></div>
                                <div className="company-name">Brand Hive</div>
                            </div>

                            <div className="job-title">UI/UX PRODUCT DESIGNER <i className="fa-solid fa-check-circle verified-icon"></i></div>

                            <div className="location">
                                <i className="fa-solid fa-location-dot"></i> Port Harcourt, Rivers State, Nigeria &bull; <i className="fa-regular fa-clock"></i> 4 months ago
                            </div>

                            <div className="tags">
                                <div className="tag"><i className="fa-solid fa-naira-sign"></i> NGN150k/month – 200k/month</div>
                                <div className="tag"><i className="fa-solid fa-house-laptop"></i> Remote</div>
                                <div className="tag"><i className="fa-regular fa-clock"></i> Full-Time</div>
                            </div>

                            <div className="actions">
                                <button className="apply-btn"><i className="fa-regular fa-paper-plane"></i> Easy Apply</button>
                                <button className="save-btn"><i className="fa-regular fa-bookmark"></i> Save</button>
                            </div>

                            <div className="section-title"><i className="fa-solid fa-circle-info"></i> About the Job</div>

                            <p>
                                We are looking for a Web-Focused E-Commerce Designer who bridges the gap between high-end modern aesthetics and high-conversion performance.
                            </p>

                            <p>
                                While you have a strong graphic design foundation, your primary expertise lies in crafting digital experiences—specifically Shopify stores,
                                high-converting landing pages, and interactive web elements.
                            </p>

                            <p>
                                In this role, you will leverage AI tools to accelerate your workflow, allowing you to focus on the strategic UX/UI decisions that drive measurable
                                growth for our e-commerce partners.
                            </p>

                            <p><i className="fa-solid fa-location-dot"></i> <strong>Location:</strong> Remote</p>
                            <p><i className="fa-solid fa-handshake"></i> <strong>Engagement:</strong> Part-Time (20 hrs/week) → Potential to scale to Full-Time</p>
                            <p><i className="fa-regular fa-calendar"></i> <strong>Schedule:</strong> Flexible, with overlap in CET</p>
                            <p><i className="fa-solid fa-sack-dollar"></i> <strong>Monthly Budget:</strong> $900</p>

                            <div className="sub-heading"><i className="fa-solid fa-list-check"></i> What You'll Do</div>

                            <div className="sub-heading"><i className="fa-solid fa-paintbrush"></i> Web & UI/UX Design</div>

                            <ul>
                                <li>Design high-performing Shopify layouts focusing on product pages and collections.</li>
                                <li>Create wireframes and prototypes in Figma with a focus on CRO.</li>
                                <li>Ensure mobile-first design optimization.</li>
                                <li>Build scalable design systems and component libraries.</li>
                            </ul>

                            <div className="sub-heading"><i className="fa-solid fa-palette"></i> Brand & Digital Identity</div>

                            <ul>
                                <li>Translate brand guidelines into digital-first visual languages.</li>
                                <li>Create variations of web elements for A/B testing.</li>
                            </ul>

                            <div className="sub-heading"><i className="fa-solid fa-robot"></i> AI-Enhanced Workflow</div>

                            <ul>
                                <li>Use AI tools (Midjourney, Adobe Firefly) to generate assets.</li>
                                <li>Integrate AI to speed up layout exploration and content variation.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="container">
                        <div className="card">
                            <h2><i className="fa-solid fa-user-search"></i> What We're Looking For</h2>

                            <h3><i className="fa-solid fa-star"></i> Must-Haves</h3>

                            <ul>
                                <li><i className="fa-solid fa-briefcase"></i> Proven experience as a UI/UX Product Designer with a strong portfolio</li>
                                <li><i className="fa-solid fa-toolbox"></i> Technical Stack: Mastery of Figma (Auto-layout, components, prototyping) and Adobe Creative Suite</li>
                                <li><i className="fa-solid fa-brain"></i> Strong understanding of user-centered design principles and best practices</li>
                                <li><i className="fa-solid fa-microchip"></i> Experience designing for web and mobile platforms</li>
                                <li><i className="fa-solid fa-shop"></i> Knowledge of e-commerce design patterns and conversion optimization</li>
                            </ul>

                            <h3><i className="fa-solid fa-heart"></i> Nice-to-Haves</h3>

                            <ul>
                                <li><i className="fa-solid fa-store"></i> Experience working with Shopify or Shopify Plus</li>
                                <li><i className="fa-solid fa-film"></i> Basic motion design skills</li>
                            </ul>

                            <h3><i className="fa-solid fa-trophy"></i> What Success Looks Like</h3>

                            <ul>
                                <li><i className="fa-solid fa-chart-line"></i> High-Performing Layouts: Launching landing pages and store sections that show a measurable lift in conversion rates</li>
                                <li><i className="fa-solid fa-folder-tree"></i> Figma Excellence: Delivery of organized, developer-ready files that follow modern web standards</li>
                                <li><i className="fa-solid fa-bolt"></i> Speed & Quality: Leveraging AI to maintain a fast-paced output without sacrificing the "premium" feel of the brands</li>
                                <li><i className="fa-solid fa-compass"></i> Self-Direction: Taking a project from a rough wireframe to a polished, live-ready web design with minimal hand-holding</li>
                            </ul>

                            <h3><i className="fa-solid fa-clipboard-list"></i> Recruitment Process</h3>

                            <ul>
                                <li><i className="fa-regular fa-comment-dots"></i> Initial Interview</li>
                                <li><i className="fa-solid fa-folder-open"></i> Portfolio Review / Design Assessment</li>
                                <li><i className="fa-solid fa-user-tie"></i> Final Interview</li>
                                <li><i className="fa-solid fa-handshake-simple"></i> Offer & Onboarding</li>
                            </ul>

                            <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                                <i className="fa-solid fa-bolt"></i> Powered by GiftedTalent
                            </p>

                            <div className="apply-wrapper">
                                <button className="apply-btn"><i className="fa-regular fa-paper-plane"></i> Easy Apply</button>
                            </div>
                        </div>
                    </div>

                    <div className="container">
                        <div className="card">
                            <h2><i className="fa-solid fa-building"></i> About the Company</h2>

                            <div className="company-header">
                                <div className="company-info">
                                    <div className="company-logo"></div>
                                    <div>
                                        <div className="company-name">Brand Hive</div>
                                        <div style={{ fontSize: '13px', color: '#777' }}><i className="fa-solid fa-users"></i> 74,867 Followers</div>
                                    </div>
                                </div>
                                <button className="follow-btn"><i className="fa-solid fa-plus"></i> Follow</button>
                            </div>

                            <div className="company-meta">
                                <i className="fa-solid fa-briefcase"></i> Digital Branding Company &bull; <i className="fa-solid fa-users"></i> 501-1000 employees
                            </div>

                            <p className="company-text">
                                <i className="fa-solid fa-quote-left"></i> Brand Hive is an indigenously owned ICT company headquartered in Port Harcourt, Nigeria.
                                Here at Brand Hive we are dedicated to the improvement of the education sector using ICT
                                as our core tool. We aim to be a leading player in the Information Technology Industry
                                with our focus on taking the education sector to the next level using knowledge,
                                creativity and innovation.
                            </p>

                            <p className="company-text">
                                Our product portfolio has several software solutions: SAF School Management Software
                                (SAFSMS), Brand Hive Students' Records Management System (SRMS), FlexiSAF Online
                                Application System, School Websites, E-Learning Solution and E-Test Solution.
                            </p>

                            <div className="show-more"><i className="fa-solid fa-chevron-down"></i> SHOW MORE</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}