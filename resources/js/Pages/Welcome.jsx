import { Head, Link } from '@inertiajs/react';
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

export default function Welcome({ auth, laravelVersion, phpVersion }) {
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
            <Head title="Welcome" />

            <div className="home-screen">
                {/* Henry */}
                <nav className="navbar">

                </nav>

                <div className="hero">

                </div>


                {/* christopher - Featured Jobs Section */}
                <div className="feature-jobs">
                    <div className="jobs-wrapper">
                        {/* Header */}
                        <div className="jobs-header">
                            <h2 className="jobs-title">Featured Jobs</h2>
                            <p className="jobs-subtitle">Top opportunities from verified employers</p>
                        </div>

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
                </div>
                
            </div>
            </>
    );
}