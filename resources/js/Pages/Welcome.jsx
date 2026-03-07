import { Head, Link } from '@inertiajs/react';
<<<<<<< HEAD
import { useState } from 'react';
import '../../css/nav.css';
import '../../css/hero.css';
import heroImage from '../../image/div (1).jpg';

=======
import '../../css/feature.css';
import '../../css/welcome.css';
import '../../css/feature_talent_section.css';

import starIcon from '../../assets/svg/star.svg';
import halfStarIcon from '../../assets/svg/half-star.svg';

import sample1 from '../../assets/img/sample1.jpg';
import sample2 from '../../assets/img/sample2.jpg';
import sample3 from '../../assets/img/sample3.jpg';
import sample4 from '../../assets/img/sample4.jpg';


const featuresData = [
    {
        name: "Micheal Chen",
        image: sample1,
        role: "Full Stack Developer",
        tech: ['Node.js', 'React', 'mongoDB'],
        bg: { background: 'linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 70.71%)' },
        border: {border: '1px solid #DBEAFE'},
        rating: 48,
        stars: 5,
        fullStar: true,
        icon: starIcon
    },
    {
        name: "Sarah Johnson",
        image: sample2,
        role: "UI/UX Designer",
        tech: ['Figma', 'Adobe', 'Prototyping'],
        border: {border: '1px solid #F3E8FF'},
        bg: { background: 'linear-gradient(135deg, #FAF5FF 0%, #FFFFFF 70.71%)' },
        stars: 4,
        rating: 35,
        fullStar: false,
        halfStar: true,
        icon: starIcon,
        halfStarIcon: halfStarIcon
    },
    {
        name: "David Martinez",
        role: "Data Analyst",
        bg: { background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 70.71%)' },
        image: sample3,
        rating: 52,
        border: {border: '1px solid #DCFCE7'},
        tech: ['Python', 'SQL', 'Tebleau'],
        stars: 5,
        fullStar: true,
        icon: starIcon
    },
    {
        name: "Emily Wilson",
        role: "Content Writer",
        bg: { background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 70.71%)' },
        rating: 41,
        image: sample4,
        tech: ['SEO', 'CopyWriting', 'Blogging'],
        border: {border: '1px solid #FFEDD5'},
        stars: 5,
        fullStar: true,
        icon: starIcon
    }
]
>>>>>>> 426b550062f40b492c5cf8393893609e15d64ab4

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="GiftedTalents" />

            <div className="home-screen">
                {/* Henry */}
                <nav className="navbar">
