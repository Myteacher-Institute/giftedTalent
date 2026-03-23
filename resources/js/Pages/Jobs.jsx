import { Head } from '@inertiajs/react';
import '../../css/jobs.css';

export default function Jobs({ jobs = [] }) {
    return (
        <>
            <Head title="Jobs" />

            <div className="jobs-page">
                {/* HEADER */}
                <header>
                    <nav>
                        <div className='logo-search'>
                            <div className="logo">
                                <a href="/" className="brand">GiftedTalents<span>.online</span></a>
                            </div>

                            <div className="search-bar">
                                {/* Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                                <svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M300.3 440.8C312.9 451 331.4 450.3 343.1 438.6L471.1 310.6C480.3 301.4 483 287.7 478 275.7C473 263.7 461.4 256 448.5 256L192.5 256C179.6 256 167.9 263.8 162.9 275.8C157.9 287.8 160.7 301.5 169.9 310.6L297.9 438.6L300.3 440.8z" /></svg>

                                <input type="text" placeholder="Search job titles or companies" />
                                <svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" /></svg>
                            </div>
                        </div>

                        <div className="nav-buttons">
                            <button>Sign in</button>
                            <button>Join now</button>
                        </div>
                    </nav>
                </header>

                {/* FILTER SECTION */}
                <section className="filters">
                    <button>Job Type<svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M300.3 440.8C312.9 451 331.4 450.3 343.1 438.6L471.1 310.6C480.3 301.4 483 287.7 478 275.7C473 263.7 461.4 256 448.5 256L192.5 256C179.6 256 167.9 263.8 162.9 275.8C157.9 287.8 160.7 301.5 169.9 310.6L297.9 438.6L300.3 440.8z" /></svg></button>

                    <button>Location<svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M300.3 440.8C312.9 451 331.4 450.3 343.1 438.6L471.1 310.6C480.3 301.4 483 287.7 478 275.7C473 263.7 461.4 256 448.5 256L192.5 256C179.6 256 167.9 263.8 162.9 275.8C157.9 287.8 160.7 301.5 169.9 310.6L297.9 438.6L300.3 440.8z" /></svg></button>

                    <button>Company<svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M300.3 440.8C312.9 451 331.4 450.3 343.1 438.6L471.1 310.6C480.3 301.4 483 287.7 478 275.7C473 263.7 461.4 256 448.5 256L192.5 256C179.6 256 167.9 263.8 162.9 275.8C157.9 287.8 160.7 301.5 169.9 310.6L297.9 438.6L300.3 440.8z" /></svg></button>

                    <button>Remote<svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M300.3 440.8C312.9 451 331.4 450.3 343.1 438.6L471.1 310.6C480.3 301.4 483 287.7 478 275.7C473 263.7 461.4 256 448.5 256L192.5 256C179.6 256 167.9 263.8 162.9 275.8C157.9 287.8 160.7 301.5 169.9 310.6L297.9 438.6L300.3 440.8z" /></svg></button>

                    <button>Experience Level<svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M300.3 440.8C312.9 451 331.4 450.3 343.1 438.6L471.1 310.6C480.3 301.4 483 287.7 478 275.7C473 263.7 461.4 256 448.5 256L192.5 256C179.6 256 167.9 263.8 162.9 275.8C157.9 287.8 160.7 301.5 169.9 310.6L297.9 438.6L300.3 440.8z" /></svg></button>
                </section>

                {/* HERO SECTION */}
                <section className="hero">
                    <h1>Find the best creative Jobs,<br /> Curated by GiftedTalents</h1>
                    <button className="find-job-btn">Find a job</button>
                </section>

                {/* JOB SECTION */}
                <section className="jobs-section">
                    <div className="jobs-header">
                        <h3>Full-Time or Contract Jobs ({jobs.length})</h3>
                        <div>
                            <svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" /></svg>

                            <input type="text" placeholder="Search Jobs" />
                        </div>
                    </div>

                    {/* JOB GRID - ONLY REAL DATA */}
                    <div className="job-grid">
                        {jobs.map((job) => (
                            <div key={job.id} className="job-card">
                                <div className="company">
                                    {/* Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                                    <svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="#4B5563" d="M463 448.2C440.9 409.8 399.4 384 352 384L288 384C240.6 384 199.1 409.8 177 448.2C212.2 487.4 263.2 512 320 512C376.8 512 427.8 487.3 463 448.2zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320zM320 336C359.8 336 392 303.8 392 264C392 224.2 359.8 192 320 192C280.2 192 248 224.2 248 264C248 303.8 280.2 336 320 336z" /></svg>
                                    <div className="company-header">
                                        <h2>{job.company_name}</h2>
                                        <div>
                                            <img src="/assets/svg/location.svg" alt="" className="location-icon" />
                                            <p>{job.company_location}</p>
                                        </div>
                                    </div>
                                </div>
                                <h3>{job.job_type}</h3>
                                <p className='job-description'>{job.description}</p>
                                <div className="job-footer">
                                    <div className="job-footer-left">
                                        <span className="job-salary">{job.salary_range || job.salary}</span>
                                    </div>
                                    <div className="job-footer-right">
                                        <span className="job-date">{new Date(job.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}</span>
                                        <button className="apply-btn">Apply now</button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {jobs.length === 0 && (
                            <div className="no-jobs-message">
                                <p>No jobs available at the moment. Check back later!</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* FOOTER */}
                <footer>
                    <div className="footer-left">
                        <a href="/" className="brand">GiftedTalents<span>.online</span></a>
                        <span>© 2026</span>
                    </div>

                    <div className="footer-right">
                        <a href="#">About</a>
                        <a href="#">Contact</a>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Community Guideline</a>
                    </div>

                </footer>
            </div>
        </>
    );
}