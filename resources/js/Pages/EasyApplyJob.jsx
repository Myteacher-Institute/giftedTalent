import { Head } from '@inertiajs/react';
import { useState } from 'react';
import '../../css/EasyApplyJob.css';
// import '@/css/EasyApplyJob.css';
// import AuthenticatedLayout from '@/js/Layouts/AuthenticatedLayout';

export default function EasyApplyJob({ auth }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="EasyApplyJob" />
            <header className="navbar">
                <div className="logo">
                    <span className="blue">GiftedTalents</span>.Online
                </div>

                <nav>
                    {['Home', 'Jobs', 'Explore', 'Hire'].map(item => (
                        <a href="#">{item}</a>
                    ))}
                </nav>

                <div className="search">
                    <input type="text" placeholder="Search for jobs..." />
                </div>

                <div className="nav-icons">
                    <i className="fa-regular fa-comment"></i>
                    <i className="fa-regular fa-bell"></i>
                    <img src="https://i.pravatar.cc/40" alt="" />
                </div>

                <button className={`hamburger ${mobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </header>

            <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
                {['Home', 'Jobs', 'Explore', 'Hire'].map(item => (
                    <a href="#" onClick={() => setMobileMenuOpen(false)}>{item}</a>
                ))}
            </div>

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
                        <li><i className="fa-solid fa-briefcase"></i> why did you change my after warning you not to , please bring back my writings</li>
                        <li><i className="fa-solid fa-toolbox"></i> Technical Stack: Mastery of Figma (Auto-layout, components, prototyping) and Adobe Creative Suite</li>
                        <li><i className="fa-solid fa-brain"></i> Technical Stack: Mastery of Figma (Auto-layout, components, prototyping) and Adobe Creative Suite</li>
                        <li><i className="fa-solid fa-microchip"></i> Technical Stack: Mastery of Figma (Auto-layout, components, prototyping) and Adobe Creative Suite</li>
                        <li><i className="fa-solid fa-shop"></i> Technical Stack: Mastery of Figma (Auto-layout, components, prototyping) and Adobe Creative Suite</li>
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
                        (SAFSMS), Brand Hive Students’ Records Management System (SRMS), FlexiSAF Online
                        Application System, School Websites, E-Learning Solution and E-Test Solution.

                    </p>

                    <div className="show-more"><i className="fa-solid fa-chevron-down"></i> SHOW MORE</div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