<<<<<<< HEAD
                    <div className="logo">
                        GiftedTalents<span>.online</span>
                    </div>
                    <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
                        <a href="#">Find Jobs</a>
                        <a href="#">Find Talents</a>
                        <a href="#">How It Works</a>
                        <a href="#">About</a>
                        <a href="#" className="nav-signin">Sign In</a>
                        <button
                            className={`nav-get-started ${dropdownOpen ? 'active' : ''}`}
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            Get Started
                        </button>
                    </div>

                    <div className="nav-right">
                        <a href="#">Sign In</a>
                        <div className={`dropdown-container ${dropdownOpen ? 'active' : ''}`}>
                            <button
                                className={`get-started ${dropdownOpen ? 'active' : ''}`}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                Get Started
                            </button>
                            <div className={`dropdown-menu ${dropdownOpen ? 'active' : ''}`}>
                                <a href="#" className="dropdown-item">Sign In</a>
                            </div>
                        </div>
                    </div>

                    <button
                        className={`hamburger ${menuOpen ? 'active' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
=======

>>>>>>> 426b550062f40b492c5cf8393893609e15d64ab4
                </nav>

                <section className="hero">
                    <div className="circle1"></div>
                    <div className="circle2"></div>

                    <div className="hero-left">
                        <h1>
                            Discover Opportunities.
                            <br />
                            <span className="talent-text">Showcase Your Talent.</span>
                        </h1>
                        <p>
                            Connecting skilled talents with verified employers worldwide.
                        </p>

                        <div className="hero-buttons">
                            <button className="btn-primary">Find Jobs</button>
                            <button className="btn-secondary">Hire Talents</button>
                        </div>
                    </div>

                    <div className="hero-right">
                        <img src={heroImage} alt="Hero Image" />
                    </div>
                </section>



                {/* search bar */}
                <div className="search-container">
                    <div className="search-box">
                        <div className="input-with-icon">
                            {/* magnifying glass / keyword */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input type="text" placeholder="Job title or Keyword" />
                        </div>
                        <div className="input-with-icon">
                            {/* briefcase / skill */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                <path d="M16 3H8v4h8V3z"></path>
                            </svg>
                            <input type="text" placeholder="Skill" />
                        </div>
                        <div className="input-with-icon">
                            {/* map pin / location */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1118 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <input type="text" placeholder="Location" />
                        </div>

                        <button className="search-button">Search Jobs</button>
                    </div>
                </div>


                {/* christopher - Featured Jobs Section */}
                <div className="feature-jobs">
<<<<<<< HEAD

                </div>
=======
                    <div className="jobs-wrapper">
                        {/* Header */}
                        <div className="jobs-header">
                            <h2 className="jobs-title">Featured Jobs</h2>
                            <p className="jobs-subtitle">Top opportunities from verified employers</p>
                        </div>
>>>>>>> 426b550062f40b492c5cf8393893609e15d64ab4

                        {/* Jobs Grid */}
                        <div className="jobs-grid">
                            {/* Job Card 1 */}
                            <div className="job-card">
                                <div className="job-card-header">
                                    <div className="job-icon gradient-blue">
                                        <img src="/assets/svg/code.svg" alt="" className="job-icon-img" />
                                    </div>
                                    <span className="job-type" id="job-type-fulltime">Full-time</span>
                                </div>
                                <h3 className="job-title">Senior Frontend Developer</h3>
                                <p className="job-company">TechCorp Solutions</p>
                                <div className="job-details">
                                    <div className="job-location">
                                        <img src="/assets/svg/location.svg" alt="" className="location-icon" />
                                        <span>Remote</span>
                                    </div>
                                    <span className="job-salary">$80k-$120k</span>
                                </div>
                                <div className="job-tags">
                                    <span className="job-tag">React</span>
                                    <span className="job-tag">TypeScript</span>
                                    <span className="job-tag">Tailwind</span>
                                </div>
                                <button className="apply-btn">Apply Now</button>
                            </div>

                            {/* Job Card 2 */}
                            <div className="job-card">
                                <div className="job-card-header">
                                    <div className="job-icon gradient-purple-pink">
                                        <img src="/assets/svg/pencil.svg" alt="" className="job-icon-img" />
                                    </div>
                                    <span className="job-type" id="job-type-contract">Contract</span>
                                </div>
                                <h3 className="job-title">UX/UI Designer</h3>
                                <p className="job-company">Creative Studios Inc</p>
                                <div className="job-details">
                                    <div className="job-location">
                                        <img src="/assets/svg/location.svg" alt="" className="location-icon" />
                                        <span>New York, NY</span>
                                    </div>
                                    <span className="job-salary">$70k-$95k</span>
                                </div>
                                <div className="job-tags">
                                    <span className="job-tag">Figma</span>
                                    <span className="job-tag">Adobe XD</span>
                                    <span className="job-tag">Sketch</span>
                                </div>
                                <button className="apply-btn">Apply Now</button>
                            </div>

                            {/* Job Card 3 */}
                            <div className="job-card">
                                <div className="job-card-header">
                                    <div className="job-icon gradient-green-teal">
                                        <img src="/assets/svg/chart.svg" alt="" className="job-icon-img" />
                                    </div>
                                    <span className="job-type" id="job-type-fulltime">Full-time</span>
                                </div>
                                <h3 className="job-title">Product Manager</h3>
                                <p className="job-company">Innovation Labs</p>
                                <div className="job-details">
                                    <div className="job-location">
                                        <img src="/assets/svg/location.svg" alt="" className="location-icon" />
                                        <span>San Francisco, CA</span>
                                    </div>
                                    <span className="job-salary">$100k-$140k</span>
                                </div>
                                <div className="job-tags">
                                    <span className="job-tag">Agile</span>
                                    <span className="job-tag">Jira</span>
                                    <span className="job-tag">Analytics</span>
                                </div>
                                <button className="apply-btn">Apply Now</button>
                            </div>

                            {/* Job Card 4 */}
                            <div className="job-card">
                                <div className="job-card-header">
                                    <div className="job-icon gradient-orange-red">
                                        <img src="/assets/svg/speaker.svg" alt="" className="job-icon-img" />
                                    </div>
                                    <span className="job-type" id="job-type-fulltime">Full-time</span>
                                </div>
                                <h3 className="job-title">Marketing Specialist</h3>
                                <p className="job-company">Digital Growth Co</p>
                                <div className="job-details">
                                    <div className="job-location">
                                        <img src="/assets/svg/location.svg" alt="" className="location-icon" />
                                        <span>Remote</span>
                                    </div>
                                    <span className="job-salary">$60k-$85k</span>
                                </div>
                                <div className="job-tags">
                                    <span className="job-tag">SEO</span>
                                    <span className="job-tag">Content</span>
                                    <span className="job-tag">Social Media</span>
                                </div>
                                <button className="apply-btn">Apply Now</button>
                            </div>

                            {/* Job Card 5 */}
                            <div className="job-card">
                                <div className="job-card-header">
                                    <div className="job-icon gradient-indigo-purple">
                                        <img src="/assets/svg/database.svg" alt="" className="job-icon-img" />
                                    </div>
                                    <span className="job-type" id="job-type-fulltime">Full-time</span>
                                </div>
                                <h3 className="job-title">Data Scientist</h3>
                                <p className="job-company">AI Innovations Ltd</p>
                                <div className="job-details">
                                    <div className="job-location">
                                        <img src="/assets/svg/location.svg" alt="" className="location-icon" />
                                        <span>Boston, MA</span>
                                    </div>
                                    <span className="job-salary">$110k-$150k</span>
                                </div>
                                <div className="job-tags">
                                    <span className="job-tag">Python</span>
                                    <span className="job-tag">ML</span>
                                    <span className="job-tag">TensorFlow</span>
                                </div>
                                <button className="apply-btn">Apply Now</button>
                            </div>

                            {/* Job Card 6 */}
                            <div className="job-card">
                                <div className="job-card-header">
                                    <div className="job-icon gradient-yellow-orange">
                                        <img src="/assets/svg/mobile.svg" alt="" className="job-icon-img" />
                                    </div>
                                    <span className="job-type" id="job-type-contract">Contract</span>
                                </div>
                                <h3 className="job-title">Mobile App Developer</h3>
                                <p className="job-company">AppWorks Studio</p>
                                <div className="job-details">
                                    <div className="job-location">
                                        <img src="/assets/svg/location.svg" alt="" className="location-icon" />
                                        <span>Austin, TX</span>
                                    </div>
                                    <span className="job-salary">$75k-$105k</span>
                                </div>
                                <div className="job-tags">
                                    <span className="job-tag">React Native</span>
                                    <span className="job-tag">iOS</span>
                                    <span className="job-tag">Android</span>
                                </div>
                                <button className="apply-btn">Apply Now</button>
                            </div>
                        </div>

                        {/* View All button */}
                        <div className="view-all-container">
                            <button className="view-all-btn">View All Jobs</button>
                        </div>
                    </div>
                </div>
                
                <div className="featured-talents">
<<<<<<< HEAD

=======
                    <div className="feature-talent-header">
                        <h3>Featured Talents</h3>
                        <p>Connect with skilled professionals ready to work</p>
                    </div>

                    <div className="feature-talent-content">
                        {featuresData.map((feature, index) => (
                            <div className="feature-talent-card" key={index} style={{...feature.bg, ...feature.border}}>
                                <div className="feature-talent-card-header">
                                    <img src={feature.image} alt="" />
                                </div>

                                <div className="feature-talent-card-body">
                                    <h3>{feature.name}</h3>
                                    <p>{feature.role}</p>
                                </div>

                                <div className="feature-talent-card-stars">
                                    {[...Array(5)].map((_, starIndex) => {
                                        if (starIndex < feature.stars) {
                                            return <img key={starIndex} src={feature.icon} alt="star" />;
                                        } else if (starIndex === feature.stars && feature.halfStar) {
                                            return <img key={starIndex} src={feature.halfStarIcon} alt="half star" />;
                                        }
                                        return null;
                                    })}
                                    <span>{`(${feature.rating})`}</span>
                                </div>

                                <div className="feature-talent-card-roles">
                                    {feature.tech.map((tech, techIndex) => (
                                        <span key={techIndex}>{tech}</span>
                                    ))}
                                </div>

                                <div className="feature-talent-card-footer">
                                    <Link href="">View Profile</Link>
                                </div>
                            </div>
                        ))}

                    </div>
                    
                    <Link href="" className='browse-all-btn'>Browse All Talents</Link>
>>>>>>> 426b550062f40b492c5cf8393893609e15d64ab4
                </div>
                
            </div>
            </>
    );
}