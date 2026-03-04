import { Head, Link } from '@inertiajs/react';
import '../../css/feature.css';

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

                </div>
            </div>
        </>
    );
}